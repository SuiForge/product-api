import { createDAppKit } from '@mysten/dapp-kit-core';
import '@mysten/dapp-kit-core/web';
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

type SupportedNetwork = 'mainnet' | 'testnet' | 'devnet';

type WalletConnectionSnapshot = {
	status: string;
	isConnected: boolean;
	walletAddress: string;
	walletName: string;
	accountLabel: string;
};

type WalletLoginClientOptions = {
	connectButtonId?: string;
	network?: string;
	onStateChange?: (state: WalletConnectionSnapshot) => void;
};

function normalizeNetwork(network?: string): SupportedNetwork {
	switch (String(network || '').trim().toLowerCase()) {
		case 'testnet':
			return 'testnet';
		case 'devnet':
			return 'devnet';
		default:
			return 'mainnet';
	}
}

function createSnapshot(dAppKit: ReturnType<typeof createDAppKit>): WalletConnectionSnapshot {
	const connection = dAppKit.stores.$connection.get() as {
		status?: string;
		wallet?: { name?: string };
		account?: { address?: string; label?: string };
	};
	return {
		status: connection?.status || 'disconnected',
		isConnected: Boolean(connection?.account?.address),
		walletAddress: connection?.account?.address || '',
		walletName: connection?.wallet?.name || '',
		accountLabel: connection?.account?.label || connection?.account?.address || '',
	};
}

function bindConnectButton(dAppKit: ReturnType<typeof createDAppKit>, connectButtonId?: string) {
	if (!connectButtonId || typeof document === 'undefined') {
		return;
	}
	const element = document.getElementById(connectButtonId) as { instance?: ReturnType<typeof createDAppKit> } | null;
	if (element) {
		element.instance = dAppKit;
	}
}

export function createWalletLoginClient(options: WalletLoginClientOptions = {}) {
	const network = normalizeNetwork(options.network);
	const dAppKit = createDAppKit({
		networks: [network],
		defaultNetwork: network,
		createClient: (selectedNetwork) => new SuiJsonRpcClient({
			url: getJsonRpcFullnodeUrl(normalizeNetwork(selectedNetwork)),
		}),
	});

	bindConnectButton(dAppKit, options.connectButtonId);

	const emitState = () => {
		options.onStateChange?.(createSnapshot(dAppKit));
	};

	const connectionStore = dAppKit.stores.$connection as {
		listen?: (listener: () => void) => () => void;
		subscribe?: (listener: () => void) => () => void;
	};

	let cleanup = () => {};
	if (typeof connectionStore.listen === 'function') {
		cleanup = connectionStore.listen(() => emitState());
	} else if (typeof connectionStore.subscribe === 'function') {
		cleanup = connectionStore.subscribe(() => emitState());
	}

	emitState();

	return {
		getConnection() {
			return createSnapshot(dAppKit);
		},
		async signPersonalMessage(message: string) {
			return dAppKit.signPersonalMessage({ message: new TextEncoder().encode(message) });
		},
		async disconnect() {
			await dAppKit.disconnectWallet();
			emitState();
		},
		destroy() {
			cleanup();
		},
	};
}
