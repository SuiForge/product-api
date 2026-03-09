const formatJSON = (data) => JSON.stringify(data, null, 2);
const txExplorerBaseURL = 'https://suiscan.xyz/mainnet/tx/';
const alertOpsBase = '/v1/alert-ops';
let latestAlertsCache = [];
let selectedAlertEvidenceId = '';
let conversionMode = 'buyer';
let currentSession = null;
let walletLoginClient = null;
let authProviders = {
  google: { enabled: false, clientId: '', hostedDomain: '' },
  wallet: { enabled: true, network: 'mainnet' },
  demoFallback: { enabled: true },
};
const liveState = {
  readiness: null,
  workspace: null,
  ruleTemplates: [],
  monitors: null,
  alerts: null,
  execution: null,
  replay: null,
  apiKey: null,
  apiKeys: null,
  destination: null,
  destinations: null,
  deliveries: null,
};

const steps = {
  workspace: { statusId: 'step-workspace-status', label: 'Inspect Overview' },
  apikey: { statusId: 'step-apikey-status', label: 'Issue API Key' },
  monitors: { statusId: 'step-monitors-status', label: 'Create Monitor' },
  alerts: { statusId: 'step-alerts-status', label: 'Review Alerts' },
  webhook: { statusId: 'step-webhook-status', label: 'Configure Webhook' },
  replay: { statusId: 'step-replay-status', label: 'Open Replay' },
};

const progressState = {
  workspace: false,
  apikey: false,
  monitors: false,
  alerts: false,
  webhook: false,
  replay: false,
};

function getSession() {
  return currentSession;
}

function currentAuthMethod() {
  return String(getSession()?.authMethod || 'session').trim().toLowerCase() || 'session';
}

function sessionHasWalletPrivileges() {
  const session = getSession();
  if (!session) return false;
  if (!String(session.walletAddress || '').trim()) return false;
  const authMethod = currentAuthMethod();
  return authMethod === 'wallet' || authMethod === 'session';
}

function walletAccessMessage(actionLabel) {
  if (!getSession()) {
    return `Login required before ${actionLabel}.`;
  }
  if (sessionHasWalletPrivileges()) {
    return '';
  }
  if (currentAuthMethod() === 'google') {
    return `${actionLabel} is wallet-bound. Keep Google for workspace access, then click “Sign In With Wallet” above to unlock API keys and webhooks.`;
  }
  return `${actionLabel} requires a Sui wallet session.`;
}

function setControlsDisabled(rootId, disabled) {
  const root = document.getElementById(rootId);
  if (!root) return;
  root.querySelectorAll('input, select, textarea, button').forEach((node) => {
    if (node.name === 'walletAddress') return;
    node.disabled = disabled;
  });
}

function syncWalletBoundActions() {
  const hasWalletAccess = sessionHasWalletPrivileges();
  setControlsDisabled('demo-key-form', !hasWalletAccess);
  setControlsDisabled('destination-form', !hasWalletAccess);
  const destinationTest = document.getElementById('destination-test');
  if (destinationTest) {
    destinationTest.disabled = !hasWalletAccess;
  }
  const apiKeyCard = document.getElementById('step-apikey-card');
  const webhookCard = document.getElementById('step-webhook-card');
  [apiKeyCard, webhookCard].forEach((node) => {
    if (!node) return;
    node.classList.toggle('is-locked', !hasWalletAccess);
  });

  if (!hasWalletAccess) {
    if (currentAuthMethod() === 'google') {
      if (!liveState.apiKey) {
        write('demo-key-result', 'Google access is active. Sign in with wallet above to generate a wallet-bound API key.');
      }
      if (!liveState.destination) {
        write('destination-result', 'Google access is active. Sign in with wallet above to configure a wallet-bound webhook destination.');
      }
    } else if (!getSession()) {
      if (!liveState.apiKey) {
        write('demo-key-result', 'Sign in with Google or wallet to continue. Wallet login is required for API key creation.');
      }
      if (!liveState.destination) {
        write('destination-result', 'Sign in with Google or wallet to continue. Wallet login is required for webhook configuration.');
      }
    }
  }
}

function saveSession(session) {
  currentSession = session;
}

function clearSession() {
  currentSession = null;
}

function workspaceFormValues(formLike) {
  const form = formLike instanceof FormData ? formLike : new FormData(formLike);
  return {
    workspaceName: (form.get('workspaceName') || 'Alpha Desk').toString().trim() || 'Alpha Desk',
    operatorName: (form.get('operatorName') || 'Founding PM').toString().trim() || 'Founding PM',
    walletAddress: (form.get('walletAddress') || '').toString().trim(),
  };
}

function workspaceGoogleFormValues(formLike) {
  const form = formLike instanceof FormData ? formLike : new FormData(formLike);
  return {
    workspaceName: (form.get('workspaceName') || 'Alpha Desk').toString().trim() || 'Alpha Desk',
    operatorName: (form.get('operatorName') || '').toString().trim(),
  };
}

function setWalletAddressInput(walletAddress) {
  if (!walletAddress) return;
  const input = document.querySelector('#workspace-login-form input[name="walletAddress"]');
  if (input) {
    input.value = walletAddress;
  }
}

function syncWalletConnectionState(state = {}) {
  const badge = document.getElementById('wallet-connection-badge');
  const copy = document.getElementById('wallet-connection-copy');
  const walletAddress = String(state.walletAddress || '').trim();
  const walletName = String(state.walletName || '').trim();
  const status = String(state.status || '').trim().toLowerCase() || 'disconnected';
  const isConnected = Boolean(state.isConnected && walletAddress);

  if (walletAddress) {
    setWalletAddressInput(walletAddress);
  }

  if (badge) {
    badge.className = 'pill-badge wallet-state';
    if (isConnected) {
      badge.classList.add('connected');
      badge.textContent = `${walletName || 'Wallet'} · ${shortDigest(walletAddress)}`;
    } else if (status === 'connecting' || status === 'reconnecting') {
      badge.classList.add('connecting');
      badge.textContent = 'Connecting wallet...';
    } else {
      badge.textContent = 'Wallet disconnected';
    }
  }

  if (copy) {
    if (isConnected) {
      copy.textContent = `Connected address ${shortDigest(walletAddress)} is ready to sign the login challenge.`;
    } else if (status === 'connecting' || status === 'reconnecting') {
      copy.textContent = 'Approve the connection in your wallet to continue.';
    } else {
      copy.textContent = 'Connect a Sui wallet first, then sign the login challenge.';
    }
  }
}

function syncGoogleConnectionState(state = {}) {
  const badge = document.getElementById('google-connection-badge');
  const copy = document.getElementById('google-connection-copy');
  const status = String(state.status || '').trim().toLowerCase() || 'unavailable';
  const email = String(state.email || '').trim();

  if (badge) {
    badge.className = 'pill-badge google-state';
    if (status === 'connected' && email) {
      badge.classList.add('connected');
      badge.textContent = `Google · ${email}`;
    } else if (status === 'ready') {
      badge.classList.add('ready');
      badge.textContent = 'Google login ready';
    } else {
      badge.textContent = 'Google login unavailable';
    }
  }

  if (copy) {
    if (status === 'connected' && email) {
      copy.textContent = `Google session active for ${email}.`;
    } else if (status === 'ready') {
      copy.textContent = 'Use Google popup sign-in for fast operator access without a wallet.';
    } else {
      copy.textContent = 'Configure Google Sign-In to enable popup login for non-wallet operators.';
    }
  }
}

function getConnectedWalletState() {
  return walletLoginClient?.getConnection ? walletLoginClient.getConnection() : null;
}

function buildWalletLoginPayload(formLike) {
  const payload = workspaceFormValues(formLike);
  const connectedWallet = getConnectedWalletState();
  if (connectedWallet?.walletAddress) {
    payload.walletAddress = connectedWallet.walletAddress;
    setWalletAddressInput(connectedWallet.walletAddress);
  }
  return payload;
}

function buildGoogleLoginPayload(formLike) {
  return workspaceGoogleFormValues(formLike);
}

async function initializeAuthProviders() {
  try {
    authProviders = await requestJSON('/v1/auth/providers');
  } catch {
    authProviders = {
      google: { enabled: false, clientId: '', hostedDomain: '' },
      wallet: { enabled: true, network: 'mainnet' },
      demoFallback: { enabled: true },
    };
  }
}

async function handleGoogleCredentialResponse(response) {
  const credential = String(response?.credential || '').trim();
  if (!credential) {
    write('workspace-session-result', 'Google login did not return a credential. Try again.');
    return;
  }
  write('workspace-session-result', 'Verifying Google identity...');
  try {
    const payload = buildGoogleLoginPayload(document.getElementById('workspace-login-form'));
    const session = await requestJSON('/v1/auth/google/verify', {
      method: 'POST',
      body: JSON.stringify({
        credential,
        workspaceName: payload.workspaceName,
        operatorName: payload.operatorName,
      }),
    });
    syncGoogleConnectionState({ status: 'connected', email: session.email });
    await finishWorkspaceAuthentication(session, `Google session started for ${session.workspaceName}. You can now explore the console.`);
  } catch (error) {
    clearSession();
    applySessionState();
    syncGoogleConnectionState({ status: 'ready' });
    write('workspace-session-result', `Google login failed\n${error.message}`);
  }
}

async function initializeGoogleLogin() {
  const provider = authProviders?.google || {};
  const slot = document.getElementById('google-signin-button');
  if (!slot) {
    return;
  }
  slot.innerHTML = '';
  if (!provider.enabled || !provider.clientId || !window.google?.accounts?.id) {
    syncGoogleConnectionState({ status: 'unavailable' });
    return;
  }
  window.google.accounts.id.initialize({
    client_id: provider.clientId,
    callback: handleGoogleCredentialResponse,
    ux_mode: 'popup',
    auto_select: false,
    context: 'signin',
    ...(provider.hostedDomain ? { hd: provider.hostedDomain } : {}),
  });
  window.google.accounts.id.renderButton(slot, {
    theme: 'outline',
    size: 'large',
    shape: 'pill',
    text: 'continue_with',
    width: 280,
    logo_alignment: 'left',
  });
  syncGoogleConnectionState({ status: 'ready' });
}

async function initializeWalletLogin() {
  const provider = authProviders?.wallet || {};
  if (!provider.enabled) {
    syncWalletConnectionState({ status: 'disconnected', isConnected: false });
    return;
  }
  if (!window.ProductWalletAuth || typeof window.ProductWalletAuth.createWalletLoginClient !== 'function') {
    syncWalletConnectionState({ status: 'disconnected', isConnected: false });
    return;
  }
  walletLoginClient = window.ProductWalletAuth.createWalletLoginClient({
    connectButtonId: 'wallet-connect-button',
    network: provider.network || 'mainnet',
    onStateChange: syncWalletConnectionState,
  });
  syncWalletConnectionState(getConnectedWalletState() || { status: 'disconnected', isConnected: false });
}

async function finishWorkspaceAuthentication(session, progressMessage) {
  saveSession(session);
  applySessionState();
  updateProgress(progressMessage);
  loadWorkspace();
  loadAPIKeys();
  loadRuleTemplates();
  loadMonitors();
  loadAlerts();
  loadDestinations();
  loadDeliveries();
}

async function requestJSON(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(typeof payload === 'string' ? payload : formatJSON(payload));
  }

  return payload;
}

function write(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = typeof value === 'string' ? value : formatJSON(value);
}

function setHTML(id, value) {
  const node = document.getElementById(id);
  if (node) node.innerHTML = value;
}

function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function shortDigest(value) {
  const text = String(value ?? '').trim();
  if (text.length <= 14) return text || '-';
  return `${text.slice(0, 6)}...${text.slice(-6)}`;
}

function formatCompactNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return value ?? '-';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(num);
}

function formatTimestamp(value) {
  const ts = Number(value);
  if (!Number.isFinite(ts) || ts <= 0) return '-';
  return new Date(ts).toLocaleString();
}

function formatRelativeTime(value) {
  const ts = Number(value);
  if (!Number.isFinite(ts) || ts <= 0) return '-';

  const deltaMs = Math.max(0, Date.now() - ts);
  const deltaMinutes = Math.floor(deltaMs / 60000);

  if (deltaMinutes < 1) return 'just now';
  if (deltaMinutes < 60) return `${deltaMinutes}m ago`;

  const deltaHours = Math.floor(deltaMinutes / 60);
  if (deltaHours < 24) return `${deltaHours}h ago`;

  const deltaDays = Math.floor(deltaHours / 24);
  return `${deltaDays}d ago`;
}

function formatFreshnessTimestamp(value, fallback) {
  const ts = Number(value);
  if (!Number.isFinite(ts) || ts <= 0) return fallback;
  return `${formatRelativeTime(ts)} · ${formatTimestamp(ts)}`;
}

function currentProjectName() {
  return liveState.workspace?.project?.name || liveState.workspace?.project?.id || 'this operator workspace';
}

function currentAlertsCount() {
  return liveState.alerts?.count ?? liveState.workspace?.usage?.alerts ?? 0;
}

function currentTradesCount() {
  return liveState.execution?.summary?.trades ?? 0;
}

function currentExecutionScoreText() {
  const executionScore = liveState.execution?.summary?.executionScore;
  return executionScore == null ? '-' : Number(executionScore).toFixed(2);
}

function currentDecisionText() {
  return liveState.replay?.decision || 'pending';
}

function currentReasonsText() {
  return (liveState.replay?.reasonCodes || []).slice(0, 2).join(', ') || 'awaiting replay evidence';
}

function currentAPIPreviewText() {
  return liveState.apiKey?.tokenPreview || 'api key not issued yet';
}

function renderFreshnessStrip() {
  setMetric(
    'freshness-execution-synced',
    formatFreshnessTimestamp(liveState.execution?.syncedAt, 'Awaiting execution sync'),
  );
  setMetric(
    'freshness-alerts-latest',
    formatFreshnessTimestamp(liveState.alerts?.alerts?.[0]?.timestamp, 'Awaiting live alerts'),
  );
  setMetric(
    'freshness-replay-status',
    liveState.replay?.evidenceId ? `Loaded · ${shortDigest(liveState.replay.evidenceId)}` : 'Awaiting replay evidence',
  );
  setMetric('freshness-api-preview', currentAPIPreviewText());
}

function renderReadinessView(result) {
  liveState.readiness = result || null;
  const status = String(result?.status || 'unknown').trim() || 'unknown';
  const statusNode = document.getElementById('readiness-status');
  if (statusNode) {
    statusNode.textContent = status.replaceAll('_', ' ');
    statusNode.className = `pill-badge ${status === 'production_ready' ? 'low' : status === 'pilot_ready' ? 'medium' : 'high'}`;
  }
  write('readiness-summary', {
    service: result?.service?.name || 'Sui Alert Ops',
    status,
    summary: result?.summary || 'Readiness data unavailable.',
  });
  setHTML(
    'readiness-auth-grid',
    `
      <div><span>Google</span><strong>${escapeHTML(result?.auth?.googleEnabled ? 'enabled' : 'not ready')}</strong></div>
      <div><span>Wallet</span><strong>${escapeHTML(result?.auth?.walletEnabled ? 'enabled' : 'not ready')}</strong></div>
      <div><span>API Key</span><strong>${escapeHTML(result?.auth?.apiKeyValidationReady ? 'enabled' : 'not ready')}</strong></div>
      <div><span>Network</span><strong>${escapeHTML(result?.auth?.walletNetwork || '-')}</strong></div>
    `,
  );
  setHTML(
    'readiness-infra-grid',
    `
      <div><span>Public Origin</span><strong>${escapeHTML(result?.infrastructure?.publicOrigin || '-')}</strong></div>
      <div><span>Persistence</span><strong>${escapeHTML(result?.infrastructure?.persistentStateEnabled ? 'enabled' : 'not ready')}</strong></div>
      <div><span>DeepBook</span><strong>${escapeHTML(result?.infrastructure?.deepBookConnected ? 'live' : 'demo')}</strong></div>
      <div><span>Vertical Index</span><strong>${escapeHTML(result?.infrastructure?.verticalIndexConnected ? 'live' : 'demo')}</strong></div>
    `,
  );
  const nextActions = result?.nextActions || [];
  if (!nextActions.length) {
    setHTML('readiness-next-actions', '<div class="alert-item empty-state">No next actions required.</div>');
    return;
  }
  setHTML(
    'readiness-next-actions',
    nextActions
      .map(
        (item, index) => `
          <div class="alert-item">
            <div class="alert-item-head">
              <div>
                <div class="alert-title">Action ${index + 1}</div>
                <div class="alert-meta">${escapeHTML(String(item || ''))}</div>
              </div>
            </div>
          </div>`,
      )
      .join(''),
  );
}

async function loadReadiness() {
  try {
    const result = await requestJSON('/v1/alert-ops/readiness');
    renderReadinessView(result);
  } catch (error) {
    write('readiness-summary', `Readiness unavailable\n${error.message}`);
    setHTML('readiness-next-actions', '<div class="alert-item empty-state">Readiness endpoint unavailable.</div>');
  }
}

function grantOnePagerText() {
  return [
    'Sui Grant One-Pager',
    '',
    'Problem',
    `- ${currentProjectName()} still needs a usable operator layer that combines execution quality, anomaly alerts, and replayable risk evidence in one workflow.`,
    '- Sui builders can access raw infrastructure, but productized visibility and decision tooling still need stronger packaging for operators and ecosystem teams.',
    '',
    'What Is Live Today',
    `- ${currentAlertsCount()} live alerts are already surfaced in the workspace feed with selectable evidence and routing context.`,
    `- ${currentTradesCount()} recent DeepBook fills are already summarized with a live execution score of ${currentExecutionScoreText()} on SUI/USDC.`,
    `- Replay evidence is already available with current decision state ${currentDecisionText()} and reason codes ${currentReasonsText()}.`,
    `- A product activation path already exists through the preview API key contract ${currentAPIPreviewText()}.`,
    '',
    'Why Sui-Specific',
    '- The demo is anchored on Sui-native execution telemetry, live DeepBook lifecycle activity, and mainnet transaction evidence that can be inspected externally.',
    '- This positions the product as a reusable execution intelligence layer for Sui trading, monitoring, and builder operations rather than a generic dashboard.',
    '',
    'Next Milestone',
    '- Harden multi-tenant onboarding, shipping-grade alert routing, replay exports, and ecosystem-facing APIs for other Sui teams to integrate quickly.',
    '',
    'Grant Ask',
    '- Fund the next milestone that turns this live operator console into shared Sui execution intelligence infrastructure for builders, operators, and ecosystem programs.',
  ].join('\n');
}

function txLink(txDigest) {
  const digest = String(txDigest ?? '').trim();
  if (!digest) return '-';
  return `<a class="external-link mono" href="${txExplorerBaseURL}${encodeURIComponent(digest)}" target="_blank" rel="noreferrer">${escapeHTML(shortDigest(digest))}</a>`;
}

function renderTableEmpty(bodyId, colspan, message) {
  setHTML(bodyId, `<tr><td colspan="${colspan}" class="table-empty">${escapeHTML(message)}</td></tr>`);
}

function setMetric(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function conversionSummaryText() {
  const alertsCount = currentAlertsCount();
  const trades = currentTradesCount();
  const executionScore = currentExecutionScoreText();
  const decision = currentDecisionText();
  const reasons = currentReasonsText();
  const projectName = currentProjectName();
  const apiPreview = currentAPIPreviewText();

  if (conversionMode === 'grant') {
    return [
      `This Sui-native operator workspace already demonstrates live execution telemetry for ${projectName}.`,
      `The current demo surfaces ${alertsCount} real anomaly alerts, ${trades} recent DeepBook fills, and an execution score of ${executionScore} on a live SUI/USDC pool.`,
      `It also produces replayable risk evidence with the current decision state ${decision} and reason codes ${reasons}.`,
      `The next milestone is to turn these primitives into a reusable product layer for Sui builders, operators, and ecosystem monitoring workflows.`
    ].join(' ');
  }

  return [
    `We can start with a paid pilot around ${projectName} using live alerts plus execution replay as the operator wedge.`,
    `Right now the console is already showing ${alertsCount} live alerts, ${trades} recent fills, and an execution score of ${executionScore} on SUI/USDC.`,
    `The risk engine is currently flagging the flow as ${decision} because of ${reasons}, and the team can route the same evidence into webhooks immediately.`,
    `Activation is simple because the product can already issue a real API key with a safe preview (${apiPreview}).`
  ].join(' ');
}

function renderConversionSummary() {
  const alertsCount = liveState.alerts?.count ?? liveState.workspace?.usage?.alerts ?? '-';
  const trades = liveState.execution?.summary?.trades ?? '-';
  const decision = liveState.replay?.decision || '-';

  document.querySelectorAll('[data-conversion-mode]').forEach((node) => {
    node.classList.toggle('is-active', node.getAttribute('data-conversion-mode') === conversionMode);
  });

  if (conversionMode === 'grant') {
    setMetric('pitch-mode-label', 'Grant Narrative');
    setMetric('pitch-headline', 'Frame this as Sui-native execution intelligence infrastructure');
  } else {
    setMetric('pitch-mode-label', 'Buyer Narrative');
    setMetric('pitch-headline', 'Use live execution and alerts as the operator wedge');
  }

  setMetric('pitch-alert-count', String(alertsCount));
  setMetric('pitch-trade-count', String(trades));
  setMetric('pitch-execution-score', currentExecutionScoreText());
  setMetric('pitch-decision', String(decision));
  write('pitch-summary', conversionSummaryText());
  renderFreshnessStrip();
  write('grant-onepager', grantOnePagerText());
}

async function copyPitchSummary() {
  const summary = conversionSummaryText();
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(summary);
      write('pitch-summary', `${summary}\n\nCopied to clipboard.`);
      return;
    }
  } catch {
  }
  write('pitch-summary', `${summary}\n\nCopy manually from this panel.`);
}

async function copyGrantOnePager() {
  const summary = grantOnePagerText();
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(summary);
      write('grant-onepager', `${summary}\n\nCopied to clipboard.`);
      return;
    }
  } catch {
  }
  write('grant-onepager', `${summary}\n\nCopy manually from this panel.`);
}

function renderExecutionView(summary, fills, lifecycle) {
  liveState.execution = { summary, fills, lifecycle, syncedAt: Date.now() };
  setMetric('execution-trades', String(summary?.trades ?? '-'));
  setMetric('execution-volume', formatCompactNumber(summary?.volumeQuote ?? '-'));
  setMetric('execution-score', summary?.executionScore == null ? '-' : Number(summary.executionScore).toFixed(2));
  setMetric('execution-window', summary?.window || '-');

  const fillRows = fills?.fills || [];
  const lifecycleRows = lifecycle?.events || [];
  setMetric('execution-fills-meta', `${fillRows.length} rows · next ${fills?.nextCursor ? 'ready' : 'end'}`);
  setMetric(
    'execution-lifecycle-meta',
    `${lifecycleRows.length} rows${lifecycle?.eventType ? ` · filter ${lifecycle.eventType}` : ' · all event types'}`,
  );

  if (!fillRows.length) {
    renderTableEmpty('execution-fills-body', 4, 'No fills found for the selected window.');
  } else {
    setHTML(
      'execution-fills-body',
      fillRows
        .map(
          (fill) => `
          <tr>
              <td>${txLink(fill.txDigest)}</td>
              <td>${escapeHTML(fill.eventSeq)}</td>
              <td>${escapeHTML(fill.price)}</td>
              <td>${escapeHTML(formatCompactNumber(fill.quoteSize))}</td>
            </tr>`,
        )
        .join(''),
    );
  }

  if (!lifecycleRows.length) {
    renderTableEmpty('execution-lifecycle-body', 3, 'No lifecycle events found for the selected filter.');
  } else {
    setHTML(
      'execution-lifecycle-body',
      lifecycleRows
        .map(
          (event) => `
          <tr>
              <td><span class="pill-badge ${escapeHTML(event.eventType)}">${escapeHTML(event.eventType)}</span></td>
              <td>${txLink(event.txDigest)}</td>
              <td>${escapeHTML(event.eventSeq)}</td>
            </tr>`,
        )
        .join(''),
    );
  }

  renderConversionSummary();
}

function renderAlertDetail(alert) {
  if (!alert) {
    setMetric('alerts-detail-meta', 'Select an alert to inspect routing evidence.');
    setHTML(
      'alerts-detail-grid',
      `
        <div><span>Severity</span><strong>-</strong></div>
        <div><span>Evidence</span><strong>-</strong></div>
        <div><span>Timestamp</span><strong>-</strong></div>
        <div><span>Source</span><strong>-</strong></div>
      `,
    );
    return;
  }

  selectedAlertEvidenceId = String(alert.evidenceId || alert.id || '');
  setMetric('alerts-detail-meta', 'Selected alert can be used as a sales walkthrough anchor.');
  setHTML(
    'alerts-detail-grid',
    `
      <div>
        <span>Severity</span>
        <strong><span class="pill-badge ${escapeHTML(String(alert.severity || 'medium').toLowerCase())}">${escapeHTML(alert.severity || 'medium')}</span></strong>
      </div>
      <div>
        <span>Evidence</span>
        <strong>${txLink(alert.evidenceId || alert.id || '')}</strong>
      </div>
      <div>
        <span>Timestamp</span>
        <strong>${escapeHTML(formatTimestamp(alert.timestamp))}</strong>
      </div>
      <div>
        <span>Source</span>
        <strong>${escapeHTML(alert.source || '-')}</strong>
      </div>
    `,
  );
}

function renderReplayView(result) {
  liveState.replay = result ? { ...result, loadedAt: Date.now() } : null;
  const reasons = result?.reasonCodes || [];
  setMetric('replay-decision', result?.decision || '-');
  setMetric('replay-score', result?.riskScore == null ? '-' : Number(result.riskScore).toFixed(1));
  setHTML('replay-evidence-link', result?.evidenceId ? txLink(result.evidenceId) : '-');
  setMetric('replay-status', result?.decision ? 'Loaded' : 'Ready');
  setMetric('replay-meta', result?.evidenceId ? 'Replay evidence is loaded from a live API response.' : 'Load an evidence record to inspect the decision path.');

  if (!reasons.length) {
    setHTML('replay-reasons', '<span class="pill-badge">No reason codes yet</span>');
    renderConversionSummary();
    return;
  }

  setHTML(
    'replay-reasons',
    reasons.map((reason) => `<span class="pill-badge order_modified">${escapeHTML(reason)}</span>`).join(''),
  );
  renderConversionSummary();
}

function renderRuleTemplates(templates) {
  liveState.ruleTemplates = templates || [];
  const items = liveState.ruleTemplates;
  const select = document.getElementById('monitor-rule-template');
  if (select) {
    select.innerHTML = items.length
      ? items.map((template) => `<option value="${escapeHTML(template.id)}">${escapeHTML(template.name)}</option>`).join('')
      : '<option value="">No templates available</option>';
  }
  setMetric('rule-templates-meta', items.length ? `${items.length} templates ready` : 'No templates loaded.');
  if (!items.length) {
    setHTML('rule-templates-strip', '<span class="pill-badge">No templates loaded</span>');
    return;
  }
  setHTML(
    'rule-templates-strip',
    items
      .map(
        (template) =>
          `<span class="pill-badge ${escapeHTML(String(template.defaultSeverity || 'medium').toLowerCase())}">${escapeHTML(template.name)}</span>`,
      )
      .join(''),
  );
}


function renderDestinationList(result) {
  const destinations = result?.destinations || [];
  liveState.destinations = { ...result, destinations, syncedAt: Date.now() };
  liveState.destination = destinations.length ? destinations[destinations.length - 1] : liveState.destination;
  setMetric('destination-list-meta', destinations.length ? `${destinations.length} configured routes` : 'No webhook routes loaded.');
  if (!destinations.length) {
    setHTML('destination-list', '<div class="alert-item empty-state">Create a destination to see configured webhook routes.</div>');
    return;
  }
  setHTML(
    'destination-list',
    destinations
      .map(
        (destination) => `
          <div class="alert-item">
            <div class="alert-item-head">
              <div>
                <div class="alert-title">${escapeHTML(destination.type || 'webhook')}</div>
                <div class="alert-meta">${escapeHTML(destination.target || '-')}</div>
              </div>
              <span class="pill-badge ${escapeHTML(String(destination.status || 'active').toLowerCase() === 'active' ? 'low' : 'medium')}">${escapeHTML(destination.status || 'active')}</span>
            </div>
            <div class="alert-item-foot">
              <div class="alert-meta">${escapeHTML((destination.eventTypes || []).join(', ') || 'risk_alert')}</div>
              <div class="alert-evidence">${escapeHTML(destination.signatureHeader || 'X-SuiIndexer-Signature')}</div>
            </div>
          </div>`,
      )
      .join(''),
  );
}

function renderDeliveryList(result) {
  const deliveries = result?.deliveries || [];
  liveState.deliveries = { ...result, deliveries, syncedAt: Date.now() };
  setMetric('delivery-list-meta', deliveries.length ? `${deliveries.length} delivery attempts logged` : 'No delivery attempts yet.');
  if (!deliveries.length) {
    setHTML('delivery-list', '<div class="alert-item empty-state">Send a test webhook to build delivery history.</div>');
    return;
  }
  setHTML(
    'delivery-list',
    deliveries
      .map(
        (delivery) => `
          <div class="alert-item">
            <div class="alert-item-head">
              <div>
                <div class="alert-title">${escapeHTML(delivery.eventType || 'risk_alert')}</div>
                <div class="alert-meta">${escapeHTML(delivery.target || '-')}</div>
              </div>
              <span class="pill-badge ${escapeHTML(delivery.delivered ? 'low' : 'high')}">${escapeHTML(delivery.status || (delivery.delivered ? 'delivered' : 'failed'))}</span>
            </div>
            <div class="alert-item-foot">
              <div class="alert-meta">HTTP ${escapeHTML(String(delivery.statusCode || '-'))} · ${escapeHTML(formatTimestamp((delivery.sentAt || 0) * 1000))}</div>
              <button class="button button-secondary retry-delivery-button" type="button" data-delivery-id="${escapeHTML(delivery.id || '')}">Retry</button>
            </div>
          </div>`,
      )
      .join(''),
  );
}

function renderAPIKeyList(result) {
  const apiKeys = result?.apiKeys || [];
  liveState.apiKeys = { ...result, apiKeys, syncedAt: Date.now() };
  if (!apiKeys.length) {
    liveState.apiKey = null;
  }
  if (!liveState.apiKey && apiKeys.length) {
    liveState.apiKey = apiKeys[0];
  }
  setMetric('api-key-list-meta', apiKeys.length ? `${apiKeys.length} key${apiKeys.length === 1 ? '' : 's'} issued` : 'No API keys issued yet.');
  if (!apiKeys.length) {
    setHTML('api-key-list', '<div class="alert-item empty-state">Generate an API key to see wallet-bound credentials listed here.</div>');
    renderConversionSummary();
    return;
  }
  setHTML(
    'api-key-list',
    apiKeys
      .map(
        (apiKey) => `
          <div class="alert-item">
            <div class="alert-item-head">
              <div>
                <div class="alert-title">${escapeHTML(apiKey.name || 'api key')}</div>
                <div class="alert-meta">${escapeHTML(apiKey.walletAddress || 'wallet-bound')}</div>
              </div>
              <span class="pill-badge low">${escapeHTML(apiKey.planTier || 'active')}</span>
            </div>
            <div class="alert-item-foot">
              <div class="alert-meta">${escapeHTML(apiKey.tokenPreview || '-')}</div>
              <div class="alert-evidence">${escapeHTML(apiKey.expiresAt || 'no expiry')}</div>
            </div>
          </div>`,
      )
      .join(''),
  );
  renderConversionSummary();
}

async function loadAPIKeys() {
  if (!getSession()) {
    return;
  }
  try {
    const result = await requestJSON('/v1/projects/me/api-keys');
    renderAPIKeyList(result);
  } catch (error) {
    setMetric('api-key-list-meta', 'API key history unavailable.');
    write('demo-key-result', `API key history unavailable\n${error.message}`);
  }
}

async function loadDestinations() {
  if (!getSession()) {
    return;
  }
  try {
    const result = await requestJSON(`${alertOpsBase}/destinations`);
    renderDestinationList(result);
  } catch (error) {
    setMetric('destination-list-meta', 'Destination routes unavailable.');
    write('destination-result', `Destination routes unavailable\n${error.message}`);
  }
}

async function loadDeliveries() {
  if (!getSession()) {
    return;
  }
  try {
    const result = await requestJSON(`${alertOpsBase}/deliveries`);
    renderDeliveryList(result);
  } catch (error) {
    setMetric('delivery-list-meta', 'Delivery history unavailable.');
    write('destination-result', `Delivery history unavailable\n${error.message}`);
  }
}

function renderMonitorList(result) {
  const monitors = result?.monitors || [];
  liveState.monitors = { ...result, monitors, syncedAt: Date.now() };
  setMetric('monitor-list-meta', monitors.length ? `${monitors.length} active monitors` : 'No monitors yet.');
  if (!monitors.length) {
    setHTML('monitor-list', '<div class="alert-item empty-state">No active monitors yet. Create one from a template.</div>');
    return;
  }
  setHTML(
    'monitor-list',
    monitors
      .map(
        (monitor) => `
          <div class="alert-item">
            <div class="alert-item-head">
              <div>
                <div class="alert-title">${escapeHTML(monitor.name || 'monitor')}</div>
                <div class="alert-meta">${escapeHTML(monitor.targetType || 'target')} · ${escapeHTML(shortDigest(monitor.targetValue || '-'))}</div>
              </div>
              <span class="pill-badge ${escapeHTML(String(monitor.severity || 'medium').toLowerCase())}">${escapeHTML(monitor.severity || 'medium')}</span>
            </div>
            <div class="alert-item-foot">
              <div class="alert-meta">Template ${escapeHTML(monitor.ruleTemplateId || '-')}</div>
              <div class="alert-evidence">${escapeHTML(monitor.status || 'active')}</div>
            </div>
          </div>`,
      )
      .join(''),
  );
}

function renderAlertsView(result) {
  const alerts = result?.alerts || [];
  liveState.alerts = { ...result, alerts, syncedAt: Date.now() };
  latestAlertsCache = alerts;
  const counts = alerts.reduce(
    (acc, alert) => {
      const severity = String(alert?.severity || '').toLowerCase();
      if (severity === 'high') acc.high += 1;
      if (severity === 'medium') acc.medium += 1;
      if (severity === 'low') acc.low += 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 },
  );

  setMetric('alerts-total', String(result?.count ?? alerts.length ?? 0));
  setMetric('alerts-high', String(counts.high));
  setMetric('alerts-medium', String(counts.medium));
  setMetric('alerts-latest', alerts[0]?.timestamp ? formatTimestamp(alerts[0].timestamp) : '-');
  setMetric('alerts-feed-meta', `${alerts.length} live alerts synced`);

  if (!alerts.length) {
    setHTML('alerts-feed', '<div class="alert-item empty-state">No live alerts matched the current tenant feed.</div>');
    renderAlertDetail(null);
    renderConversionSummary();
    return;
  }

  setHTML(
    'alerts-feed',
      alerts
      .map((alert, index) => {
        const evidenceId = String(alert.evidenceId || alert.id || '');
        const selected = evidenceId && evidenceId === selectedAlertEvidenceId ? ' is-selected' : '';
        return `
          <button type="button" class="alert-item alert-item-button${selected}" data-alert-index="${index}">
            <div class="alert-item-head">
              <div>
                <div class="alert-title">${escapeHTML(alert.type || 'alert')}</div>
                <div class="alert-meta">Source ${escapeHTML(alert.source || '-')}</div>
              </div>
              <span class="pill-badge ${escapeHTML(String(alert.severity || 'medium').toLowerCase())}">${escapeHTML(alert.severity || 'medium')}</span>
            </div>
            <div class="alert-item-foot">
              <div class="alert-meta">Triggered ${escapeHTML(formatTimestamp(alert.timestamp))}</div>
              <div class="alert-evidence">${escapeHTML(shortDigest(alert.evidenceId || alert.id || '-'))}</div>
            </div>
          </button>`;
      })
      .join(''),
  );
  const targetAlert = alerts.find((alert) => String(alert.evidenceId || alert.id || '') === selectedAlertEvidenceId) || alerts[0];
  renderAlertDetail(targetAlert);
  renderConversionSummary();
}

function readExecutionFormValues() {
  const form = document.getElementById('execution-form');
  if (!form) return null;
  return Object.fromEntries(new FormData(form).entries());
}

async function loadExecutionFromForm() {
  const values = readExecutionFormValues();
  if (!values) return;
  if (!getSession()) {
    write('execution-result', 'Login required in Demo Access before loading execution data.');
    return;
  }

  const query = new URLSearchParams({
    poolId: values.poolId,
    symbol: values.symbol,
    window: values.window,
  });
  const fillsQuery = new URLSearchParams({
    poolId: values.poolId,
    window: values.window,
    limit: '5',
  });
  const lifecycleQuery = new URLSearchParams({
    poolId: values.poolId,
    window: values.window,
    limit: '5',
  });
  if (values.eventType) {
    lifecycleQuery.set('eventType', values.eventType);
  }

  write('execution-result', 'Loading execution summary...');
  const [summary, fills, lifecycle] = await Promise.all([
    requestJSON(`/v1/execution/summaries?${query.toString()}`),
    requestJSON(`/v1/execution/fills?${fillsQuery.toString()}`),
    requestJSON(`/v1/execution/lifecycle?${lifecycleQuery.toString()}`),
  ]);
  renderExecutionView(summary, fills, lifecycle);
  write('execution-result', `Execution synced · ${summary.poolId} · ${fills.count} fills · ${lifecycle.count} lifecycle events`);
}

function applySessionState() {
  const session = getSession();
  const app = document.getElementById('console-app');
  if (!app) return;

  if (!session) {
    app.classList.remove('is-active');
    app.classList.add('is-locked');
    write('workspace-session-result', 'No active workspace session. Use Wallet Login or Demo Fallback to continue to the console.');
    syncWalletBoundActions();
    return;
  }

  app.classList.remove('is-locked');
  app.classList.add('is-active');
  if ((session.authMethod || '') === 'google') {
    syncGoogleConnectionState({ status: 'connected', email: session.email || '' });
  }
  write('workspace-session-result', {
    mode: 'authenticated',
    authMethod: session.authMethod || 'session',
    workspaceName: session.workspaceName,
    operatorName: session.operatorName,
    walletAddress: session.walletAddress,
    email: session.email || '',
    status: 'active',
    expiresAt: session.expiresAt ? new Date(session.expiresAt * 1000).toLocaleString() : '-',
  });
  syncWalletBoundActions();
}

async function handleWorkspaceLogin(event) {
  event.preventDefault();
  const payload = buildWalletLoginPayload(event.currentTarget);
  write('workspace-session-result', 'Issuing wallet login challenge...');
  try {
    if (!walletLoginClient) {
      throw new Error('Wallet login bundle is not loaded yet. Refresh and try again.');
    }
    if (!payload.walletAddress) {
      throw new Error('Connect a Sui wallet before signing in.');
    }
    const challenge = await requestJSON('/v1/auth/wallet/nonce', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    write('workspace-session-result', {
      mode: 'wallet_challenge_issued',
      walletAddress: challenge.walletAddress,
      nonce: shortDigest(challenge.nonce),
      expiresAt: challenge.expiresAt ? new Date(challenge.expiresAt * 1000).toLocaleString() : '-',
      status: 'awaiting signature',
    });
    const signed = await walletLoginClient.signPersonalMessage(challenge.message);
    const session = await requestJSON('/v1/auth/wallet/verify', {
      method: 'POST',
      body: JSON.stringify({
        nonce: challenge.nonce,
        signature: signed.signature,
      }),
    });
    await finishWorkspaceAuthentication(session, `Wallet session started for ${session.workspaceName}. You can now explore the console.`);
  } catch (error) {
    clearSession();
    applySessionState();
    write('workspace-session-result', `Wallet login failed\n${error.message}`);
  }
}

async function handleWorkspaceDemoFallback() {
  const form = document.getElementById('workspace-login-form');
  const payload = buildWalletLoginPayload(form);
  if (!payload.walletAddress) {
    write('workspace-session-result', 'Connect a wallet or enter a wallet address before using Demo Fallback.');
    return;
  }
  write('workspace-session-result', 'Authenticating demo fallback session...');
  try {
    const session = await requestJSON('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await finishWorkspaceAuthentication(session, `Demo fallback session started for ${session.workspaceName}.`);
  } catch (error) {
    clearSession();
    applySessionState();
    write('workspace-session-result', `Demo fallback login failed\n${error.message}`);
  }
}

async function handleWorkspaceLogout() {
  try {
    await requestJSON('/v1/auth/logout', { method: 'POST' });
  } catch {
  }
  try {
    window.google?.accounts?.id?.disableAutoSelect?.();
  } catch {
  }
  clearSession();
  applySessionState();
  syncGoogleConnectionState(authProviders?.google?.enabled ? { status: 'ready' } : { status: 'unavailable' });
  updateProgress('Workspace session cleared. Sign in again to continue.');
}

async function restoreSession() {
  try {
    const session = await requestJSON('/v1/auth/session');
    saveSession(session);
  } catch {
    clearSession();
  }
  applySessionState();
}

function scrollToPanel(id) {
  const node = document.getElementById(id);
  if (node) {
    node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function setStepState(step, state, detail) {
  const config = steps[step];
  if (!config) return;

  const node = document.getElementById(config.statusId);
  if (!node) return;

  node.className = `step-status ${state}`;
  node.textContent = state === 'done' ? 'Completed' : state === 'active' ? 'In Progress' : 'Pending';

  if (state === 'done') {
    progressState[step] = true;
  }

  updateProgress(detail || `${config.label} ${node.textContent.toLowerCase()}.`);
}

function updateProgress(message) {
  const completed = Object.values(progressState).filter(Boolean).length;
  const percent = (completed / Object.keys(progressState).length) * 100;
  document.getElementById('demo-progress-bar').style.width = `${percent}%`;
  document.getElementById('demo-progress-label').textContent = `${completed} / ${Object.keys(progressState).length} completed`;
  if (message) {
    write('demo-log', message);
  }
}

async function loadWorkspace() {
  if (!getSession()) {
    write('workspace-log', 'Login required in Demo Access before loading alert ops overview.');
    return;
  }
  setStepState('workspace', 'active', 'Loading alert ops overview...');
  write('workspace-log', 'Loading alert ops overview...');
  try {
    const overview = await requestJSON(`${alertOpsBase}/overview`);
    const project = overview.workspace || {};
    const usage = overview.usage || {};
    const alerts = overview.alerts || { count: 0 };

    document.getElementById('workspace-project').textContent = project.name || project.id || 'Unknown';
    document.getElementById('workspace-plan').textContent = project.plan || '-';
    document.getElementById('workspace-requests').textContent = usage.requests ?? '-';
    document.getElementById('workspace-alerts').textContent = usage.alerts ?? alerts.count ?? '-';
    liveState.workspace = { project, usage, alertsCount: alerts.count };
    renderConversionSummary();
    write('workspace-log', overview);
    setStepState('workspace', 'done', 'Alert ops overview loaded. The buyer can now see plan, request load, and alert volume.');
  } catch (error) {
    write('workspace-log', `Alert ops overview unavailable\n${error.message}`);
    setStepState('workspace', 'pending', 'Overview unavailable. Configure tenant and alerts upstream to complete the first step.');
  }
}

async function loadRuleTemplates() {
  if (!getSession()) {
    renderRuleTemplates([]);
    return;
  }
  try {
    const result = await requestJSON(`${alertOpsBase}/rule-templates`);
    renderRuleTemplates(result);
  } catch (error) {
    renderRuleTemplates([]);
    write('monitors-result', `Rule templates unavailable\n${error.message}`);
  }
}

async function loadMonitors() {
  if (!getSession()) {
    renderMonitorList({ count: 0, monitors: [] });
    return;
  }
  try {
    const result = await requestJSON(`${alertOpsBase}/monitors`);
    renderMonitorList(result);
    if ((result?.count || 0) > 0) {
      setStepState('monitors', 'done', 'Monitor coverage is active. Templates are now bound to concrete targets.');
    }
  } catch (error) {
    renderMonitorList({ count: 0, monitors: [] });
    write('monitors-result', `Monitors unavailable\n${error.message}`);
  }
}

async function createMonitor(event) {
  event.preventDefault();
  if (!getSession()) {
    write('monitors-result', 'Login required in Demo Access before creating a monitor.');
    return;
  }
  const form = new FormData(event.currentTarget);
  const payload = Object.fromEntries(form.entries());
  setStepState('monitors', 'active', 'Creating monitor from rule template...');
  write('monitors-result', 'Creating monitor...');
  try {
    const result = await requestJSON(`${alertOpsBase}/monitors`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await loadMonitors();
    write('monitors-result', `Monitor created · ${result.name || result.id}`);
    setStepState('monitors', 'done', 'Monitor created. The service can now watch the selected target continuously.');
  } catch (error) {
    write('monitors-result', `Create monitor failed\n${error.message}`);
    setStepState('monitors', 'pending', 'Monitor creation failed. Complete rule template and target fields to continue.');
  }
}

async function createDemoKey(event) {
  event.preventDefault();
  if (!getSession()) {
    write('demo-key-result', 'Login required in Demo Access before generating an API key.');
    return;
  }
  if (!sessionHasWalletPrivileges()) {
    const message = walletAccessMessage('API key generation');
    write('demo-key-result', message);
    setStepState('apikey', 'pending', message);
    return;
  }
  const form = new FormData(event.currentTarget);
  const payload = Object.fromEntries(form.entries());
  setStepState('apikey', 'active', 'Generating real API key...');
  write('demo-key-result', 'Generating real API key...');
  try {
    const result = await requestJSON('/v1/projects/me/api-keys', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    liveState.apiKey = result;
    await loadAPIKeys();
    renderConversionSummary();

    write('demo-key-result', {
      ...result,
      note: 'Store this API key securely. The full token is shown only at creation time.',
      nextCallExample: 'curl -H "X-API-Key: YOUR_REAL_KEY" $BASE_URL/v1/auth/api-key/validate',
    });
    setStepState('apikey', 'done', 'Real API key generated. The user can now move into an authenticated integration flow.');
    scrollToPanel('conversion-cta');
  } catch (error) {
    write('demo-key-result', `Generate API key failed\n${error.message}`);
    setStepState('apikey', 'pending', 'API key generation requires a wallet-backed session and a healthy tenant service.');
  }
}

async function submitRisk(event) {
  event.preventDefault();
  if (!getSession()) {
    write('risk-result', 'Login required in Demo Access before running a risk check.');
    return;
  }
  const form = new FormData(event.currentTarget);
  const payload = Object.fromEntries(form.entries());
  setStepState('risk', 'active', 'Submitting first risk decision...');
  write('risk-result', 'Submitting risk check...');
  try {
    const result = await requestJSON('/v1/risk/check', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    write('risk-result', result);
    renderReplayView(result);
    if (result.evidenceId) {
      document.getElementById('replay-evidence-id').value = result.evidenceId;
    }
    setStepState('risk', 'done', 'First decision completed. Replay is now preloaded with the returned evidence ID.');
  } catch (error) {
    write('risk-result', `Risk check failed\n${error.message}`);
    setStepState('risk', 'pending', 'Risk engine unavailable. Keep the API live to complete this step.');
  }
}

async function loadReplay(event) {
  event.preventDefault();
  if (!getSession()) {
    write('replay-result', 'Login required in Demo Access before loading replay evidence.');
    return;
  }
  const evidenceId = document.getElementById('replay-evidence-id').value.trim();
  if (!evidenceId) {
    write('replay-result', 'Please enter an evidenceId.');
    return;
  }
  write('replay-result', 'Loading replay...');
  setStepState('replay', 'active', 'Loading replay evidence...');
  try {
    const result = await requestJSON(`${alertOpsBase}/replays/${encodeURIComponent(evidenceId)}`);
    renderReplayView(result);
    write('replay-result', result);
    setStepState('replay', 'done', 'Replay loaded. The team can now explain why this alert mattered.');
  } catch (error) {
    write('replay-result', `Replay failed\n${error.message}`);
    setStepState('replay', 'pending', 'Replay unavailable. Keep evidence service online to complete this step.');
  }
}

async function loadExecution(event) {
  event.preventDefault();
  try {
    await loadExecutionFromForm();
  } catch (error) {
    write('execution-result', `Execution summary failed\n${error.message}`);
  }
}

async function loadAlerts() {
  if (!getSession()) {
    write('alerts-result', 'Login required in Demo Access before loading alerts.');
    return;
  }
  setStepState('alerts', 'active', 'Loading live alert feed...');
  write('alerts-result', 'Loading alerts...');
  try {
    const result = await requestJSON(`${alertOpsBase}/alerts`);
    renderAlertsView(result);
    write('alerts-result', `Alert feed synced · ${result.count} live alerts`);
    setStepState('alerts', 'done', 'Live alerts synced. Select one to inspect evidence and open replay.');
  } catch (error) {
    write('alerts-result', `Alerts unavailable\n${error.message}`);
    setStepState('alerts', 'pending', 'Alert feed unavailable. Configure alerts upstream to complete this step.');
  }
}

async function createDestination(event) {
  event.preventDefault();
  if (!getSession()) {
    write('destination-result', 'Login required in Demo Access before configuring a destination.');
    return;
  }
  if (!sessionHasWalletPrivileges()) {
    const message = walletAccessMessage('Webhook configuration');
    write('destination-result', message);
    setStepState('webhook', 'pending', message);
    return;
  }
  const form = new FormData(event.currentTarget);
  const payload = Object.fromEntries(form.entries());
  setStepState('webhook', 'active', 'Creating webhook destination...');
  write('destination-result', 'Creating destination...');
  try {
    const result = await requestJSON(`${alertOpsBase}/destinations`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    liveState.destination = result;
    write('destination-result', result);
    await loadDestinations();
    setStepState('webhook', 'done', 'Webhook destination configured. The product now feels operational and recurring.');
  } catch (error) {
    write('destination-result', `Create destination failed\n${error.message}`);
    setStepState('webhook', 'pending', 'Webhook setup failed. Configure alerts upstream to complete this step.');
  }
}

async function testDestination() {
	if (!getSession()) {
		write('destination-result', 'Login required in Demo Access before sending a test webhook.');
		return;
	}
	if (!sessionHasWalletPrivileges()) {
		const message = walletAccessMessage('Webhook test delivery');
		write('destination-result', message);
		return;
	}
	const destination = liveState.destination;
	if (!destination?.target || !destination?.webhookSecret) {
		write('destination-result', 'Create a webhook destination first so the console can test a signed delivery.');
		return;
	}
	write('destination-result', 'Sending signed test webhook...');
	try {
		const result = await requestJSON(`${alertOpsBase}/destinations/test`, {
			method: 'POST',
			body: JSON.stringify({
				destinationId: destination.id,
				target: destination.target,
				secret: destination.webhookSecret,
				eventType: destination.eventTypes?.[0] || 'risk_alert',
				payload: {
					tx_digest: latestAlertsCache[0]?.evidenceId || 'tx_demo_test',
					severity: latestAlertsCache[0]?.severity || 'medium',
					source: latestAlertsCache[0]?.source || 'product-api',
					workspace: getSession()?.workspaceName || 'Alpha Desk',
				},
			}),
		});
		write('destination-result', result);
		await loadDeliveries();
		setStepState('webhook', 'done', 'Signed webhook test sent. The integration path is now verifiable for buyers and grant reviewers.');
	} catch (error) {
		write('destination-result', `Test webhook failed\n${error.message}`);
	}
}

async function retryDelivery(deliveryId) {
	if (!deliveryId) {
		return;
	}
	write('destination-result', 'Retrying webhook delivery...');
	try {
		const result = await requestJSON(`${alertOpsBase}/deliveries/${encodeURIComponent(deliveryId)}/retry`, {
			method: 'POST',
		});
		write('destination-result', result);
		await loadDeliveries();
	} catch (error) {
		write('destination-result', `Retry delivery failed\n${error.message}`);
	}
}

window.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('workspace-login-form').addEventListener('submit', handleWorkspaceLogin);
  document.getElementById('workspace-demo-login').addEventListener('click', handleWorkspaceDemoFallback);
  document.getElementById('workspace-logout').addEventListener('click', handleWorkspaceLogout);
  document.getElementById('workspace-refresh').addEventListener('click', loadWorkspace);
  document.getElementById('demo-key-form').addEventListener('submit', createDemoKey);
  document.getElementById('monitor-form').addEventListener('submit', createMonitor);
  document.getElementById('alerts-refresh').addEventListener('click', loadAlerts);
  document.getElementById('risk-form').addEventListener('submit', submitRisk);
  document.getElementById('replay-form').addEventListener('submit', loadReplay);
  document.getElementById('execution-form').addEventListener('submit', loadExecution);
  document.getElementById('destination-form').addEventListener('submit', createDestination);
  document.getElementById('destination-test').addEventListener('click', testDestination);
  document.getElementById('delivery-list').addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-delivery-id]');
    if (!trigger) return;
    retryDelivery(trigger.getAttribute('data-delivery-id'));
  });
  document.getElementById('demo-check-workspace').addEventListener('click', loadWorkspace);
  document.getElementById('demo-go-apikey').addEventListener('click', () => scrollToPanel('apikey-panel'));
  document.getElementById('demo-go-monitors').addEventListener('click', () => scrollToPanel('monitors-panel'));
  document.getElementById('demo-go-alerts').addEventListener('click', () => scrollToPanel('alerts-panel'));
  document.getElementById('demo-go-webhook').addEventListener('click', () => scrollToPanel('alerts-panel'));
  document.getElementById('demo-go-replay').addEventListener('click', () => scrollToPanel('replay-panel'));
  document.getElementById('cta-open-workspace').addEventListener('click', () => scrollToPanel('workspace-panel'));
  document.getElementById('cta-open-replay').addEventListener('click', () => scrollToPanel('replay-panel'));
  document.getElementById('cta-open-alerts').addEventListener('click', () => scrollToPanel('alerts-panel'));
  document.getElementById('copy-pitch-summary').addEventListener('click', () => {
    copyPitchSummary().catch(() => {
      write('pitch-summary', `${conversionSummaryText()}\n\nCopy manually from this panel.`);
    });
  });
  document.getElementById('copy-grant-onepager').addEventListener('click', () => {
    copyGrantOnePager().catch(() => {
      write('grant-onepager', `${grantOnePagerText()}\n\nCopy manually from this panel.`);
    });
  });
  document.getElementById('pitch-mode-toggle').addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-conversion-mode]');
    if (!trigger) return;
    conversionMode = trigger.getAttribute('data-conversion-mode') || 'buyer';
    renderConversionSummary();
  });
  document.getElementById('alerts-feed').addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-alert-index]');
    if (!trigger) return;
    const index = Number(trigger.getAttribute('data-alert-index'));
    const alert = latestAlertsCache[index];
    if (!alert) return;
    selectedAlertEvidenceId = String(alert.evidenceId || alert.id || '');
    const replayInput = document.getElementById('replay-evidence-id');
    if (replayInput) {
      replayInput.value = selectedAlertEvidenceId;
    }
    setStepState('replay', 'active', 'Alert selected. Replay input is prefilled and ready to load.');
    renderAlertsView({ count: latestAlertsCache.length, alerts: latestAlertsCache });
  });

  await initializeAuthProviders();
  await initializeGoogleLogin();
  await initializeWalletLogin();
  await restoreSession();
  renderReadinessView(null);
  renderReplayView(null);
  renderAPIKeyList({ count: 0, apiKeys: [] });
  renderRuleTemplates([]);
  renderMonitorList({ count: 0, monitors: [] });
  renderDestinationList({ count: 0, destinations: [] });
  renderDeliveryList({ count: 0, deliveries: [] });
  renderConversionSummary();
  updateProgress('Alert ops flow ready. Start with overview.');
  loadReadiness();
  if (getSession()) {
    loadWorkspace();
    loadAPIKeys();
    loadRuleTemplates();
    loadMonitors();
    loadAlerts();
    loadDestinations();
    loadDeliveries();
  }
});
