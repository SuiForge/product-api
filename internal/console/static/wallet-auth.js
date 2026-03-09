var ProductWalletAuth = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod2) => function __require() {
    return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
    mod2
  ));
  var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
  var __privateWrapper = (obj, member, setter, getter) => ({
    set _(value) {
      __privateSet(obj, member, value, setter);
    },
    get _() {
      return __privateGet(obj, member, getter);
    }
  });

  // node_modules/@nanostores/lit/lib/StoreController.js
  var require_StoreController = __commonJS({
    "node_modules/@nanostores/lit/lib/StoreController.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StoreController = void 0;
      var StoreController = class {
        constructor(host, atom2) {
          this.host = host;
          this.atom = atom2;
          host.addController(this);
        }
        // Subscribe to the atom when the host connects
        hostConnected() {
          this.unsubscribe = this.atom.subscribe(() => {
            this.host.requestUpdate();
          });
        }
        // Unsubscribe from the atom when the host disconnects
        hostDisconnected() {
          var _a23;
          (_a23 = this.unsubscribe) === null || _a23 === void 0 ? void 0 : _a23.call(this);
        }
        /**
         * The current value of the atom.
         * @readonly
         */
        get value() {
          return this.atom.get();
        }
      };
      exports.StoreController = StoreController;
    }
  });

  // node_modules/@nanostores/lit/lib/MultiStoreController.js
  var require_MultiStoreController = __commonJS({
    "node_modules/@nanostores/lit/lib/MultiStoreController.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.MultiStoreController = void 0;
      var MultiStoreController2 = class {
        constructor(host, atoms) {
          this.host = host;
          this.atoms = atoms;
          host.addController(this);
        }
        // Subscribe to the atom when the host connects
        hostConnected() {
          this.unsubscribes = this.atoms.map((atom2) => atom2.subscribe(() => this.host.requestUpdate()));
        }
        // Unsubscribe from the atom when the host disconnects
        hostDisconnected() {
          var _a23;
          (_a23 = this.unsubscribes) === null || _a23 === void 0 ? void 0 : _a23.forEach((unsubscribe) => unsubscribe());
        }
        /**
         * The current values of the atoms.
         * @readonly
         */
        get values() {
          return this.atoms.map((atom2) => atom2.get());
        }
      };
      exports.MultiStoreController = MultiStoreController2;
    }
  });

  // node_modules/@nanostores/lit/lib/useStores.js
  var require_useStores = __commonJS({
    "node_modules/@nanostores/lit/lib/useStores.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.useStores = void 0;
      var MultiStoreController_1 = require_MultiStoreController();
      function useStores(...atoms) {
        return (constructor) => {
          return class extends constructor {
            constructor(...args) {
              super(...args);
              new MultiStoreController_1.MultiStoreController(this, atoms);
            }
          };
        };
      }
      exports.useStores = useStores;
    }
  });

  // node_modules/@nanostores/lit/lib/withStores.js
  var require_withStores = __commonJS({
    "node_modules/@nanostores/lit/lib/withStores.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.withStores = void 0;
      var MultiStoreController_1 = require_MultiStoreController();
      var withStores = (LitElementClass, atoms) => {
        return class LitElementWithStores extends LitElementClass {
          constructor(...args) {
            super(...args);
            new MultiStoreController_1.MultiStoreController(this, atoms);
          }
        };
      };
      exports.withStores = withStores;
    }
  });

  // node_modules/@nanostores/lit/lib/index.js
  var require_lib = __commonJS({
    "node_modules/@nanostores/lit/lib/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.withStores = exports.useStores = exports.MultiStoreController = exports.StoreController = void 0;
      var StoreController_1 = require_StoreController();
      Object.defineProperty(exports, "StoreController", { enumerable: true, get: function() {
        return StoreController_1.StoreController;
      } });
      var MultiStoreController_1 = require_MultiStoreController();
      Object.defineProperty(exports, "MultiStoreController", { enumerable: true, get: function() {
        return MultiStoreController_1.MultiStoreController;
      } });
      var useStores_1 = require_useStores();
      Object.defineProperty(exports, "useStores", { enumerable: true, get: function() {
        return useStores_1.useStores;
      } });
      var withStores_1 = require_withStores();
      Object.defineProperty(exports, "withStores", { enumerable: true, get: function() {
        return withStores_1.withStores;
      } });
    }
  });

  // web-src/wallet-auth.ts
  var wallet_auth_exports = {};
  __export(wallet_auth_exports, {
    createWalletLoginClient: () => createWalletLoginClient
  });

  // node_modules/nanostores/task/index.js
  var tasks = 0;
  var resolves = [];
  function startTask() {
    tasks += 1;
    return () => {
      tasks -= 1;
      if (tasks === 0) {
        let prevResolves = resolves;
        resolves = [];
        for (let i7 of prevResolves) i7();
      }
    };
  }
  function task(cb) {
    let endTask = startTask();
    let promise = cb().finally(endTask);
    promise.t = true;
    return promise;
  }

  // node_modules/nanostores/clean-stores/index.js
  var clean = Symbol("clean");

  // node_modules/nanostores/atom/index.js
  var listenerQueue = [];
  var lqIndex = 0;
  var QUEUE_ITEMS_PER_LISTENER = 4;
  var epoch = 0;
  var atom = /* @__NO_SIDE_EFFECTS__ */ (initialValue) => {
    let listeners2 = [];
    let $atom = {
      get() {
        if (!$atom.lc) {
          $atom.listen(() => {
          })();
        }
        return $atom.value;
      },
      lc: 0,
      listen(listener) {
        $atom.lc = listeners2.push(listener);
        return () => {
          for (let i7 = lqIndex + QUEUE_ITEMS_PER_LISTENER; i7 < listenerQueue.length; ) {
            if (listenerQueue[i7] === listener) {
              listenerQueue.splice(i7, QUEUE_ITEMS_PER_LISTENER);
            } else {
              i7 += QUEUE_ITEMS_PER_LISTENER;
            }
          }
          let index = listeners2.indexOf(listener);
          if (~index) {
            listeners2.splice(index, 1);
            if (!--$atom.lc) $atom.off();
          }
        };
      },
      notify(oldValue, changedKey) {
        epoch++;
        let runListenerQueue = !listenerQueue.length;
        for (let listener of listeners2) {
          listenerQueue.push(listener, $atom.value, oldValue, changedKey);
        }
        if (runListenerQueue) {
          for (lqIndex = 0; lqIndex < listenerQueue.length; lqIndex += QUEUE_ITEMS_PER_LISTENER) {
            listenerQueue[lqIndex](
              listenerQueue[lqIndex + 1],
              listenerQueue[lqIndex + 2],
              listenerQueue[lqIndex + 3]
            );
          }
          listenerQueue.length = 0;
        }
      },
      /* It will be called on last listener unsubscribing.
         We will redefine it in onMount and onStop. */
      off() {
      },
      set(newValue) {
        let oldValue = $atom.value;
        if (oldValue !== newValue) {
          $atom.value = newValue;
          $atom.notify(oldValue);
        }
      },
      subscribe(listener) {
        let unbind = $atom.listen(listener);
        listener($atom.value);
        return unbind;
      },
      value: initialValue
    };
    if (true) {
      $atom[clean] = () => {
        listeners2 = [];
        $atom.lc = 0;
        $atom.off();
      };
    }
    return $atom;
  };
  var readonlyType = (store) => store;

  // node_modules/nanostores/lifecycle/index.js
  var MOUNT = 5;
  var UNMOUNT = 6;
  var REVERT_MUTATION = 10;
  var on = (object2, listener, eventKey, mutateStore) => {
    object2.events = object2.events || {};
    if (!object2.events[eventKey + REVERT_MUTATION]) {
      object2.events[eventKey + REVERT_MUTATION] = mutateStore((eventProps) => {
        object2.events[eventKey].reduceRight((event, l3) => (l3(event), event), {
          shared: {},
          ...eventProps
        });
      });
    }
    object2.events[eventKey] = object2.events[eventKey] || [];
    object2.events[eventKey].push(listener);
    return () => {
      let currentListeners = object2.events[eventKey];
      let index = currentListeners.indexOf(listener);
      currentListeners.splice(index, 1);
      if (!currentListeners.length) {
        delete object2.events[eventKey];
        object2.events[eventKey + REVERT_MUTATION]();
        delete object2.events[eventKey + REVERT_MUTATION];
      }
    };
  };
  var STORE_UNMOUNT_DELAY = 1e3;
  var onMount = ($store, initialize) => {
    let listener = (payload) => {
      let destroy = initialize(payload);
      if (destroy) $store.events[UNMOUNT].push(destroy);
    };
    return on($store, listener, MOUNT, (runListeners) => {
      let originListen = $store.listen;
      $store.listen = (...args) => {
        if (!$store.lc && !$store.active) {
          $store.active = true;
          runListeners();
        }
        return originListen(...args);
      };
      let originOff = $store.off;
      $store.events[UNMOUNT] = [];
      $store.off = () => {
        originOff();
        setTimeout(() => {
          if ($store.active && !$store.lc) {
            $store.active = false;
            for (let destroy of $store.events[UNMOUNT]) destroy();
            $store.events[UNMOUNT] = [];
          }
        }, STORE_UNMOUNT_DELAY);
      };
      if (true) {
        let originClean = $store[clean];
        $store[clean] = () => {
          for (let destroy of $store.events[UNMOUNT]) destroy();
          $store.events[UNMOUNT] = [];
          $store.active = false;
          originClean();
        };
      }
      return () => {
        $store.listen = originListen;
        $store.off = originOff;
      };
    });
  };

  // node_modules/nanostores/computed/index.js
  var computedStore = (stores, cb, batched2) => {
    if (!Array.isArray(stores)) stores = [stores];
    let previousArgs;
    let currentEpoch;
    let set = () => {
      if (currentEpoch === epoch) return;
      currentEpoch = epoch;
      let args = stores.map(($store) => $store.get());
      if (!previousArgs || args.some((arg, i7) => arg !== previousArgs[i7])) {
        previousArgs = args;
        let value = cb(...args);
        if (value && value.then && value.t) {
          value.then((asyncValue) => {
            if (previousArgs === args) {
              $computed.set(asyncValue);
            }
          });
        } else {
          $computed.set(value);
          currentEpoch = epoch;
        }
      }
    };
    let $computed = atom(void 0);
    let get2 = $computed.get;
    $computed.get = () => {
      set();
      return get2();
    };
    let timer;
    let run = batched2 ? () => {
      clearTimeout(timer);
      timer = setTimeout(set);
    } : set;
    onMount($computed, () => {
      let unbinds = stores.map(($store) => $store.listen(run));
      set();
      return () => {
        for (let unbind of unbinds) unbind();
      };
    });
    return $computed;
  };
  var computed = /* @__NO_SIDE_EFFECTS__ */ (stores, fn) => computedStore(stores, fn);

  // node_modules/nanostores/map/index.js
  var map = /* @__NO_SIDE_EFFECTS__ */ (initial = {}) => {
    let $map = atom(initial);
    $map.setKey = function(key, value) {
      let oldMap = $map.value;
      if (typeof value === "undefined" && key in $map.value) {
        $map.value = { ...$map.value };
        delete $map.value[key];
        $map.notify(oldMap, key);
      } else if ($map.value[key] !== value) {
        $map.value = {
          ...$map.value,
          [key]: value
        };
        $map.notify(oldMap, key);
      }
    };
    return $map;
  };

  // node_modules/@wallet-standard/errors/lib/esm/codes.js
  var WALLET_STANDARD_ERROR__REGISTRY__WALLET_NOT_FOUND = 3834e3;
  var WALLET_STANDARD_ERROR__REGISTRY__WALLET_ACCOUNT_NOT_FOUND = 3834001;
  var WALLET_STANDARD_ERROR__USER__REQUEST_REJECTED = 4001e3;
  var WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED = 616e4;
  var WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED = 6160001;
  var WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED = 6160002;

  // node_modules/@wallet-standard/errors/lib/esm/messages.js
  var WalletStandardErrorMessages = {
    [WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED]: "The wallet account $address does not support the chain `$chain`",
    [WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED]: "The wallet account $address does not support the `$featureName` feature",
    [WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED]: "The wallet '$walletName' does not support the `$featureName` feature",
    [WALLET_STANDARD_ERROR__REGISTRY__WALLET_ACCOUNT_NOT_FOUND]: "No account with address $address could be found in the '$walletName' wallet",
    [WALLET_STANDARD_ERROR__REGISTRY__WALLET_NOT_FOUND]: "No underlying Wallet Standard wallet could be found for this handle. This can happen if the wallet associated with the handle has been unregistered.",
    [WALLET_STANDARD_ERROR__USER__REQUEST_REJECTED]: "The user rejected the request"
  };

  // node_modules/@wallet-standard/errors/lib/esm/message-formatter.js
  var StateType;
  (function(StateType2) {
    StateType2[StateType2["EscapeSequence"] = 0] = "EscapeSequence";
    StateType2[StateType2["Text"] = 1] = "Text";
    StateType2[StateType2["Variable"] = 2] = "Variable";
  })(StateType || (StateType = {}));
  var START_INDEX = "i";
  var TYPE = "t";
  function getHumanReadableErrorMessage(code, context = {}) {
    const messageFormatString = WalletStandardErrorMessages[code];
    if (messageFormatString.length === 0) {
      return "";
    }
    let state;
    function commitStateUpTo(endIndex) {
      if (state[TYPE] === StateType.Variable) {
        const variableName = messageFormatString.slice(state[START_INDEX] + 1, endIndex);
        fragments.push(variableName in context ? `${context[variableName]}` : `$${variableName}`);
      } else if (state[TYPE] === StateType.Text) {
        fragments.push(messageFormatString.slice(state[START_INDEX], endIndex));
      }
    }
    const fragments = [];
    messageFormatString.split("").forEach((char, ii) => {
      if (ii === 0) {
        state = {
          [START_INDEX]: 0,
          [TYPE]: messageFormatString[0] === "\\" ? StateType.EscapeSequence : messageFormatString[0] === "$" ? StateType.Variable : StateType.Text
        };
        return;
      }
      let nextState;
      switch (state[TYPE]) {
        case StateType.EscapeSequence:
          nextState = { [START_INDEX]: ii, [TYPE]: StateType.Text };
          break;
        case StateType.Text:
          if (char === "\\") {
            nextState = { [START_INDEX]: ii, [TYPE]: StateType.EscapeSequence };
          } else if (char === "$") {
            nextState = { [START_INDEX]: ii, [TYPE]: StateType.Variable };
          }
          break;
        case StateType.Variable:
          if (char === "\\") {
            nextState = { [START_INDEX]: ii, [TYPE]: StateType.EscapeSequence };
          } else if (char === "$") {
            nextState = { [START_INDEX]: ii, [TYPE]: StateType.Variable };
          } else if (!char.match(/\w/)) {
            nextState = { [START_INDEX]: ii, [TYPE]: StateType.Text };
          }
          break;
      }
      if (nextState) {
        if (state !== nextState) {
          commitStateUpTo(ii);
        }
        state = nextState;
      }
    });
    commitStateUpTo();
    return fragments.join("");
  }
  function getErrorMessage(code, context = {}) {
    if (true) {
      return getHumanReadableErrorMessage(code, context);
    } else {
      let decodingAdviceMessage = `Wallet Standard error #${code}; Decode this error by running \`npx @wallet-standard/errors decode -- ${code}`;
      if (Object.keys(context).length) {
        decodingAdviceMessage += ` '${encodeContextObject(context)}'`;
      }
      return `${decodingAdviceMessage}\``;
    }
  }

  // node_modules/@wallet-standard/errors/lib/esm/error.js
  function isWalletStandardError(e9, code) {
    const isWalletStandardError2 = e9 instanceof Error && e9.name === "WalletStandardError";
    if (isWalletStandardError2) {
      if (code !== void 0) {
        return e9.context.__code === code;
      }
      return true;
    }
    return false;
  }
  var WalletStandardError = class extends Error {
    constructor(...[code, contextAndErrorOptions]) {
      let context;
      let errorOptions;
      if (contextAndErrorOptions) {
        const { cause, ...contextRest } = contextAndErrorOptions;
        if (cause) {
          errorOptions = { cause };
        }
        if (Object.keys(contextRest).length > 0) {
          context = contextRest;
        }
      }
      const message = getErrorMessage(code, context);
      super(message, errorOptions);
      this.context = {
        __code: code,
        ...context
      };
      this.name = "WalletStandardError";
    }
  };

  // node_modules/@wallet-standard/errors/lib/esm/stack-trace.js
  function safeCaptureStackTrace(...args) {
    if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(...args);
    }
  }

  // node_modules/@wallet-standard/ui-registry/lib/esm/UiWalletHandleRegistry_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.js
  var uiWalletHandlesToWallets = /* @__PURE__ */ new WeakMap();
  function registerWalletHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(uiWalletHandle, wallet) {
    uiWalletHandlesToWallets.set(uiWalletHandle, wallet);
  }
  function getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(uiWalletAccount) {
    const wallet = getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(uiWalletAccount);
    const account = wallet.accounts.find(({ address }) => address === uiWalletAccount.address);
    if (!account) {
      const err = new WalletStandardError(WALLET_STANDARD_ERROR__REGISTRY__WALLET_ACCOUNT_NOT_FOUND, {
        address: uiWalletAccount.address,
        walletName: wallet.name
      });
      safeCaptureStackTrace(err, getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
      throw err;
    }
    return account;
  }
  function getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(uiWalletHandle) {
    const wallet = uiWalletHandlesToWallets.get(uiWalletHandle);
    if (!wallet) {
      const err = new WalletStandardError(WALLET_STANDARD_ERROR__REGISTRY__WALLET_NOT_FOUND);
      safeCaptureStackTrace(err, getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
      throw err;
    }
    return wallet;
  }

  // node_modules/@wallet-standard/ui-registry/lib/esm/compare.js
  function identifierArraysAreDifferent(a3, b3) {
    const itemsSetA = new Set(a3);
    const itemsSetB = new Set(b3);
    if (itemsSetA.size !== itemsSetB.size) {
      return true;
    }
    for (const itemFromA of itemsSetA) {
      if (!itemsSetB.has(itemFromA)) {
        return true;
      }
    }
    return false;
  }

  // node_modules/@wallet-standard/ui-registry/lib/esm/UiWalletAccountRegistry_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.js
  var walletAccountsToUiWalletAccounts = /* @__PURE__ */ new WeakMap();
  function getOrCreateUiWalletAccountForStandardWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(wallet, account) {
    let existingUiWalletAccount = walletAccountsToUiWalletAccounts.get(account);
    if (existingUiWalletAccount) {
      try {
        if (getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(existingUiWalletAccount) !== wallet) {
          existingUiWalletAccount = void 0;
        }
      } catch {
        existingUiWalletAccount = void 0;
      }
    }
    const mustInitialize = !existingUiWalletAccount;
    let uiWalletAccount = existingUiWalletAccount ?? {};
    let isDirty = !existingUiWalletAccount;
    function dirtyUiWallet() {
      if (!isDirty) {
        uiWalletAccount = { ...uiWalletAccount };
        isDirty = true;
      }
    }
    if (mustInitialize || identifierArraysAreDifferent(uiWalletAccount.chains, account.chains)) {
      dirtyUiWallet();
      uiWalletAccount.chains = Object.freeze([...account.chains]);
    }
    if (mustInitialize || identifierArraysAreDifferent(uiWalletAccount.features, account.features)) {
      dirtyUiWallet();
      uiWalletAccount.features = Object.freeze([...account.features]);
    }
    if (mustInitialize || uiWalletAccount.address !== account.address || uiWalletAccount.icon !== account.icon || uiWalletAccount.label !== account.label || uiWalletAccount.publicKey !== account.publicKey) {
      dirtyUiWallet();
      uiWalletAccount.address = account.address;
      uiWalletAccount.icon = account.icon;
      uiWalletAccount.label = account.label;
      uiWalletAccount.publicKey = account.publicKey;
    }
    if (isDirty) {
      walletAccountsToUiWalletAccounts.set(account, uiWalletAccount);
      registerWalletHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(uiWalletAccount, wallet);
    }
    return Object.freeze(uiWalletAccount);
  }

  // node_modules/@wallet-standard/ui-registry/lib/esm/UiWalletRegistry_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.js
  var walletsToUiWallets = /* @__PURE__ */ new WeakMap();
  function getOrCreateUiWalletForStandardWallet_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(wallet) {
    const existingUiWallet = walletsToUiWallets.get(wallet);
    const mustInitialize = !existingUiWallet;
    let uiWallet = existingUiWallet ?? {};
    let isDirty = !existingUiWallet;
    function dirtyUiWallet() {
      if (!isDirty) {
        uiWallet = { ...uiWallet };
        isDirty = true;
      }
    }
    const nextUiWalletAccounts = {
      _cache: [],
      *[Symbol.iterator]() {
        if (this._cache.length) {
          yield* this._cache;
        }
        for (const walletAccount of wallet.accounts.slice(this._cache.length)) {
          const uiWalletAccount = getOrCreateUiWalletAccountForStandardWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(wallet, walletAccount);
          this._cache.push(uiWalletAccount);
          yield uiWalletAccount;
        }
      },
      some(predicateFn) {
        if (this._cache.some(predicateFn)) {
          return true;
        }
        for (const walletAccount of wallet.accounts.slice(this._cache.length)) {
          const uiWalletAccount = getOrCreateUiWalletAccountForStandardWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(wallet, walletAccount);
          this._cache.push(uiWalletAccount);
          if (predicateFn(uiWalletAccount)) {
            return true;
          }
        }
        return false;
      },
      get length() {
        return wallet.accounts.length;
      }
    };
    if (mustInitialize || uiWallet.accounts.length !== wallet.accounts.length || nextUiWalletAccounts.some((account) => !uiWallet.accounts.includes(account))) {
      dirtyUiWallet();
      uiWallet.accounts = Object.freeze(Array.from(nextUiWalletAccounts));
    }
    if (mustInitialize || identifierArraysAreDifferent(uiWallet.features, Object.keys(wallet.features))) {
      dirtyUiWallet();
      uiWallet.features = Object.freeze(Object.keys(wallet.features));
    }
    if (mustInitialize || identifierArraysAreDifferent(uiWallet.chains, wallet.chains)) {
      dirtyUiWallet();
      uiWallet.chains = Object.freeze([...wallet.chains]);
    }
    if (mustInitialize || uiWallet.icon !== wallet.icon || uiWallet.name !== wallet.name || uiWallet.version !== wallet.version) {
      dirtyUiWallet();
      uiWallet.icon = wallet.icon;
      uiWallet.name = wallet.name;
      uiWallet.version = wallet.version;
    }
    if (isDirty) {
      walletsToUiWallets.set(wallet, uiWallet);
      registerWalletHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(uiWallet, wallet);
    }
    return Object.freeze(uiWallet);
  }

  // node_modules/@wallet-standard/ui-compare/lib/esm/compare.js
  function uiWalletAccountsAreSame(a3, b3) {
    if (a3.address !== b3.address) {
      return false;
    }
    const underlyingWalletA = getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(a3);
    const underlyingWalletB = getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(b3);
    return underlyingWalletA === underlyingWalletB;
  }
  function uiWalletAccountBelongsToUiWallet(account, wallet) {
    const underlyingWalletForUiWallet = getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(wallet);
    const underlyingWalletForUiWalletAccount = getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(account);
    return underlyingWalletForUiWallet === underlyingWalletForUiWalletAccount;
  }

  // node_modules/@wallet-standard/ui-features/lib/esm/getWalletFeature.js
  function getWalletFeature(uiWalletHandle, featureName) {
    const wallet = getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(uiWalletHandle);
    if (!(featureName in wallet.features)) {
      const err = new WalletStandardError(WALLET_STANDARD_ERROR__FEATURES__WALLET_FEATURE_UNIMPLEMENTED, {
        featureName,
        supportedChains: [...wallet.chains],
        supportedFeatures: Object.keys(wallet.features),
        walletName: wallet.name
      });
      safeCaptureStackTrace(err, getWalletFeature);
      throw err;
    }
    return wallet.features[featureName];
  }

  // node_modules/@wallet-standard/ui-features/lib/esm/getWalletAccountFeature.js
  function getWalletAccountFeature(walletAccount, featureName) {
    if (!walletAccount.features.includes(featureName)) {
      const err = new WalletStandardError(WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_FEATURE_UNIMPLEMENTED, {
        address: walletAccount.address,
        featureName,
        supportedChains: [...walletAccount.chains],
        supportedFeatures: [...walletAccount.features]
      });
      safeCaptureStackTrace(err, getWalletAccountFeature);
      throw err;
    }
    return getWalletFeature(walletAccount, featureName);
  }

  // node_modules/@mysten/sui/dist/utils/suins.mjs
  var SUI_NS_NAME_REGEX = /^(?!.*(^(?!@)|[-.@])($|[-.@]))(?:[a-z0-9-]{0,63}(?:\.[a-z0-9-]{0,63})*)?@[a-z0-9-]{0,63}$/i;
  var SUI_NS_DOMAIN_REGEX = /^(?!.*(^|[-.])($|[-.]))(?:[a-z0-9-]{0,63}\.)+sui$/i;
  var MAX_SUI_NS_NAME_LENGTH = 235;
  function isValidSuiNSName(name) {
    if (name.length > MAX_SUI_NS_NAME_LENGTH) return false;
    if (name.includes("@")) return SUI_NS_NAME_REGEX.test(name);
    return SUI_NS_DOMAIN_REGEX.test(name);
  }
  function normalizeSuiNSName(name, format = "at") {
    const lowerCase = name.toLowerCase();
    let parts;
    if (lowerCase.includes("@")) {
      if (!SUI_NS_NAME_REGEX.test(lowerCase)) throw new Error(`Invalid SuiNS name ${name}`);
      const [labels, domain] = lowerCase.split("@");
      parts = [...labels ? labels.split(".") : [], domain];
    } else {
      if (!SUI_NS_DOMAIN_REGEX.test(lowerCase)) throw new Error(`Invalid SuiNS name ${name}`);
      parts = lowerCase.split(".").slice(0, -1);
    }
    if (format === "dot") return `${parts.join(".")}.sui`;
    return `${parts.slice(0, -1).join(".")}@${parts[parts.length - 1]}`;
  }

  // node_modules/@mysten/sui/dist/utils/move-registry.mjs
  var NAME_PATTERN = /^([a-z0-9]+(?:-[a-z0-9]+)*)$/;
  var VERSION_REGEX = /^\d+$/;
  var MAX_APP_SIZE = 64;
  var NAME_SEPARATOR = "/";
  var isValidNamedPackage = (name) => {
    const parts = name.split(NAME_SEPARATOR);
    if (parts.length < 2 || parts.length > 3) return false;
    const [org, app, version] = parts;
    if (version !== void 0 && !VERSION_REGEX.test(version)) return false;
    if (!isValidSuiNSName(org)) return false;
    return NAME_PATTERN.test(app) && app.length < MAX_APP_SIZE;
  };
  var isValidNamedType = (type) => {
    const splitType = type.split(/::|<|>|,/);
    for (const t5 of splitType) if (t5.includes(NAME_SEPARATOR) && !isValidNamedPackage(t5)) return false;
    return isValidStructTag(type);
  };

  // node_modules/@mysten/bcs/dist/uleb.mjs
  function ulebEncode(num) {
    let bigNum = BigInt(num);
    const arr = [];
    let len = 0;
    if (bigNum === 0n) return [0];
    while (bigNum > 0) {
      arr[len] = Number(bigNum & 127n);
      bigNum >>= 7n;
      if (bigNum > 0n) arr[len] |= 128;
      len += 1;
    }
    return arr;
  }
  function ulebDecode(arr) {
    let total = 0n;
    let shift3 = 0n;
    let len = 0;
    while (true) {
      if (len >= arr.length) throw new Error("ULEB decode error: buffer overflow");
      const byte = arr[len];
      len += 1;
      total += BigInt(byte & 127) << shift3;
      if ((byte & 128) === 0) break;
      shift3 += 7n;
    }
    if (total > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("ULEB decode error: value exceeds MAX_SAFE_INTEGER");
    return {
      value: Number(total),
      length: len
    };
  }

  // node_modules/@mysten/bcs/dist/reader.mjs
  var BcsReader = class {
    /**
    * @param {Uint8Array} data Data to use as a buffer.
    */
    constructor(data) {
      this.bytePosition = 0;
      this.dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
    }
    /**
    * Shift current cursor position by `bytes`.
    *
    * @param {Number} bytes Number of bytes to
    * @returns {this} Self for possible chaining.
    */
    shift(bytes) {
      this.bytePosition += bytes;
      return this;
    }
    /**
    * Read U8 value from the buffer and shift cursor by 1.
    * @returns
    */
    read8() {
      const value = this.dataView.getUint8(this.bytePosition);
      this.shift(1);
      return value;
    }
    /**
    * Read U16 value from the buffer and shift cursor by 2.
    * @returns
    */
    read16() {
      const value = this.dataView.getUint16(this.bytePosition, true);
      this.shift(2);
      return value;
    }
    /**
    * Read U32 value from the buffer and shift cursor by 4.
    * @returns
    */
    read32() {
      const value = this.dataView.getUint32(this.bytePosition, true);
      this.shift(4);
      return value;
    }
    /**
    * Read U64 value from the buffer and shift cursor by 8.
    * @returns
    */
    read64() {
      const value1 = this.read32();
      const result = this.read32().toString(16) + value1.toString(16).padStart(8, "0");
      return BigInt("0x" + result).toString(10);
    }
    /**
    * Read U128 value from the buffer and shift cursor by 16.
    */
    read128() {
      const value1 = BigInt(this.read64());
      const result = BigInt(this.read64()).toString(16) + value1.toString(16).padStart(16, "0");
      return BigInt("0x" + result).toString(10);
    }
    /**
    * Read U128 value from the buffer and shift cursor by 32.
    * @returns
    */
    read256() {
      const value1 = BigInt(this.read128());
      const result = BigInt(this.read128()).toString(16) + value1.toString(16).padStart(32, "0");
      return BigInt("0x" + result).toString(10);
    }
    /**
    * Read `num` number of bytes from the buffer and shift cursor by `num`.
    * @param num Number of bytes to read.
    */
    readBytes(num) {
      const start = this.bytePosition + this.dataView.byteOffset;
      const value = new Uint8Array(this.dataView.buffer, start, num);
      this.shift(num);
      return value;
    }
    /**
    * Read ULEB value - an integer of varying size. Used for enum indexes and
    * vector lengths.
    * @returns {Number} The ULEB value.
    */
    readULEB() {
      const start = this.bytePosition + this.dataView.byteOffset;
      const { value, length } = ulebDecode(new Uint8Array(this.dataView.buffer, start));
      this.shift(length);
      return value;
    }
    /**
    * Read a BCS vector: read a length and then apply function `cb` X times
    * where X is the length of the vector, defined as ULEB in BCS bytes.
    * @param cb Callback to process elements of vector.
    * @returns {Array<Any>} Array of the resulting values, returned by callback.
    */
    readVec(cb) {
      const length = this.readULEB();
      const result = [];
      for (let i7 = 0; i7 < length; i7++) result.push(cb(this, i7, length));
      return result;
    }
  };

  // node_modules/@scure/base/index.js
  function isBytes(a3) {
    return a3 instanceof Uint8Array || ArrayBuffer.isView(a3) && a3.constructor.name === "Uint8Array";
  }
  function isArrayOf(isString, arr) {
    if (!Array.isArray(arr))
      return false;
    if (arr.length === 0)
      return true;
    if (isString) {
      return arr.every((item) => typeof item === "string");
    } else {
      return arr.every((item) => Number.isSafeInteger(item));
    }
  }
  function afn(input) {
    if (typeof input !== "function")
      throw new Error("function expected");
    return true;
  }
  function astr(label, input) {
    if (typeof input !== "string")
      throw new Error(`${label}: string expected`);
    return true;
  }
  function anumber(n6) {
    if (!Number.isSafeInteger(n6))
      throw new Error(`invalid integer: ${n6}`);
  }
  function aArr(input) {
    if (!Array.isArray(input))
      throw new Error("array expected");
  }
  function astrArr(label, input) {
    if (!isArrayOf(true, input))
      throw new Error(`${label}: array of strings expected`);
  }
  function anumArr(label, input) {
    if (!isArrayOf(false, input))
      throw new Error(`${label}: array of numbers expected`);
  }
  // @__NO_SIDE_EFFECTS__
  function chain(...args) {
    const id = (a3) => a3;
    const wrap = (a3, b3) => (c4) => a3(b3(c4));
    const encode = args.map((x2) => x2.encode).reduceRight(wrap, id);
    const decode2 = args.map((x2) => x2.decode).reduce(wrap, id);
    return { encode, decode: decode2 };
  }
  // @__NO_SIDE_EFFECTS__
  function alphabet(letters) {
    const lettersA = typeof letters === "string" ? letters.split("") : letters;
    const len = lettersA.length;
    astrArr("alphabet", lettersA);
    const indexes = new Map(lettersA.map((l3, i7) => [l3, i7]));
    return {
      encode: (digits) => {
        aArr(digits);
        return digits.map((i7) => {
          if (!Number.isSafeInteger(i7) || i7 < 0 || i7 >= len)
            throw new Error(`alphabet.encode: digit index outside alphabet "${i7}". Allowed: ${letters}`);
          return lettersA[i7];
        });
      },
      decode: (input) => {
        aArr(input);
        return input.map((letter) => {
          astr("alphabet.decode", letter);
          const i7 = indexes.get(letter);
          if (i7 === void 0)
            throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
          return i7;
        });
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function join(separator = "") {
    astr("join", separator);
    return {
      encode: (from) => {
        astrArr("join.decode", from);
        return from.join(separator);
      },
      decode: (to) => {
        astr("join.decode", to);
        return to.split(separator);
      }
    };
  }
  function convertRadix(data, from, to) {
    if (from < 2)
      throw new Error(`convertRadix: invalid from=${from}, base cannot be less than 2`);
    if (to < 2)
      throw new Error(`convertRadix: invalid to=${to}, base cannot be less than 2`);
    aArr(data);
    if (!data.length)
      return [];
    let pos = 0;
    const res = [];
    const digits = Array.from(data, (d3) => {
      anumber(d3);
      if (d3 < 0 || d3 >= from)
        throw new Error(`invalid integer: ${d3}`);
      return d3;
    });
    const dlen = digits.length;
    while (true) {
      let carry = 0;
      let done = true;
      for (let i7 = pos; i7 < dlen; i7++) {
        const digit = digits[i7];
        const fromCarry = from * carry;
        const digitBase = fromCarry + digit;
        if (!Number.isSafeInteger(digitBase) || fromCarry / from !== carry || digitBase - digit !== fromCarry) {
          throw new Error("convertRadix: carry overflow");
        }
        const div = digitBase / to;
        carry = digitBase % to;
        const rounded = Math.floor(div);
        digits[i7] = rounded;
        if (!Number.isSafeInteger(rounded) || rounded * to + carry !== digitBase)
          throw new Error("convertRadix: carry overflow");
        if (!done)
          continue;
        else if (!rounded)
          pos = i7;
        else
          done = false;
      }
      res.push(carry);
      if (done)
        break;
    }
    for (let i7 = 0; i7 < data.length - 1 && data[i7] === 0; i7++)
      res.push(0);
    return res.reverse();
  }
  var gcd = (a3, b3) => b3 === 0 ? a3 : gcd(b3, a3 % b3);
  var radix2carry = /* @__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
  var powers = /* @__PURE__ */ (() => {
    let res = [];
    for (let i7 = 0; i7 < 40; i7++)
      res.push(2 ** i7);
    return res;
  })();
  function convertRadix2(data, from, to, padding) {
    aArr(data);
    if (from <= 0 || from > 32)
      throw new Error(`convertRadix2: wrong from=${from}`);
    if (to <= 0 || to > 32)
      throw new Error(`convertRadix2: wrong to=${to}`);
    if (/* @__PURE__ */ radix2carry(from, to) > 32) {
      throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${/* @__PURE__ */ radix2carry(from, to)}`);
    }
    let carry = 0;
    let pos = 0;
    const max2 = powers[from];
    const mask = powers[to] - 1;
    const res = [];
    for (const n6 of data) {
      anumber(n6);
      if (n6 >= max2)
        throw new Error(`convertRadix2: invalid data word=${n6} from=${from}`);
      carry = carry << from | n6;
      if (pos + from > 32)
        throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
      pos += from;
      for (; pos >= to; pos -= to)
        res.push((carry >> pos - to & mask) >>> 0);
      const pow = powers[pos];
      if (pow === void 0)
        throw new Error("invalid carry");
      carry &= pow - 1;
    }
    carry = carry << to - pos & mask;
    if (!padding && pos >= from)
      throw new Error("Excess padding");
    if (!padding && carry > 0)
      throw new Error(`Non-zero padding: ${carry}`);
    if (padding && pos > 0)
      res.push(carry >>> 0);
    return res;
  }
  // @__NO_SIDE_EFFECTS__
  function radix(num) {
    anumber(num);
    const _256 = 2 ** 8;
    return {
      encode: (bytes) => {
        if (!isBytes(bytes))
          throw new Error("radix.encode input should be Uint8Array");
        return convertRadix(Array.from(bytes), _256, num);
      },
      decode: (digits) => {
        anumArr("radix.decode", digits);
        return Uint8Array.from(convertRadix(digits, num, _256));
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function radix2(bits, revPadding = false) {
    anumber(bits);
    if (bits <= 0 || bits > 32)
      throw new Error("radix2: bits should be in (0..32]");
    if (/* @__PURE__ */ radix2carry(8, bits) > 32 || /* @__PURE__ */ radix2carry(bits, 8) > 32)
      throw new Error("radix2: carry overflow");
    return {
      encode: (bytes) => {
        if (!isBytes(bytes))
          throw new Error("radix2.encode input should be Uint8Array");
        return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
      },
      decode: (digits) => {
        anumArr("radix2.decode", digits);
        return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
      }
    };
  }
  function unsafeWrapper(fn) {
    afn(fn);
    return function(...args) {
      try {
        return fn.apply(null, args);
      } catch (e9) {
      }
    };
  }
  var genBase58 = /* @__NO_SIDE_EFFECTS__ */ (abc) => /* @__PURE__ */ chain(/* @__PURE__ */ radix(58), /* @__PURE__ */ alphabet(abc), /* @__PURE__ */ join(""));
  var base58 = /* @__PURE__ */ genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
  var BECH_ALPHABET = /* @__PURE__ */ chain(/* @__PURE__ */ alphabet("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), /* @__PURE__ */ join(""));
  var POLYMOD_GENERATORS = [996825010, 642813549, 513874426, 1027748829, 705979059];
  function bech32Polymod(pre) {
    const b3 = pre >> 25;
    let chk = (pre & 33554431) << 5;
    for (let i7 = 0; i7 < POLYMOD_GENERATORS.length; i7++) {
      if ((b3 >> i7 & 1) === 1)
        chk ^= POLYMOD_GENERATORS[i7];
    }
    return chk;
  }
  function bechChecksum(prefix, words, encodingConst = 1) {
    const len = prefix.length;
    let chk = 1;
    for (let i7 = 0; i7 < len; i7++) {
      const c4 = prefix.charCodeAt(i7);
      if (c4 < 33 || c4 > 126)
        throw new Error(`Invalid prefix (${prefix})`);
      chk = bech32Polymod(chk) ^ c4 >> 5;
    }
    chk = bech32Polymod(chk);
    for (let i7 = 0; i7 < len; i7++)
      chk = bech32Polymod(chk) ^ prefix.charCodeAt(i7) & 31;
    for (let v2 of words)
      chk = bech32Polymod(chk) ^ v2;
    for (let i7 = 0; i7 < 6; i7++)
      chk = bech32Polymod(chk);
    chk ^= encodingConst;
    return BECH_ALPHABET.encode(convertRadix2([chk % powers[30]], 30, 5, false));
  }
  // @__NO_SIDE_EFFECTS__
  function genBech32(encoding) {
    const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
    const _words = /* @__PURE__ */ radix2(5);
    const fromWords = _words.decode;
    const toWords = _words.encode;
    const fromWordsUnsafe = unsafeWrapper(fromWords);
    function encode(prefix, words, limit = 90) {
      astr("bech32.encode prefix", prefix);
      if (isBytes(words))
        words = Array.from(words);
      anumArr("bech32.encode", words);
      const plen = prefix.length;
      if (plen === 0)
        throw new TypeError(`Invalid prefix length ${plen}`);
      const actualLength = plen + 7 + words.length;
      if (limit !== false && actualLength > limit)
        throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
      const lowered = prefix.toLowerCase();
      const sum = bechChecksum(lowered, words, ENCODING_CONST);
      return `${lowered}1${BECH_ALPHABET.encode(words)}${sum}`;
    }
    function decode2(str, limit = 90) {
      astr("bech32.decode input", str);
      const slen = str.length;
      if (slen < 8 || limit !== false && slen > limit)
        throw new TypeError(`invalid string length: ${slen} (${str}). Expected (8..${limit})`);
      const lowered = str.toLowerCase();
      if (str !== lowered && str !== str.toUpperCase())
        throw new Error(`String must be lowercase or uppercase`);
      const sepIndex = lowered.lastIndexOf("1");
      if (sepIndex === 0 || sepIndex === -1)
        throw new Error(`Letter "1" must be present between prefix and data only`);
      const prefix = lowered.slice(0, sepIndex);
      const data = lowered.slice(sepIndex + 1);
      if (data.length < 6)
        throw new Error("Data must be at least 6 characters long");
      const words = BECH_ALPHABET.decode(data).slice(0, -6);
      const sum = bechChecksum(prefix, words, ENCODING_CONST);
      if (!data.endsWith(sum))
        throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
      return { prefix, words };
    }
    const decodeUnsafe = unsafeWrapper(decode2);
    function decodeToBytes(str) {
      const { prefix, words } = decode2(str, false);
      return { prefix, words, bytes: fromWords(words) };
    }
    function encodeFromBytes(prefix, bytes) {
      return encode(prefix, toWords(bytes));
    }
    return {
      encode,
      decode: decode2,
      encodeFromBytes,
      decodeToBytes,
      decodeUnsafe,
      fromWords,
      fromWordsUnsafe,
      toWords
    };
  }
  var bech32 = /* @__PURE__ */ genBech32("bech32");

  // node_modules/@mysten/utils/dist/b58.mjs
  var toBase58 = (buffer) => base58.encode(buffer);
  var fromBase58 = (str) => base58.decode(str);

  // node_modules/@mysten/utils/dist/b64.mjs
  function fromBase64(base64String2) {
    return Uint8Array.from(atob(base64String2), (char) => char.charCodeAt(0));
  }
  var CHUNK_SIZE = 8192;
  function toBase64(bytes) {
    if (bytes.length < CHUNK_SIZE) return btoa(String.fromCharCode(...bytes));
    let output = "";
    for (var i7 = 0; i7 < bytes.length; i7 += CHUNK_SIZE) {
      const chunk2 = bytes.slice(i7, i7 + CHUNK_SIZE);
      output += String.fromCharCode(...chunk2);
    }
    return btoa(output);
  }

  // node_modules/@mysten/utils/dist/hex.mjs
  function fromHex(hexStr) {
    const normalized = hexStr.startsWith("0x") ? hexStr.slice(2) : hexStr;
    const padded = normalized.length % 2 === 0 ? normalized : `0${normalized}`;
    const intArr = padded.match(/[0-9a-fA-F]{2}/g)?.map((byte) => parseInt(byte, 16)) ?? [];
    if (intArr.length !== padded.length / 2) throw new Error(`Invalid hex string ${hexStr}`);
    return Uint8Array.from(intArr);
  }
  function toHex(bytes) {
    return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
  }

  // node_modules/@mysten/utils/dist/chunk.mjs
  function chunk(array2, size2) {
    return Array.from({ length: Math.ceil(array2.length / size2) }, (_2, i7) => {
      return array2.slice(i7 * size2, (i7 + 1) * size2);
    });
  }

  // node_modules/@mysten/utils/dist/with-resolver.mjs
  function promiseWithResolvers() {
    let resolver;
    let rejecter;
    return {
      promise: new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      }),
      resolve: resolver,
      reject: rejecter
    };
  }

  // node_modules/@mysten/utils/dist/dataloader.mjs
  var DataLoader = class {
    constructor(batchLoadFn, options) {
      if (typeof batchLoadFn !== "function") throw new TypeError(`DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but got: ${batchLoadFn}.`);
      this._batchLoadFn = batchLoadFn;
      this._maxBatchSize = getValidMaxBatchSize(options);
      this._batchScheduleFn = getValidBatchScheduleFn(options);
      this._cacheKeyFn = getValidCacheKeyFn(options);
      this._cacheMap = getValidCacheMap(options);
      this._batch = null;
      this.name = getValidName(options);
    }
    /**
    * Loads a key, returning a `Promise` for the value represented by that key.
    */
    load(key) {
      if (key === null || key === void 0) throw new TypeError(`The loader.load() function must be called with a value, but got: ${String(key)}.`);
      const batch = getCurrentBatch(this);
      const cacheMap = this._cacheMap;
      let cacheKey;
      if (cacheMap) {
        cacheKey = this._cacheKeyFn(key);
        const cachedPromise = cacheMap.get(cacheKey);
        if (cachedPromise) {
          const cacheHits = batch.cacheHits || (batch.cacheHits = []);
          return new Promise((resolve) => {
            cacheHits.push(() => {
              resolve(cachedPromise);
            });
          });
        }
      }
      batch.keys.push(key);
      const promise = new Promise((resolve, reject) => {
        batch.callbacks.push({
          resolve,
          reject
        });
      });
      if (cacheMap) cacheMap.set(cacheKey, promise);
      return promise;
    }
    /**
    * Loads multiple keys, promising an array of values:
    *
    *     var [ a, b ] = await myLoader.loadMany([ 'a', 'b' ]);
    *
    * This is similar to the more verbose:
    *
    *     var [ a, b ] = await Promise.all([
    *       myLoader.load('a'),
    *       myLoader.load('b')
    *     ]);
    *
    * However it is different in the case where any load fails. Where
    * Promise.all() would reject, loadMany() always resolves, however each result
    * is either a value or an Error instance.
    *
    *     var [ a, b, c ] = await myLoader.loadMany([ 'a', 'b', 'badkey' ]);
    *     // c instanceof Error
    *
    */
    loadMany(keys) {
      if (!isArrayLike(keys)) throw new TypeError(`The loader.loadMany() function must be called with Array<key>, but got: ${keys}.`);
      const loadPromises = [];
      for (let i7 = 0; i7 < keys.length; i7++) loadPromises.push(this.load(keys[i7]).catch((error) => error));
      return Promise.all(loadPromises);
    }
    /**
    * Clears the value at `key` from the cache, if it exists. Returns itself for
    * method chaining.
    */
    clear(key) {
      const cacheMap = this._cacheMap;
      if (cacheMap) {
        const cacheKey = this._cacheKeyFn(key);
        cacheMap.delete(cacheKey);
      }
      return this;
    }
    /**
    * Clears the entire cache. To be used when some event results in unknown
    * invalidations across this particular `DataLoader`. Returns itself for
    * method chaining.
    */
    clearAll() {
      const cacheMap = this._cacheMap;
      if (cacheMap) cacheMap.clear();
      return this;
    }
    /**
    * Adds the provided key and value to the cache. If the key already
    * exists, no change is made. Returns itself for method chaining.
    *
    * To prime the cache with an error at a key, provide an Error instance.
    */
    prime(key, value) {
      const cacheMap = this._cacheMap;
      if (cacheMap) {
        const cacheKey = this._cacheKeyFn(key);
        if (cacheMap.get(cacheKey) === void 0) {
          let promise;
          if (value instanceof Error) {
            promise = Promise.reject(value);
            promise.catch(() => {
            });
          } else promise = Promise.resolve(value);
          cacheMap.set(cacheKey, promise);
        }
      }
      return this;
    }
  };
  var enqueuePostPromiseJob = typeof process === "object" && typeof process.nextTick === "function" ? function(fn) {
    if (!resolvedPromise) resolvedPromise = Promise.resolve();
    resolvedPromise.then(() => {
      process.nextTick(fn);
    });
  } : typeof setImmediate === "function" ? function(fn) {
    setImmediate(fn);
  } : function(fn) {
    setTimeout(fn);
  };
  var resolvedPromise;
  function getCurrentBatch(loader) {
    const existingBatch = loader._batch;
    if (existingBatch !== null && !existingBatch.hasDispatched && existingBatch.keys.length < loader._maxBatchSize) return existingBatch;
    const newBatch = {
      hasDispatched: false,
      keys: [],
      callbacks: []
    };
    loader._batch = newBatch;
    loader._batchScheduleFn(() => {
      dispatchBatch(loader, newBatch);
    });
    return newBatch;
  }
  function dispatchBatch(loader, batch) {
    batch.hasDispatched = true;
    if (batch.keys.length === 0) {
      resolveCacheHits(batch);
      return;
    }
    let batchPromise;
    try {
      batchPromise = loader._batchLoadFn(batch.keys);
    } catch (e9) {
      return failedDispatch(loader, batch, /* @__PURE__ */ new TypeError(`DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but the function errored synchronously: ${String(e9)}.`));
    }
    if (!batchPromise || typeof batchPromise.then !== "function") return failedDispatch(loader, batch, /* @__PURE__ */ new TypeError(`DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but the function did not return a Promise: ${String(batchPromise)}.`));
    Promise.resolve(batchPromise).then((values) => {
      if (!isArrayLike(values)) throw new TypeError(`DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but the function did not return a Promise of an Array: ${String(values)}.`);
      if (values.length !== batch.keys.length) throw new TypeError(`DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>, but the function did not return a Promise of an Array of the same length as the Array of keys.

Keys:
${String(batch.keys)}

Values:
${String(values)}`);
      resolveCacheHits(batch);
      for (let i7 = 0; i7 < batch.callbacks.length; i7++) {
        const value = values[i7];
        if (value instanceof Error) batch.callbacks[i7].reject(value);
        else batch.callbacks[i7].resolve(value);
      }
    }).catch((error) => {
      failedDispatch(loader, batch, error);
    });
  }
  function failedDispatch(loader, batch, error) {
    resolveCacheHits(batch);
    for (let i7 = 0; i7 < batch.keys.length; i7++) {
      loader.clear(batch.keys[i7]);
      batch.callbacks[i7].reject(error);
    }
  }
  function resolveCacheHits(batch) {
    if (batch.cacheHits) for (let i7 = 0; i7 < batch.cacheHits.length; i7++) batch.cacheHits[i7]();
  }
  function getValidMaxBatchSize(options) {
    if (!(!options || options.batch !== false)) return 1;
    const maxBatchSize = options && options.maxBatchSize;
    if (maxBatchSize === void 0) return Infinity;
    if (typeof maxBatchSize !== "number" || maxBatchSize < 1) throw new TypeError(`maxBatchSize must be a positive number: ${maxBatchSize}`);
    return maxBatchSize;
  }
  function getValidBatchScheduleFn(options) {
    const batchScheduleFn = options && options.batchScheduleFn;
    if (batchScheduleFn === void 0) return enqueuePostPromiseJob;
    if (typeof batchScheduleFn !== "function") throw new TypeError(`batchScheduleFn must be a function: ${batchScheduleFn}`);
    return batchScheduleFn;
  }
  function getValidCacheKeyFn(options) {
    const cacheKeyFn = options && options.cacheKeyFn;
    if (cacheKeyFn === void 0) return (key) => key;
    if (typeof cacheKeyFn !== "function") throw new TypeError(`cacheKeyFn must be a function: ${cacheKeyFn}`);
    return cacheKeyFn;
  }
  function getValidCacheMap(options) {
    if (!(!options || options.cache !== false)) return null;
    const cacheMap = options && options.cacheMap;
    if (cacheMap === void 0) return /* @__PURE__ */ new Map();
    if (cacheMap !== null) {
      const missingFunctions = [
        "get",
        "set",
        "delete",
        "clear"
      ].filter((fnName) => cacheMap && typeof cacheMap[fnName] !== "function");
      if (missingFunctions.length !== 0) throw new TypeError("Custom cacheMap missing methods: " + missingFunctions.join(", "));
    }
    return cacheMap;
  }
  function getValidName(options) {
    if (options && options.name) return options.name;
    return null;
  }
  function isArrayLike(x2) {
    return typeof x2 === "object" && x2 !== null && "length" in x2 && typeof x2.length === "number" && (x2.length === 0 || x2.length > 0 && Object.prototype.hasOwnProperty.call(x2, x2.length - 1));
  }

  // node_modules/@mysten/utils/dist/mitt.mjs
  function mitt(all) {
    all = all || /* @__PURE__ */ new Map();
    return {
      all,
      on(type, handler) {
        const handlers = all.get(type);
        if (handlers) handlers.push(handler);
        else all.set(type, [handler]);
      },
      off(type, handler) {
        const handlers = all.get(type);
        if (handlers) if (handler) handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        else all.set(type, []);
      },
      emit(type, evt) {
        let handlers = all.get(type);
        if (handlers) handlers.slice().map((handler) => {
          handler(evt);
        });
        handlers = all.get("*");
        if (handlers) handlers.slice().map((handler) => {
          handler(type, evt);
        });
      }
    };
  }

  // node_modules/@mysten/bcs/dist/utils.mjs
  function encodeStr(data, encoding) {
    switch (encoding) {
      case "base58":
        return toBase58(data);
      case "base64":
        return toBase64(data);
      case "hex":
        return toHex(data);
      default:
        throw new Error("Unsupported encoding, supported values are: base64, hex");
    }
  }
  function splitGenericParameters(str, genericSeparators = ["<", ">"]) {
    const [left, right] = genericSeparators;
    const tok = [];
    let word = "";
    let nestedAngleBrackets = 0;
    for (let i7 = 0; i7 < str.length; i7++) {
      const char = str[i7];
      if (char === left) nestedAngleBrackets++;
      if (char === right) nestedAngleBrackets--;
      if (nestedAngleBrackets === 0 && char === ",") {
        tok.push(word.trim());
        word = "";
        continue;
      }
      word += char;
    }
    tok.push(word.trim());
    return tok;
  }

  // node_modules/@mysten/bcs/dist/writer.mjs
  var BcsWriter = class {
    constructor({ initialSize = 1024, maxSize = Infinity, allocateSize = 1024 } = {}) {
      this.bytePosition = 0;
      this.size = initialSize;
      this.maxSize = maxSize;
      this.allocateSize = allocateSize;
      this.dataView = new DataView(new ArrayBuffer(initialSize));
    }
    ensureSizeOrGrow(bytes) {
      const requiredSize = this.bytePosition + bytes;
      if (requiredSize > this.size) {
        const nextSize = Math.min(this.maxSize, Math.max(this.size + requiredSize, this.size + this.allocateSize));
        if (requiredSize > nextSize) throw new Error(`Attempting to serialize to BCS, but buffer does not have enough size. Allocated size: ${this.size}, Max size: ${this.maxSize}, Required size: ${requiredSize}`);
        this.size = nextSize;
        const nextBuffer = new ArrayBuffer(this.size);
        new Uint8Array(nextBuffer).set(new Uint8Array(this.dataView.buffer));
        this.dataView = new DataView(nextBuffer);
      }
    }
    /**
    * Shift current cursor position by `bytes`.
    *
    * @param {Number} bytes Number of bytes to
    * @returns {this} Self for possible chaining.
    */
    shift(bytes) {
      this.bytePosition += bytes;
      return this;
    }
    /**
    * Write a U8 value into a buffer and shift cursor position by 1.
    * @param {Number} value Value to write.
    * @returns {this}
    */
    write8(value) {
      this.ensureSizeOrGrow(1);
      this.dataView.setUint8(this.bytePosition, Number(value));
      return this.shift(1);
    }
    /**
    * Write a U8 value into a buffer and shift cursor position by 1.
    * @param {Number} value Value to write.
    * @returns {this}
    */
    writeBytes(bytes) {
      this.ensureSizeOrGrow(bytes.length);
      for (let i7 = 0; i7 < bytes.length; i7++) this.dataView.setUint8(this.bytePosition + i7, bytes[i7]);
      return this.shift(bytes.length);
    }
    /**
    * Write a U16 value into a buffer and shift cursor position by 2.
    * @param {Number} value Value to write.
    * @returns {this}
    */
    write16(value) {
      this.ensureSizeOrGrow(2);
      this.dataView.setUint16(this.bytePosition, Number(value), true);
      return this.shift(2);
    }
    /**
    * Write a U32 value into a buffer and shift cursor position by 4.
    * @param {Number} value Value to write.
    * @returns {this}
    */
    write32(value) {
      this.ensureSizeOrGrow(4);
      this.dataView.setUint32(this.bytePosition, Number(value), true);
      return this.shift(4);
    }
    /**
    * Write a U64 value into a buffer and shift cursor position by 8.
    * @param {bigint} value Value to write.
    * @returns {this}
    */
    write64(value) {
      toLittleEndian(BigInt(value), 8).forEach((el) => this.write8(el));
      return this;
    }
    /**
    * Write a U128 value into a buffer and shift cursor position by 16.
    *
    * @param {bigint} value Value to write.
    * @returns {this}
    */
    write128(value) {
      toLittleEndian(BigInt(value), 16).forEach((el) => this.write8(el));
      return this;
    }
    /**
    * Write a U256 value into a buffer and shift cursor position by 16.
    *
    * @param {bigint} value Value to write.
    * @returns {this}
    */
    write256(value) {
      toLittleEndian(BigInt(value), 32).forEach((el) => this.write8(el));
      return this;
    }
    /**
    * Write a ULEB value into a buffer and shift cursor position by number of bytes
    * written.
    * @param {Number} value Value to write.
    * @returns {this}
    */
    writeULEB(value) {
      ulebEncode(value).forEach((el) => this.write8(el));
      return this;
    }
    /**
    * Write a vector into a buffer by first writing the vector length and then calling
    * a callback on each passed value.
    *
    * @param {Array<Any>} vector Array of elements to write.
    * @param {WriteVecCb} cb Callback to call on each element of the vector.
    * @returns {this}
    */
    writeVec(vector2, cb) {
      this.writeULEB(vector2.length);
      Array.from(vector2).forEach((el, i7) => cb(this, el, i7, vector2.length));
      return this;
    }
    /**
    * Adds support for iterations over the object.
    * @returns {Uint8Array}
    */
    *[Symbol.iterator]() {
      for (let i7 = 0; i7 < this.bytePosition; i7++) yield this.dataView.getUint8(i7);
      return this.toBytes();
    }
    /**
    * Get underlying buffer taking only value bytes (in case initial buffer size was bigger).
    * @returns {Uint8Array} Resulting bcs.
    */
    toBytes() {
      return new Uint8Array(this.dataView.buffer.slice(0, this.bytePosition));
    }
    /**
    * Represent data as 'hex' or 'base64'
    * @param encoding Encoding to use: 'base64' or 'hex'
    */
    toString(encoding) {
      return encodeStr(this.toBytes(), encoding);
    }
  };
  function toLittleEndian(bigint2, size2) {
    const result = new Uint8Array(size2);
    let i7 = 0;
    while (bigint2 > 0) {
      result[i7] = Number(bigint2 % BigInt(256));
      bigint2 = bigint2 / BigInt(256);
      i7 += 1;
    }
    return result;
  }

  // node_modules/@mysten/bcs/dist/bcs-type.mjs
  var _write, _serialize, _a;
  var BcsType = (_a = class {
    constructor(options) {
      __privateAdd(this, _write);
      __privateAdd(this, _serialize);
      this.name = options.name;
      this.read = options.read;
      this.serializedSize = options.serializedSize ?? (() => null);
      __privateSet(this, _write, options.write);
      __privateSet(this, _serialize, options.serialize ?? ((value, options$1) => {
        const writer = new BcsWriter({
          initialSize: this.serializedSize(value) ?? void 0,
          ...options$1
        });
        __privateGet(this, _write).call(this, value, writer);
        return writer.toBytes();
      }));
      this.validate = options.validate ?? (() => {
      });
    }
    write(value, writer) {
      this.validate(value);
      __privateGet(this, _write).call(this, value, writer);
    }
    serialize(value, options) {
      this.validate(value);
      return new SerializedBcs(this, __privateGet(this, _serialize).call(this, value, options));
    }
    parse(bytes) {
      const reader = new BcsReader(bytes);
      return this.read(reader);
    }
    fromHex(hex) {
      return this.parse(fromHex(hex));
    }
    fromBase58(b64) {
      return this.parse(fromBase58(b64));
    }
    fromBase64(b64) {
      return this.parse(fromBase64(b64));
    }
    transform({ name, input, output, validate: validate2 }) {
      return new _a({
        name: name ?? this.name,
        read: (reader) => output ? output(this.read(reader)) : this.read(reader),
        write: (value, writer) => __privateGet(this, _write).call(this, input ? input(value) : value, writer),
        serializedSize: (value) => this.serializedSize(input ? input(value) : value),
        serialize: (value, options) => __privateGet(this, _serialize).call(this, input ? input(value) : value, options),
        validate: (value) => {
          validate2?.(value);
          this.validate(input ? input(value) : value);
        }
      });
    }
  }, _write = new WeakMap(), _serialize = new WeakMap(), _a);
  var SERIALIZED_BCS_BRAND = Symbol.for("@mysten/serialized-bcs");
  function isSerializedBcs(obj) {
    return !!obj && typeof obj === "object" && obj[SERIALIZED_BCS_BRAND] === true;
  }
  var _schema, _bytes, _a2;
  var SerializedBcs = (_a2 = class {
    constructor(schema, bytes) {
      __privateAdd(this, _schema);
      __privateAdd(this, _bytes);
      __privateSet(this, _schema, schema);
      __privateSet(this, _bytes, bytes);
    }
    get [SERIALIZED_BCS_BRAND]() {
      return true;
    }
    toBytes() {
      return __privateGet(this, _bytes);
    }
    toHex() {
      return toHex(__privateGet(this, _bytes));
    }
    toBase64() {
      return toBase64(__privateGet(this, _bytes));
    }
    toBase58() {
      return toBase58(__privateGet(this, _bytes));
    }
    parse() {
      return __privateGet(this, _schema).parse(__privateGet(this, _bytes));
    }
  }, _schema = new WeakMap(), _bytes = new WeakMap(), _a2);
  function fixedSizeBcsType({ size: size2, ...options }) {
    return new BcsType({
      ...options,
      serializedSize: () => size2
    });
  }
  function uIntBcsType({ readMethod, writeMethod, ...options }) {
    return fixedSizeBcsType({
      ...options,
      read: (reader) => reader[readMethod](),
      write: (value, writer) => writer[writeMethod](value),
      validate: (value) => {
        if (value < 0 || value > options.maxValue) throw new TypeError(`Invalid ${options.name} value: ${value}. Expected value in range 0-${options.maxValue}`);
        options.validate?.(value);
      }
    });
  }
  function bigUIntBcsType({ readMethod, writeMethod, ...options }) {
    return fixedSizeBcsType({
      ...options,
      read: (reader) => reader[readMethod](),
      write: (value, writer) => writer[writeMethod](BigInt(value)),
      validate: (val) => {
        const value = BigInt(val);
        if (value < 0 || value > options.maxValue) throw new TypeError(`Invalid ${options.name} value: ${value}. Expected value in range 0-${options.maxValue}`);
        options.validate?.(value);
      }
    });
  }
  function dynamicSizeBcsType({ serialize, ...options }) {
    const type = new BcsType({
      ...options,
      serialize,
      write: (value, writer) => {
        for (const byte of type.serialize(value).toBytes()) writer.write8(byte);
      }
    });
    return type;
  }
  function stringLikeBcsType({ toBytes, fromBytes, ...options }) {
    return new BcsType({
      ...options,
      read: (reader) => {
        const length = reader.readULEB();
        return fromBytes(reader.readBytes(length));
      },
      write: (hex, writer) => {
        const bytes = toBytes(hex);
        writer.writeULEB(bytes.length);
        for (let i7 = 0; i7 < bytes.length; i7++) writer.write8(bytes[i7]);
      },
      serialize: (value) => {
        const bytes = toBytes(value);
        const size2 = ulebEncode(bytes.length);
        const result = new Uint8Array(size2.length + bytes.length);
        result.set(size2, 0);
        result.set(bytes, size2.length);
        return result;
      },
      validate: (value) => {
        if (typeof value !== "string") throw new TypeError(`Invalid ${options.name} value: ${value}. Expected string`);
        options.validate?.(value);
      }
    });
  }
  function lazyBcsType(cb) {
    let lazyType = null;
    function getType() {
      if (!lazyType) lazyType = cb();
      return lazyType;
    }
    return new BcsType({
      name: "lazy",
      read: (data) => getType().read(data),
      serializedSize: (value) => getType().serializedSize(value),
      write: (value, writer) => getType().write(value, writer),
      serialize: (value, options) => getType().serialize(value, options).toBytes()
    });
  }
  var BcsStruct = class extends BcsType {
    constructor({ name, fields, ...options }) {
      const canonicalOrder = Object.entries(fields);
      super({
        name,
        serializedSize: (values) => {
          let total = 0;
          for (const [field, type] of canonicalOrder) {
            const size2 = type.serializedSize(values[field]);
            if (size2 == null) return null;
            total += size2;
          }
          return total;
        },
        read: (reader) => {
          const result = {};
          for (const [field, type] of canonicalOrder) result[field] = type.read(reader);
          return result;
        },
        write: (value, writer) => {
          for (const [field, type] of canonicalOrder) type.write(value[field], writer);
        },
        ...options,
        validate: (value) => {
          options?.validate?.(value);
          if (typeof value !== "object" || value == null) throw new TypeError(`Expected object, found ${typeof value}`);
        }
      });
    }
  };
  var BcsEnum = class extends BcsType {
    constructor({ fields, ...options }) {
      const canonicalOrder = Object.entries(fields);
      super({
        read: (reader) => {
          const index = reader.readULEB();
          const enumEntry = canonicalOrder[index];
          if (!enumEntry) throw new TypeError(`Unknown value ${index} for enum ${options.name}`);
          const [kind, type] = enumEntry;
          return {
            [kind]: type?.read(reader) ?? true,
            $kind: kind
          };
        },
        write: (value, writer) => {
          const [name, val] = Object.entries(value).filter(([name$1]) => Object.hasOwn(fields, name$1))[0];
          for (let i7 = 0; i7 < canonicalOrder.length; i7++) {
            const [optionName, optionType] = canonicalOrder[i7];
            if (optionName === name) {
              writer.writeULEB(i7);
              optionType?.write(val, writer);
              return;
            }
          }
        },
        ...options,
        validate: (value) => {
          options?.validate?.(value);
          if (typeof value !== "object" || value == null) throw new TypeError(`Expected object, found ${typeof value}`);
          const keys = Object.keys(value).filter((k2) => value[k2] !== void 0 && Object.hasOwn(fields, k2));
          if (keys.length !== 1) throw new TypeError(`Expected object with one key, but found ${keys.length} for type ${options.name}}`);
          const [variant2] = keys;
          if (!Object.hasOwn(fields, variant2)) throw new TypeError(`Invalid enum variant ${variant2}`);
        }
      });
    }
  };
  var BcsTuple = class extends BcsType {
    constructor({ fields, name, ...options }) {
      super({
        name: name ?? `(${fields.map((t5) => t5.name).join(", ")})`,
        serializedSize: (values) => {
          let total = 0;
          for (let i7 = 0; i7 < fields.length; i7++) {
            const size2 = fields[i7].serializedSize(values[i7]);
            if (size2 == null) return null;
            total += size2;
          }
          return total;
        },
        read: (reader) => {
          const result = [];
          for (const field of fields) result.push(field.read(reader));
          return result;
        },
        write: (value, writer) => {
          for (let i7 = 0; i7 < fields.length; i7++) fields[i7].write(value[i7], writer);
        },
        ...options,
        validate: (value) => {
          options?.validate?.(value);
          if (!Array.isArray(value)) throw new TypeError(`Expected array, found ${typeof value}`);
          if (value.length !== fields.length) throw new TypeError(`Expected array of length ${fields.length}, found ${value.length}`);
        }
      });
    }
  };

  // node_modules/@mysten/bcs/dist/bcs.mjs
  function fixedArray(size2, type, options) {
    return new BcsType({
      read: (reader) => {
        const result = new Array(size2);
        for (let i7 = 0; i7 < size2; i7++) result[i7] = type.read(reader);
        return result;
      },
      write: (value, writer) => {
        for (const item of value) type.write(item, writer);
      },
      ...options,
      name: options?.name ?? `${type.name}[${size2}]`,
      validate: (value) => {
        options?.validate?.(value);
        if (!value || typeof value !== "object" || !("length" in value)) throw new TypeError(`Expected array, found ${typeof value}`);
        if (value.length !== size2) throw new TypeError(`Expected array of length ${size2}, found ${value.length}`);
      }
    });
  }
  function option(type) {
    return bcs.enum(`Option<${type.name}>`, {
      None: null,
      Some: type
    }).transform({
      input: (value) => {
        if (value == null) return { None: true };
        return { Some: value };
      },
      output: (value) => {
        if (value.$kind === "Some") return value.Some;
        return null;
      }
    });
  }
  function vector(type, options) {
    return new BcsType({
      read: (reader) => {
        const length = reader.readULEB();
        const result = new Array(length);
        for (let i7 = 0; i7 < length; i7++) result[i7] = type.read(reader);
        return result;
      },
      write: (value, writer) => {
        writer.writeULEB(value.length);
        for (const item of value) type.write(item, writer);
      },
      ...options,
      name: options?.name ?? `vector<${type.name}>`,
      validate: (value) => {
        options?.validate?.(value);
        if (!value || typeof value !== "object" || !("length" in value)) throw new TypeError(`Expected array, found ${typeof value}`);
      }
    });
  }
  function compareBcsBytes(a3, b3) {
    for (let i7 = 0; i7 < Math.min(a3.length, b3.length); i7++) if (a3[i7] !== b3[i7]) return a3[i7] - b3[i7];
    return a3.length - b3.length;
  }
  function map2(keyType, valueType) {
    return new BcsType({
      name: `Map<${keyType.name}, ${valueType.name}>`,
      read: (reader) => {
        const length = reader.readULEB();
        const result = /* @__PURE__ */ new Map();
        for (let i7 = 0; i7 < length; i7++) result.set(keyType.read(reader), valueType.read(reader));
        return result;
      },
      write: (value, writer) => {
        const entries = [...value.entries()].map(([key, val]) => [keyType.serialize(key).toBytes(), val]);
        entries.sort(([a3], [b3]) => compareBcsBytes(a3, b3));
        writer.writeULEB(entries.length);
        for (const [keyBytes, val] of entries) {
          writer.writeBytes(keyBytes);
          valueType.write(val, writer);
        }
      }
    });
  }
  var bcs = {
    u8(options) {
      return uIntBcsType({
        readMethod: "read8",
        writeMethod: "write8",
        size: 1,
        maxValue: 2 ** 8 - 1,
        ...options,
        name: options?.name ?? "u8"
      });
    },
    u16(options) {
      return uIntBcsType({
        readMethod: "read16",
        writeMethod: "write16",
        size: 2,
        maxValue: 2 ** 16 - 1,
        ...options,
        name: options?.name ?? "u16"
      });
    },
    u32(options) {
      return uIntBcsType({
        readMethod: "read32",
        writeMethod: "write32",
        size: 4,
        maxValue: 2 ** 32 - 1,
        ...options,
        name: options?.name ?? "u32"
      });
    },
    u64(options) {
      return bigUIntBcsType({
        readMethod: "read64",
        writeMethod: "write64",
        size: 8,
        maxValue: 2n ** 64n - 1n,
        ...options,
        name: options?.name ?? "u64"
      });
    },
    u128(options) {
      return bigUIntBcsType({
        readMethod: "read128",
        writeMethod: "write128",
        size: 16,
        maxValue: 2n ** 128n - 1n,
        ...options,
        name: options?.name ?? "u128"
      });
    },
    u256(options) {
      return bigUIntBcsType({
        readMethod: "read256",
        writeMethod: "write256",
        size: 32,
        maxValue: 2n ** 256n - 1n,
        ...options,
        name: options?.name ?? "u256"
      });
    },
    bool(options) {
      return fixedSizeBcsType({
        size: 1,
        read: (reader) => reader.read8() === 1,
        write: (value, writer) => writer.write8(value ? 1 : 0),
        ...options,
        name: options?.name ?? "bool",
        validate: (value) => {
          options?.validate?.(value);
          if (typeof value !== "boolean") throw new TypeError(`Expected boolean, found ${typeof value}`);
        }
      });
    },
    uleb128(options) {
      return dynamicSizeBcsType({
        read: (reader) => reader.readULEB(),
        serialize: (value) => {
          return Uint8Array.from(ulebEncode(value));
        },
        ...options,
        name: options?.name ?? "uleb128"
      });
    },
    bytes(size2, options) {
      return fixedSizeBcsType({
        size: size2,
        read: (reader) => reader.readBytes(size2),
        write: (value, writer) => {
          writer.writeBytes(new Uint8Array(value));
        },
        ...options,
        name: options?.name ?? `bytes[${size2}]`,
        validate: (value) => {
          options?.validate?.(value);
          if (!value || typeof value !== "object" || !("length" in value)) throw new TypeError(`Expected array, found ${typeof value}`);
          if (value.length !== size2) throw new TypeError(`Expected array of length ${size2}, found ${value.length}`);
        }
      });
    },
    byteVector(options) {
      return new BcsType({
        read: (reader) => {
          const length = reader.readULEB();
          return reader.readBytes(length);
        },
        write: (value, writer) => {
          const array2 = new Uint8Array(value);
          writer.writeULEB(array2.length);
          writer.writeBytes(array2);
        },
        ...options,
        name: options?.name ?? "vector<u8>",
        serializedSize: (value) => {
          const length = "length" in value ? value.length : null;
          return length == null ? null : ulebEncode(length).length + length;
        },
        validate: (value) => {
          options?.validate?.(value);
          if (!value || typeof value !== "object" || !("length" in value)) throw new TypeError(`Expected array, found ${typeof value}`);
        }
      });
    },
    string(options) {
      return stringLikeBcsType({
        toBytes: (value) => new TextEncoder().encode(value),
        fromBytes: (bytes) => new TextDecoder().decode(bytes),
        ...options,
        name: options?.name ?? "string"
      });
    },
    fixedArray,
    option,
    vector,
    tuple(fields, options) {
      return new BcsTuple({
        fields,
        ...options
      });
    },
    struct(name, fields, options) {
      return new BcsStruct({
        name,
        fields,
        ...options
      });
    },
    enum(name, fields, options) {
      return new BcsEnum({
        name,
        fields,
        ...options
      });
    },
    map: map2,
    lazy(cb) {
      return lazyBcsType(cb);
    }
  };

  // node_modules/@mysten/sui/dist/utils/sui-types.mjs
  var TX_DIGEST_LENGTH = 32;
  function isValidTransactionDigest(value) {
    try {
      return fromBase58(value).length === TX_DIGEST_LENGTH;
    } catch {
      return false;
    }
  }
  var SUI_ADDRESS_LENGTH = 32;
  function isValidSuiAddress(value) {
    return isHex(value) && getHexByteLength(value) === SUI_ADDRESS_LENGTH;
  }
  function isValidSuiObjectId(value) {
    return isValidSuiAddress(value);
  }
  var MOVE_IDENTIFIER_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  function isValidMoveIdentifier(name) {
    return MOVE_IDENTIFIER_REGEX.test(name);
  }
  var PRIMITIVE_TYPE_TAGS = [
    "bool",
    "u8",
    "u16",
    "u32",
    "u64",
    "u128",
    "u256",
    "address",
    "signer"
  ];
  var VECTOR_TYPE_REGEX = /^vector<(.+)>$/;
  function isValidTypeTag(type) {
    if (PRIMITIVE_TYPE_TAGS.includes(type)) return true;
    const vectorMatch = type.match(VECTOR_TYPE_REGEX);
    if (vectorMatch) return isValidTypeTag(vectorMatch[1]);
    if (type.includes("::")) return isValidStructTag(type);
    return false;
  }
  function isValidParsedStructTag(tag) {
    if (!isValidSuiAddress(tag.address) && !isValidNamedPackage(tag.address)) return false;
    if (!isValidMoveIdentifier(tag.module) || !isValidMoveIdentifier(tag.name)) return false;
    return tag.typeParams.every((param) => {
      if (typeof param === "string") return isValidTypeTag(param);
      return isValidParsedStructTag(param);
    });
  }
  function isValidStructTag(type) {
    try {
      return isValidParsedStructTag(parseStructTag(type));
    } catch {
      return false;
    }
  }
  function parseTypeTag(type) {
    if (type.startsWith("vector<")) {
      if (!type.endsWith(">")) throw new Error(`Invalid type tag: ${type}`);
      const inner = type.slice(7, -1);
      if (!inner) throw new Error(`Invalid type tag: ${type}`);
      const parsed = parseTypeTag(inner);
      if (typeof parsed === "string") return `vector<${parsed}>`;
      return `vector<${normalizeStructTag(parsed)}>`;
    }
    if (!type.includes("::")) return type;
    return parseStructTag(type);
  }
  function parseStructTag(type) {
    const parts = type.split("::");
    if (parts.length < 3) throw new Error(`Invalid struct tag: ${type}`);
    const [address, module] = parts;
    const isMvrPackage = isValidNamedPackage(address);
    const rest = type.slice(address.length + module.length + 4);
    const name = rest.includes("<") ? rest.slice(0, rest.indexOf("<")) : rest;
    const typeParams = rest.includes("<") ? splitGenericParameters(rest.slice(rest.indexOf("<") + 1, rest.lastIndexOf(">"))).map((typeParam) => parseTypeTag(typeParam.trim())) : [];
    return {
      address: isMvrPackage ? address : normalizeSuiAddress(address),
      module,
      name,
      typeParams
    };
  }
  function normalizeStructTag(type) {
    const { address, module, name, typeParams } = typeof type === "string" ? parseStructTag(type) : type;
    return `${address}::${module}::${name}${typeParams?.length > 0 ? `<${typeParams.map((typeParam) => typeof typeParam === "string" ? typeParam : normalizeStructTag(typeParam)).join(",")}>` : ""}`;
  }
  function normalizeSuiAddress(value, forceAdd0x = false) {
    let address = value.toLowerCase();
    if (!forceAdd0x && address.startsWith("0x")) address = address.slice(2);
    return `0x${address.padStart(SUI_ADDRESS_LENGTH * 2, "0")}`;
  }
  function normalizeSuiObjectId(value, forceAdd0x = false) {
    return normalizeSuiAddress(value, forceAdd0x);
  }
  function isHex(value) {
    return /^(0x|0X)?[a-fA-F0-9]+$/.test(value) && value.length % 2 === 0;
  }
  function getHexByteLength(value) {
    return /^(0x|0X)/.test(value) ? (value.length - 2) / 2 : value.length / 2;
  }

  // node_modules/@mysten/sui/dist/bcs/type-tag-serializer.mjs
  var VECTOR_REGEX = /^vector<(.+)>$/;
  var STRUCT_REGEX = /^([^:]+)::([^:]+)::([^<]+)(<(.+)>)?/;
  var TypeTagSerializer = class TypeTagSerializer2 {
    static parseFromStr(str, normalizeAddress = false) {
      if (str === "address") return { address: null };
      else if (str === "bool") return { bool: null };
      else if (str === "u8") return { u8: null };
      else if (str === "u16") return { u16: null };
      else if (str === "u32") return { u32: null };
      else if (str === "u64") return { u64: null };
      else if (str === "u128") return { u128: null };
      else if (str === "u256") return { u256: null };
      else if (str === "signer") return { signer: null };
      const vectorMatch = str.match(VECTOR_REGEX);
      if (vectorMatch) return { vector: TypeTagSerializer2.parseFromStr(vectorMatch[1], normalizeAddress) };
      const structMatch = str.match(STRUCT_REGEX);
      if (structMatch) return { struct: {
        address: normalizeAddress ? normalizeSuiAddress(structMatch[1]) : structMatch[1],
        module: structMatch[2],
        name: structMatch[3],
        typeParams: structMatch[5] === void 0 ? [] : TypeTagSerializer2.parseStructTypeArgs(structMatch[5], normalizeAddress)
      } };
      throw new Error(`Encountered unexpected token when parsing type args for ${str}`);
    }
    static parseStructTypeArgs(str, normalizeAddress = false) {
      return splitGenericParameters(str).map((tok) => TypeTagSerializer2.parseFromStr(tok, normalizeAddress));
    }
    static tagToString(tag) {
      if ("bool" in tag) return "bool";
      if ("u8" in tag) return "u8";
      if ("u16" in tag) return "u16";
      if ("u32" in tag) return "u32";
      if ("u64" in tag) return "u64";
      if ("u128" in tag) return "u128";
      if ("u256" in tag) return "u256";
      if ("address" in tag) return "address";
      if ("signer" in tag) return "signer";
      if ("vector" in tag) return `vector<${TypeTagSerializer2.tagToString(tag.vector)}>`;
      if ("struct" in tag) {
        const struct = tag.struct;
        const typeParams = struct.typeParams.map(TypeTagSerializer2.tagToString).join(", ");
        return `${struct.address}::${struct.module}::${struct.name}${typeParams ? `<${typeParams}>` : ""}`;
      }
      throw new Error("Invalid TypeTag");
    }
  };

  // node_modules/@mysten/sui/dist/bcs/bcs.mjs
  function unsafe_u64(options) {
    return bcs.u64({
      name: "unsafe_u64",
      ...options
    }).transform({
      input: (val) => val,
      output: (val) => Number(val)
    });
  }
  function optionEnum(type) {
    return bcs.enum("Option", {
      None: null,
      Some: type
    });
  }
  var Address = bcs.bytes(SUI_ADDRESS_LENGTH).transform({
    validate: (val) => {
      const address = typeof val === "string" ? val : toHex(val);
      if (!address || !isValidSuiAddress(normalizeSuiAddress(address))) throw new Error(`Invalid Sui address ${address}`);
    },
    input: (val) => typeof val === "string" ? fromHex(normalizeSuiAddress(val)) : val,
    output: (val) => normalizeSuiAddress(toHex(val))
  });
  var ObjectDigest = bcs.byteVector().transform({
    name: "ObjectDigest",
    input: (value) => fromBase58(value),
    output: (value) => toBase58(new Uint8Array(value)),
    validate: (value) => {
      if (fromBase58(value).length !== 32) throw new Error("ObjectDigest must be 32 bytes");
    }
  });
  var SuiObjectRef = bcs.struct("SuiObjectRef", {
    objectId: Address,
    version: bcs.u64(),
    digest: ObjectDigest
  });
  var SharedObjectRef = bcs.struct("SharedObjectRef", {
    objectId: Address,
    initialSharedVersion: bcs.u64(),
    mutable: bcs.bool()
  });
  var ObjectArg = bcs.enum("ObjectArg", {
    ImmOrOwnedObject: SuiObjectRef,
    SharedObject: SharedObjectRef,
    Receiving: SuiObjectRef
  });
  var Owner = bcs.enum("Owner", {
    AddressOwner: Address,
    ObjectOwner: Address,
    Shared: bcs.struct("Shared", { initialSharedVersion: bcs.u64() }),
    Immutable: null,
    ConsensusAddressOwner: bcs.struct("ConsensusAddressOwner", {
      startVersion: bcs.u64(),
      owner: Address
    })
  });
  var Reservation = bcs.enum("Reservation", { MaxAmountU64: bcs.u64() });
  var WithdrawalType = bcs.enum("WithdrawalType", { Balance: bcs.lazy(() => TypeTag) });
  var WithdrawFrom = bcs.enum("WithdrawFrom", {
    Sender: null,
    Sponsor: null
  });
  var FundsWithdrawal = bcs.struct("FundsWithdrawal", {
    reservation: Reservation,
    typeArg: WithdrawalType,
    withdrawFrom: WithdrawFrom
  });
  var CallArg = bcs.enum("CallArg", {
    Pure: bcs.struct("Pure", { bytes: bcs.byteVector().transform({
      input: (val) => typeof val === "string" ? fromBase64(val) : val,
      output: (val) => toBase64(new Uint8Array(val))
    }) }),
    Object: ObjectArg,
    FundsWithdrawal
  });
  var InnerTypeTag = bcs.enum("TypeTag", {
    bool: null,
    u8: null,
    u64: null,
    u128: null,
    address: null,
    signer: null,
    vector: bcs.lazy(() => InnerTypeTag),
    struct: bcs.lazy(() => StructTag),
    u16: null,
    u32: null,
    u256: null
  });
  var TypeTag = InnerTypeTag.transform({
    input: (typeTag) => typeof typeTag === "string" ? TypeTagSerializer.parseFromStr(typeTag, true) : typeTag,
    output: (typeTag) => TypeTagSerializer.tagToString(typeTag)
  });
  var Argument = bcs.enum("Argument", {
    GasCoin: null,
    Input: bcs.u16(),
    Result: bcs.u16(),
    NestedResult: bcs.tuple([bcs.u16(), bcs.u16()])
  });
  var ProgrammableMoveCall = bcs.struct("ProgrammableMoveCall", {
    package: Address,
    module: bcs.string(),
    function: bcs.string(),
    typeArguments: bcs.vector(TypeTag),
    arguments: bcs.vector(Argument)
  });
  var Command = bcs.enum("Command", {
    MoveCall: ProgrammableMoveCall,
    TransferObjects: bcs.struct("TransferObjects", {
      objects: bcs.vector(Argument),
      address: Argument
    }),
    SplitCoins: bcs.struct("SplitCoins", {
      coin: Argument,
      amounts: bcs.vector(Argument)
    }),
    MergeCoins: bcs.struct("MergeCoins", {
      destination: Argument,
      sources: bcs.vector(Argument)
    }),
    Publish: bcs.struct("Publish", {
      modules: bcs.vector(bcs.byteVector().transform({
        input: (val) => typeof val === "string" ? fromBase64(val) : val,
        output: (val) => toBase64(new Uint8Array(val))
      })),
      dependencies: bcs.vector(Address)
    }),
    MakeMoveVec: bcs.struct("MakeMoveVec", {
      type: optionEnum(TypeTag).transform({
        input: (val) => val === null ? { None: true } : { Some: val },
        output: (val) => val.Some ?? null
      }),
      elements: bcs.vector(Argument)
    }),
    Upgrade: bcs.struct("Upgrade", {
      modules: bcs.vector(bcs.byteVector().transform({
        input: (val) => typeof val === "string" ? fromBase64(val) : val,
        output: (val) => toBase64(new Uint8Array(val))
      })),
      dependencies: bcs.vector(Address),
      package: Address,
      ticket: Argument
    })
  });
  var ProgrammableTransaction = bcs.struct("ProgrammableTransaction", {
    inputs: bcs.vector(CallArg),
    commands: bcs.vector(Command)
  });
  var TransactionKind = bcs.enum("TransactionKind", {
    ProgrammableTransaction,
    ChangeEpoch: null,
    Genesis: null,
    ConsensusCommitPrologue: null
  });
  var ValidDuring = bcs.struct("ValidDuring", {
    minEpoch: bcs.option(bcs.u64()),
    maxEpoch: bcs.option(bcs.u64()),
    minTimestamp: bcs.option(bcs.u64()),
    maxTimestamp: bcs.option(bcs.u64()),
    chain: ObjectDigest,
    nonce: bcs.u32()
  });
  var TransactionExpiration = bcs.enum("TransactionExpiration", {
    None: null,
    Epoch: unsafe_u64(),
    ValidDuring
  });
  var StructTag = bcs.struct("StructTag", {
    address: Address,
    module: bcs.string(),
    name: bcs.string(),
    typeParams: bcs.vector(InnerTypeTag)
  });
  var GasData = bcs.struct("GasData", {
    payment: bcs.vector(SuiObjectRef),
    owner: Address,
    price: bcs.u64(),
    budget: bcs.u64()
  });
  var TransactionDataV1 = bcs.struct("TransactionDataV1", {
    kind: TransactionKind,
    sender: Address,
    gasData: GasData,
    expiration: TransactionExpiration
  });
  var TransactionData = bcs.enum("TransactionData", { V1: TransactionDataV1 });
  var IntentScope = bcs.enum("IntentScope", {
    TransactionData: null,
    TransactionEffects: null,
    CheckpointSummary: null,
    PersonalMessage: null
  });
  var IntentVersion = bcs.enum("IntentVersion", { V0: null });
  var AppId = bcs.enum("AppId", { Sui: null });
  var Intent = bcs.struct("Intent", {
    scope: IntentScope,
    version: IntentVersion,
    appId: AppId
  });
  function IntentMessage(T2) {
    return bcs.struct(`IntentMessage<${T2.name}>`, {
      intent: Intent,
      value: T2
    });
  }
  var CompressedSignature = bcs.enum("CompressedSignature", {
    ED25519: bcs.bytes(64),
    Secp256k1: bcs.bytes(64),
    Secp256r1: bcs.bytes(64),
    ZkLogin: bcs.byteVector(),
    Passkey: bcs.byteVector()
  });
  var PublicKey = bcs.enum("PublicKey", {
    ED25519: bcs.bytes(32),
    Secp256k1: bcs.bytes(33),
    Secp256r1: bcs.bytes(33),
    ZkLogin: bcs.byteVector(),
    Passkey: bcs.bytes(33)
  });
  var MultiSigPkMap = bcs.struct("MultiSigPkMap", {
    pubKey: PublicKey,
    weight: bcs.u8()
  });
  var MultiSigPublicKey = bcs.struct("MultiSigPublicKey", {
    pk_map: bcs.vector(MultiSigPkMap),
    threshold: bcs.u16()
  });
  var MultiSig = bcs.struct("MultiSig", {
    sigs: bcs.vector(CompressedSignature),
    bitmap: bcs.u16(),
    multisig_pk: MultiSigPublicKey
  });
  var base64String = bcs.byteVector().transform({
    input: (val) => typeof val === "string" ? fromBase64(val) : val,
    output: (val) => toBase64(new Uint8Array(val))
  });
  var SenderSignedTransaction = bcs.struct("SenderSignedTransaction", {
    intentMessage: IntentMessage(TransactionData),
    txSignatures: bcs.vector(base64String)
  });
  var SenderSignedData = bcs.vector(SenderSignedTransaction, { name: "SenderSignedData" });
  var PasskeyAuthenticator = bcs.struct("PasskeyAuthenticator", {
    authenticatorData: bcs.byteVector(),
    clientDataJson: bcs.string(),
    userSignature: bcs.byteVector()
  });
  var MoveObjectType = bcs.enum("MoveObjectType", {
    Other: StructTag,
    GasCoin: null,
    StakedSui: null,
    Coin: TypeTag,
    AccumulatorBalanceWrapper: null
  });
  var TypeOrigin = bcs.struct("TypeOrigin", {
    moduleName: bcs.string(),
    datatypeName: bcs.string(),
    package: Address
  });
  var UpgradeInfo = bcs.struct("UpgradeInfo", {
    upgradedId: Address,
    upgradedVersion: bcs.u64()
  });
  var MovePackage = bcs.struct("MovePackage", {
    id: Address,
    version: bcs.u64(),
    moduleMap: bcs.map(bcs.string(), bcs.byteVector()),
    typeOriginTable: bcs.vector(TypeOrigin),
    linkageTable: bcs.map(Address, UpgradeInfo)
  });
  var MoveObject = bcs.struct("MoveObject", {
    type: MoveObjectType,
    hasPublicTransfer: bcs.bool(),
    version: bcs.u64(),
    contents: bcs.byteVector()
  });
  var Data = bcs.enum("Data", {
    Move: MoveObject,
    Package: MovePackage
  });
  var ObjectInner = bcs.struct("ObjectInner", {
    data: Data,
    owner: Owner,
    previousTransaction: ObjectDigest,
    storageRebate: bcs.u64()
  });

  // node_modules/@mysten/sui/dist/bcs/effects.mjs
  var PackageUpgradeError = bcs.enum("PackageUpgradeError", {
    UnableToFetchPackage: bcs.struct("UnableToFetchPackage", { packageId: Address }),
    NotAPackage: bcs.struct("NotAPackage", { objectId: Address }),
    IncompatibleUpgrade: null,
    DigestDoesNotMatch: bcs.struct("DigestDoesNotMatch", { digest: bcs.byteVector() }),
    UnknownUpgradePolicy: bcs.struct("UnknownUpgradePolicy", { policy: bcs.u8() }),
    PackageIDDoesNotMatch: bcs.struct("PackageIDDoesNotMatch", {
      packageId: Address,
      ticketId: Address
    })
  });
  var ModuleId = bcs.struct("ModuleId", {
    address: Address,
    name: bcs.string()
  });
  var MoveLocation = bcs.struct("MoveLocation", {
    module: ModuleId,
    function: bcs.u16(),
    instruction: bcs.u16(),
    functionName: bcs.option(bcs.string())
  });
  var CommandArgumentError = bcs.enum("CommandArgumentError", {
    TypeMismatch: null,
    InvalidBCSBytes: null,
    InvalidUsageOfPureArg: null,
    InvalidArgumentToPrivateEntryFunction: null,
    IndexOutOfBounds: bcs.struct("IndexOutOfBounds", { idx: bcs.u16() }),
    SecondaryIndexOutOfBounds: bcs.struct("SecondaryIndexOutOfBounds", {
      resultIdx: bcs.u16(),
      secondaryIdx: bcs.u16()
    }),
    InvalidResultArity: bcs.struct("InvalidResultArity", { resultIdx: bcs.u16() }),
    InvalidGasCoinUsage: null,
    InvalidValueUsage: null,
    InvalidObjectByValue: null,
    InvalidObjectByMutRef: null,
    SharedObjectOperationNotAllowed: null,
    InvalidArgumentArity: null,
    InvalidTransferObject: null,
    InvalidMakeMoveVecNonObjectArgument: null,
    ArgumentWithoutValue: null,
    CannotMoveBorrowedValue: null,
    CannotWriteToExtendedReference: null,
    InvalidReferenceArgument: null
  });
  var TypeArgumentError = bcs.enum("TypeArgumentError", {
    TypeNotFound: null,
    ConstraintNotSatisfied: null
  });
  var ExecutionFailureStatus = bcs.enum("ExecutionFailureStatus", {
    InsufficientGas: null,
    InvalidGasObject: null,
    InvariantViolation: null,
    FeatureNotYetSupported: null,
    MoveObjectTooBig: bcs.struct("MoveObjectTooBig", {
      objectSize: bcs.u64(),
      maxObjectSize: bcs.u64()
    }),
    MovePackageTooBig: bcs.struct("MovePackageTooBig", {
      objectSize: bcs.u64(),
      maxObjectSize: bcs.u64()
    }),
    CircularObjectOwnership: bcs.struct("CircularObjectOwnership", { object: Address }),
    InsufficientCoinBalance: null,
    CoinBalanceOverflow: null,
    PublishErrorNonZeroAddress: null,
    SuiMoveVerificationError: null,
    MovePrimitiveRuntimeError: bcs.option(MoveLocation),
    MoveAbort: bcs.tuple([MoveLocation, bcs.u64()]),
    VMVerificationOrDeserializationError: null,
    VMInvariantViolation: null,
    FunctionNotFound: null,
    ArityMismatch: null,
    TypeArityMismatch: null,
    NonEntryFunctionInvoked: null,
    CommandArgumentError: bcs.struct("CommandArgumentError", {
      argIdx: bcs.u16(),
      kind: CommandArgumentError
    }),
    TypeArgumentError: bcs.struct("TypeArgumentError", {
      argumentIdx: bcs.u16(),
      kind: TypeArgumentError
    }),
    UnusedValueWithoutDrop: bcs.struct("UnusedValueWithoutDrop", {
      resultIdx: bcs.u16(),
      secondaryIdx: bcs.u16()
    }),
    InvalidPublicFunctionReturnType: bcs.struct("InvalidPublicFunctionReturnType", { idx: bcs.u16() }),
    InvalidTransferObject: null,
    EffectsTooLarge: bcs.struct("EffectsTooLarge", {
      currentSize: bcs.u64(),
      maxSize: bcs.u64()
    }),
    PublishUpgradeMissingDependency: null,
    PublishUpgradeDependencyDowngrade: null,
    PackageUpgradeError: bcs.struct("PackageUpgradeError", { upgradeError: PackageUpgradeError }),
    WrittenObjectsTooLarge: bcs.struct("WrittenObjectsTooLarge", {
      currentSize: bcs.u64(),
      maxSize: bcs.u64()
    }),
    CertificateDenied: null,
    SuiMoveVerificationTimedout: null,
    SharedObjectOperationNotAllowed: null,
    InputObjectDeleted: null,
    ExecutionCancelledDueToSharedObjectCongestion: bcs.struct("ExecutionCancelledDueToSharedObjectCongestion", { congested_objects: bcs.vector(Address) }),
    AddressDeniedForCoin: bcs.struct("AddressDeniedForCoin", {
      address: Address,
      coinType: bcs.string()
    }),
    CoinTypeGlobalPause: bcs.struct("CoinTypeGlobalPause", { coinType: bcs.string() }),
    ExecutionCancelledDueToRandomnessUnavailable: null,
    MoveVectorElemTooBig: bcs.struct("MoveVectorElemTooBig", {
      valueSize: bcs.u64(),
      maxScaledSize: bcs.u64()
    }),
    MoveRawValueTooBig: bcs.struct("MoveRawValueTooBig", {
      valueSize: bcs.u64(),
      maxScaledSize: bcs.u64()
    }),
    InvalidLinkage: null,
    InsufficientBalanceForWithdraw: null,
    NonExclusiveWriteInputObjectModified: bcs.struct("NonExclusiveWriteInputObjectModified", { id: Address })
  });
  var ExecutionStatus = bcs.enum("ExecutionStatus", {
    Success: null,
    Failure: bcs.struct("Failure", {
      error: ExecutionFailureStatus,
      command: bcs.option(bcs.u64())
    })
  });
  var GasCostSummary = bcs.struct("GasCostSummary", {
    computationCost: bcs.u64(),
    storageCost: bcs.u64(),
    storageRebate: bcs.u64(),
    nonRefundableStorageFee: bcs.u64()
  });
  var TransactionEffectsV1 = bcs.struct("TransactionEffectsV1", {
    status: ExecutionStatus,
    executedEpoch: bcs.u64(),
    gasUsed: GasCostSummary,
    modifiedAtVersions: bcs.vector(bcs.tuple([Address, bcs.u64()])),
    sharedObjects: bcs.vector(SuiObjectRef),
    transactionDigest: ObjectDigest,
    created: bcs.vector(bcs.tuple([SuiObjectRef, Owner])),
    mutated: bcs.vector(bcs.tuple([SuiObjectRef, Owner])),
    unwrapped: bcs.vector(bcs.tuple([SuiObjectRef, Owner])),
    deleted: bcs.vector(SuiObjectRef),
    unwrappedThenDeleted: bcs.vector(SuiObjectRef),
    wrapped: bcs.vector(SuiObjectRef),
    gasObject: bcs.tuple([SuiObjectRef, Owner]),
    eventsDigest: bcs.option(ObjectDigest),
    dependencies: bcs.vector(ObjectDigest)
  });
  var VersionDigest = bcs.tuple([bcs.u64(), ObjectDigest]);
  var ObjectIn = bcs.enum("ObjectIn", {
    NotExist: null,
    Exist: bcs.tuple([VersionDigest, Owner])
  });
  var AccumulatorAddress = bcs.struct("AccumulatorAddress", {
    address: Address,
    ty: TypeTag
  });
  var AccumulatorOperation = bcs.enum("AccumulatorOperation", {
    Merge: null,
    Split: null
  });
  var AccumulatorValue = bcs.enum("AccumulatorValue", {
    Integer: bcs.u64(),
    IntegerTuple: bcs.tuple([bcs.u64(), bcs.u64()]),
    EventDigest: bcs.vector(bcs.tuple([bcs.u64(), ObjectDigest]))
  });
  var AccumulatorWriteV1 = bcs.struct("AccumulatorWriteV1", {
    address: AccumulatorAddress,
    operation: AccumulatorOperation,
    value: AccumulatorValue
  });
  var ObjectOut = bcs.enum("ObjectOut", {
    NotExist: null,
    ObjectWrite: bcs.tuple([ObjectDigest, Owner]),
    PackageWrite: VersionDigest,
    AccumulatorWriteV1
  });
  var IDOperation = bcs.enum("IDOperation", {
    None: null,
    Created: null,
    Deleted: null
  });
  var EffectsObjectChange = bcs.struct("EffectsObjectChange", {
    inputState: ObjectIn,
    outputState: ObjectOut,
    idOperation: IDOperation
  });
  var UnchangedConsensusKind = bcs.enum("UnchangedConsensusKind", {
    ReadOnlyRoot: VersionDigest,
    MutateConsensusStreamEnded: bcs.u64(),
    ReadConsensusStreamEnded: bcs.u64(),
    Cancelled: bcs.u64(),
    PerEpochConfig: null
  });
  var TransactionEffectsV2 = bcs.struct("TransactionEffectsV2", {
    status: ExecutionStatus,
    executedEpoch: bcs.u64(),
    gasUsed: GasCostSummary,
    transactionDigest: ObjectDigest,
    gasObjectIndex: bcs.option(bcs.u32()),
    eventsDigest: bcs.option(ObjectDigest),
    dependencies: bcs.vector(ObjectDigest),
    lamportVersion: bcs.u64(),
    changedObjects: bcs.vector(bcs.tuple([Address, EffectsObjectChange])),
    unchangedConsensusObjects: bcs.vector(bcs.tuple([Address, UnchangedConsensusKind])),
    auxDataDigest: bcs.option(ObjectDigest)
  });
  var TransactionEffects = bcs.enum("TransactionEffects", {
    V1: TransactionEffectsV1,
    V2: TransactionEffectsV2
  });

  // node_modules/@mysten/sui/dist/bcs/pure.mjs
  function pureBcsSchemaFromTypeName(name) {
    switch (name) {
      case "u8":
        return bcs.u8();
      case "u16":
        return bcs.u16();
      case "u32":
        return bcs.u32();
      case "u64":
        return bcs.u64();
      case "u128":
        return bcs.u128();
      case "u256":
        return bcs.u256();
      case "bool":
        return bcs.bool();
      case "string":
        return bcs.string();
      case "id":
      case "address":
        return Address;
    }
    const generic = name.match(/^(vector|option)<(.+)>$/);
    if (generic) {
      const [kind, inner] = generic.slice(1);
      if (kind === "vector") return bcs.vector(pureBcsSchemaFromTypeName(inner));
      else return bcs.option(pureBcsSchemaFromTypeName(inner));
    }
    throw new Error(`Invalid Pure type name: ${name}`);
  }

  // node_modules/@mysten/sui/dist/bcs/index.mjs
  var suiBcs = {
    ...bcs,
    U8: bcs.u8(),
    U16: bcs.u16(),
    U32: bcs.u32(),
    U64: bcs.u64(),
    U128: bcs.u128(),
    U256: bcs.u256(),
    ULEB128: bcs.uleb128(),
    Bool: bcs.bool(),
    String: bcs.string(),
    Address,
    AppId,
    Argument,
    CallArg,
    Command,
    CompressedSignature,
    Data,
    GasData,
    Intent,
    IntentMessage,
    IntentScope,
    IntentVersion,
    MoveObject,
    MoveObjectType,
    MovePackage,
    MultiSig,
    MultiSigPkMap,
    MultiSigPublicKey,
    Object: ObjectInner,
    ObjectArg,
    ObjectDigest,
    Owner,
    PasskeyAuthenticator,
    ProgrammableMoveCall,
    ProgrammableTransaction,
    PublicKey,
    SenderSignedData,
    SenderSignedTransaction,
    SharedObjectRef,
    StructTag,
    SuiObjectRef,
    TransactionData,
    TransactionDataV1,
    TransactionEffects,
    TransactionExpiration,
    TransactionKind,
    TypeOrigin,
    TypeTag,
    UpgradeInfo
  };

  // node_modules/valibot/dist/index.mjs
  var store$4;
  // @__NO_SIDE_EFFECTS__
  function getGlobalConfig(config$1) {
    return {
      lang: config$1?.lang ?? store$4?.lang,
      message: config$1?.message,
      abortEarly: config$1?.abortEarly ?? store$4?.abortEarly,
      abortPipeEarly: config$1?.abortPipeEarly ?? store$4?.abortPipeEarly
    };
  }
  var store$3;
  // @__NO_SIDE_EFFECTS__
  function getGlobalMessage(lang) {
    return store$3?.get(lang);
  }
  var store$2;
  // @__NO_SIDE_EFFECTS__
  function getSchemaMessage(lang) {
    return store$2?.get(lang);
  }
  var store$1;
  // @__NO_SIDE_EFFECTS__
  function getSpecificMessage(reference, lang) {
    return store$1?.get(reference)?.get(lang);
  }
  // @__NO_SIDE_EFFECTS__
  function _stringify(input) {
    const type = typeof input;
    if (type === "string") return `"${input}"`;
    if (type === "number" || type === "bigint" || type === "boolean") return `${input}`;
    if (type === "object" || type === "function") return (input && Object.getPrototypeOf(input)?.constructor?.name) ?? "null";
    return type;
  }
  function _addIssue(context, label, dataset, config$1, other) {
    const input = other && "input" in other ? other.input : dataset.value;
    const expected = other?.expected ?? context.expects ?? null;
    const received = other?.received ?? /* @__PURE__ */ _stringify(input);
    const issue = {
      kind: context.kind,
      type: context.type,
      input,
      expected,
      received,
      message: `Invalid ${label}: ${expected ? `Expected ${expected} but r` : "R"}eceived ${received}`,
      requirement: context.requirement,
      path: other?.path,
      issues: other?.issues,
      lang: config$1.lang,
      abortEarly: config$1.abortEarly,
      abortPipeEarly: config$1.abortPipeEarly
    };
    const isSchema = context.kind === "schema";
    const message$1 = other?.message ?? context.message ?? /* @__PURE__ */ getSpecificMessage(context.reference, issue.lang) ?? (isSchema ? /* @__PURE__ */ getSchemaMessage(issue.lang) : null) ?? config$1.message ?? /* @__PURE__ */ getGlobalMessage(issue.lang);
    if (message$1 !== void 0) issue.message = typeof message$1 === "function" ? message$1(issue) : message$1;
    if (isSchema) dataset.typed = false;
    if (dataset.issues) dataset.issues.push(issue);
    else dataset.issues = [issue];
  }
  // @__NO_SIDE_EFFECTS__
  function _getStandardProps(context) {
    return {
      version: 1,
      vendor: "valibot",
      validate(value$1) {
        return context["~run"]({ value: value$1 }, /* @__PURE__ */ getGlobalConfig());
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function _isValidObjectKey(object$1, key) {
    return Object.hasOwn(object$1, key) && key !== "__proto__" && key !== "prototype" && key !== "constructor";
  }
  // @__NO_SIDE_EFFECTS__
  function _joinExpects(values$1, separator) {
    const list = [...new Set(values$1)];
    if (list.length > 1) return `(${list.join(` ${separator} `)})`;
    return list[0] ?? "never";
  }
  var ValiError = class extends Error {
    /**
    * Creates a Valibot error with useful information.
    *
    * @param issues The error issues.
    */
    constructor(issues) {
      super(issues[0].message);
      this.name = "ValiError";
      this.issues = issues;
    }
  };
  var UUID_REGEX = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/iu;
  // @__NO_SIDE_EFFECTS__
  function check(requirement, message$1) {
    return {
      kind: "validation",
      type: "check",
      reference: check,
      async: false,
      expects: null,
      requirement,
      message: message$1,
      "~run"(dataset, config$1) {
        if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "input", dataset, config$1);
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function integer(message$1) {
    return {
      kind: "validation",
      type: "integer",
      reference: integer,
      async: false,
      expects: null,
      requirement: Number.isInteger,
      message: message$1,
      "~run"(dataset, config$1) {
        if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "integer", dataset, config$1);
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function transform(operation) {
    return {
      kind: "transformation",
      type: "transform",
      reference: transform,
      async: false,
      operation,
      "~run"(dataset) {
        dataset.value = this.operation(dataset.value);
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function uuid(message$1) {
    return {
      kind: "validation",
      type: "uuid",
      reference: uuid,
      async: false,
      expects: null,
      requirement: UUID_REGEX,
      message: message$1,
      "~run"(dataset, config$1) {
        if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "UUID", dataset, config$1);
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function getFallback(schema, dataset, config$1) {
    return typeof schema.fallback === "function" ? schema.fallback(dataset, config$1) : schema.fallback;
  }
  // @__NO_SIDE_EFFECTS__
  function getDefault(schema, dataset, config$1) {
    return typeof schema.default === "function" ? schema.default(dataset, config$1) : schema.default;
  }
  // @__NO_SIDE_EFFECTS__
  function is(schema, input) {
    return !schema["~run"]({ value: input }, { abortEarly: true }).issues;
  }
  // @__NO_SIDE_EFFECTS__
  function array(item, message$1) {
    return {
      kind: "schema",
      type: "array",
      reference: array,
      expects: "Array",
      async: false,
      item,
      message: message$1,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        const input = dataset.value;
        if (Array.isArray(input)) {
          dataset.typed = true;
          dataset.value = [];
          for (let key = 0; key < input.length; key++) {
            const value$1 = input[key];
            const itemDataset = this.item["~run"]({ value: value$1 }, config$1);
            if (itemDataset.issues) {
              const pathItem = {
                type: "array",
                origin: "value",
                input,
                key,
                value: value$1
              };
              for (const issue of itemDataset.issues) {
                if (issue.path) issue.path.unshift(pathItem);
                else issue.path = [pathItem];
                dataset.issues?.push(issue);
              }
              if (!dataset.issues) dataset.issues = itemDataset.issues;
              if (config$1.abortEarly) {
                dataset.typed = false;
                break;
              }
            }
            if (!itemDataset.typed) dataset.typed = false;
            dataset.value.push(itemDataset.value);
          }
        } else _addIssue(this, "type", dataset, config$1);
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function bigint(message$1) {
    return {
      kind: "schema",
      type: "bigint",
      reference: bigint,
      expects: "bigint",
      async: false,
      message: message$1,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        if (typeof dataset.value === "bigint") dataset.typed = true;
        else _addIssue(this, "type", dataset, config$1);
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function boolean(message$1) {
    return {
      kind: "schema",
      type: "boolean",
      reference: boolean,
      expects: "boolean",
      async: false,
      message: message$1,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        if (typeof dataset.value === "boolean") dataset.typed = true;
        else _addIssue(this, "type", dataset, config$1);
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function lazy(getter) {
    return {
      kind: "schema",
      type: "lazy",
      reference: lazy,
      expects: "unknown",
      async: false,
      getter,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        return this.getter(dataset.value)["~run"](dataset, config$1);
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function literal(literal_, message$1) {
    return {
      kind: "schema",
      type: "literal",
      reference: literal,
      expects: /* @__PURE__ */ _stringify(literal_),
      async: false,
      literal: literal_,
      message: message$1,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        if (dataset.value === this.literal) dataset.typed = true;
        else _addIssue(this, "type", dataset, config$1);
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function nullable(wrapped, default_) {
    return {
      kind: "schema",
      type: "nullable",
      reference: nullable,
      expects: `(${wrapped.expects} | null)`,
      async: false,
      wrapped,
      default: default_,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        if (dataset.value === null) {
          if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
          if (dataset.value === null) {
            dataset.typed = true;
            return dataset;
          }
        }
        return this.wrapped["~run"](dataset, config$1);
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function nullish(wrapped, default_) {
    return {
      kind: "schema",
      type: "nullish",
      reference: nullish,
      expects: `(${wrapped.expects} | null | undefined)`,
      async: false,
      wrapped,
      default: default_,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        if (dataset.value === null || dataset.value === void 0) {
          if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
          if (dataset.value === null || dataset.value === void 0) {
            dataset.typed = true;
            return dataset;
          }
        }
        return this.wrapped["~run"](dataset, config$1);
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function number(message$1) {
    return {
      kind: "schema",
      type: "number",
      reference: number,
      expects: "number",
      async: false,
      message: message$1,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        if (typeof dataset.value === "number" && !isNaN(dataset.value)) dataset.typed = true;
        else _addIssue(this, "type", dataset, config$1);
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function object(entries$1, message$1) {
    return {
      kind: "schema",
      type: "object",
      reference: object,
      expects: "Object",
      async: false,
      entries: entries$1,
      message: message$1,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        const input = dataset.value;
        if (input && typeof input === "object") {
          dataset.typed = true;
          dataset.value = {};
          for (const key in this.entries) {
            const valueSchema = this.entries[key];
            if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
              const value$1 = key in input ? input[key] : /* @__PURE__ */ getDefault(valueSchema);
              const valueDataset = valueSchema["~run"]({ value: value$1 }, config$1);
              if (valueDataset.issues) {
                const pathItem = {
                  type: "object",
                  origin: "value",
                  input,
                  key,
                  value: value$1
                };
                for (const issue of valueDataset.issues) {
                  if (issue.path) issue.path.unshift(pathItem);
                  else issue.path = [pathItem];
                  dataset.issues?.push(issue);
                }
                if (!dataset.issues) dataset.issues = valueDataset.issues;
                if (config$1.abortEarly) {
                  dataset.typed = false;
                  break;
                }
              }
              if (!valueDataset.typed) dataset.typed = false;
              dataset.value[key] = valueDataset.value;
            } else if (valueSchema.fallback !== void 0) dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
            else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
              _addIssue(this, "key", dataset, config$1, {
                input: void 0,
                expected: `"${key}"`,
                path: [{
                  type: "object",
                  origin: "key",
                  input,
                  key,
                  value: input[key]
                }]
              });
              if (config$1.abortEarly) break;
            }
          }
        } else _addIssue(this, "type", dataset, config$1);
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function optional(wrapped, default_) {
    return {
      kind: "schema",
      type: "optional",
      reference: optional,
      expects: `(${wrapped.expects} | undefined)`,
      async: false,
      wrapped,
      default: default_,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        if (dataset.value === void 0) {
          if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
          if (dataset.value === void 0) {
            dataset.typed = true;
            return dataset;
          }
        }
        return this.wrapped["~run"](dataset, config$1);
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function record(key, value$1, message$1) {
    return {
      kind: "schema",
      type: "record",
      reference: record,
      expects: "Object",
      async: false,
      key,
      value: value$1,
      message: message$1,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        const input = dataset.value;
        if (input && typeof input === "object") {
          dataset.typed = true;
          dataset.value = {};
          for (const entryKey in input) if (/* @__PURE__ */ _isValidObjectKey(input, entryKey)) {
            const entryValue = input[entryKey];
            const keyDataset = this.key["~run"]({ value: entryKey }, config$1);
            if (keyDataset.issues) {
              const pathItem = {
                type: "object",
                origin: "key",
                input,
                key: entryKey,
                value: entryValue
              };
              for (const issue of keyDataset.issues) {
                issue.path = [pathItem];
                dataset.issues?.push(issue);
              }
              if (!dataset.issues) dataset.issues = keyDataset.issues;
              if (config$1.abortEarly) {
                dataset.typed = false;
                break;
              }
            }
            const valueDataset = this.value["~run"]({ value: entryValue }, config$1);
            if (valueDataset.issues) {
              const pathItem = {
                type: "object",
                origin: "value",
                input,
                key: entryKey,
                value: entryValue
              };
              for (const issue of valueDataset.issues) {
                if (issue.path) issue.path.unshift(pathItem);
                else issue.path = [pathItem];
                dataset.issues?.push(issue);
              }
              if (!dataset.issues) dataset.issues = valueDataset.issues;
              if (config$1.abortEarly) {
                dataset.typed = false;
                break;
              }
            }
            if (!keyDataset.typed || !valueDataset.typed) dataset.typed = false;
            if (keyDataset.typed) dataset.value[keyDataset.value] = valueDataset.value;
          }
        } else _addIssue(this, "type", dataset, config$1);
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function string(message$1) {
    return {
      kind: "schema",
      type: "string",
      reference: string,
      expects: "string",
      async: false,
      message: message$1,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        if (typeof dataset.value === "string") dataset.typed = true;
        else _addIssue(this, "type", dataset, config$1);
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function tuple(items, message$1) {
    return {
      kind: "schema",
      type: "tuple",
      reference: tuple,
      expects: "Array",
      async: false,
      items,
      message: message$1,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        const input = dataset.value;
        if (Array.isArray(input)) {
          dataset.typed = true;
          dataset.value = [];
          for (let key = 0; key < this.items.length; key++) {
            const value$1 = input[key];
            const itemDataset = this.items[key]["~run"]({ value: value$1 }, config$1);
            if (itemDataset.issues) {
              const pathItem = {
                type: "array",
                origin: "value",
                input,
                key,
                value: value$1
              };
              for (const issue of itemDataset.issues) {
                if (issue.path) issue.path.unshift(pathItem);
                else issue.path = [pathItem];
                dataset.issues?.push(issue);
              }
              if (!dataset.issues) dataset.issues = itemDataset.issues;
              if (config$1.abortEarly) {
                dataset.typed = false;
                break;
              }
            }
            if (!itemDataset.typed) dataset.typed = false;
            dataset.value.push(itemDataset.value);
          }
        } else _addIssue(this, "type", dataset, config$1);
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function _subIssues(datasets) {
    let issues;
    if (datasets) for (const dataset of datasets) if (issues) issues.push(...dataset.issues);
    else issues = dataset.issues;
    return issues;
  }
  // @__NO_SIDE_EFFECTS__
  function union(options, message$1) {
    return {
      kind: "schema",
      type: "union",
      reference: union,
      expects: /* @__PURE__ */ _joinExpects(options.map((option2) => option2.expects), "|"),
      async: false,
      options,
      message: message$1,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        let validDataset;
        let typedDatasets;
        let untypedDatasets;
        for (const schema of this.options) {
          const optionDataset = schema["~run"]({ value: dataset.value }, config$1);
          if (optionDataset.typed) if (optionDataset.issues) if (typedDatasets) typedDatasets.push(optionDataset);
          else typedDatasets = [optionDataset];
          else {
            validDataset = optionDataset;
            break;
          }
          else if (untypedDatasets) untypedDatasets.push(optionDataset);
          else untypedDatasets = [optionDataset];
        }
        if (validDataset) return validDataset;
        if (typedDatasets) {
          if (typedDatasets.length === 1) return typedDatasets[0];
          _addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(typedDatasets) });
          dataset.typed = true;
        } else if (untypedDatasets?.length === 1) return untypedDatasets[0];
        else _addIssue(this, "type", dataset, config$1, { issues: /* @__PURE__ */ _subIssues(untypedDatasets) });
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function unknown() {
    return {
      kind: "schema",
      type: "unknown",
      reference: unknown,
      expects: "unknown",
      async: false,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset) {
        dataset.typed = true;
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function variant(key, options, message$1) {
    return {
      kind: "schema",
      type: "variant",
      reference: variant,
      expects: "Object",
      async: false,
      key,
      options,
      message: message$1,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        const input = dataset.value;
        if (input && typeof input === "object") {
          let outputDataset;
          let maxDiscriminatorPriority = 0;
          let invalidDiscriminatorKey = this.key;
          let expectedDiscriminators = [];
          const parseOptions = (variant$1, allKeys) => {
            for (const schema of variant$1.options) {
              if (schema.type === "variant") parseOptions(schema, new Set(allKeys).add(schema.key));
              else {
                let keysAreValid = true;
                let currentPriority = 0;
                for (const currentKey of allKeys) {
                  const discriminatorSchema = schema.entries[currentKey];
                  if (currentKey in input ? discriminatorSchema["~run"]({
                    typed: false,
                    value: input[currentKey]
                  }, { abortEarly: true }).issues : discriminatorSchema.type !== "exact_optional" && discriminatorSchema.type !== "optional" && discriminatorSchema.type !== "nullish") {
                    keysAreValid = false;
                    if (invalidDiscriminatorKey !== currentKey && (maxDiscriminatorPriority < currentPriority || maxDiscriminatorPriority === currentPriority && currentKey in input && !(invalidDiscriminatorKey in input))) {
                      maxDiscriminatorPriority = currentPriority;
                      invalidDiscriminatorKey = currentKey;
                      expectedDiscriminators = [];
                    }
                    if (invalidDiscriminatorKey === currentKey) expectedDiscriminators.push(schema.entries[currentKey].expects);
                    break;
                  }
                  currentPriority++;
                }
                if (keysAreValid) {
                  const optionDataset = schema["~run"]({ value: input }, config$1);
                  if (!outputDataset || !outputDataset.typed && optionDataset.typed) outputDataset = optionDataset;
                }
              }
              if (outputDataset && !outputDataset.issues) break;
            }
          };
          parseOptions(this, /* @__PURE__ */ new Set([this.key]));
          if (outputDataset) return outputDataset;
          _addIssue(this, "type", dataset, config$1, {
            input: input[invalidDiscriminatorKey],
            expected: /* @__PURE__ */ _joinExpects(expectedDiscriminators, "|"),
            path: [{
              type: "object",
              origin: "value",
              input,
              key: invalidDiscriminatorKey,
              value: input[invalidDiscriminatorKey]
            }]
          });
        } else _addIssue(this, "type", dataset, config$1);
        return dataset;
      }
    };
  }
  function parse(schema, input, config$1) {
    const dataset = schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config$1));
    if (dataset.issues) throw new ValiError(dataset.issues);
    return dataset.value;
  }
  // @__NO_SIDE_EFFECTS__
  function pipe(...pipe$1) {
    return {
      ...pipe$1[0],
      pipe: pipe$1,
      get "~standard"() {
        return /* @__PURE__ */ _getStandardProps(this);
      },
      "~run"(dataset, config$1) {
        for (const item of pipe$1) if (item.kind !== "metadata") {
          if (dataset.issues && (item.kind === "schema" || item.kind === "transformation")) {
            dataset.typed = false;
            break;
          }
          if (!dataset.issues || !config$1.abortEarly && !config$1.abortPipeEarly) dataset = item["~run"](dataset, config$1);
        }
        return dataset;
      }
    };
  }
  // @__NO_SIDE_EFFECTS__
  function safeParse(schema, input, config$1) {
    const dataset = schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config$1));
    return {
      typed: dataset.typed,
      success: !dataset.issues,
      output: dataset.value,
      issues: dataset.issues
    };
  }

  // node_modules/@mysten/sui/dist/transactions/data/internal.mjs
  function safeEnum(options) {
    return union(Object.keys(options).map((key) => withKind(key, object({ [key]: options[key] }))));
  }
  function withKind(key, schema) {
    return pipe(object({
      ...schema.entries,
      $kind: optional(literal(key))
    }), transform((value) => ({
      ...value,
      $kind: key
    })));
  }
  var SuiAddress = pipe(string(), transform((value) => normalizeSuiAddress(value)), check(isValidSuiAddress));
  var ObjectID = SuiAddress;
  var BCSBytes = string();
  var JsonU64 = pipe(union([string(), pipe(number(), integer())]), check((val) => {
    try {
      BigInt(val);
      return BigInt(val) >= 0 && BigInt(val) <= 18446744073709551615n;
    } catch {
      return false;
    }
  }, "Invalid u64"));
  var U32 = pipe(number(), integer(), check((val) => val >= 0 && val < 2 ** 32, "Invalid u32"));
  var ObjectRefSchema = object({
    objectId: SuiAddress,
    version: JsonU64,
    digest: string()
  });
  var ArgumentSchema = union([
    withKind("GasCoin", object({ GasCoin: literal(true) })),
    withKind("Input", object({
      Input: pipe(number(), integer()),
      type: optional(union([
        literal("pure"),
        literal("object"),
        literal("withdrawal")
      ]))
    })),
    withKind("Result", object({ Result: pipe(number(), integer()) })),
    withKind("NestedResult", object({ NestedResult: tuple([pipe(number(), integer()), pipe(number(), integer())]) }))
  ]);
  var GasDataSchema = object({
    budget: nullable(JsonU64),
    price: nullable(JsonU64),
    owner: nullable(SuiAddress),
    payment: nullable(array(ObjectRefSchema))
  });
  var StructTagSchema = object({
    address: string(),
    module: string(),
    name: string(),
    typeParams: array(string())
  });
  var OpenSignatureBodySchema = union([
    object({ $kind: literal("address") }),
    object({ $kind: literal("bool") }),
    object({ $kind: literal("u8") }),
    object({ $kind: literal("u16") }),
    object({ $kind: literal("u32") }),
    object({ $kind: literal("u64") }),
    object({ $kind: literal("u128") }),
    object({ $kind: literal("u256") }),
    object({ $kind: literal("unknown") }),
    object({
      $kind: literal("vector"),
      vector: lazy(() => OpenSignatureBodySchema)
    }),
    object({
      $kind: literal("datatype"),
      datatype: object({
        typeName: string(),
        typeParameters: array(lazy(() => OpenSignatureBodySchema))
      })
    }),
    object({
      $kind: literal("typeParameter"),
      index: pipe(number(), integer())
    })
  ]);
  var OpenSignatureSchema = object({
    reference: nullable(union([
      literal("mutable"),
      literal("immutable"),
      literal("unknown")
    ])),
    body: OpenSignatureBodySchema
  });
  var ProgrammableMoveCallSchema = object({
    package: ObjectID,
    module: string(),
    function: string(),
    typeArguments: array(string()),
    arguments: array(ArgumentSchema),
    _argumentTypes: optional(nullable(array(OpenSignatureSchema)))
  });
  var $Intent = object({
    name: string(),
    inputs: record(string(), union([ArgumentSchema, array(ArgumentSchema)])),
    data: record(string(), unknown())
  });
  var CommandSchema = safeEnum({
    MoveCall: ProgrammableMoveCallSchema,
    TransferObjects: object({
      objects: array(ArgumentSchema),
      address: ArgumentSchema
    }),
    SplitCoins: object({
      coin: ArgumentSchema,
      amounts: array(ArgumentSchema)
    }),
    MergeCoins: object({
      destination: ArgumentSchema,
      sources: array(ArgumentSchema)
    }),
    Publish: object({
      modules: array(BCSBytes),
      dependencies: array(ObjectID)
    }),
    MakeMoveVec: object({
      type: nullable(string()),
      elements: array(ArgumentSchema)
    }),
    Upgrade: object({
      modules: array(BCSBytes),
      dependencies: array(ObjectID),
      package: ObjectID,
      ticket: ArgumentSchema
    }),
    $Intent
  });
  var ObjectArgSchema = safeEnum({
    ImmOrOwnedObject: ObjectRefSchema,
    SharedObject: object({
      objectId: ObjectID,
      initialSharedVersion: JsonU64,
      mutable: boolean()
    }),
    Receiving: ObjectRefSchema
  });
  var ReservationSchema = safeEnum({ MaxAmountU64: JsonU64 });
  var WithdrawalTypeArgSchema = safeEnum({ Balance: string() });
  var WithdrawFromSchema = safeEnum({
    Sender: literal(true),
    Sponsor: literal(true)
  });
  var FundsWithdrawalArgSchema = object({
    reservation: ReservationSchema,
    typeArg: WithdrawalTypeArgSchema,
    withdrawFrom: WithdrawFromSchema
  });
  var CallArgSchema = safeEnum({
    Object: ObjectArgSchema,
    Pure: object({ bytes: BCSBytes }),
    UnresolvedPure: object({ value: unknown() }),
    UnresolvedObject: object({
      objectId: ObjectID,
      version: optional(nullable(JsonU64)),
      digest: optional(nullable(string())),
      initialSharedVersion: optional(nullable(JsonU64)),
      mutable: optional(nullable(boolean()))
    }),
    FundsWithdrawal: FundsWithdrawalArgSchema
  });
  var NormalizedCallArg = safeEnum({
    Object: ObjectArgSchema,
    Pure: object({ bytes: BCSBytes })
  });
  var ValidDuringSchema = object({
    minEpoch: nullable(JsonU64),
    maxEpoch: nullable(JsonU64),
    minTimestamp: nullable(JsonU64),
    maxTimestamp: nullable(JsonU64),
    chain: string(),
    nonce: U32
  });
  var TransactionExpiration2 = safeEnum({
    None: literal(true),
    Epoch: JsonU64,
    ValidDuring: ValidDuringSchema
  });
  var TransactionDataSchema = object({
    version: literal(2),
    sender: nullish(SuiAddress),
    expiration: nullish(TransactionExpiration2),
    gasData: GasDataSchema,
    inputs: array(CallArgSchema),
    commands: array(CommandSchema)
  });

  // node_modules/@mysten/sui/dist/transactions/utils.mjs
  function getIdFromCallArg(arg) {
    if (typeof arg === "string") return normalizeSuiAddress(arg);
    if (arg.Object) {
      if (arg.Object.ImmOrOwnedObject) return normalizeSuiAddress(arg.Object.ImmOrOwnedObject.objectId);
      if (arg.Object.Receiving) return normalizeSuiAddress(arg.Object.Receiving.objectId);
      return normalizeSuiAddress(arg.Object.SharedObject.objectId);
    }
    if (arg.UnresolvedObject) return normalizeSuiAddress(arg.UnresolvedObject.objectId);
  }
  function remapCommandArguments(command, inputMapping, commandMapping) {
    const remapArg = (arg) => {
      switch (arg.$kind) {
        case "Input": {
          const newInputIndex = inputMapping.get(arg.Input);
          if (newInputIndex === void 0) throw new Error(`Input ${arg.Input} not found in input mapping`);
          return {
            ...arg,
            Input: newInputIndex
          };
        }
        case "Result": {
          const newCommandIndex = commandMapping.get(arg.Result);
          if (newCommandIndex !== void 0) return {
            ...arg,
            Result: newCommandIndex
          };
          return arg;
        }
        case "NestedResult": {
          const newCommandIndex = commandMapping.get(arg.NestedResult[0]);
          if (newCommandIndex !== void 0) return {
            ...arg,
            NestedResult: [newCommandIndex, arg.NestedResult[1]]
          };
          return arg;
        }
        default:
          return arg;
      }
    };
    switch (command.$kind) {
      case "MoveCall":
        command.MoveCall.arguments = command.MoveCall.arguments.map(remapArg);
        break;
      case "TransferObjects":
        command.TransferObjects.objects = command.TransferObjects.objects.map(remapArg);
        command.TransferObjects.address = remapArg(command.TransferObjects.address);
        break;
      case "SplitCoins":
        command.SplitCoins.coin = remapArg(command.SplitCoins.coin);
        command.SplitCoins.amounts = command.SplitCoins.amounts.map(remapArg);
        break;
      case "MergeCoins":
        command.MergeCoins.destination = remapArg(command.MergeCoins.destination);
        command.MergeCoins.sources = command.MergeCoins.sources.map(remapArg);
        break;
      case "MakeMoveVec":
        command.MakeMoveVec.elements = command.MakeMoveVec.elements.map(remapArg);
        break;
      case "Upgrade":
        command.Upgrade.ticket = remapArg(command.Upgrade.ticket);
        break;
      case "$Intent": {
        const inputs = command.$Intent.inputs;
        command.$Intent.inputs = {};
        for (const [key, value] of Object.entries(inputs)) command.$Intent.inputs[key] = Array.isArray(value) ? value.map(remapArg) : remapArg(value);
        break;
      }
      case "Publish":
        break;
    }
  }

  // node_modules/@mysten/sui/dist/transactions/data/v1.mjs
  var ObjectRef = object({
    digest: string(),
    objectId: string(),
    version: union([
      pipe(number(), integer()),
      string(),
      bigint()
    ])
  });
  var ObjectArg2 = safeEnum({
    ImmOrOwned: ObjectRef,
    Shared: object({
      objectId: ObjectID,
      initialSharedVersion: JsonU64,
      mutable: boolean()
    }),
    Receiving: ObjectRef
  });
  var NormalizedCallArg2 = safeEnum({
    Object: ObjectArg2,
    Pure: array(pipe(number(), integer()))
  });
  var TransactionInput = union([object({
    kind: literal("Input"),
    index: pipe(number(), integer()),
    value: unknown(),
    type: optional(literal("object"))
  }), object({
    kind: literal("Input"),
    index: pipe(number(), integer()),
    value: unknown(),
    type: literal("pure")
  })]);
  var TransactionExpiration3 = union([object({ Epoch: pipe(number(), integer()) }), object({ None: nullable(literal(true)) })]);
  var StringEncodedBigint = pipe(union([
    number(),
    string(),
    bigint()
  ]), check((val) => {
    if (![
      "string",
      "number",
      "bigint"
    ].includes(typeof val)) return false;
    try {
      BigInt(val);
      return true;
    } catch {
      return false;
    }
  }));
  var TypeTag2 = union([
    object({ bool: nullable(literal(true)) }),
    object({ u8: nullable(literal(true)) }),
    object({ u64: nullable(literal(true)) }),
    object({ u128: nullable(literal(true)) }),
    object({ address: nullable(literal(true)) }),
    object({ signer: nullable(literal(true)) }),
    object({ vector: lazy(() => TypeTag2) }),
    object({ struct: lazy(() => StructTag2) }),
    object({ u16: nullable(literal(true)) }),
    object({ u32: nullable(literal(true)) }),
    object({ u256: nullable(literal(true)) })
  ]);
  var StructTag2 = object({
    address: string(),
    module: string(),
    name: string(),
    typeParams: array(TypeTag2)
  });
  var GasConfig = object({
    budget: optional(StringEncodedBigint),
    price: optional(StringEncodedBigint),
    payment: optional(array(ObjectRef)),
    owner: optional(string())
  });
  var TransactionArgumentTypes = [
    TransactionInput,
    object({ kind: literal("GasCoin") }),
    object({
      kind: literal("Result"),
      index: pipe(number(), integer())
    }),
    object({
      kind: literal("NestedResult"),
      index: pipe(number(), integer()),
      resultIndex: pipe(number(), integer())
    })
  ];
  var TransactionArgument = union([...TransactionArgumentTypes]);
  var MoveCallTransaction = object({
    kind: literal("MoveCall"),
    target: pipe(string(), check((target) => target.split("::").length === 3)),
    typeArguments: array(string()),
    arguments: array(TransactionArgument)
  });
  var TransferObjectsTransaction = object({
    kind: literal("TransferObjects"),
    objects: array(TransactionArgument),
    address: TransactionArgument
  });
  var SplitCoinsTransaction = object({
    kind: literal("SplitCoins"),
    coin: TransactionArgument,
    amounts: array(TransactionArgument)
  });
  var MergeCoinsTransaction = object({
    kind: literal("MergeCoins"),
    destination: TransactionArgument,
    sources: array(TransactionArgument)
  });
  var MakeMoveVecTransaction = object({
    kind: literal("MakeMoveVec"),
    type: union([object({ Some: TypeTag2 }), object({ None: nullable(literal(true)) })]),
    objects: array(TransactionArgument)
  });
  var TransactionType = union([...[
    MoveCallTransaction,
    TransferObjectsTransaction,
    SplitCoinsTransaction,
    MergeCoinsTransaction,
    object({
      kind: literal("Publish"),
      modules: array(array(pipe(number(), integer()))),
      dependencies: array(string())
    }),
    object({
      kind: literal("Upgrade"),
      modules: array(array(pipe(number(), integer()))),
      dependencies: array(string()),
      packageId: string(),
      ticket: TransactionArgument
    }),
    MakeMoveVecTransaction
  ]]);
  var SerializedTransactionDataV1 = object({
    version: literal(1),
    sender: optional(string()),
    expiration: nullish(TransactionExpiration3),
    gasConfig: GasConfig,
    inputs: array(TransactionInput),
    transactions: array(TransactionType)
  });
  function serializeV1TransactionData(transactionData) {
    const inputs = transactionData.inputs.map((input, index) => {
      if (input.Object) return {
        kind: "Input",
        index,
        value: { Object: input.Object.ImmOrOwnedObject ? { ImmOrOwned: input.Object.ImmOrOwnedObject } : input.Object.Receiving ? { Receiving: {
          digest: input.Object.Receiving.digest,
          version: input.Object.Receiving.version,
          objectId: input.Object.Receiving.objectId
        } } : { Shared: {
          mutable: input.Object.SharedObject.mutable,
          initialSharedVersion: input.Object.SharedObject.initialSharedVersion,
          objectId: input.Object.SharedObject.objectId
        } } },
        type: "object"
      };
      if (input.Pure) return {
        kind: "Input",
        index,
        value: { Pure: Array.from(fromBase64(input.Pure.bytes)) },
        type: "pure"
      };
      if (input.UnresolvedPure) return {
        kind: "Input",
        type: "pure",
        index,
        value: input.UnresolvedPure.value
      };
      if (input.UnresolvedObject) return {
        kind: "Input",
        type: "object",
        index,
        value: input.UnresolvedObject.objectId
      };
      throw new Error("Invalid input");
    });
    return {
      version: 1,
      sender: transactionData.sender ?? void 0,
      expiration: transactionData.expiration?.$kind === "Epoch" ? { Epoch: Number(transactionData.expiration.Epoch) } : transactionData.expiration ? { None: true } : null,
      gasConfig: {
        owner: transactionData.gasData.owner ?? void 0,
        budget: transactionData.gasData.budget ?? void 0,
        price: transactionData.gasData.price ?? void 0,
        payment: transactionData.gasData.payment ?? void 0
      },
      inputs,
      transactions: transactionData.commands.map((command) => {
        if (command.MakeMoveVec) return {
          kind: "MakeMoveVec",
          type: command.MakeMoveVec.type === null ? { None: true } : { Some: TypeTagSerializer.parseFromStr(command.MakeMoveVec.type) },
          objects: command.MakeMoveVec.elements.map((arg) => convertTransactionArgument(arg, inputs))
        };
        if (command.MergeCoins) return {
          kind: "MergeCoins",
          destination: convertTransactionArgument(command.MergeCoins.destination, inputs),
          sources: command.MergeCoins.sources.map((arg) => convertTransactionArgument(arg, inputs))
        };
        if (command.MoveCall) return {
          kind: "MoveCall",
          target: `${command.MoveCall.package}::${command.MoveCall.module}::${command.MoveCall.function}`,
          typeArguments: command.MoveCall.typeArguments,
          arguments: command.MoveCall.arguments.map((arg) => convertTransactionArgument(arg, inputs))
        };
        if (command.Publish) return {
          kind: "Publish",
          modules: command.Publish.modules.map((mod2) => Array.from(fromBase64(mod2))),
          dependencies: command.Publish.dependencies
        };
        if (command.SplitCoins) return {
          kind: "SplitCoins",
          coin: convertTransactionArgument(command.SplitCoins.coin, inputs),
          amounts: command.SplitCoins.amounts.map((arg) => convertTransactionArgument(arg, inputs))
        };
        if (command.TransferObjects) return {
          kind: "TransferObjects",
          objects: command.TransferObjects.objects.map((arg) => convertTransactionArgument(arg, inputs)),
          address: convertTransactionArgument(command.TransferObjects.address, inputs)
        };
        if (command.Upgrade) return {
          kind: "Upgrade",
          modules: command.Upgrade.modules.map((mod2) => Array.from(fromBase64(mod2))),
          dependencies: command.Upgrade.dependencies,
          packageId: command.Upgrade.package,
          ticket: convertTransactionArgument(command.Upgrade.ticket, inputs)
        };
        throw new Error(`Unknown transaction ${Object.keys(command)}`);
      })
    };
  }
  function convertTransactionArgument(arg, inputs) {
    if (arg.$kind === "GasCoin") return { kind: "GasCoin" };
    if (arg.$kind === "Result") return {
      kind: "Result",
      index: arg.Result
    };
    if (arg.$kind === "NestedResult") return {
      kind: "NestedResult",
      index: arg.NestedResult[0],
      resultIndex: arg.NestedResult[1]
    };
    if (arg.$kind === "Input") return inputs[arg.Input];
    throw new Error(`Invalid argument ${Object.keys(arg)}`);
  }
  function transactionDataFromV1(data) {
    return parse(TransactionDataSchema, {
      version: 2,
      sender: data.sender ?? null,
      expiration: data.expiration ? "Epoch" in data.expiration ? { Epoch: data.expiration.Epoch } : { None: true } : null,
      gasData: {
        owner: data.gasConfig.owner ?? null,
        budget: data.gasConfig.budget?.toString() ?? null,
        price: data.gasConfig.price?.toString() ?? null,
        payment: data.gasConfig.payment?.map((ref) => ({
          digest: ref.digest,
          objectId: ref.objectId,
          version: ref.version.toString()
        })) ?? null
      },
      inputs: data.inputs.map((input) => {
        if (input.kind === "Input") {
          if (is(NormalizedCallArg2, input.value)) {
            const value = parse(NormalizedCallArg2, input.value);
            if (value.Object) {
              if (value.Object.ImmOrOwned) return { Object: { ImmOrOwnedObject: {
                objectId: value.Object.ImmOrOwned.objectId,
                version: String(value.Object.ImmOrOwned.version),
                digest: value.Object.ImmOrOwned.digest
              } } };
              if (value.Object.Shared) return { Object: { SharedObject: {
                mutable: value.Object.Shared.mutable ?? null,
                initialSharedVersion: value.Object.Shared.initialSharedVersion,
                objectId: value.Object.Shared.objectId
              } } };
              if (value.Object.Receiving) return { Object: { Receiving: {
                digest: value.Object.Receiving.digest,
                version: String(value.Object.Receiving.version),
                objectId: value.Object.Receiving.objectId
              } } };
              throw new Error("Invalid object input");
            }
            return { Pure: { bytes: toBase64(new Uint8Array(value.Pure)) } };
          }
          if (input.type === "object") return { UnresolvedObject: { objectId: input.value } };
          return { UnresolvedPure: { value: input.value } };
        }
        throw new Error("Invalid input");
      }),
      commands: data.transactions.map((transaction) => {
        switch (transaction.kind) {
          case "MakeMoveVec":
            return { MakeMoveVec: {
              type: "Some" in transaction.type ? TypeTagSerializer.tagToString(transaction.type.Some) : null,
              elements: transaction.objects.map((arg) => parseV1TransactionArgument(arg))
            } };
          case "MergeCoins":
            return { MergeCoins: {
              destination: parseV1TransactionArgument(transaction.destination),
              sources: transaction.sources.map((arg) => parseV1TransactionArgument(arg))
            } };
          case "MoveCall": {
            const [pkg, mod2, fn] = transaction.target.split("::");
            return { MoveCall: {
              package: pkg,
              module: mod2,
              function: fn,
              typeArguments: transaction.typeArguments,
              arguments: transaction.arguments.map((arg) => parseV1TransactionArgument(arg))
            } };
          }
          case "Publish":
            return { Publish: {
              modules: transaction.modules.map((mod2) => toBase64(Uint8Array.from(mod2))),
              dependencies: transaction.dependencies
            } };
          case "SplitCoins":
            return { SplitCoins: {
              coin: parseV1TransactionArgument(transaction.coin),
              amounts: transaction.amounts.map((arg) => parseV1TransactionArgument(arg))
            } };
          case "TransferObjects":
            return { TransferObjects: {
              objects: transaction.objects.map((arg) => parseV1TransactionArgument(arg)),
              address: parseV1TransactionArgument(transaction.address)
            } };
          case "Upgrade":
            return { Upgrade: {
              modules: transaction.modules.map((mod2) => toBase64(Uint8Array.from(mod2))),
              dependencies: transaction.dependencies,
              package: transaction.packageId,
              ticket: parseV1TransactionArgument(transaction.ticket)
            } };
        }
        throw new Error(`Unknown transaction ${Object.keys(transaction)}`);
      })
    });
  }
  function parseV1TransactionArgument(arg) {
    switch (arg.kind) {
      case "GasCoin":
        return { GasCoin: true };
      case "Result":
        return { Result: arg.index };
      case "NestedResult":
        return { NestedResult: [arg.index, arg.resultIndex] };
      case "Input":
        return { Input: arg.index };
    }
  }

  // node_modules/@noble/hashes/utils.js
  function isBytes2(a3) {
    return a3 instanceof Uint8Array || ArrayBuffer.isView(a3) && a3.constructor.name === "Uint8Array";
  }
  function anumber2(n6, title = "") {
    if (!Number.isSafeInteger(n6) || n6 < 0) {
      const prefix = title && `"${title}" `;
      throw new Error(`${prefix}expected integer >= 0, got ${n6}`);
    }
  }
  function abytes(value, length, title = "") {
    const bytes = isBytes2(value);
    const len = value?.length;
    const needsLen = length !== void 0;
    if (!bytes || needsLen && len !== length) {
      const prefix = title && `"${title}" `;
      const ofLen = needsLen ? ` of length ${length}` : "";
      const got = bytes ? `length=${len}` : `type=${typeof value}`;
      throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
    }
    return value;
  }
  function ahash(h4) {
    if (typeof h4 !== "function" || typeof h4.create !== "function")
      throw new Error("Hash must wrapped by utils.createHasher");
    anumber2(h4.outputLen);
    anumber2(h4.blockLen);
  }
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function aoutput(out, instance) {
    abytes(out, void 0, "digestInto() output");
    const min2 = instance.outputLen;
    if (out.length < min2) {
      throw new Error('"digestInto() output" expected to be of length >=' + min2);
    }
  }
  function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
  }
  function clean2(...arrays) {
    for (let i7 = 0; i7 < arrays.length; i7++) {
      arrays[i7].fill(0);
    }
  }
  function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  var isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
  function byteSwap(word) {
    return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
  }
  var swap8IfBE = isLE ? (n6) => n6 : (n6) => byteSwap(n6);
  function byteSwap32(arr) {
    for (let i7 = 0; i7 < arr.length; i7++) {
      arr[i7] = byteSwap(arr[i7]);
    }
    return arr;
  }
  var swap32IfBE = isLE ? (u3) => u3 : byteSwap32;
  var hasHexBuiltin = /* @__PURE__ */ (() => (
    // @ts-ignore
    typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
  ))();
  var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_2, i7) => i7.toString(16).padStart(2, "0"));
  function bytesToHex(bytes) {
    abytes(bytes);
    if (hasHexBuiltin)
      return bytes.toHex();
    let hex = "";
    for (let i7 = 0; i7 < bytes.length; i7++) {
      hex += hexes[bytes[i7]];
    }
    return hex;
  }
  var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function asciiToBase16(ch) {
    if (ch >= asciis._0 && ch <= asciis._9)
      return ch - asciis._0;
    if (ch >= asciis.A && ch <= asciis.F)
      return ch - (asciis.A - 10);
    if (ch >= asciis.a && ch <= asciis.f)
      return ch - (asciis.a - 10);
    return;
  }
  function hexToBytes(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    if (hasHexBuiltin)
      return Uint8Array.fromHex(hex);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2)
      throw new Error("hex string expected, got unpadded hex of length " + hl);
    const array2 = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = asciiToBase16(hex.charCodeAt(hi));
      const n22 = asciiToBase16(hex.charCodeAt(hi + 1));
      if (n1 === void 0 || n22 === void 0) {
        const char = hex[hi] + hex[hi + 1];
        throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
      }
      array2[ai] = n1 * 16 + n22;
    }
    return array2;
  }
  function utf8ToBytes(str) {
    if (typeof str !== "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function kdfInputToBytes(data, errorTitle = "") {
    if (typeof data === "string")
      return utf8ToBytes(data);
    return abytes(data, void 0, errorTitle);
  }
  function concatBytes(...arrays) {
    let sum = 0;
    for (let i7 = 0; i7 < arrays.length; i7++) {
      const a3 = arrays[i7];
      abytes(a3);
      sum += a3.length;
    }
    const res = new Uint8Array(sum);
    for (let i7 = 0, pad = 0; i7 < arrays.length; i7++) {
      const a3 = arrays[i7];
      res.set(a3, pad);
      pad += a3.length;
    }
    return res;
  }
  function checkOpts(defaults, opts) {
    if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
      throw new Error("options must be object or undefined");
    const merged = Object.assign(defaults, opts);
    return merged;
  }
  function createHasher(hashCons, info = {}) {
    const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
    const tmp = hashCons(void 0);
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    Object.assign(hashC, info);
    return Object.freeze(hashC);
  }
  function randomBytes(bytesLength = 32) {
    const cr = typeof globalThis === "object" ? globalThis.crypto : null;
    if (typeof cr?.getRandomValues !== "function")
      throw new Error("crypto.getRandomValues must be defined");
    return cr.getRandomValues(new Uint8Array(bytesLength));
  }
  var oidNist = (suffix) => ({
    oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
  });

  // node_modules/@noble/hashes/_blake.js
  var BSIGMA = /* @__PURE__ */ Uint8Array.from([
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    14,
    10,
    4,
    8,
    9,
    15,
    13,
    6,
    1,
    12,
    0,
    2,
    11,
    7,
    5,
    3,
    11,
    8,
    12,
    0,
    5,
    2,
    15,
    13,
    10,
    14,
    3,
    6,
    7,
    1,
    9,
    4,
    7,
    9,
    3,
    1,
    13,
    12,
    11,
    14,
    2,
    6,
    5,
    10,
    4,
    0,
    15,
    8,
    9,
    0,
    5,
    7,
    2,
    4,
    10,
    15,
    14,
    1,
    11,
    12,
    6,
    8,
    3,
    13,
    2,
    12,
    6,
    10,
    0,
    11,
    8,
    3,
    4,
    13,
    7,
    5,
    15,
    14,
    1,
    9,
    12,
    5,
    1,
    15,
    14,
    13,
    4,
    10,
    0,
    7,
    6,
    3,
    9,
    2,
    8,
    11,
    13,
    11,
    7,
    14,
    12,
    1,
    3,
    9,
    5,
    0,
    15,
    4,
    8,
    6,
    2,
    10,
    6,
    15,
    14,
    9,
    11,
    3,
    0,
    8,
    12,
    2,
    13,
    7,
    1,
    4,
    10,
    5,
    10,
    2,
    8,
    4,
    7,
    6,
    1,
    5,
    15,
    11,
    9,
    14,
    3,
    12,
    13,
    0,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    14,
    10,
    4,
    8,
    9,
    15,
    13,
    6,
    1,
    12,
    0,
    2,
    11,
    7,
    5,
    3,
    // Blake1, unused in others
    11,
    8,
    12,
    0,
    5,
    2,
    15,
    13,
    10,
    14,
    3,
    6,
    7,
    1,
    9,
    4,
    7,
    9,
    3,
    1,
    13,
    12,
    11,
    14,
    2,
    6,
    5,
    10,
    4,
    0,
    15,
    8,
    9,
    0,
    5,
    7,
    2,
    4,
    10,
    15,
    14,
    1,
    11,
    12,
    6,
    8,
    3,
    13,
    2,
    12,
    6,
    10,
    0,
    11,
    8,
    3,
    4,
    13,
    7,
    5,
    15,
    14,
    1,
    9
  ]);

  // node_modules/@noble/hashes/_md.js
  var HashMD = class {
    constructor(blockLen, outputLen, padOffset, isLE2) {
      __publicField(this, "blockLen");
      __publicField(this, "outputLen");
      __publicField(this, "padOffset");
      __publicField(this, "isLE");
      // For partial updates less than block size
      __publicField(this, "buffer");
      __publicField(this, "view");
      __publicField(this, "finished", false);
      __publicField(this, "length", 0);
      __publicField(this, "pos", 0);
      __publicField(this, "destroyed", false);
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE2;
      this.buffer = new Uint8Array(blockLen);
      this.view = createView(this.buffer);
    }
    update(data) {
      aexists(this);
      abytes(data);
      const { view, buffer, blockLen } = this;
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = createView(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          continue;
        }
        buffer.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
        }
      }
      this.length += data.length;
      this.roundClean();
      return this;
    }
    digestInto(out) {
      aexists(this);
      aoutput(out, this);
      this.finished = true;
      const { buffer, view, blockLen, isLE: isLE2 } = this;
      let { pos } = this;
      buffer[pos++] = 128;
      clean2(this.buffer.subarray(pos));
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        pos = 0;
      }
      for (let i7 = pos; i7 < blockLen; i7++)
        buffer[i7] = 0;
      view.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE2);
      this.process(view, 0);
      const oview = createView(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen must be aligned to 32bit");
      const outLen = len / 4;
      const state = this.get();
      if (outLen > state.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i7 = 0; i7 < outLen; i7++)
        oview.setUint32(4 * i7, state[i7], isLE2);
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to) {
      to || (to = new this.constructor());
      to.set(...this.get());
      const { blockLen, buffer, length, finished, destroyed, pos } = this;
      to.destroyed = destroyed;
      to.finished = finished;
      to.length = length;
      to.pos = pos;
      if (length % blockLen)
        to.buffer.set(buffer);
      return to;
    }
    clone() {
      return this._cloneInto();
    }
  };
  var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
    1779033703,
    4089235720,
    3144134277,
    2227873595,
    1013904242,
    4271175723,
    2773480762,
    1595750129,
    1359893119,
    2917565137,
    2600822924,
    725511199,
    528734635,
    4215389547,
    1541459225,
    327033209
  ]);

  // node_modules/@noble/hashes/_u64.js
  var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
  var _32n = /* @__PURE__ */ BigInt(32);
  function fromBig(n6, le = false) {
    if (le)
      return { h: Number(n6 & U32_MASK64), l: Number(n6 >> _32n & U32_MASK64) };
    return { h: Number(n6 >> _32n & U32_MASK64) | 0, l: Number(n6 & U32_MASK64) | 0 };
  }
  function split(lst, le = false) {
    const len = lst.length;
    let Ah = new Uint32Array(len);
    let Al = new Uint32Array(len);
    for (let i7 = 0; i7 < len; i7++) {
      const { h: h4, l: l3 } = fromBig(lst[i7], le);
      [Ah[i7], Al[i7]] = [h4, l3];
    }
    return [Ah, Al];
  }
  var shrSH = (h4, _l, s5) => h4 >>> s5;
  var shrSL = (h4, l3, s5) => h4 << 32 - s5 | l3 >>> s5;
  var rotrSH = (h4, l3, s5) => h4 >>> s5 | l3 << 32 - s5;
  var rotrSL = (h4, l3, s5) => h4 << 32 - s5 | l3 >>> s5;
  var rotrBH = (h4, l3, s5) => h4 << 64 - s5 | l3 >>> s5 - 32;
  var rotrBL = (h4, l3, s5) => h4 >>> s5 - 32 | l3 << 64 - s5;
  var rotr32H = (_h, l3) => l3;
  var rotr32L = (h4, _l) => h4;
  function add(Ah, Al, Bh, Bl) {
    const l3 = (Al >>> 0) + (Bl >>> 0);
    return { h: Ah + Bh + (l3 / 2 ** 32 | 0) | 0, l: l3 | 0 };
  }
  var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
  var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
  var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
  var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
  var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
  var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;

  // node_modules/@noble/hashes/blake2.js
  var B2B_IV = /* @__PURE__ */ Uint32Array.from([
    4089235720,
    1779033703,
    2227873595,
    3144134277,
    4271175723,
    1013904242,
    1595750129,
    2773480762,
    2917565137,
    1359893119,
    725511199,
    2600822924,
    4215389547,
    528734635,
    327033209,
    1541459225
  ]);
  var BBUF = /* @__PURE__ */ new Uint32Array(32);
  function G1b(a3, b3, c4, d3, msg, x2) {
    const Xl = msg[x2], Xh = msg[x2 + 1];
    let Al = BBUF[2 * a3], Ah = BBUF[2 * a3 + 1];
    let Bl = BBUF[2 * b3], Bh = BBUF[2 * b3 + 1];
    let Cl = BBUF[2 * c4], Ch = BBUF[2 * c4 + 1];
    let Dl = BBUF[2 * d3], Dh = BBUF[2 * d3 + 1];
    let ll = add3L(Al, Bl, Xl);
    Ah = add3H(ll, Ah, Bh, Xh);
    Al = ll | 0;
    ({ Dh, Dl } = { Dh: Dh ^ Ah, Dl: Dl ^ Al });
    ({ Dh, Dl } = { Dh: rotr32H(Dh, Dl), Dl: rotr32L(Dh, Dl) });
    ({ h: Ch, l: Cl } = add(Ch, Cl, Dh, Dl));
    ({ Bh, Bl } = { Bh: Bh ^ Ch, Bl: Bl ^ Cl });
    ({ Bh, Bl } = { Bh: rotrSH(Bh, Bl, 24), Bl: rotrSL(Bh, Bl, 24) });
    BBUF[2 * a3] = Al, BBUF[2 * a3 + 1] = Ah;
    BBUF[2 * b3] = Bl, BBUF[2 * b3 + 1] = Bh;
    BBUF[2 * c4] = Cl, BBUF[2 * c4 + 1] = Ch;
    BBUF[2 * d3] = Dl, BBUF[2 * d3 + 1] = Dh;
  }
  function G2b(a3, b3, c4, d3, msg, x2) {
    const Xl = msg[x2], Xh = msg[x2 + 1];
    let Al = BBUF[2 * a3], Ah = BBUF[2 * a3 + 1];
    let Bl = BBUF[2 * b3], Bh = BBUF[2 * b3 + 1];
    let Cl = BBUF[2 * c4], Ch = BBUF[2 * c4 + 1];
    let Dl = BBUF[2 * d3], Dh = BBUF[2 * d3 + 1];
    let ll = add3L(Al, Bl, Xl);
    Ah = add3H(ll, Ah, Bh, Xh);
    Al = ll | 0;
    ({ Dh, Dl } = { Dh: Dh ^ Ah, Dl: Dl ^ Al });
    ({ Dh, Dl } = { Dh: rotrSH(Dh, Dl, 16), Dl: rotrSL(Dh, Dl, 16) });
    ({ h: Ch, l: Cl } = add(Ch, Cl, Dh, Dl));
    ({ Bh, Bl } = { Bh: Bh ^ Ch, Bl: Bl ^ Cl });
    ({ Bh, Bl } = { Bh: rotrBH(Bh, Bl, 63), Bl: rotrBL(Bh, Bl, 63) });
    BBUF[2 * a3] = Al, BBUF[2 * a3 + 1] = Ah;
    BBUF[2 * b3] = Bl, BBUF[2 * b3 + 1] = Bh;
    BBUF[2 * c4] = Cl, BBUF[2 * c4 + 1] = Ch;
    BBUF[2 * d3] = Dl, BBUF[2 * d3 + 1] = Dh;
  }
  function checkBlake2Opts(outputLen, opts = {}, keyLen, saltLen, persLen) {
    anumber2(keyLen);
    if (outputLen < 0 || outputLen > keyLen)
      throw new Error("outputLen bigger than keyLen");
    const { key, salt, personalization } = opts;
    if (key !== void 0 && (key.length < 1 || key.length > keyLen))
      throw new Error('"key" expected to be undefined or of length=1..' + keyLen);
    if (salt !== void 0)
      abytes(salt, saltLen, "salt");
    if (personalization !== void 0)
      abytes(personalization, persLen, "personalization");
  }
  var _BLAKE2 = class {
    constructor(blockLen, outputLen) {
      __publicField(this, "buffer");
      __publicField(this, "buffer32");
      __publicField(this, "finished", false);
      __publicField(this, "destroyed", false);
      __publicField(this, "length", 0);
      __publicField(this, "pos", 0);
      __publicField(this, "blockLen");
      __publicField(this, "outputLen");
      anumber2(blockLen);
      anumber2(outputLen);
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.buffer = new Uint8Array(blockLen);
      this.buffer32 = u32(this.buffer);
    }
    update(data) {
      aexists(this);
      abytes(data);
      const { blockLen, buffer, buffer32 } = this;
      const len = data.length;
      const offset3 = data.byteOffset;
      const buf = data.buffer;
      for (let pos = 0; pos < len; ) {
        if (this.pos === blockLen) {
          swap32IfBE(buffer32);
          this.compress(buffer32, 0, false);
          swap32IfBE(buffer32);
          this.pos = 0;
        }
        const take = Math.min(blockLen - this.pos, len - pos);
        const dataOffset = offset3 + pos;
        if (take === blockLen && !(dataOffset % 4) && pos + take < len) {
          const data32 = new Uint32Array(buf, dataOffset, Math.floor((len - pos) / 4));
          swap32IfBE(data32);
          for (let pos32 = 0; pos + blockLen < len; pos32 += buffer32.length, pos += blockLen) {
            this.length += blockLen;
            this.compress(data32, pos32, false);
          }
          swap32IfBE(data32);
          continue;
        }
        buffer.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        this.length += take;
        pos += take;
      }
      return this;
    }
    digestInto(out) {
      aexists(this);
      aoutput(out, this);
      const { pos, buffer32 } = this;
      this.finished = true;
      clean2(this.buffer.subarray(pos));
      swap32IfBE(buffer32);
      this.compress(buffer32, 0, true);
      swap32IfBE(buffer32);
      const out32 = u32(out);
      this.get().forEach((v2, i7) => out32[i7] = swap8IfBE(v2));
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to) {
      const { buffer, length, finished, destroyed, outputLen, pos } = this;
      to || (to = new this.constructor({ dkLen: outputLen }));
      to.set(...this.get());
      to.buffer.set(buffer);
      to.destroyed = destroyed;
      to.finished = finished;
      to.length = length;
      to.pos = pos;
      to.outputLen = outputLen;
      return to;
    }
    clone() {
      return this._cloneInto();
    }
  };
  var _BLAKE2b = class extends _BLAKE2 {
    constructor(opts = {}) {
      const olen = opts.dkLen === void 0 ? 64 : opts.dkLen;
      super(128, olen);
      // Same as SHA-512, but LE
      __publicField(this, "v0l", B2B_IV[0] | 0);
      __publicField(this, "v0h", B2B_IV[1] | 0);
      __publicField(this, "v1l", B2B_IV[2] | 0);
      __publicField(this, "v1h", B2B_IV[3] | 0);
      __publicField(this, "v2l", B2B_IV[4] | 0);
      __publicField(this, "v2h", B2B_IV[5] | 0);
      __publicField(this, "v3l", B2B_IV[6] | 0);
      __publicField(this, "v3h", B2B_IV[7] | 0);
      __publicField(this, "v4l", B2B_IV[8] | 0);
      __publicField(this, "v4h", B2B_IV[9] | 0);
      __publicField(this, "v5l", B2B_IV[10] | 0);
      __publicField(this, "v5h", B2B_IV[11] | 0);
      __publicField(this, "v6l", B2B_IV[12] | 0);
      __publicField(this, "v6h", B2B_IV[13] | 0);
      __publicField(this, "v7l", B2B_IV[14] | 0);
      __publicField(this, "v7h", B2B_IV[15] | 0);
      checkBlake2Opts(olen, opts, 64, 16, 16);
      let { key, personalization, salt } = opts;
      let keyLength = 0;
      if (key !== void 0) {
        abytes(key, void 0, "key");
        keyLength = key.length;
      }
      this.v0l ^= this.outputLen | keyLength << 8 | 1 << 16 | 1 << 24;
      if (salt !== void 0) {
        abytes(salt, void 0, "salt");
        const slt = u32(salt);
        this.v4l ^= swap8IfBE(slt[0]);
        this.v4h ^= swap8IfBE(slt[1]);
        this.v5l ^= swap8IfBE(slt[2]);
        this.v5h ^= swap8IfBE(slt[3]);
      }
      if (personalization !== void 0) {
        abytes(personalization, void 0, "personalization");
        const pers = u32(personalization);
        this.v6l ^= swap8IfBE(pers[0]);
        this.v6h ^= swap8IfBE(pers[1]);
        this.v7l ^= swap8IfBE(pers[2]);
        this.v7h ^= swap8IfBE(pers[3]);
      }
      if (key !== void 0) {
        const tmp = new Uint8Array(this.blockLen);
        tmp.set(key);
        this.update(tmp);
      }
    }
    // prettier-ignore
    get() {
      let { v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h } = this;
      return [v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h];
    }
    // prettier-ignore
    set(v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h) {
      this.v0l = v0l | 0;
      this.v0h = v0h | 0;
      this.v1l = v1l | 0;
      this.v1h = v1h | 0;
      this.v2l = v2l | 0;
      this.v2h = v2h | 0;
      this.v3l = v3l | 0;
      this.v3h = v3h | 0;
      this.v4l = v4l | 0;
      this.v4h = v4h | 0;
      this.v5l = v5l | 0;
      this.v5h = v5h | 0;
      this.v6l = v6l | 0;
      this.v6h = v6h | 0;
      this.v7l = v7l | 0;
      this.v7h = v7h | 0;
    }
    compress(msg, offset3, isLast) {
      this.get().forEach((v2, i7) => BBUF[i7] = v2);
      BBUF.set(B2B_IV, 16);
      let { h: h4, l: l3 } = fromBig(BigInt(this.length));
      BBUF[24] = B2B_IV[8] ^ l3;
      BBUF[25] = B2B_IV[9] ^ h4;
      if (isLast) {
        BBUF[28] = ~BBUF[28];
        BBUF[29] = ~BBUF[29];
      }
      let j = 0;
      const s5 = BSIGMA;
      for (let i7 = 0; i7 < 12; i7++) {
        G1b(0, 4, 8, 12, msg, offset3 + 2 * s5[j++]);
        G2b(0, 4, 8, 12, msg, offset3 + 2 * s5[j++]);
        G1b(1, 5, 9, 13, msg, offset3 + 2 * s5[j++]);
        G2b(1, 5, 9, 13, msg, offset3 + 2 * s5[j++]);
        G1b(2, 6, 10, 14, msg, offset3 + 2 * s5[j++]);
        G2b(2, 6, 10, 14, msg, offset3 + 2 * s5[j++]);
        G1b(3, 7, 11, 15, msg, offset3 + 2 * s5[j++]);
        G2b(3, 7, 11, 15, msg, offset3 + 2 * s5[j++]);
        G1b(0, 5, 10, 15, msg, offset3 + 2 * s5[j++]);
        G2b(0, 5, 10, 15, msg, offset3 + 2 * s5[j++]);
        G1b(1, 6, 11, 12, msg, offset3 + 2 * s5[j++]);
        G2b(1, 6, 11, 12, msg, offset3 + 2 * s5[j++]);
        G1b(2, 7, 8, 13, msg, offset3 + 2 * s5[j++]);
        G2b(2, 7, 8, 13, msg, offset3 + 2 * s5[j++]);
        G1b(3, 4, 9, 14, msg, offset3 + 2 * s5[j++]);
        G2b(3, 4, 9, 14, msg, offset3 + 2 * s5[j++]);
      }
      this.v0l ^= BBUF[0] ^ BBUF[16];
      this.v0h ^= BBUF[1] ^ BBUF[17];
      this.v1l ^= BBUF[2] ^ BBUF[18];
      this.v1h ^= BBUF[3] ^ BBUF[19];
      this.v2l ^= BBUF[4] ^ BBUF[20];
      this.v2h ^= BBUF[5] ^ BBUF[21];
      this.v3l ^= BBUF[6] ^ BBUF[22];
      this.v3h ^= BBUF[7] ^ BBUF[23];
      this.v4l ^= BBUF[8] ^ BBUF[24];
      this.v4h ^= BBUF[9] ^ BBUF[25];
      this.v5l ^= BBUF[10] ^ BBUF[26];
      this.v5h ^= BBUF[11] ^ BBUF[27];
      this.v6l ^= BBUF[12] ^ BBUF[28];
      this.v6h ^= BBUF[13] ^ BBUF[29];
      this.v7l ^= BBUF[14] ^ BBUF[30];
      this.v7h ^= BBUF[15] ^ BBUF[31];
      clean2(BBUF);
    }
    destroy() {
      this.destroyed = true;
      clean2(this.buffer32);
      this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  };
  var blake2b = /* @__PURE__ */ createHasher((opts) => new _BLAKE2b(opts));

  // node_modules/@mysten/sui/dist/transactions/hash.mjs
  function hashTypedData(typeTag, data) {
    const typeTagBytes = Array.from(`${typeTag}::`).map((e9) => e9.charCodeAt(0));
    const dataWithTag = new Uint8Array(typeTagBytes.length + data.length);
    dataWithTag.set(typeTagBytes);
    dataWithTag.set(data, typeTagBytes.length);
    return blake2b(dataWithTag, { dkLen: 32 });
  }

  // node_modules/@mysten/sui/dist/transactions/TransactionData.mjs
  function prepareSuiAddress(address) {
    return normalizeSuiAddress(address).replace("0x", "");
  }
  var TransactionDataBuilder = class TransactionDataBuilder2 {
    static fromKindBytes(bytes) {
      const programmableTx = suiBcs.TransactionKind.parse(bytes).ProgrammableTransaction;
      if (!programmableTx) throw new Error("Unable to deserialize from bytes.");
      return TransactionDataBuilder2.restore({
        version: 2,
        sender: null,
        expiration: null,
        gasData: {
          budget: null,
          owner: null,
          payment: null,
          price: null
        },
        inputs: programmableTx.inputs,
        commands: programmableTx.commands
      });
    }
    static fromBytes(bytes) {
      const data = suiBcs.TransactionData.parse(bytes)?.V1;
      const programmableTx = data.kind.ProgrammableTransaction;
      if (!data || !programmableTx) throw new Error("Unable to deserialize from bytes.");
      return TransactionDataBuilder2.restore({
        version: 2,
        sender: data.sender,
        expiration: data.expiration,
        gasData: data.gasData,
        inputs: programmableTx.inputs,
        commands: programmableTx.commands
      });
    }
    static restore(data) {
      if (data.version === 2) return new TransactionDataBuilder2(parse(TransactionDataSchema, data));
      else return new TransactionDataBuilder2(parse(TransactionDataSchema, transactionDataFromV1(data)));
    }
    /**
    * Generate transaction digest.
    *
    * @param bytes BCS serialized transaction data
    * @returns transaction digest.
    */
    static getDigestFromBytes(bytes) {
      return toBase58(hashTypedData("TransactionData", bytes));
    }
    constructor(clone) {
      this.version = 2;
      this.sender = clone?.sender ?? null;
      this.expiration = clone?.expiration ?? null;
      this.inputs = clone?.inputs ?? [];
      this.commands = clone?.commands ?? [];
      this.gasData = clone?.gasData ?? {
        budget: null,
        price: null,
        owner: null,
        payment: null
      };
    }
    build({ maxSizeBytes = Infinity, overrides, onlyTransactionKind } = {}) {
      const inputs = this.inputs;
      const commands = this.commands;
      const kind = { ProgrammableTransaction: {
        inputs,
        commands
      } };
      if (onlyTransactionKind) return suiBcs.TransactionKind.serialize(kind, { maxSize: maxSizeBytes }).toBytes();
      const expiration = overrides?.expiration ?? this.expiration;
      const sender = overrides?.sender ?? this.sender;
      const gasData = {
        ...this.gasData,
        ...overrides?.gasData
      };
      if (!sender) throw new Error("Missing transaction sender");
      if (!gasData.budget) throw new Error("Missing gas budget");
      if (!gasData.payment) throw new Error("Missing gas payment");
      if (!gasData.price) throw new Error("Missing gas price");
      const transactionData = {
        sender: prepareSuiAddress(sender),
        expiration: expiration ? expiration : { None: true },
        gasData: {
          payment: gasData.payment,
          owner: prepareSuiAddress(this.gasData.owner ?? sender),
          price: BigInt(gasData.price),
          budget: BigInt(gasData.budget)
        },
        kind: { ProgrammableTransaction: {
          inputs,
          commands
        } }
      };
      return suiBcs.TransactionData.serialize({ V1: transactionData }, { maxSize: maxSizeBytes }).toBytes();
    }
    addInput(type, arg) {
      const index = this.inputs.length;
      this.inputs.push(arg);
      return {
        Input: index,
        type,
        $kind: "Input"
      };
    }
    getInputUses(index, fn) {
      this.mapArguments((arg, command) => {
        if (arg.$kind === "Input" && arg.Input === index) fn(arg, command);
        return arg;
      });
    }
    mapCommandArguments(index, fn) {
      const command = this.commands[index];
      switch (command.$kind) {
        case "MoveCall":
          command.MoveCall.arguments = command.MoveCall.arguments.map((arg) => fn(arg, command, index));
          break;
        case "TransferObjects":
          command.TransferObjects.objects = command.TransferObjects.objects.map((arg) => fn(arg, command, index));
          command.TransferObjects.address = fn(command.TransferObjects.address, command, index);
          break;
        case "SplitCoins":
          command.SplitCoins.coin = fn(command.SplitCoins.coin, command, index);
          command.SplitCoins.amounts = command.SplitCoins.amounts.map((arg) => fn(arg, command, index));
          break;
        case "MergeCoins":
          command.MergeCoins.destination = fn(command.MergeCoins.destination, command, index);
          command.MergeCoins.sources = command.MergeCoins.sources.map((arg) => fn(arg, command, index));
          break;
        case "MakeMoveVec":
          command.MakeMoveVec.elements = command.MakeMoveVec.elements.map((arg) => fn(arg, command, index));
          break;
        case "Upgrade":
          command.Upgrade.ticket = fn(command.Upgrade.ticket, command, index);
          break;
        case "$Intent":
          const inputs = command.$Intent.inputs;
          command.$Intent.inputs = {};
          for (const [key, value] of Object.entries(inputs)) command.$Intent.inputs[key] = Array.isArray(value) ? value.map((arg) => fn(arg, command, index)) : fn(value, command, index);
          break;
        case "Publish":
          break;
        default:
          throw new Error(`Unexpected transaction kind: ${command.$kind}`);
      }
    }
    mapArguments(fn) {
      for (const commandIndex of this.commands.keys()) this.mapCommandArguments(commandIndex, fn);
    }
    replaceCommand(index, replacement, resultIndex = index) {
      if (!Array.isArray(replacement)) {
        this.commands[index] = replacement;
        return;
      }
      const sizeDiff = replacement.length - 1;
      this.commands.splice(index, 1, ...structuredClone(replacement));
      this.mapArguments((arg, _command, commandIndex) => {
        if (commandIndex < index + replacement.length) return arg;
        if (typeof resultIndex !== "number") {
          if (arg.$kind === "Result" && arg.Result === index || arg.$kind === "NestedResult" && arg.NestedResult[0] === index) if (!("NestedResult" in arg) || arg.NestedResult[1] === 0) return parse(ArgumentSchema, structuredClone(resultIndex));
          else throw new Error(`Cannot replace command ${index} with a specific result type: NestedResult[${index}, ${arg.NestedResult[1]}] references a nested element that cannot be mapped to the replacement result`);
        }
        switch (arg.$kind) {
          case "Result":
            if (arg.Result === index && typeof resultIndex === "number") arg.Result = resultIndex;
            if (arg.Result > index) arg.Result += sizeDiff;
            break;
          case "NestedResult":
            if (arg.NestedResult[0] === index && typeof resultIndex === "number") return {
              $kind: "NestedResult",
              NestedResult: [resultIndex, arg.NestedResult[1]]
            };
            if (arg.NestedResult[0] > index) arg.NestedResult[0] += sizeDiff;
            break;
        }
        return arg;
      });
    }
    replaceCommandWithTransaction(index, otherTransaction, result) {
      if (result.$kind !== "Result" && result.$kind !== "NestedResult") throw new Error("Result must be of kind Result or NestedResult");
      this.insertTransaction(index, otherTransaction);
      this.replaceCommand(index + otherTransaction.commands.length, [], "Result" in result ? { NestedResult: [result.Result + index, 0] } : { NestedResult: [result.NestedResult[0] + index, result.NestedResult[1]] });
    }
    insertTransaction(atCommandIndex, otherTransaction) {
      const inputMapping = /* @__PURE__ */ new Map();
      const commandMapping = /* @__PURE__ */ new Map();
      for (let i7 = 0; i7 < otherTransaction.inputs.length; i7++) {
        const otherInput = otherTransaction.inputs[i7];
        const id = getIdFromCallArg(otherInput);
        let existingIndex = -1;
        if (id !== void 0) {
          existingIndex = this.inputs.findIndex((input) => getIdFromCallArg(input) === id);
          if (existingIndex !== -1 && this.inputs[existingIndex].Object?.SharedObject && otherInput.Object?.SharedObject) this.inputs[existingIndex].Object.SharedObject.mutable = this.inputs[existingIndex].Object.SharedObject.mutable || otherInput.Object.SharedObject.mutable;
        }
        if (existingIndex !== -1) inputMapping.set(i7, existingIndex);
        else {
          const newIndex = this.inputs.length;
          this.inputs.push(otherInput);
          inputMapping.set(i7, newIndex);
        }
      }
      for (let i7 = 0; i7 < otherTransaction.commands.length; i7++) commandMapping.set(i7, atCommandIndex + i7);
      const remappedCommands = [];
      for (let i7 = 0; i7 < otherTransaction.commands.length; i7++) {
        const command = structuredClone(otherTransaction.commands[i7]);
        remapCommandArguments(command, inputMapping, commandMapping);
        remappedCommands.push(command);
      }
      this.commands.splice(atCommandIndex, 0, ...remappedCommands);
      const sizeDiff = remappedCommands.length;
      if (sizeDiff > 0) this.mapArguments((arg, _command, commandIndex) => {
        if (commandIndex >= atCommandIndex && commandIndex < atCommandIndex + remappedCommands.length) return arg;
        switch (arg.$kind) {
          case "Result":
            if (arg.Result >= atCommandIndex) arg.Result += sizeDiff;
            break;
          case "NestedResult":
            if (arg.NestedResult[0] >= atCommandIndex) arg.NestedResult[0] += sizeDiff;
            break;
        }
        return arg;
      });
    }
    getDigest() {
      const bytes = this.build({ onlyTransactionKind: false });
      return TransactionDataBuilder2.getDigestFromBytes(bytes);
    }
    snapshot() {
      return parse(TransactionDataSchema, this);
    }
    shallowClone() {
      return new TransactionDataBuilder2({
        version: this.version,
        sender: this.sender,
        expiration: this.expiration,
        gasData: { ...this.gasData },
        inputs: [...this.inputs],
        commands: [...this.commands]
      });
    }
    applyResolvedData(resolved) {
      if (!this.sender) this.sender = resolved.sender ?? null;
      if (!this.expiration) this.expiration = resolved.expiration ?? null;
      if (!this.gasData.budget) this.gasData.budget = resolved.gasData.budget;
      if (!this.gasData.owner) this.gasData.owner = resolved.gasData.owner ?? null;
      if (!this.gasData.payment) this.gasData.payment = resolved.gasData.payment;
      if (!this.gasData.price) this.gasData.price = resolved.gasData.price;
      for (let i7 = 0; i7 < this.inputs.length; i7++) {
        const input = this.inputs[i7];
        const resolvedInput = resolved.inputs[i7];
        switch (input.$kind) {
          case "UnresolvedPure":
            if (resolvedInput.$kind !== "Pure") throw new Error(`Expected input at index ${i7} to resolve to a Pure argument, but got ${JSON.stringify(resolvedInput)}`);
            this.inputs[i7] = resolvedInput;
            break;
          case "UnresolvedObject":
            if (resolvedInput.$kind !== "Object") throw new Error(`Expected input at index ${i7} to resolve to an Object argument, but got ${JSON.stringify(resolvedInput)}`);
            if (resolvedInput.Object.$kind === "ImmOrOwnedObject" || resolvedInput.Object.$kind === "Receiving") {
              const original = input.UnresolvedObject;
              const resolved$1 = resolvedInput.Object.ImmOrOwnedObject ?? resolvedInput.Object.Receiving;
              if (normalizeSuiAddress(original.objectId) !== normalizeSuiAddress(resolved$1.objectId) || original.version != null && original.version !== resolved$1.version || original.digest != null && original.digest !== resolved$1.digest || original.mutable != null || original.initialSharedVersion != null) throw new Error(`Input at index ${i7} did not match unresolved object. ${JSON.stringify(original)} is not compatible with ${JSON.stringify(resolved$1)}`);
            } else if (resolvedInput.Object.$kind === "SharedObject") {
              const original = input.UnresolvedObject;
              const resolved$1 = resolvedInput.Object.SharedObject;
              if (normalizeSuiAddress(original.objectId) !== normalizeSuiAddress(resolved$1.objectId) || original.initialSharedVersion != null && original.initialSharedVersion !== resolved$1.initialSharedVersion || original.mutable != null && original.mutable !== resolved$1.mutable || original.version != null || original.digest != null) throw new Error(`Input at index ${i7} did not match unresolved object. ${JSON.stringify(original)} is not compatible with ${JSON.stringify(resolved$1)}`);
            } else throw new Error(`Input at index ${i7} resolved to an unexpected Object kind: ${JSON.stringify(resolvedInput.Object)}`);
            this.inputs[i7] = resolvedInput;
            break;
        }
      }
    }
  };

  // node_modules/@mysten/sui/dist/transactions/Commands.mjs
  var TransactionCommands = {
    MoveCall(input) {
      const [pkg, mod2 = "", fn = ""] = "target" in input ? input.target.split("::") : [
        input.package,
        input.module,
        input.function
      ];
      return {
        $kind: "MoveCall",
        MoveCall: {
          package: pkg,
          module: mod2,
          function: fn,
          typeArguments: input.typeArguments ?? [],
          arguments: input.arguments ?? []
        }
      };
    },
    TransferObjects(objects, address) {
      return {
        $kind: "TransferObjects",
        TransferObjects: {
          objects: objects.map((o6) => parse(ArgumentSchema, o6)),
          address: parse(ArgumentSchema, address)
        }
      };
    },
    SplitCoins(coin, amounts) {
      return {
        $kind: "SplitCoins",
        SplitCoins: {
          coin: parse(ArgumentSchema, coin),
          amounts: amounts.map((o6) => parse(ArgumentSchema, o6))
        }
      };
    },
    MergeCoins(destination, sources) {
      return {
        $kind: "MergeCoins",
        MergeCoins: {
          destination: parse(ArgumentSchema, destination),
          sources: sources.map((o6) => parse(ArgumentSchema, o6))
        }
      };
    },
    Publish({ modules, dependencies }) {
      return {
        $kind: "Publish",
        Publish: {
          modules: modules.map((module) => typeof module === "string" ? module : toBase64(new Uint8Array(module))),
          dependencies: dependencies.map((dep) => normalizeSuiObjectId(dep))
        }
      };
    },
    Upgrade({ modules, dependencies, package: packageId, ticket }) {
      return {
        $kind: "Upgrade",
        Upgrade: {
          modules: modules.map((module) => typeof module === "string" ? module : toBase64(new Uint8Array(module))),
          dependencies: dependencies.map((dep) => normalizeSuiObjectId(dep)),
          package: packageId,
          ticket: parse(ArgumentSchema, ticket)
        }
      };
    },
    MakeMoveVec({ type, elements }) {
      return {
        $kind: "MakeMoveVec",
        MakeMoveVec: {
          type: type ?? null,
          elements: elements.map((o6) => parse(ArgumentSchema, o6))
        }
      };
    },
    Intent({ name, inputs = {}, data = {} }) {
      return {
        $kind: "$Intent",
        $Intent: {
          name,
          inputs: Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, Array.isArray(value) ? value.map((o6) => parse(ArgumentSchema, o6)) : parse(ArgumentSchema, value)])),
          data
        }
      };
    }
  };

  // node_modules/@mysten/sui/dist/transactions/Inputs.mjs
  function Pure(data) {
    return {
      $kind: "Pure",
      Pure: { bytes: data instanceof Uint8Array ? toBase64(data) : data.toBase64() }
    };
  }
  var Inputs = {
    Pure,
    ObjectRef({ objectId, digest, version }) {
      return {
        $kind: "Object",
        Object: {
          $kind: "ImmOrOwnedObject",
          ImmOrOwnedObject: {
            digest,
            version,
            objectId: normalizeSuiAddress(objectId)
          }
        }
      };
    },
    SharedObjectRef({ objectId, mutable, initialSharedVersion }) {
      return {
        $kind: "Object",
        Object: {
          $kind: "SharedObject",
          SharedObject: {
            mutable,
            initialSharedVersion,
            objectId: normalizeSuiAddress(objectId)
          }
        }
      };
    },
    ReceivingRef({ objectId, digest, version }) {
      return {
        $kind: "Object",
        Object: {
          $kind: "Receiving",
          Receiving: {
            digest,
            version,
            objectId: normalizeSuiAddress(objectId)
          }
        }
      };
    },
    FundsWithdrawal({ reservation, typeArg, withdrawFrom }) {
      return {
        $kind: "FundsWithdrawal",
        FundsWithdrawal: {
          reservation,
          typeArg,
          withdrawFrom
        }
      };
    }
  };

  // node_modules/@mysten/sui/dist/utils/constants.mjs
  var MIST_PER_SUI = BigInt(1e9);
  var MOVE_STDLIB_ADDRESS = "0x0000000000000000000000000000000000000000000000000000000000000001";
  var SUI_FRAMEWORK_ADDRESS = "0x0000000000000000000000000000000000000000000000000000000000000002";
  var SUI_SYSTEM_ADDRESS = "0x0000000000000000000000000000000000000000000000000000000000000003";
  var SUI_CLOCK_OBJECT_ID = "0x0000000000000000000000000000000000000000000000000000000000000006";
  var SUI_TYPE_ARG = `${SUI_FRAMEWORK_ADDRESS}::sui::SUI`;
  var SUI_SYSTEM_STATE_OBJECT_ID = "0x0000000000000000000000000000000000000000000000000000000000000005";
  var SUI_RANDOM_OBJECT_ID = "0x0000000000000000000000000000000000000000000000000000000000000008";
  var SUI_DENY_LIST_OBJECT_ID = "0x0000000000000000000000000000000000000000000000000000000000000403";

  // node_modules/@mysten/sui/dist/transactions/serializer.mjs
  function parseTypeName(typeName) {
    const parts = typeName.split("::");
    if (parts.length !== 3) throw new Error(`Invalid type name format: ${typeName}`);
    return {
      package: parts[0],
      module: parts[1],
      name: parts[2]
    };
  }
  function isTxContext(param) {
    if (param.body.$kind !== "datatype") return false;
    const { package: pkg, module, name } = parseTypeName(param.body.datatype.typeName);
    return normalizeSuiAddress(pkg) === SUI_FRAMEWORK_ADDRESS && module === "tx_context" && name === "TxContext";
  }
  function getPureBcsSchema(typeSignature) {
    switch (typeSignature.$kind) {
      case "address":
        return suiBcs.Address;
      case "bool":
        return suiBcs.Bool;
      case "u8":
        return suiBcs.U8;
      case "u16":
        return suiBcs.U16;
      case "u32":
        return suiBcs.U32;
      case "u64":
        return suiBcs.U64;
      case "u128":
        return suiBcs.U128;
      case "u256":
        return suiBcs.U256;
      case "vector": {
        if (typeSignature.vector.$kind === "u8") return suiBcs.byteVector().transform({
          input: (val) => typeof val === "string" ? new TextEncoder().encode(val) : val,
          output: (val) => val
        });
        const type = getPureBcsSchema(typeSignature.vector);
        return type ? suiBcs.vector(type) : null;
      }
      case "datatype": {
        const { package: pkg, module, name } = parseTypeName(typeSignature.datatype.typeName);
        const normalizedPkg = normalizeSuiAddress(pkg);
        if (normalizedPkg === MOVE_STDLIB_ADDRESS) {
          if (module === "ascii" && name === "String") return suiBcs.String;
          if (module === "string" && name === "String") return suiBcs.String;
          if (module === "option" && name === "Option") {
            const type = getPureBcsSchema(typeSignature.datatype.typeParameters[0]);
            return type ? suiBcs.vector(type) : null;
          }
        }
        if (normalizedPkg === SUI_FRAMEWORK_ADDRESS) {
          if (module === "object" && name === "ID") return suiBcs.Address;
        }
        return null;
      }
      case "typeParameter":
      case "unknown":
        return null;
    }
  }

  // node_modules/@mysten/sui/dist/transactions/intents/CoinWithBalance.mjs
  var COIN_WITH_BALANCE = "CoinWithBalance";
  var SUI_TYPE = normalizeStructTag("0x2::sui::SUI");
  var CoinWithBalanceData = object({
    type: string(),
    balance: bigint()
  });
  async function resolveCoinBalance(transactionData, buildOptions, next) {
    const coinTypes = /* @__PURE__ */ new Set();
    const totalByType = /* @__PURE__ */ new Map();
    if (!transactionData.sender) throw new Error("Sender must be set to resolve CoinWithBalance");
    for (const command of transactionData.commands) if (command.$kind === "$Intent" && command.$Intent.name === COIN_WITH_BALANCE) {
      const { type, balance } = parse(CoinWithBalanceData, command.$Intent.data);
      if (type !== "gas" && balance > 0n) coinTypes.add(type);
      totalByType.set(type, (totalByType.get(type) ?? 0n) + balance);
    }
    const usedIds = /* @__PURE__ */ new Set();
    for (const input of transactionData.inputs) {
      if (input.Object?.ImmOrOwnedObject) usedIds.add(input.Object.ImmOrOwnedObject.objectId);
      if (input.UnresolvedObject?.objectId) usedIds.add(input.UnresolvedObject.objectId);
    }
    const coinsByType = /* @__PURE__ */ new Map();
    const addressBalanceByType = /* @__PURE__ */ new Map();
    const client = buildOptions.client;
    if (!client) throw new Error("Client must be provided to build or serialize transactions with CoinWithBalance intents");
    await Promise.all([...[...coinTypes].map(async (coinType) => {
      const { coins, addressBalance } = await getCoinsAndBalanceOfType({
        coinType,
        balance: totalByType.get(coinType),
        client,
        owner: transactionData.sender,
        usedIds
      });
      coinsByType.set(coinType, coins);
      addressBalanceByType.set(coinType, addressBalance);
    }), totalByType.has("gas") ? await client.core.getBalance({
      owner: transactionData.sender,
      coinType: SUI_TYPE
    }).then(({ balance }) => {
      addressBalanceByType.set("gas", BigInt(balance.addressBalance));
    }) : null]);
    const mergedCoins = /* @__PURE__ */ new Map();
    for (const [index, transaction] of transactionData.commands.entries()) {
      if (transaction.$kind !== "$Intent" || transaction.$Intent.name !== COIN_WITH_BALANCE) continue;
      const { type, balance } = transaction.$Intent.data;
      if (balance === 0n) {
        transactionData.replaceCommand(index, TransactionCommands.MoveCall({
          target: "0x2::coin::zero",
          typeArguments: [type === "gas" ? SUI_TYPE : type]
        }));
        continue;
      }
      const commands = [];
      if (addressBalanceByType.get(type) >= totalByType.get(type)) commands.push(TransactionCommands.MoveCall({
        target: "0x2::coin::redeem_funds",
        typeArguments: [type === "gas" ? SUI_TYPE : type],
        arguments: [transactionData.addInput("withdrawal", Inputs.FundsWithdrawal({
          reservation: {
            $kind: "MaxAmountU64",
            MaxAmountU64: String(balance)
          },
          typeArg: {
            $kind: "Balance",
            Balance: type === "gas" ? SUI_TYPE : type
          },
          withdrawFrom: {
            $kind: "Sender",
            Sender: true
          }
        }))]
      }));
      else {
        if (!mergedCoins.has(type)) {
          const addressBalance = addressBalanceByType.get(type) ?? 0n;
          const coinType = type === "gas" ? SUI_TYPE : type;
          let baseCoin;
          let restCoins;
          if (type === "gas") {
            baseCoin = {
              $kind: "GasCoin",
              GasCoin: true
            };
            restCoins = [];
          } else [baseCoin, ...restCoins] = coinsByType.get(type).map((coin) => transactionData.addInput("object", Inputs.ObjectRef({
            objectId: coin.objectId,
            digest: coin.digest,
            version: coin.version
          })));
          if (addressBalance > 0n) {
            commands.push(TransactionCommands.MoveCall({
              target: "0x2::coin::redeem_funds",
              typeArguments: [coinType],
              arguments: [transactionData.addInput("withdrawal", Inputs.FundsWithdrawal({
                reservation: {
                  $kind: "MaxAmountU64",
                  MaxAmountU64: String(addressBalance)
                },
                typeArg: {
                  $kind: "Balance",
                  Balance: coinType
                },
                withdrawFrom: {
                  $kind: "Sender",
                  Sender: true
                }
              }))]
            }));
            commands.push(TransactionCommands.MergeCoins(baseCoin, [{
              $kind: "Result",
              Result: index + commands.length - 1
            }, ...restCoins]));
          } else if (restCoins.length > 0) commands.push(TransactionCommands.MergeCoins(baseCoin, restCoins));
          mergedCoins.set(type, baseCoin);
        }
        commands.push(TransactionCommands.SplitCoins(mergedCoins.get(type), [transactionData.addInput("pure", Inputs.Pure(suiBcs.u64().serialize(balance)))]));
      }
      transactionData.replaceCommand(index, commands);
      transactionData.mapArguments((arg, _command, commandIndex) => {
        if (commandIndex >= index && commandIndex < index + commands.length) return arg;
        if (arg.$kind === "Result" && arg.Result === index) return {
          $kind: "NestedResult",
          NestedResult: [index + commands.length - 1, 0]
        };
        return arg;
      });
    }
    return next();
  }
  async function getCoinsAndBalanceOfType({ coinType, balance, client, owner, usedIds }) {
    let remainingBalance = balance;
    const coins = [];
    const balanceRequest = client.core.getBalance({
      owner,
      coinType
    }).then(({ balance: balance$1 }) => {
      remainingBalance -= BigInt(balance$1.addressBalance);
      return balance$1;
    });
    const [allCoins, balanceResponse] = await Promise.all([loadMoreCoins(), balanceRequest]);
    if (BigInt(balanceResponse.balance) < balance) throw new Error(`Insufficient balance of ${coinType} for owner ${owner}. Required: ${balance}, Available: ${balance - remainingBalance}`);
    return {
      coins: allCoins,
      balance: BigInt(balanceResponse.coinBalance),
      addressBalance: BigInt(balanceResponse.addressBalance),
      coinBalance: BigInt(balanceResponse.coinBalance)
    };
    async function loadMoreCoins(cursor = null) {
      const { objects, hasNextPage, cursor: nextCursor } = await client.core.listCoins({
        owner,
        coinType,
        cursor
      });
      await balanceRequest;
      if (remainingBalance > 0n) {
        for (const coin of objects) {
          if (usedIds.has(coin.objectId)) continue;
          const coinBalance = BigInt(coin.balance);
          coins.push(coin);
          remainingBalance -= coinBalance;
          if (remainingBalance <= 0) break;
        }
        if (hasNextPage) return loadMoreCoins(nextCursor);
      }
      return coins;
    }
  }

  // node_modules/@mysten/sui/dist/transactions/data/v2.mjs
  function enumUnion(options) {
    return union(Object.entries(options).map(([key, value]) => object({ [key]: value })));
  }
  var Argument2 = enumUnion({
    GasCoin: literal(true),
    Input: pipe(number(), integer()),
    Result: pipe(number(), integer()),
    NestedResult: tuple([pipe(number(), integer()), pipe(number(), integer())])
  });
  var GasData2 = object({
    budget: nullable(JsonU64),
    price: nullable(JsonU64),
    owner: nullable(SuiAddress),
    payment: nullable(array(ObjectRefSchema))
  });
  var ProgrammableMoveCall2 = object({
    package: ObjectID,
    module: string(),
    function: string(),
    typeArguments: array(string()),
    arguments: array(Argument2)
  });
  var $Intent2 = object({
    name: string(),
    inputs: record(string(), union([Argument2, array(Argument2)])),
    data: record(string(), unknown())
  });
  var Command2 = enumUnion({
    MoveCall: ProgrammableMoveCall2,
    TransferObjects: object({
      objects: array(Argument2),
      address: Argument2
    }),
    SplitCoins: object({
      coin: Argument2,
      amounts: array(Argument2)
    }),
    MergeCoins: object({
      destination: Argument2,
      sources: array(Argument2)
    }),
    Publish: object({
      modules: array(BCSBytes),
      dependencies: array(ObjectID)
    }),
    MakeMoveVec: object({
      type: nullable(string()),
      elements: array(Argument2)
    }),
    Upgrade: object({
      modules: array(BCSBytes),
      dependencies: array(ObjectID),
      package: ObjectID,
      ticket: Argument2
    }),
    $Intent: $Intent2
  });
  var CallArg2 = enumUnion({
    Object: enumUnion({
      ImmOrOwnedObject: ObjectRefSchema,
      SharedObject: object({
        objectId: ObjectID,
        initialSharedVersion: JsonU64,
        mutable: boolean()
      }),
      Receiving: ObjectRefSchema
    }),
    Pure: object({ bytes: BCSBytes }),
    UnresolvedPure: object({ value: unknown() }),
    UnresolvedObject: object({
      objectId: ObjectID,
      version: optional(nullable(JsonU64)),
      digest: optional(nullable(string())),
      initialSharedVersion: optional(nullable(JsonU64)),
      mutable: optional(nullable(boolean()))
    }),
    FundsWithdrawal: FundsWithdrawalArgSchema
  });
  var TransactionExpiration4 = enumUnion({
    None: literal(true),
    Epoch: JsonU64,
    ValidDuring: ValidDuringSchema
  });
  var SerializedTransactionDataV2Schema = object({
    version: literal(2),
    sender: nullish(SuiAddress),
    expiration: nullish(TransactionExpiration4),
    gasData: GasData2,
    inputs: array(CallArg2),
    commands: array(Command2),
    digest: optional(nullable(string()))
  });

  // node_modules/@mysten/sui/dist/client/errors.mjs
  var SuiClientError = class extends Error {
  };
  var SimulationError = class extends SuiClientError {
    constructor(message, options) {
      super(message, { cause: options?.cause });
      this.executionError = options?.executionError;
    }
  };
  var ObjectError = class ObjectError2 extends SuiClientError {
    constructor(code, message) {
      super(message);
      this.code = code;
    }
    static fromResponse(response, objectId) {
      switch (response.code) {
        case "notExists":
          return new ObjectError2(response.code, `Object ${response.object_id} does not exist`);
        case "dynamicFieldNotFound":
          return new ObjectError2(response.code, `Dynamic field not found for object ${response.parent_object_id}`);
        case "deleted":
          return new ObjectError2(response.code, `Object ${response.object_id} has been deleted`);
        case "displayError":
          return new ObjectError2(response.code, `Display error: ${response.error}`);
        case "unknown":
        default:
          return new ObjectError2(response.code, `Unknown error while loading object${objectId ? ` ${objectId}` : ""}`);
      }
    }
  };

  // node_modules/@mysten/sui/dist/client/core-resolver.mjs
  var MAX_OBJECTS_PER_FETCH = 50;
  var GAS_SAFE_OVERHEAD = 1000n;
  var MAX_GAS = 5e10;
  function getClient(options) {
    if (!options.client) throw new Error(`No sui client passed to Transaction#build, but transaction data was not sufficient to build offline.`);
    return options.client;
  }
  async function coreClientResolveTransactionPlugin(transactionData, options, next) {
    const client = getClient(options);
    await normalizeInputs(transactionData, client);
    await resolveObjectReferences(transactionData, client);
    if (!options.onlyTransactionKind) await setGasData(transactionData, client);
    return await next();
  }
  async function setGasData(transactionData, client) {
    let systemState = null;
    if (!transactionData.gasData.price) {
      systemState = (await client.core.getCurrentSystemState()).systemState;
      transactionData.gasData.price = systemState.referenceGasPrice;
    }
    await setGasBudget(transactionData, client);
    await setGasPayment(transactionData, client);
    if (!transactionData.expiration) await setExpiration(transactionData, client, systemState);
  }
  async function setGasBudget(transactionData, client) {
    if (transactionData.gasData.budget) return;
    const simulateResult = await client.core.simulateTransaction({
      transaction: transactionData.build({ overrides: { gasData: {
        budget: String(MAX_GAS),
        payment: []
      } } }),
      include: { effects: true }
    });
    if (simulateResult.$kind === "FailedTransaction") {
      const executionError = simulateResult.FailedTransaction.status.error ?? void 0;
      throw new SimulationError(`Transaction resolution failed: ${executionError?.message ?? "Unknown error"}`, {
        cause: simulateResult,
        executionError
      });
    }
    const gasUsed = simulateResult.Transaction.effects.gasUsed;
    const safeOverhead = GAS_SAFE_OVERHEAD * BigInt(transactionData.gasData.price || 1n);
    const baseComputationCostWithOverhead = BigInt(gasUsed.computationCost) + safeOverhead;
    const gasBudget = baseComputationCostWithOverhead + BigInt(gasUsed.storageCost) - BigInt(gasUsed.storageRebate);
    transactionData.gasData.budget = String(gasBudget > baseComputationCostWithOverhead ? gasBudget : baseComputationCostWithOverhead);
  }
  async function setGasPayment(transactionData, client) {
    if (!transactionData.gasData.payment) {
      const gasPayer = transactionData.gasData.owner ?? transactionData.sender;
      if (!gasPayer) throw new Error("Either a gas owner or sender must be set to determine gas payment.");
      const normalizedGasPayer = normalizeSuiAddress(gasPayer);
      let usesGasCoin = false;
      let withdrawals = 0n;
      transactionData.mapArguments((arg) => {
        if (arg.$kind === "GasCoin") usesGasCoin = true;
        else if (arg.$kind === "Input") {
          const input = transactionData.inputs[arg.Input];
          if (input.$kind === "FundsWithdrawal") {
            const withdrawalOwner = input.FundsWithdrawal.withdrawFrom.Sender ? transactionData.sender : gasPayer;
            if (withdrawalOwner && normalizeSuiAddress(withdrawalOwner) === normalizedGasPayer) {
              if (input.FundsWithdrawal.reservation.$kind === "MaxAmountU64") withdrawals += BigInt(input.FundsWithdrawal.reservation.MaxAmountU64);
            }
          }
        }
        return arg;
      });
      const [suiBalance, coins] = await Promise.all([usesGasCoin ? null : client.core.getBalance({ owner: gasPayer }), client.core.listCoins({
        owner: gasPayer,
        coinType: SUI_TYPE_ARG
      })]);
      if (suiBalance?.balance.addressBalance && BigInt(suiBalance.balance.addressBalance) >= BigInt(transactionData.gasData.budget || "0") + withdrawals) {
        transactionData.gasData.payment = [];
        return;
      }
      const paymentCoins = coins.objects.filter((coin) => {
        return !transactionData.inputs.find((input) => {
          if (input.Object?.ImmOrOwnedObject) return coin.objectId === input.Object.ImmOrOwnedObject.objectId;
          return false;
        });
      }).map((coin) => parse(ObjectRefSchema, {
        objectId: coin.objectId,
        digest: coin.digest,
        version: coin.version
      }));
      if (!paymentCoins.length) throw new Error("No valid gas coins found for the transaction.");
      transactionData.gasData.payment = paymentCoins;
    }
  }
  async function setExpiration(transactionData, client, existingSystemState) {
    const [systemState, { chainIdentifier }] = await Promise.all([existingSystemState ?? client.core.getCurrentSystemState().then((r7) => r7.systemState), client.core.getChainIdentifier()]);
    const currentEpoch = BigInt(systemState.epoch);
    transactionData.expiration = {
      $kind: "ValidDuring",
      ValidDuring: {
        minEpoch: String(currentEpoch),
        maxEpoch: String(currentEpoch + 1n),
        minTimestamp: null,
        maxTimestamp: null,
        chain: chainIdentifier,
        nonce: Math.random() * 4294967296 >>> 0
      }
    };
  }
  async function resolveObjectReferences(transactionData, client) {
    const objectsToResolve = transactionData.inputs.filter((input) => {
      return input.UnresolvedObject && !(input.UnresolvedObject.version || input.UnresolvedObject?.initialSharedVersion);
    });
    const dedupedIds = [...new Set(objectsToResolve.map((input) => normalizeSuiObjectId(input.UnresolvedObject.objectId)))];
    const objectChunks = dedupedIds.length ? chunk(dedupedIds, MAX_OBJECTS_PER_FETCH) : [];
    const resolved = (await Promise.all(objectChunks.map((chunkIds) => client.core.getObjects({ objectIds: chunkIds })))).flatMap((result) => result.objects);
    const responsesById = new Map(dedupedIds.map((id, index) => {
      return [id, resolved[index]];
    }));
    const invalidObjects = Array.from(responsesById).filter(([_2, obj]) => obj instanceof Error).map(([_2, obj]) => obj.message);
    if (invalidObjects.length) throw new Error(`The following input objects are invalid: ${invalidObjects.join(", ")}`);
    const objects = resolved.map((object$1) => {
      if (object$1 instanceof Error) throw new Error(`Failed to fetch object: ${object$1.message}`);
      const owner = object$1.owner;
      const initialSharedVersion = owner && typeof owner === "object" ? owner.$kind === "Shared" ? owner.Shared.initialSharedVersion : owner.$kind === "ConsensusAddressOwner" ? owner.ConsensusAddressOwner.startVersion : null : null;
      return {
        objectId: object$1.objectId,
        digest: object$1.digest,
        version: object$1.version,
        initialSharedVersion
      };
    });
    const objectsById = new Map(dedupedIds.map((id, index) => {
      return [id, objects[index]];
    }));
    for (const [index, input] of transactionData.inputs.entries()) {
      if (!input.UnresolvedObject) continue;
      let updated;
      const id = normalizeSuiAddress(input.UnresolvedObject.objectId);
      const object$1 = objectsById.get(id);
      if (input.UnresolvedObject.initialSharedVersion ?? object$1?.initialSharedVersion) updated = Inputs.SharedObjectRef({
        objectId: id,
        initialSharedVersion: input.UnresolvedObject.initialSharedVersion || object$1?.initialSharedVersion,
        mutable: input.UnresolvedObject.mutable || isUsedAsMutable(transactionData, index)
      });
      else if (isUsedAsReceiving(transactionData, index)) updated = Inputs.ReceivingRef({
        objectId: id,
        digest: input.UnresolvedObject.digest ?? object$1?.digest,
        version: input.UnresolvedObject.version ?? object$1?.version
      });
      transactionData.inputs[transactionData.inputs.indexOf(input)] = updated ?? Inputs.ObjectRef({
        objectId: id,
        digest: input.UnresolvedObject.digest ?? object$1?.digest,
        version: input.UnresolvedObject.version ?? object$1?.version
      });
    }
  }
  async function normalizeInputs(transactionData, client) {
    const { inputs, commands } = transactionData;
    const moveCallsToResolve = [];
    const moveFunctionsToResolve = /* @__PURE__ */ new Set();
    commands.forEach((command) => {
      if (command.MoveCall) {
        if (command.MoveCall._argumentTypes) return;
        if (command.MoveCall.arguments.map((arg) => {
          if (arg.$kind === "Input") return transactionData.inputs[arg.Input];
          return null;
        }).some((input) => input?.UnresolvedPure || input?.UnresolvedObject && typeof input?.UnresolvedObject.mutable !== "boolean")) {
          const functionName = `${command.MoveCall.package}::${command.MoveCall.module}::${command.MoveCall.function}`;
          moveFunctionsToResolve.add(functionName);
          moveCallsToResolve.push(command.MoveCall);
        }
      }
    });
    const moveFunctionParameters = /* @__PURE__ */ new Map();
    if (moveFunctionsToResolve.size > 0) await Promise.all([...moveFunctionsToResolve].map(async (functionName) => {
      const [packageId, moduleName, name] = functionName.split("::");
      const { function: def } = await client.core.getMoveFunction({
        packageId,
        moduleName,
        name
      });
      moveFunctionParameters.set(functionName, def.parameters);
    }));
    if (moveCallsToResolve.length) await Promise.all(moveCallsToResolve.map(async (moveCall) => {
      const parameters = moveFunctionParameters.get(`${moveCall.package}::${moveCall.module}::${moveCall.function}`);
      if (!parameters) return;
      moveCall._argumentTypes = parameters.length > 0 && isTxContext(parameters.at(-1)) ? parameters.slice(0, parameters.length - 1) : parameters;
    }));
    commands.forEach((command) => {
      if (!command.MoveCall) return;
      const moveCall = command.MoveCall;
      const fnName = `${moveCall.package}::${moveCall.module}::${moveCall.function}`;
      const params = moveCall._argumentTypes;
      if (!params) return;
      if (params.length !== command.MoveCall.arguments.length) throw new Error(`Incorrect number of arguments for ${fnName}`);
      params.forEach((param, i7) => {
        const arg = moveCall.arguments[i7];
        if (arg.$kind !== "Input") return;
        const input = inputs[arg.Input];
        if (!input.UnresolvedPure && !input.UnresolvedObject) return;
        const inputValue = input.UnresolvedPure?.value ?? input.UnresolvedObject?.objectId;
        const schema = getPureBcsSchema(param.body);
        if (schema) {
          arg.type = "pure";
          inputs[inputs.indexOf(input)] = Inputs.Pure(schema.serialize(inputValue));
          return;
        }
        if (typeof inputValue !== "string") throw new Error(`Expect the argument to be an object id string, got ${JSON.stringify(inputValue, null, 2)}`);
        arg.type = "object";
        const unresolvedObject = input.UnresolvedPure ? {
          $kind: "UnresolvedObject",
          UnresolvedObject: { objectId: inputValue }
        } : input;
        inputs[arg.Input] = unresolvedObject;
      });
    });
  }
  function isUsedAsMutable(transactionData, index) {
    let usedAsMutable = false;
    transactionData.getInputUses(index, (arg, tx) => {
      if (tx.MoveCall && tx.MoveCall._argumentTypes) {
        const argIndex = tx.MoveCall.arguments.indexOf(arg);
        usedAsMutable = tx.MoveCall._argumentTypes[argIndex].reference !== "immutable" || usedAsMutable;
      }
      if (tx.$kind === "MakeMoveVec" || tx.$kind === "MergeCoins" || tx.$kind === "SplitCoins" || tx.$kind === "TransferObjects") usedAsMutable = true;
    });
    return usedAsMutable;
  }
  function isUsedAsReceiving(transactionData, index) {
    let usedAsReceiving = false;
    transactionData.getInputUses(index, (arg, tx) => {
      if (tx.MoveCall && tx.MoveCall._argumentTypes) {
        const argIndex = tx.MoveCall.arguments.indexOf(arg);
        usedAsReceiving = isReceivingType(tx.MoveCall._argumentTypes[argIndex]) || usedAsReceiving;
      }
    });
    return usedAsReceiving;
  }
  var RECEIVING_TYPE = "0x0000000000000000000000000000000000000000000000000000000000000002::transfer::Receiving";
  function isReceivingType(type) {
    if (type.body.$kind !== "datatype") return false;
    return type.body.datatype.typeName === RECEIVING_TYPE;
  }

  // node_modules/@mysten/sui/dist/transactions/resolve.mjs
  function needsTransactionResolution(data, options) {
    if (data.inputs.some((input) => {
      return input.UnresolvedObject || input.UnresolvedPure;
    })) return true;
    if (!options.onlyTransactionKind) {
      if (!data.gasData.price || !data.gasData.budget || !data.gasData.payment) return true;
      if (data.gasData.payment.length === 0 && !data.expiration) return true;
    }
    return false;
  }
  async function resolveTransactionPlugin(transactionData, options, next) {
    normalizeRawArguments(transactionData);
    if (!needsTransactionResolution(transactionData, options)) {
      await validate(transactionData);
      return next();
    }
    return (getClient2(options).core?.resolveTransactionPlugin() ?? coreClientResolveTransactionPlugin)(transactionData, options, async () => {
      await validate(transactionData);
      await next();
    });
  }
  function validate(transactionData) {
    transactionData.inputs.forEach((input, index) => {
      if (input.$kind !== "Object" && input.$kind !== "Pure" && input.$kind !== "FundsWithdrawal") throw new Error(`Input at index ${index} has not been resolved.  Expected a Pure, Object, or FundsWithdrawal input, but found ${JSON.stringify(input)}`);
    });
  }
  function getClient2(options) {
    if (!options.client) throw new Error(`No sui client passed to Transaction#build, but transaction data was not sufficient to build offline.`);
    return options.client;
  }
  function normalizeRawArguments(transactionData) {
    for (const command of transactionData.commands) switch (command.$kind) {
      case "SplitCoins":
        command.SplitCoins.amounts.forEach((amount) => {
          normalizeRawArgument(amount, suiBcs.U64, transactionData);
        });
        break;
      case "TransferObjects":
        normalizeRawArgument(command.TransferObjects.address, suiBcs.Address, transactionData);
        break;
    }
  }
  function normalizeRawArgument(arg, schema, transactionData) {
    if (arg.$kind !== "Input") return;
    const input = transactionData.inputs[arg.Input];
    if (input.$kind !== "UnresolvedPure") return;
    transactionData.inputs[arg.Input] = Inputs.Pure(schema.serialize(input.UnresolvedPure.value));
  }

  // node_modules/@mysten/sui/dist/transactions/object.mjs
  function createObjectMethods(makeObject) {
    function object2(value) {
      return makeObject(value);
    }
    object2.system = (options) => {
      const mutable = options?.mutable;
      if (mutable !== void 0) return object2(Inputs.SharedObjectRef({
        objectId: SUI_SYSTEM_STATE_OBJECT_ID,
        initialSharedVersion: 1,
        mutable
      }));
      return object2({
        $kind: "UnresolvedObject",
        UnresolvedObject: {
          objectId: SUI_SYSTEM_STATE_OBJECT_ID,
          initialSharedVersion: 1
        }
      });
    };
    object2.clock = () => object2(Inputs.SharedObjectRef({
      objectId: SUI_CLOCK_OBJECT_ID,
      initialSharedVersion: 1,
      mutable: false
    }));
    object2.random = () => object2({
      $kind: "UnresolvedObject",
      UnresolvedObject: {
        objectId: SUI_RANDOM_OBJECT_ID,
        mutable: false
      }
    });
    object2.denyList = (options) => {
      return object2({
        $kind: "UnresolvedObject",
        UnresolvedObject: {
          objectId: SUI_DENY_LIST_OBJECT_ID,
          mutable: options?.mutable
        }
      });
    };
    object2.option = ({ type, value }) => (tx) => tx.moveCall({
      typeArguments: [type],
      target: `${MOVE_STDLIB_ADDRESS}::option::${value === null ? "none" : "some"}`,
      arguments: value === null ? [] : [tx.object(value)]
    });
    return object2;
  }

  // node_modules/@mysten/sui/dist/transactions/pure.mjs
  function createPure(makePure) {
    function pure(typeOrSerializedValue, value) {
      if (typeof typeOrSerializedValue === "string") return makePure(pureBcsSchemaFromTypeName(typeOrSerializedValue).serialize(value));
      if (typeOrSerializedValue instanceof Uint8Array || isSerializedBcs(typeOrSerializedValue)) return makePure(typeOrSerializedValue);
      throw new Error("tx.pure must be called either a bcs type name, or a serialized bcs value");
    }
    pure.u8 = (value) => makePure(suiBcs.U8.serialize(value));
    pure.u16 = (value) => makePure(suiBcs.U16.serialize(value));
    pure.u32 = (value) => makePure(suiBcs.U32.serialize(value));
    pure.u64 = (value) => makePure(suiBcs.U64.serialize(value));
    pure.u128 = (value) => makePure(suiBcs.U128.serialize(value));
    pure.u256 = (value) => makePure(suiBcs.U256.serialize(value));
    pure.bool = (value) => makePure(suiBcs.Bool.serialize(value));
    pure.string = (value) => makePure(suiBcs.String.serialize(value));
    pure.address = (value) => makePure(suiBcs.Address.serialize(value));
    pure.id = pure.address;
    pure.vector = (type, value) => {
      return makePure(suiBcs.vector(pureBcsSchemaFromTypeName(type)).serialize(value));
    };
    pure.option = (type, value) => {
      return makePure(suiBcs.option(pureBcsSchemaFromTypeName(type)).serialize(value));
    };
    return pure;
  }

  // node_modules/@mysten/sui/dist/version.mjs
  var PACKAGE_VERSION = "2.6.0";
  var TARGETED_RPC_VERSION = "1.68.0";

  // node_modules/@mysten/sui/dist/client/mvr.mjs
  var NAME_SEPARATOR2 = "/";
  var MVR_API_HEADER = { "Mvr-Source": `@mysten/sui@${PACKAGE_VERSION}` };
  var _cache, _url, _pageSize, _overrides, _MvrClient_instances, mvrPackageDataLoader_get, mvrTypeDataLoader_get, resolvePackages_fn, resolveTypes_fn, fetch_fn, _a3;
  var MvrClient = (_a3 = class {
    constructor({ cache: cache2, url, pageSize = 50, overrides }) {
      __privateAdd(this, _MvrClient_instances);
      __privateAdd(this, _cache);
      __privateAdd(this, _url);
      __privateAdd(this, _pageSize);
      __privateAdd(this, _overrides);
      __privateSet(this, _cache, cache2);
      __privateSet(this, _url, url);
      __privateSet(this, _pageSize, pageSize);
      __privateSet(this, _overrides, {
        packages: overrides?.packages,
        types: overrides?.types
      });
      validateOverrides(__privateGet(this, _overrides));
    }
    async resolvePackage({ package: name }) {
      if (!hasMvrName(name)) return { package: name };
      return { package: await __privateGet(this, _MvrClient_instances, mvrPackageDataLoader_get).load(name) };
    }
    async resolveType({ type }) {
      if (!hasMvrName(type)) return { type };
      const mvrTypes = [...extractMvrTypes(type)];
      const resolvedTypes = await __privateGet(this, _MvrClient_instances, mvrTypeDataLoader_get).loadMany(mvrTypes);
      const typeMap = {};
      for (let i7 = 0; i7 < mvrTypes.length; i7++) {
        const resolvedType = resolvedTypes[i7];
        if (resolvedType instanceof Error) throw resolvedType;
        typeMap[mvrTypes[i7]] = resolvedType;
      }
      return { type: replaceMvrNames(type, typeMap) };
    }
    async resolve({ types = [], packages = [] }) {
      const mvrTypes = /* @__PURE__ */ new Set();
      for (const type of types ?? []) extractMvrTypes(type, mvrTypes);
      const typesArray = [...mvrTypes];
      const [resolvedTypes, resolvedPackages] = await Promise.all([typesArray.length > 0 ? __privateGet(this, _MvrClient_instances, mvrTypeDataLoader_get).loadMany(typesArray) : [], packages.length > 0 ? __privateGet(this, _MvrClient_instances, mvrPackageDataLoader_get).loadMany(packages) : []]);
      const typeMap = { ...__privateGet(this, _overrides)?.types };
      for (const [i7, type] of typesArray.entries()) {
        const resolvedType = resolvedTypes[i7];
        if (resolvedType instanceof Error) throw resolvedType;
        typeMap[type] = resolvedType;
      }
      const replacedTypes = {};
      for (const type of types ?? []) replacedTypes[type] = { type: replaceMvrNames(type, typeMap) };
      const replacedPackages = {};
      for (const [i7, pkg] of (packages ?? []).entries()) {
        const resolvedPkg = __privateGet(this, _overrides)?.packages?.[pkg] ?? resolvedPackages[i7];
        if (resolvedPkg instanceof Error) throw resolvedPkg;
        replacedPackages[pkg] = { package: resolvedPkg };
      }
      return {
        types: replacedTypes,
        packages: replacedPackages
      };
    }
  }, _cache = new WeakMap(), _url = new WeakMap(), _pageSize = new WeakMap(), _overrides = new WeakMap(), _MvrClient_instances = new WeakSet(), mvrPackageDataLoader_get = function() {
    return __privateGet(this, _cache).readSync(["#mvrPackageDataLoader", __privateGet(this, _url) ?? ""], () => {
      const loader = new DataLoader(async (packages) => {
        if (!__privateGet(this, _url)) throw new Error(`MVR Api URL is not set for the current client (resolving ${packages.join(", ")})`);
        const resolved = await __privateMethod(this, _MvrClient_instances, resolvePackages_fn).call(this, packages);
        return packages.map((pkg) => resolved[pkg] ?? /* @__PURE__ */ new Error(`Failed to resolve package: ${pkg}`));
      });
      const overrides = __privateGet(this, _overrides)?.packages;
      if (overrides) for (const [pkg, id] of Object.entries(overrides)) loader.prime(pkg, id);
      return loader;
    });
  }, mvrTypeDataLoader_get = function() {
    return __privateGet(this, _cache).readSync(["#mvrTypeDataLoader", __privateGet(this, _url) ?? ""], () => {
      const loader = new DataLoader(async (types) => {
        if (!__privateGet(this, _url)) throw new Error(`MVR Api URL is not set for the current client (resolving ${types.join(", ")})`);
        const resolved = await __privateMethod(this, _MvrClient_instances, resolveTypes_fn).call(this, types);
        return types.map((type) => resolved[type] ?? /* @__PURE__ */ new Error(`Failed to resolve type: ${type}`));
      });
      const overrides = __privateGet(this, _overrides)?.types;
      if (overrides) for (const [type, id] of Object.entries(overrides)) loader.prime(type, id);
      return loader;
    });
  }, resolvePackages_fn = async function(packages) {
    if (packages.length === 0) return {};
    const batches = chunk(packages, __privateGet(this, _pageSize));
    const results = {};
    await Promise.all(batches.map(async (batch) => {
      const data = await __privateMethod(this, _MvrClient_instances, fetch_fn).call(this, "/v1/resolution/bulk", { names: batch });
      if (!data?.resolution) return;
      for (const pkg of Object.keys(data?.resolution)) {
        const pkgData = data.resolution[pkg]?.package_id;
        if (!pkgData) continue;
        results[pkg] = pkgData;
      }
    }));
    return results;
  }, resolveTypes_fn = async function(types) {
    if (types.length === 0) return {};
    const batches = chunk(types, __privateGet(this, _pageSize));
    const results = {};
    await Promise.all(batches.map(async (batch) => {
      const data = await __privateMethod(this, _MvrClient_instances, fetch_fn).call(this, "/v1/struct-definition/bulk", { types: batch });
      if (!data?.resolution) return;
      for (const type of Object.keys(data?.resolution)) {
        const typeData = data.resolution[type]?.type_tag;
        if (!typeData) continue;
        results[type] = typeData;
      }
    }));
    return results;
  }, fetch_fn = async function(url, body) {
    if (!__privateGet(this, _url)) throw new Error("MVR Api URL is not set for the current client");
    const response = await fetch(`${__privateGet(this, _url)}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...MVR_API_HEADER
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(`Failed to resolve types: ${errorBody?.message}`);
    }
    return response.json();
  }, _a3);
  function validateOverrides(overrides) {
    if (overrides?.packages) for (const [pkg, id] of Object.entries(overrides.packages)) {
      if (!isValidNamedPackage(pkg)) throw new Error(`Invalid package name: ${pkg}`);
      if (!isValidSuiAddress(normalizeSuiAddress(id))) throw new Error(`Invalid package ID: ${id}`);
    }
    if (overrides?.types) for (const [type, val] of Object.entries(overrides.types)) {
      if (parseStructTag(type).typeParams.length > 0) throw new Error("Type overrides must be first-level only. If you want to supply generic types, just pass each type individually.");
      if (!isValidSuiAddress(parseStructTag(val).address)) throw new Error(`Invalid type: ${val}`);
    }
  }
  function extractMvrTypes(type, types = /* @__PURE__ */ new Set()) {
    if (typeof type === "string" && !hasMvrName(type)) return types;
    const tag = isStructTag(type) ? type : parseStructTag(type);
    if (hasMvrName(tag.address)) types.add(`${tag.address}::${tag.module}::${tag.name}`);
    for (const param of tag.typeParams) extractMvrTypes(param, types);
    return types;
  }
  function replaceMvrNames(tag, typeCache) {
    const type = isStructTag(tag) ? tag : parseStructTag(tag);
    const cacheHit = typeCache[`${type.address}::${type.module}::${type.name}`];
    return normalizeStructTag({
      ...type,
      address: cacheHit ? cacheHit.split("::")[0] : type.address,
      typeParams: type.typeParams.map((param) => replaceMvrNames(param, typeCache))
    });
  }
  function hasMvrName(nameOrType) {
    return nameOrType.includes(NAME_SEPARATOR2) || nameOrType.includes("@") || nameOrType.includes(".sui");
  }
  function isStructTag(type) {
    return typeof type === "object" && "address" in type && "module" in type && "name" in type && "typeParams" in type;
  }
  function findNamesInTransaction(builder) {
    const packages = /* @__PURE__ */ new Set();
    const types = /* @__PURE__ */ new Set();
    for (const command of builder.commands) switch (command.$kind) {
      case "MakeMoveVec":
        if (command.MakeMoveVec.type) getNamesFromTypeList([command.MakeMoveVec.type]).forEach((type) => {
          types.add(type);
        });
        break;
      case "MoveCall":
        const moveCall = command.MoveCall;
        const pkg = moveCall.package.split("::")[0];
        if (hasMvrName(pkg)) {
          if (!isValidNamedPackage(pkg)) throw new Error(`Invalid package name: ${pkg}`);
          packages.add(pkg);
        }
        getNamesFromTypeList(moveCall.typeArguments ?? []).forEach((type) => {
          types.add(type);
        });
        break;
      default:
        break;
    }
    return {
      packages: [...packages],
      types: [...types]
    };
  }
  function replaceNames(builder, resolved) {
    for (const command of builder.commands) {
      if (command.MakeMoveVec?.type) {
        if (!hasMvrName(command.MakeMoveVec.type)) continue;
        if (!resolved.types[command.MakeMoveVec.type]) throw new Error(`No resolution found for type: ${command.MakeMoveVec.type}`);
        command.MakeMoveVec.type = resolved.types[command.MakeMoveVec.type].type;
      }
      const tx = command.MoveCall;
      if (!tx) continue;
      const nameParts = tx.package.split("::");
      const name = nameParts[0];
      if (hasMvrName(name) && !resolved.packages[name]) throw new Error(`No address found for package: ${name}`);
      if (hasMvrName(name)) {
        nameParts[0] = resolved.packages[name].package;
        tx.package = nameParts.join("::");
      }
      const types = tx.typeArguments;
      if (!types) continue;
      for (let i7 = 0; i7 < types.length; i7++) {
        if (!hasMvrName(types[i7])) continue;
        if (!resolved.types[types[i7]]) throw new Error(`No resolution found for type: ${types[i7]}`);
        types[i7] = resolved.types[types[i7]].type;
      }
      tx.typeArguments = types;
    }
  }
  function getNamesFromTypeList(types) {
    const names = /* @__PURE__ */ new Set();
    for (const type of types) if (hasMvrName(type)) {
      if (!isValidNamedType(type)) throw new Error(`Invalid type with names: ${type}`);
      names.add(type);
    }
    return names;
  }

  // node_modules/@mysten/sui/dist/transactions/plugins/NamedPackagesPlugin.mjs
  function namedPackagesPlugin() {
    return async (transactionData, buildOptions, next) => {
      const names = findNamesInTransaction(transactionData);
      if (names.types.length === 0 && names.packages.length === 0) return next();
      if (!buildOptions.client) throw new Error(`Transaction contains MVR names but no client was provided to resolve them. Please pass a client to Transaction#build()`);
      replaceNames(transactionData, await buildOptions.client.core.mvr.resolve({
        types: names.types,
        packages: names.packages
      }));
      await next();
    };
  }

  // node_modules/@mysten/sui/dist/transactions/Transaction.mjs
  function createTransactionResult(index, length = Infinity) {
    const baseResult = {
      $kind: "Result",
      get Result() {
        return typeof index === "function" ? index() : index;
      }
    };
    const nestedResults = [];
    const nestedResultFor = (resultIndex) => nestedResults[resultIndex] ?? (nestedResults[resultIndex] = {
      $kind: "NestedResult",
      get NestedResult() {
        return [typeof index === "function" ? index() : index, resultIndex];
      }
    });
    return new Proxy(baseResult, {
      set() {
        throw new Error("The transaction result is a proxy, and does not support setting properties directly");
      },
      get(target, property) {
        if (property in target) return Reflect.get(target, property);
        if (property === Symbol.iterator) return function* () {
          let i7 = 0;
          while (i7 < length) {
            yield nestedResultFor(i7);
            i7++;
          }
        };
        if (typeof property === "symbol") return;
        const resultIndex = parseInt(property, 10);
        if (Number.isNaN(resultIndex) || resultIndex < 0) return;
        return nestedResultFor(resultIndex);
      }
    });
  }
  var TRANSACTION_BRAND = Symbol.for("@mysten/transaction");
  function isTransaction(obj) {
    return !!obj && typeof obj === "object" && obj[TRANSACTION_BRAND] === true;
  }
  var _serializationPlugins, _buildPlugins, _intentResolvers, _inputSection, _commandSection, _availableResults, _pendingPromises, _added, _data, _Transaction_instances, fork_fn, addCommand_fn, addInput_fn, normalizeTransactionArgument_fn, resolveArgument_fn, prepareBuild_fn, runPlugins_fn, waitForPendingTasks_fn, sortCommandsAndInputs_fn, _a4;
  var Transaction = (_a4 = class {
    constructor() {
      __privateAdd(this, _Transaction_instances);
      __privateAdd(this, _serializationPlugins);
      __privateAdd(this, _buildPlugins);
      __privateAdd(this, _intentResolvers, /* @__PURE__ */ new Map());
      __privateAdd(this, _inputSection, []);
      __privateAdd(this, _commandSection, []);
      __privateAdd(this, _availableResults, /* @__PURE__ */ new Set());
      __privateAdd(this, _pendingPromises, /* @__PURE__ */ new Set());
      __privateAdd(this, _added, /* @__PURE__ */ new Map());
      __privateAdd(this, _data);
      this.object = createObjectMethods((value) => {
        if (typeof value === "function") return this.object(this.add(value));
        if (typeof value === "object" && is(ArgumentSchema, value)) return value;
        const id = getIdFromCallArg(value);
        const inserted = __privateGet(this, _data).inputs.find((i7) => id === getIdFromCallArg(i7));
        if (inserted?.Object?.SharedObject && typeof value === "object" && value.Object?.SharedObject) inserted.Object.SharedObject.mutable = inserted.Object.SharedObject.mutable || value.Object.SharedObject.mutable;
        return inserted ? {
          $kind: "Input",
          Input: __privateGet(this, _data).inputs.indexOf(inserted),
          type: "object"
        } : __privateMethod(this, _Transaction_instances, addInput_fn).call(this, "object", typeof value === "string" ? {
          $kind: "UnresolvedObject",
          UnresolvedObject: { objectId: normalizeSuiAddress(value) }
        } : value);
      });
      __privateSet(this, _data, new TransactionDataBuilder());
      __privateSet(this, _buildPlugins, []);
      __privateSet(this, _serializationPlugins, []);
    }
    /**
    * Converts from a serialize transaction kind (built with `build({ onlyTransactionKind: true })`) to a `Transaction` class.
    * Supports either a byte array, or base64-encoded bytes.
    */
    static fromKind(serialized) {
      const tx = new _a4();
      __privateSet(tx, _data, TransactionDataBuilder.fromKindBytes(typeof serialized === "string" ? fromBase64(serialized) : serialized));
      __privateSet(tx, _inputSection, __privateGet(tx, _data).inputs.slice());
      __privateSet(tx, _commandSection, __privateGet(tx, _data).commands.slice());
      __privateSet(tx, _availableResults, new Set(__privateGet(tx, _commandSection).map((_2, i7) => i7)));
      return tx;
    }
    /**
    * Converts from a serialized transaction format to a `Transaction` class.
    * There are two supported serialized formats:
    * - A string returned from `Transaction#serialize`. The serialized format must be compatible, or it will throw an error.
    * - A byte array (or base64-encoded bytes) containing BCS transaction data.
    */
    static from(transaction) {
      const newTransaction = new _a4();
      if (isTransaction(transaction)) __privateSet(newTransaction, _data, TransactionDataBuilder.restore(transaction.getData()));
      else if (typeof transaction !== "string" || !transaction.startsWith("{")) __privateSet(newTransaction, _data, TransactionDataBuilder.fromBytes(typeof transaction === "string" ? fromBase64(transaction) : transaction));
      else __privateSet(newTransaction, _data, TransactionDataBuilder.restore(JSON.parse(transaction)));
      __privateSet(newTransaction, _inputSection, __privateGet(newTransaction, _data).inputs.slice());
      __privateSet(newTransaction, _commandSection, __privateGet(newTransaction, _data).commands.slice());
      __privateSet(newTransaction, _availableResults, new Set(__privateGet(newTransaction, _commandSection).map((_2, i7) => i7)));
      if (!newTransaction.isPreparedForSerialization({ supportedIntents: [COIN_WITH_BALANCE] })) throw new Error("Transaction has unresolved intents or async thunks. Call `prepareForSerialization` before copying.");
      if (__privateGet(newTransaction, _data).commands.some((cmd) => cmd.$Intent?.name === COIN_WITH_BALANCE)) newTransaction.addIntentResolver(COIN_WITH_BALANCE, resolveCoinBalance);
      return newTransaction;
    }
    addSerializationPlugin(step) {
      __privateGet(this, _serializationPlugins).push(step);
    }
    addBuildPlugin(step) {
      __privateGet(this, _buildPlugins).push(step);
    }
    addIntentResolver(intent, resolver) {
      if (__privateGet(this, _intentResolvers).has(intent) && __privateGet(this, _intentResolvers).get(intent) !== resolver) throw new Error(`Intent resolver for ${intent} already exists`);
      __privateGet(this, _intentResolvers).set(intent, resolver);
    }
    setSender(sender) {
      __privateGet(this, _data).sender = sender;
    }
    /**
    * Sets the sender only if it has not already been set.
    * This is useful for sponsored transaction flows where the sender may not be the same as the signer address.
    */
    setSenderIfNotSet(sender) {
      if (!__privateGet(this, _data).sender) __privateGet(this, _data).sender = sender;
    }
    setExpiration(expiration) {
      __privateGet(this, _data).expiration = expiration ? parse(TransactionExpiration2, expiration) : null;
    }
    setGasPrice(price) {
      __privateGet(this, _data).gasData.price = String(price);
    }
    setGasBudget(budget) {
      __privateGet(this, _data).gasData.budget = String(budget);
    }
    setGasBudgetIfNotSet(budget) {
      if (__privateGet(this, _data).gasData.budget == null) __privateGet(this, _data).gasData.budget = String(budget);
    }
    setGasOwner(owner) {
      __privateGet(this, _data).gasData.owner = owner;
    }
    setGasPayment(payments) {
      __privateGet(this, _data).gasData.payment = payments.map((payment) => parse(ObjectRefSchema, payment));
    }
    /** Get a snapshot of the transaction data, in JSON form: */
    getData() {
      return __privateGet(this, _data).snapshot();
    }
    get [TRANSACTION_BRAND]() {
      return true;
    }
    get pure() {
      Object.defineProperty(this, "pure", {
        enumerable: false,
        value: createPure((value) => {
          if (isSerializedBcs(value)) return __privateMethod(this, _Transaction_instances, addInput_fn).call(this, "pure", {
            $kind: "Pure",
            Pure: { bytes: value.toBase64() }
          });
          return __privateMethod(this, _Transaction_instances, addInput_fn).call(this, "pure", is(NormalizedCallArg, value) ? parse(NormalizedCallArg, value) : value instanceof Uint8Array ? Inputs.Pure(value) : {
            $kind: "UnresolvedPure",
            UnresolvedPure: { value }
          });
        })
      });
      return this.pure;
    }
    /** Returns an argument for the gas coin, to be used in a transaction. */
    get gas() {
      return {
        $kind: "GasCoin",
        GasCoin: true
      };
    }
    /**
    * Add a new object input to the transaction using the fully-resolved object reference.
    * If you only have an object ID, use `builder.object(id)` instead.
    */
    objectRef(...args) {
      return this.object(Inputs.ObjectRef(...args));
    }
    /**
    * Add a new receiving input to the transaction using the fully-resolved object reference.
    * If you only have an object ID, use `builder.object(id)` instead.
    */
    receivingRef(...args) {
      return this.object(Inputs.ReceivingRef(...args));
    }
    /**
    * Add a new shared object input to the transaction using the fully-resolved shared object reference.
    * If you only have an object ID, use `builder.object(id)` instead.
    */
    sharedObjectRef(...args) {
      return this.object(Inputs.SharedObjectRef(...args));
    }
    add(command) {
      if (typeof command === "function") {
        if (__privateGet(this, _added).has(command)) return __privateGet(this, _added).get(command);
        const fork = __privateMethod(this, _Transaction_instances, fork_fn).call(this);
        const result = command(fork);
        if (!(result && typeof result === "object" && "then" in result)) {
          __privateSet(this, _availableResults, __privateGet(fork, _availableResults));
          __privateGet(this, _added).set(command, result);
          return result;
        }
        const placeholder = __privateMethod(this, _Transaction_instances, addCommand_fn).call(this, {
          $kind: "$Intent",
          $Intent: {
            name: "AsyncTransactionThunk",
            inputs: {},
            data: {
              resultIndex: __privateGet(this, _data).commands.length,
              result: null
            }
          }
        });
        __privateGet(this, _pendingPromises).add(Promise.resolve(result).then((result$1) => {
          placeholder.$Intent.data.result = result$1;
        }));
        const txResult = createTransactionResult(() => placeholder.$Intent.data.resultIndex);
        __privateGet(this, _added).set(command, txResult);
        return txResult;
      } else __privateMethod(this, _Transaction_instances, addCommand_fn).call(this, command);
      return createTransactionResult(__privateGet(this, _data).commands.length - 1);
    }
    splitCoins(coin, amounts) {
      const command = TransactionCommands.SplitCoins(typeof coin === "string" ? this.object(coin) : __privateMethod(this, _Transaction_instances, resolveArgument_fn).call(this, coin), amounts.map((amount) => typeof amount === "number" || typeof amount === "bigint" || typeof amount === "string" ? this.pure.u64(amount) : __privateMethod(this, _Transaction_instances, normalizeTransactionArgument_fn).call(this, amount)));
      __privateMethod(this, _Transaction_instances, addCommand_fn).call(this, command);
      return createTransactionResult(__privateGet(this, _data).commands.length - 1, amounts.length);
    }
    mergeCoins(destination, sources) {
      return this.add(TransactionCommands.MergeCoins(this.object(destination), sources.map((src) => this.object(src))));
    }
    publish({ modules, dependencies }) {
      return this.add(TransactionCommands.Publish({
        modules,
        dependencies
      }));
    }
    upgrade({ modules, dependencies, package: packageId, ticket }) {
      return this.add(TransactionCommands.Upgrade({
        modules,
        dependencies,
        package: packageId,
        ticket: this.object(ticket)
      }));
    }
    moveCall({ arguments: args, ...input }) {
      return this.add(TransactionCommands.MoveCall({
        ...input,
        arguments: args?.map((arg) => __privateMethod(this, _Transaction_instances, normalizeTransactionArgument_fn).call(this, arg))
      }));
    }
    transferObjects(objects, address) {
      return this.add(TransactionCommands.TransferObjects(objects.map((obj) => this.object(obj)), typeof address === "string" ? this.pure.address(address) : __privateMethod(this, _Transaction_instances, normalizeTransactionArgument_fn).call(this, address)));
    }
    makeMoveVec({ type, elements }) {
      return this.add(TransactionCommands.MakeMoveVec({
        type,
        elements: elements.map((obj) => this.object(obj))
      }));
    }
    /**
    * Create a FundsWithdrawal input for withdrawing Balance<T> from an address balance accumulator.
    * This is used for gas payments from address balances.
    *
    * @param options.amount - The Amount to withdraw (u64).
    * @param options.type - The balance type (e.g., "0x2::sui::SUI"). Defaults to SUI.
    */
    withdrawal({ amount, type }) {
      const input = {
        $kind: "FundsWithdrawal",
        FundsWithdrawal: {
          reservation: {
            $kind: "MaxAmountU64",
            MaxAmountU64: String(amount)
          },
          typeArg: {
            $kind: "Balance",
            Balance: type ?? "0x2::sui::SUI"
          },
          withdrawFrom: {
            $kind: "Sender",
            Sender: true
          }
        }
      };
      return __privateMethod(this, _Transaction_instances, addInput_fn).call(this, "object", input);
    }
    /**
    * @deprecated Use toJSON instead.
    * For synchronous serialization, you can use `getData()`
    * */
    serialize() {
      return JSON.stringify(serializeV1TransactionData(__privateGet(this, _data).snapshot()));
    }
    async toJSON(options = {}) {
      await this.prepareForSerialization(options);
      const fullyResolved = this.isFullyResolved();
      return JSON.stringify(parse(SerializedTransactionDataV2Schema, fullyResolved ? {
        ...__privateGet(this, _data).snapshot(),
        digest: __privateGet(this, _data).getDigest()
      } : __privateGet(this, _data).snapshot()), (_key, value) => typeof value === "bigint" ? value.toString() : value, 2);
    }
    /** Build the transaction to BCS bytes, and sign it with the provided keypair. */
    async sign(options) {
      const { signer, ...buildOptions } = options;
      const bytes = await this.build(buildOptions);
      return signer.signTransaction(bytes);
    }
    /**
    * Checks if the transaction is prepared for serialization to JSON.
    * This means:
    *  - All async thunks have been fully resolved
    *  - All transaction intents have been resolved (unless in supportedIntents)
    *
    * Unlike `isFullyResolved()`, this does not require the sender, gas payment,
    * budget, or object versions to be set.
    */
    isPreparedForSerialization(options = {}) {
      if (__privateGet(this, _pendingPromises).size > 0) return false;
      if (__privateGet(this, _data).commands.some((cmd) => cmd.$Intent && !options.supportedIntents?.includes(cmd.$Intent.name))) return false;
      return true;
    }
    /**
    *  Ensures that:
    *  - All objects have been fully resolved to a specific version
    *  - All pure inputs have been serialized to bytes
    *  - All async thunks have been fully resolved
    *  - All transaction intents have been resolved
    * 	- The gas payment, budget, and price have been set
    *  - The transaction sender has been set
    *
    *  When true, the transaction will always be built to the same bytes and digest (unless the transaction is mutated)
    */
    isFullyResolved() {
      if (!this.isPreparedForSerialization()) return false;
      if (!__privateGet(this, _data).sender) return false;
      if (needsTransactionResolution(__privateGet(this, _data), {})) return false;
      return true;
    }
    /** Build the transaction to BCS bytes. */
    async build(options = {}) {
      await this.prepareForSerialization(options);
      await __privateMethod(this, _Transaction_instances, prepareBuild_fn).call(this, options);
      return __privateGet(this, _data).build({ onlyTransactionKind: options.onlyTransactionKind });
    }
    /** Derive transaction digest */
    async getDigest(options = {}) {
      await this.prepareForSerialization(options);
      await __privateMethod(this, _Transaction_instances, prepareBuild_fn).call(this, options);
      return __privateGet(this, _data).getDigest();
    }
    async prepareForSerialization(options) {
      await __privateMethod(this, _Transaction_instances, waitForPendingTasks_fn).call(this);
      __privateMethod(this, _Transaction_instances, sortCommandsAndInputs_fn).call(this);
      const intents = /* @__PURE__ */ new Set();
      for (const command of __privateGet(this, _data).commands) if (command.$Intent) intents.add(command.$Intent.name);
      const steps = [...__privateGet(this, _serializationPlugins)];
      for (const intent of intents) {
        if (options.supportedIntents?.includes(intent)) continue;
        if (!__privateGet(this, _intentResolvers).has(intent)) throw new Error(`Missing intent resolver for ${intent}`);
        steps.push(__privateGet(this, _intentResolvers).get(intent));
      }
      steps.push(namedPackagesPlugin());
      await __privateMethod(this, _Transaction_instances, runPlugins_fn).call(this, steps, options);
    }
  }, _serializationPlugins = new WeakMap(), _buildPlugins = new WeakMap(), _intentResolvers = new WeakMap(), _inputSection = new WeakMap(), _commandSection = new WeakMap(), _availableResults = new WeakMap(), _pendingPromises = new WeakMap(), _added = new WeakMap(), _data = new WeakMap(), _Transaction_instances = new WeakSet(), fork_fn = function() {
    const fork = new _a4();
    __privateSet(fork, _data, __privateGet(this, _data));
    __privateSet(fork, _serializationPlugins, __privateGet(this, _serializationPlugins));
    __privateSet(fork, _buildPlugins, __privateGet(this, _buildPlugins));
    __privateSet(fork, _intentResolvers, __privateGet(this, _intentResolvers));
    __privateSet(fork, _pendingPromises, __privateGet(this, _pendingPromises));
    __privateSet(fork, _availableResults, new Set(__privateGet(this, _availableResults)));
    __privateSet(fork, _added, __privateGet(this, _added));
    __privateGet(this, _inputSection).push(__privateGet(fork, _inputSection));
    __privateGet(this, _commandSection).push(__privateGet(fork, _commandSection));
    return fork;
  }, addCommand_fn = function(command) {
    const resultIndex = __privateGet(this, _data).commands.length;
    __privateGet(this, _commandSection).push(command);
    __privateGet(this, _availableResults).add(resultIndex);
    __privateGet(this, _data).commands.push(command);
    __privateGet(this, _data).mapCommandArguments(resultIndex, (arg) => {
      if (arg.$kind === "Result" && !__privateGet(this, _availableResults).has(arg.Result)) throw new Error(`Result { Result: ${arg.Result} } is not available to use in the current transaction`);
      if (arg.$kind === "NestedResult" && !__privateGet(this, _availableResults).has(arg.NestedResult[0])) throw new Error(`Result { NestedResult: [${arg.NestedResult[0]}, ${arg.NestedResult[1]}] } is not available to use in the current transaction`);
      if (arg.$kind === "Input" && arg.Input >= __privateGet(this, _data).inputs.length) throw new Error(`Input { Input: ${arg.Input} } references an input that does not exist in the current transaction`);
      return arg;
    });
    return command;
  }, addInput_fn = function(type, input) {
    __privateGet(this, _inputSection).push(input);
    return __privateGet(this, _data).addInput(type, input);
  }, normalizeTransactionArgument_fn = function(arg) {
    if (isSerializedBcs(arg)) return this.pure(arg);
    return __privateMethod(this, _Transaction_instances, resolveArgument_fn).call(this, arg);
  }, resolveArgument_fn = function(arg) {
    if (typeof arg === "function") {
      const resolved = this.add(arg);
      if (typeof resolved === "function") return __privateMethod(this, _Transaction_instances, resolveArgument_fn).call(this, resolved);
      return parse(ArgumentSchema, resolved);
    }
    return parse(ArgumentSchema, arg);
  }, prepareBuild_fn = async function(options) {
    if (!options.onlyTransactionKind && !__privateGet(this, _data).sender) throw new Error("Missing transaction sender");
    await __privateMethod(this, _Transaction_instances, runPlugins_fn).call(this, [...__privateGet(this, _buildPlugins), resolveTransactionPlugin], options);
  }, runPlugins_fn = async function(plugins, options) {
    try {
      const createNext = (i7) => {
        if (i7 >= plugins.length) return () => {
        };
        const plugin = plugins[i7];
        return async () => {
          const next = createNext(i7 + 1);
          let calledNext = false;
          let nextResolved = false;
          await plugin(__privateGet(this, _data), options, async () => {
            if (calledNext) throw new Error(`next() was call multiple times in TransactionPlugin ${i7}`);
            calledNext = true;
            await next();
            nextResolved = true;
          });
          if (!calledNext) throw new Error(`next() was not called in TransactionPlugin ${i7}`);
          if (!nextResolved) throw new Error(`next() was not awaited in TransactionPlugin ${i7}`);
        };
      };
      await createNext(0)();
    } finally {
      __privateSet(this, _inputSection, __privateGet(this, _data).inputs.slice());
      __privateSet(this, _commandSection, __privateGet(this, _data).commands.slice());
      __privateSet(this, _availableResults, new Set(__privateGet(this, _commandSection).map((_2, i7) => i7)));
    }
  }, waitForPendingTasks_fn = async function() {
    while (__privateGet(this, _pendingPromises).size > 0) {
      const newPromise = Promise.all(__privateGet(this, _pendingPromises));
      __privateGet(this, _pendingPromises).clear();
      __privateGet(this, _pendingPromises).add(newPromise);
      await newPromise;
      __privateGet(this, _pendingPromises).delete(newPromise);
    }
  }, sortCommandsAndInputs_fn = function() {
    const unorderedCommands = __privateGet(this, _data).commands;
    const unorderedInputs = __privateGet(this, _data).inputs;
    const orderedCommands = __privateGet(this, _commandSection).flat(Infinity);
    const orderedInputs = __privateGet(this, _inputSection).flat(Infinity);
    if (orderedCommands.length !== unorderedCommands.length) throw new Error("Unexpected number of commands found in transaction data");
    if (orderedInputs.length !== unorderedInputs.length) throw new Error("Unexpected number of inputs found in transaction data");
    const filteredCommands = orderedCommands.filter((cmd) => cmd.$Intent?.name !== "AsyncTransactionThunk");
    __privateGet(this, _data).commands = filteredCommands;
    __privateGet(this, _data).inputs = orderedInputs;
    __privateSet(this, _commandSection, filteredCommands);
    __privateSet(this, _inputSection, orderedInputs);
    __privateSet(this, _availableResults, new Set(filteredCommands.map((_2, i7) => i7)));
    function getOriginalIndex(index) {
      const command = unorderedCommands[index];
      if (command.$Intent?.name === "AsyncTransactionThunk") {
        const result = command.$Intent.data.result;
        if (result == null) throw new Error("AsyncTransactionThunk has not been resolved");
        return getOriginalIndex(result.Result);
      }
      const updated = filteredCommands.indexOf(command);
      if (updated === -1) throw new Error("Unable to find original index for command");
      return updated;
    }
    __privateGet(this, _data).mapArguments((arg) => {
      if (arg.$kind === "Input") {
        const updated = orderedInputs.indexOf(unorderedInputs[arg.Input]);
        if (updated === -1) throw new Error("Input has not been resolved");
        return {
          ...arg,
          Input: updated
        };
      } else if (arg.$kind === "Result") {
        const updated = getOriginalIndex(arg.Result);
        return {
          ...arg,
          Result: updated
        };
      } else if (arg.$kind === "NestedResult") {
        const updated = getOriginalIndex(arg.NestedResult[0]);
        return {
          ...arg,
          NestedResult: [updated, arg.NestedResult[1]]
        };
      }
      return arg;
    });
    for (const [i7, cmd] of unorderedCommands.entries()) if (cmd.$Intent?.name === "AsyncTransactionThunk") try {
      cmd.$Intent.data.resultIndex = getOriginalIndex(i7);
    } catch {
    }
  }, _a4);

  // node_modules/@mysten/sui/dist/utils/dynamic-fields.mjs
  function deriveDynamicFieldID(parentId, typeTag, key) {
    const address = suiBcs.Address.serialize(parentId).toBytes();
    const tag = suiBcs.TypeTag.serialize(typeTag).toBytes();
    const keyLength = suiBcs.u64().serialize(key.length).toBytes();
    const hash = blake2b.create({ dkLen: 32 });
    hash.update(new Uint8Array([240]));
    hash.update(address);
    hash.update(keyLength);
    hash.update(key);
    hash.update(tag);
    return `0x${toHex(hash.digest().slice(0, 32))}`;
  }

  // node_modules/@mysten/sui/dist/utils/format.mjs
  var ELLIPSIS = "\u2026";
  function formatAddress(address) {
    if (address.length <= 6) return address;
    const offset3 = address.startsWith("0x") ? 2 : 0;
    return `0x${address.slice(offset3, offset3 + 4)}${ELLIPSIS}${address.slice(-4)}`;
  }

  // node_modules/@mysten/wallet-standard/dist/features/suiSignTransactionBlock.mjs
  var SuiSignTransactionBlock = "sui:signTransactionBlock";

  // node_modules/@mysten/wallet-standard/dist/features/suiSignTransaction.mjs
  var SuiSignTransaction = "sui:signTransaction";

  // node_modules/@mysten/wallet-standard/dist/features/suiSignAndExecuteTransactionBlock.mjs
  var SuiSignAndExecuteTransactionBlock = "sui:signAndExecuteTransactionBlock";

  // node_modules/@mysten/wallet-standard/dist/features/suiSignAndExecuteTransaction.mjs
  var SuiSignAndExecuteTransaction = "sui:signAndExecuteTransaction";

  // node_modules/@mysten/wallet-standard/dist/features/suiSignPersonalMessage.mjs
  var SuiSignPersonalMessage = "sui:signPersonalMessage";

  // node_modules/@wallet-standard/app/lib/esm/wallets.js
  var __classPrivateFieldGet = function(receiver, state, kind, f3) {
    if (kind === "a" && !f3) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f3 : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f3 : kind === "a" ? f3.call(receiver) : f3 ? f3.value : state.get(receiver);
  };
  var __classPrivateFieldSet = function(receiver, state, value, kind, f3) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f3) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f3 : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f3.call(receiver, value) : f3 ? f3.value = value : state.set(receiver, value), value;
  };
  var _AppReadyEvent_detail;
  var wallets = void 0;
  var registeredWalletsSet = /* @__PURE__ */ new Set();
  function addRegisteredWallet(wallet) {
    cachedWalletsArray = void 0;
    registeredWalletsSet.add(wallet);
  }
  function removeRegisteredWallet(wallet) {
    cachedWalletsArray = void 0;
    registeredWalletsSet.delete(wallet);
  }
  var listeners = {};
  function getWallets() {
    if (wallets)
      return wallets;
    wallets = Object.freeze({ register, get, on: on2 });
    if (typeof window === "undefined")
      return wallets;
    const api = Object.freeze({ register });
    try {
      window.addEventListener("wallet-standard:register-wallet", ({ detail: callback }) => callback(api));
    } catch (error) {
      console.error("wallet-standard:register-wallet event listener could not be added\n", error);
    }
    try {
      window.dispatchEvent(new AppReadyEvent(api));
    } catch (error) {
      console.error("wallet-standard:app-ready event could not be dispatched\n", error);
    }
    return wallets;
  }
  function register(...wallets2) {
    wallets2 = wallets2.filter((wallet) => !registeredWalletsSet.has(wallet));
    if (!wallets2.length)
      return () => {
      };
    wallets2.forEach((wallet) => addRegisteredWallet(wallet));
    listeners["register"]?.forEach((listener) => guard(() => listener(...wallets2)));
    return function unregister() {
      wallets2.forEach((wallet) => removeRegisteredWallet(wallet));
      listeners["unregister"]?.forEach((listener) => guard(() => listener(...wallets2)));
    };
  }
  var cachedWalletsArray;
  function get() {
    if (!cachedWalletsArray) {
      cachedWalletsArray = [...registeredWalletsSet];
    }
    return cachedWalletsArray;
  }
  function on2(event, listener) {
    listeners[event]?.push(listener) || (listeners[event] = [listener]);
    return function off() {
      listeners[event] = listeners[event]?.filter((existingListener) => listener !== existingListener);
    };
  }
  function guard(callback) {
    try {
      callback();
    } catch (error) {
      console.error(error);
    }
  }
  var AppReadyEvent = class extends Event {
    get detail() {
      return __classPrivateFieldGet(this, _AppReadyEvent_detail, "f");
    }
    get type() {
      return "wallet-standard:app-ready";
    }
    constructor(api) {
      super("wallet-standard:app-ready", {
        bubbles: false,
        cancelable: false,
        composed: false
      });
      _AppReadyEvent_detail.set(this, void 0);
      __classPrivateFieldSet(this, _AppReadyEvent_detail, api, "f");
    }
    /** @deprecated */
    preventDefault() {
      throw new Error("preventDefault cannot be called");
    }
    /** @deprecated */
    stopImmediatePropagation() {
      throw new Error("stopImmediatePropagation cannot be called");
    }
    /** @deprecated */
    stopPropagation() {
      throw new Error("stopPropagation cannot be called");
    }
  };
  _AppReadyEvent_detail = /* @__PURE__ */ new WeakMap();

  // node_modules/@wallet-standard/features/lib/esm/connect.js
  var StandardConnect = "standard:connect";

  // node_modules/@wallet-standard/features/lib/esm/disconnect.js
  var StandardDisconnect = "standard:disconnect";

  // node_modules/@wallet-standard/features/lib/esm/events.js
  var StandardEvents = "standard:events";

  // node_modules/@wallet-standard/wallet/lib/esm/util.js
  var __classPrivateFieldGet2 = function(receiver, state, kind, f3) {
    if (kind === "a" && !f3) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f3 : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f3 : kind === "a" ? f3.call(receiver) : f3 ? f3.value : state.get(receiver);
  };
  var __classPrivateFieldSet2 = function(receiver, state, value, kind, f3) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f3) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f3 : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f3.call(receiver, value) : f3 ? f3.value = value : state.set(receiver, value), value;
  };
  var _ReadonlyWalletAccount_address;
  var _ReadonlyWalletAccount_publicKey;
  var _ReadonlyWalletAccount_chains;
  var _ReadonlyWalletAccount_features;
  var _ReadonlyWalletAccount_label;
  var _ReadonlyWalletAccount_icon;
  var ReadonlyWalletAccount = class _ReadonlyWalletAccount {
    /** Implementation of {@link "@wallet-standard/base".WalletAccount.address | WalletAccount::address} */
    get address() {
      return __classPrivateFieldGet2(this, _ReadonlyWalletAccount_address, "f");
    }
    /** Implementation of {@link "@wallet-standard/base".WalletAccount.publicKey | WalletAccount::publicKey} */
    get publicKey() {
      return __classPrivateFieldGet2(this, _ReadonlyWalletAccount_publicKey, "f").slice();
    }
    /** Implementation of {@link "@wallet-standard/base".WalletAccount.chains | WalletAccount::chains} */
    get chains() {
      return __classPrivateFieldGet2(this, _ReadonlyWalletAccount_chains, "f").slice();
    }
    /** Implementation of {@link "@wallet-standard/base".WalletAccount.features | WalletAccount::features} */
    get features() {
      return __classPrivateFieldGet2(this, _ReadonlyWalletAccount_features, "f").slice();
    }
    /** Implementation of {@link "@wallet-standard/base".WalletAccount.label | WalletAccount::label} */
    get label() {
      return __classPrivateFieldGet2(this, _ReadonlyWalletAccount_label, "f");
    }
    /** Implementation of {@link "@wallet-standard/base".WalletAccount.icon | WalletAccount::icon} */
    get icon() {
      return __classPrivateFieldGet2(this, _ReadonlyWalletAccount_icon, "f");
    }
    /**
     * Create and freeze a read-only account.
     *
     * @param account Account to copy properties from.
     */
    constructor(account) {
      _ReadonlyWalletAccount_address.set(this, void 0);
      _ReadonlyWalletAccount_publicKey.set(this, void 0);
      _ReadonlyWalletAccount_chains.set(this, void 0);
      _ReadonlyWalletAccount_features.set(this, void 0);
      _ReadonlyWalletAccount_label.set(this, void 0);
      _ReadonlyWalletAccount_icon.set(this, void 0);
      if (new.target === _ReadonlyWalletAccount) {
        Object.freeze(this);
      }
      __classPrivateFieldSet2(this, _ReadonlyWalletAccount_address, account.address, "f");
      __classPrivateFieldSet2(this, _ReadonlyWalletAccount_publicKey, account.publicKey.slice(), "f");
      __classPrivateFieldSet2(this, _ReadonlyWalletAccount_chains, account.chains.slice(), "f");
      __classPrivateFieldSet2(this, _ReadonlyWalletAccount_features, account.features.slice(), "f");
      __classPrivateFieldSet2(this, _ReadonlyWalletAccount_label, account.label, "f");
      __classPrivateFieldSet2(this, _ReadonlyWalletAccount_icon, account.icon, "f");
    }
  };
  _ReadonlyWalletAccount_address = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_publicKey = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_chains = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_features = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_label = /* @__PURE__ */ new WeakMap(), _ReadonlyWalletAccount_icon = /* @__PURE__ */ new WeakMap();

  // node_modules/@mysten/wallet-standard/dist/chains.mjs
  var SUI_DEVNET_CHAIN = "sui:devnet";
  var SUI_TESTNET_CHAIN = "sui:testnet";
  var SUI_LOCALNET_CHAIN = "sui:localnet";
  var SUI_MAINNET_CHAIN = "sui:mainnet";
  var SUI_CHAINS = [
    SUI_DEVNET_CHAIN,
    SUI_TESTNET_CHAIN,
    SUI_LOCALNET_CHAIN,
    SUI_MAINNET_CHAIN
  ];

  // node_modules/@mysten/sui/dist/client/cache.mjs
  var _prefix, _cache2, _a5;
  var ClientCache = (_a5 = class {
    constructor({ prefix, cache: cache2 } = {}) {
      __privateAdd(this, _prefix);
      __privateAdd(this, _cache2);
      __privateSet(this, _prefix, prefix ?? []);
      __privateSet(this, _cache2, cache2 ?? /* @__PURE__ */ new Map());
    }
    read(key, load) {
      const cacheKey = [__privateGet(this, _prefix), ...key].join(":");
      if (__privateGet(this, _cache2).has(cacheKey)) return __privateGet(this, _cache2).get(cacheKey);
      const result = load();
      __privateGet(this, _cache2).set(cacheKey, result);
      if (typeof result === "object" && result !== null && "then" in result) return Promise.resolve(result).then((v2) => {
        __privateGet(this, _cache2).set(cacheKey, v2);
        return v2;
      }).catch((err) => {
        __privateGet(this, _cache2).delete(cacheKey);
        throw err;
      });
      return result;
    }
    readSync(key, load) {
      const cacheKey = [__privateGet(this, _prefix), ...key].join(":");
      if (__privateGet(this, _cache2).has(cacheKey)) return __privateGet(this, _cache2).get(cacheKey);
      const result = load();
      __privateGet(this, _cache2).set(cacheKey, result);
      return result;
    }
    clear(prefix) {
      const prefixKey = [...__privateGet(this, _prefix), ...prefix ?? []].join(":");
      if (!prefixKey) {
        __privateGet(this, _cache2).clear();
        return;
      }
      for (const key of __privateGet(this, _cache2).keys()) if (key.startsWith(prefixKey)) __privateGet(this, _cache2).delete(key);
    }
    scope(prefix) {
      return new _a5({
        prefix: [...__privateGet(this, _prefix), ...Array.isArray(prefix) ? prefix : [prefix]],
        cache: __privateGet(this, _cache2)
      });
    }
  }, _prefix = new WeakMap(), _cache2 = new WeakMap(), _a5);

  // node_modules/@mysten/sui/dist/client/client.mjs
  var BaseClient = class {
    constructor({ network, base, cache: cache2 = base?.cache ?? new ClientCache() }) {
      this.network = network;
      this.base = base ?? this;
      this.cache = cache2;
    }
    $extend(...registrations) {
      const extensions = Object.fromEntries(registrations.map((registration) => {
        return [registration.name, registration.register(this)];
      }));
      const methodCache = /* @__PURE__ */ new Map();
      return new Proxy(this, { get(target, prop, receiver) {
        if (typeof prop === "string" && prop in extensions) return extensions[prop];
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === "function") {
          if (prop === "$extend") return value.bind(receiver);
          if (!methodCache.has(prop)) methodCache.set(prop, value.bind(target));
          return methodCache.get(prop);
        }
        return value;
      } });
    }
  };

  // node_modules/@mysten/sui/dist/client/core.mjs
  var DEFAULT_MVR_URLS = {
    mainnet: "https://mainnet.mvr.mystenlabs.com",
    testnet: "https://testnet.mvr.mystenlabs.com"
  };
  var CoreClient = class extends BaseClient {
    constructor(options) {
      super(options);
      this.core = this;
      this.mvr = new MvrClient({
        cache: this.cache.scope("core.mvr"),
        url: options.mvr?.url ?? DEFAULT_MVR_URLS[this.network],
        pageSize: options.mvr?.pageSize,
        overrides: options.mvr?.overrides
      });
    }
    async getObject(options) {
      const { objectId } = options;
      const { objects: [result] } = await this.getObjects({
        objectIds: [objectId],
        signal: options.signal,
        include: options.include
      });
      if (result instanceof Error) throw result;
      return { object: result };
    }
    async getDynamicField(options) {
      const normalizedNameType = TypeTagSerializer.parseFromStr((await this.core.mvr.resolveType({ type: options.name.type })).type);
      const fieldId = deriveDynamicFieldID(options.parentId, normalizedNameType, options.name.bcs);
      const { objects: [fieldObject] } = await this.getObjects({
        objectIds: [fieldId],
        signal: options.signal,
        include: {
          previousTransaction: true,
          content: true
        }
      });
      if (fieldObject instanceof Error) throw fieldObject;
      const fieldType = parseStructTag(fieldObject.type);
      const content = await fieldObject.content;
      const nameTypeParam = fieldType.typeParams[0];
      const isDynamicObject = typeof nameTypeParam !== "string" && nameTypeParam.module === "dynamic_object_field" && nameTypeParam.name === "Wrapper";
      const valueBcs = content.slice(SUI_ADDRESS_LENGTH + options.name.bcs.length);
      const valueType = typeof fieldType.typeParams[1] === "string" ? fieldType.typeParams[1] : normalizeStructTag(fieldType.typeParams[1]);
      return { dynamicField: {
        $kind: isDynamicObject ? "DynamicObject" : "DynamicField",
        fieldId: fieldObject.objectId,
        digest: fieldObject.digest,
        version: fieldObject.version,
        type: fieldObject.type,
        previousTransaction: fieldObject.previousTransaction,
        name: {
          type: typeof nameTypeParam === "string" ? nameTypeParam : normalizeStructTag(nameTypeParam),
          bcs: options.name.bcs
        },
        value: {
          type: valueType,
          bcs: valueBcs
        },
        childId: isDynamicObject ? suiBcs.Address.parse(valueBcs) : void 0
      } };
    }
    async getDynamicObjectField(options) {
      const wrappedType = `0x2::dynamic_object_field::Wrapper<${(await this.core.mvr.resolveType({ type: options.name.type })).type}>`;
      const { dynamicField } = await this.getDynamicField({
        parentId: options.parentId,
        name: {
          type: wrappedType,
          bcs: options.name.bcs
        },
        signal: options.signal
      });
      const { object: object2 } = await this.getObject({
        objectId: dynamicField.childId,
        signal: options.signal,
        include: options.include
      });
      return { object: object2 };
    }
    async waitForTransaction(options) {
      const { signal, timeout = 60 * 1e3, include } = options;
      const digest = "result" in options && options.result ? (options.result.Transaction ?? options.result.FailedTransaction).digest : options.digest;
      const abortSignal = signal ? AbortSignal.any([AbortSignal.timeout(timeout), signal]) : AbortSignal.timeout(timeout);
      const abortPromise = new Promise((_2, reject) => {
        abortSignal.addEventListener("abort", () => reject(abortSignal.reason));
      });
      abortPromise.catch(() => {
      });
      while (true) {
        abortSignal.throwIfAborted();
        try {
          return await this.getTransaction({
            digest,
            include,
            signal: abortSignal
          });
        } catch {
          await Promise.race([new Promise((resolve) => setTimeout(resolve, 2e3)), abortPromise]);
        }
      }
    }
    async signAndExecuteTransaction({ transaction, signer, additionalSignatures = [], ...input }) {
      let transactionBytes;
      if (transaction instanceof Uint8Array) transactionBytes = transaction;
      else {
        transaction.setSenderIfNotSet(signer.toSuiAddress());
        transactionBytes = await transaction.build({ client: this });
      }
      const { signature } = await signer.signTransaction(transactionBytes);
      return this.executeTransaction({
        transaction: transactionBytes,
        signatures: [signature, ...additionalSignatures],
        ...input
      });
    }
  };

  // node_modules/@mysten/sui/dist/client/utils.mjs
  var ordinalRules = new Intl.PluralRules("en-US", { type: "ordinal" });
  var ordinalSuffixes = /* @__PURE__ */ new Map([
    ["one", "st"],
    ["two", "nd"],
    ["few", "rd"],
    ["other", "th"]
  ]);
  function formatOrdinal(n6) {
    return `${n6}${ordinalSuffixes.get(ordinalRules.select(n6))}`;
  }
  function formatMoveAbortMessage(options) {
    const { command, location, abortCode, cleverError } = options;
    const parts = [];
    if (command != null) parts.push(`MoveAbort in ${formatOrdinal(command + 1)} command`);
    else parts.push("MoveAbort");
    if (cleverError?.constantName) {
      const errorStr = cleverError.value ? `'${cleverError.constantName}': ${cleverError.value}` : `'${cleverError.constantName}'`;
      parts.push(errorStr);
    } else parts.push(`abort code: ${abortCode}`);
    if (location?.package && location?.module) {
      const locationStr = [`in '${[
        location.package.startsWith("0x") ? location.package : `0x${location.package}`,
        location.module,
        location.functionName
      ].filter(Boolean).join("::")}'`];
      if (cleverError?.lineNumber != null) locationStr.push(`(line ${cleverError.lineNumber})`);
      else if (location.instruction != null) locationStr.push(`(instruction ${location.instruction})`);
      parts.push(locationStr.join(" "));
    }
    return parts.join(", ");
  }
  var MinimalEffectsWithError = suiBcs.struct("MinimalEffectsWithError", { status: ExecutionStatus });
  var MinimalTransactionEffectsWithError = suiBcs.enum("MinimalTransactionEffectsWithError", {
    V1: MinimalEffectsWithError,
    V2: MinimalEffectsWithError
  });
  var MinimalExecutionStatusNoError = suiBcs.enum("MinimalExecutionStatusNoError", {
    Success: null,
    Failed: null
  });
  var MinimalEffectsNoError = suiBcs.struct("MinimalEffectsNoError", { status: MinimalExecutionStatusNoError });
  var MinimalTransactionEffectsNoError = suiBcs.enum("MinimalTransactionEffectsNoError", {
    V1: MinimalEffectsNoError,
    V2: MinimalEffectsNoError
  });
  function formatErrorMessage($kind, data) {
    if (data !== null && data !== void 0 && typeof data !== "boolean") return `${$kind}(${JSON.stringify(data, (_key, value) => typeof value === "bigint" ? value.toString() : value)})`;
    return $kind;
  }
  function parseBcsExecutionError(failure) {
    const error = failure.error;
    const command = failure.command != null ? Number(failure.command) : void 0;
    switch (error.$kind) {
      case "MoveAbort": {
        const [location, abortCode] = error.MoveAbort;
        const moveLocation = {
          package: location.module.address,
          module: location.module.name,
          function: location.function,
          functionName: location.functionName ?? void 0,
          instruction: location.instruction
        };
        return {
          $kind: "MoveAbort",
          message: formatMoveAbortMessage({
            command,
            location: moveLocation,
            abortCode: String(abortCode)
          }),
          command,
          MoveAbort: {
            abortCode: String(abortCode),
            location: moveLocation
          }
        };
      }
      case "MoveObjectTooBig":
        return {
          $kind: "SizeError",
          message: formatErrorMessage("MoveObjectTooBig", error.MoveObjectTooBig),
          command,
          SizeError: {
            name: "ObjectTooBig",
            size: Number(error.MoveObjectTooBig.objectSize),
            maxSize: Number(error.MoveObjectTooBig.maxObjectSize)
          }
        };
      case "MovePackageTooBig":
        return {
          $kind: "SizeError",
          message: formatErrorMessage("MovePackageTooBig", error.MovePackageTooBig),
          command,
          SizeError: {
            name: "PackageTooBig",
            size: Number(error.MovePackageTooBig.objectSize),
            maxSize: Number(error.MovePackageTooBig.maxObjectSize)
          }
        };
      case "EffectsTooLarge":
        return {
          $kind: "SizeError",
          message: formatErrorMessage("EffectsTooLarge", error.EffectsTooLarge),
          command,
          SizeError: {
            name: "EffectsTooLarge",
            size: Number(error.EffectsTooLarge.currentSize),
            maxSize: Number(error.EffectsTooLarge.maxSize)
          }
        };
      case "WrittenObjectsTooLarge":
        return {
          $kind: "SizeError",
          message: formatErrorMessage("WrittenObjectsTooLarge", error.WrittenObjectsTooLarge),
          command,
          SizeError: {
            name: "WrittenObjectsTooLarge",
            size: Number(error.WrittenObjectsTooLarge.currentSize),
            maxSize: Number(error.WrittenObjectsTooLarge.maxSize)
          }
        };
      case "MoveVectorElemTooBig":
        return {
          $kind: "SizeError",
          message: formatErrorMessage("MoveVectorElemTooBig", error.MoveVectorElemTooBig),
          command,
          SizeError: {
            name: "MoveVectorElemTooBig",
            size: Number(error.MoveVectorElemTooBig.valueSize),
            maxSize: Number(error.MoveVectorElemTooBig.maxScaledSize)
          }
        };
      case "MoveRawValueTooBig":
        return {
          $kind: "SizeError",
          message: formatErrorMessage("MoveRawValueTooBig", error.MoveRawValueTooBig),
          command,
          SizeError: {
            name: "MoveRawValueTooBig",
            size: Number(error.MoveRawValueTooBig.valueSize),
            maxSize: Number(error.MoveRawValueTooBig.maxScaledSize)
          }
        };
      case "CommandArgumentError":
        return {
          $kind: "CommandArgumentError",
          message: formatErrorMessage("CommandArgumentError", error.CommandArgumentError),
          command,
          CommandArgumentError: {
            argument: error.CommandArgumentError.argIdx,
            name: error.CommandArgumentError.kind.$kind
          }
        };
      case "TypeArgumentError":
        return {
          $kind: "TypeArgumentError",
          message: formatErrorMessage("TypeArgumentError", error.TypeArgumentError),
          command,
          TypeArgumentError: {
            typeArgument: error.TypeArgumentError.argumentIdx,
            name: error.TypeArgumentError.kind.$kind
          }
        };
      case "PackageUpgradeError": {
        const upgradeError = error.PackageUpgradeError.upgradeError;
        return {
          $kind: "PackageUpgradeError",
          message: formatErrorMessage("PackageUpgradeError", error.PackageUpgradeError),
          command,
          PackageUpgradeError: {
            name: upgradeError.$kind,
            packageId: upgradeError.$kind === "UnableToFetchPackage" ? upgradeError.UnableToFetchPackage.packageId : void 0,
            digest: upgradeError.$kind === "DigestDoesNotMatch" ? toBase64(upgradeError.DigestDoesNotMatch.digest) : void 0
          }
        };
      }
      case "ExecutionCancelledDueToSharedObjectCongestion":
        return {
          $kind: "CongestedObjects",
          message: formatErrorMessage("ExecutionCancelledDueToSharedObjectCongestion", error.ExecutionCancelledDueToSharedObjectCongestion),
          command,
          CongestedObjects: {
            name: "ExecutionCanceledDueToConsensusObjectCongestion",
            objects: error.ExecutionCancelledDueToSharedObjectCongestion.congested_objects
          }
        };
      case "AddressDeniedForCoin":
        return {
          $kind: "CoinDenyListError",
          message: formatErrorMessage("AddressDeniedForCoin", error.AddressDeniedForCoin),
          command,
          CoinDenyListError: {
            name: "AddressDeniedForCoin",
            address: error.AddressDeniedForCoin.address,
            coinType: error.AddressDeniedForCoin.coinType
          }
        };
      case "CoinTypeGlobalPause":
        return {
          $kind: "CoinDenyListError",
          message: formatErrorMessage("CoinTypeGlobalPause", error.CoinTypeGlobalPause),
          command,
          CoinDenyListError: {
            name: "CoinTypeGlobalPause",
            coinType: error.CoinTypeGlobalPause.coinType
          }
        };
      case "CircularObjectOwnership":
        return {
          $kind: "ObjectIdError",
          message: formatErrorMessage("CircularObjectOwnership", error.CircularObjectOwnership),
          command,
          ObjectIdError: {
            name: "CircularObjectOwnership",
            objectId: error.CircularObjectOwnership.object
          }
        };
      case "InvalidGasObject":
        return {
          $kind: "ObjectIdError",
          message: "InvalidGasObject",
          command,
          ObjectIdError: {
            name: "InvalidGasObject",
            objectId: ""
          }
        };
      case "InputObjectDeleted":
        return {
          $kind: "ObjectIdError",
          message: "InputObjectDeleted",
          command,
          ObjectIdError: {
            name: "InputObjectDeleted",
            objectId: ""
          }
        };
      case "InvalidTransferObject":
        return {
          $kind: "ObjectIdError",
          message: "InvalidTransferObject",
          command,
          ObjectIdError: {
            name: "InvalidTransferObject",
            objectId: ""
          }
        };
      case "NonExclusiveWriteInputObjectModified":
        return {
          $kind: "Unknown",
          message: formatErrorMessage("NonExclusiveWriteInputObjectModified", error.NonExclusiveWriteInputObjectModified),
          command,
          Unknown: null
        };
      case "InsufficientGas":
      case "InvariantViolation":
      case "FeatureNotYetSupported":
      case "InsufficientCoinBalance":
      case "CoinBalanceOverflow":
      case "PublishErrorNonZeroAddress":
      case "SuiMoveVerificationError":
      case "MovePrimitiveRuntimeError":
      case "VMVerificationOrDeserializationError":
      case "VMInvariantViolation":
      case "FunctionNotFound":
      case "ArityMismatch":
      case "TypeArityMismatch":
      case "NonEntryFunctionInvoked":
      case "UnusedValueWithoutDrop":
      case "InvalidPublicFunctionReturnType":
      case "PublishUpgradeMissingDependency":
      case "PublishUpgradeDependencyDowngrade":
      case "CertificateDenied":
      case "SuiMoveVerificationTimedout":
      case "SharedObjectOperationNotAllowed":
      case "ExecutionCancelledDueToRandomnessUnavailable":
      case "InvalidLinkage":
      case "InsufficientBalanceForWithdraw":
        return {
          $kind: "Unknown",
          message: error.$kind,
          command,
          Unknown: null
        };
      default:
        return {
          $kind: "Unknown",
          message: "Unknown error",
          command,
          Unknown: null
        };
    }
  }
  function parseTransactionBcs(bytes, onlyTransactionKind = false) {
    return (onlyTransactionKind ? TransactionDataBuilder.fromKindBytes(bytes) : TransactionDataBuilder.fromBytes(bytes)).snapshot();
  }
  function extractStatusFromEffectsBcs(effectsBytes) {
    let parsed = null;
    try {
      parsed = MinimalTransactionEffectsWithError.parse(effectsBytes);
    } catch {
      const parsedNoError = MinimalTransactionEffectsNoError.parse(effectsBytes);
      if ((parsedNoError.V1 ?? parsedNoError.V2).status.$kind === "Success") return {
        success: true,
        error: null
      };
      return {
        success: false,
        error: {
          $kind: "Unknown",
          message: "ExecutionFailed",
          Unknown: null
        }
      };
    }
    const status = (parsed.V1 ?? parsed.V2).status;
    if (status.$kind === "Success") return {
      success: true,
      error: null
    };
    return {
      success: false,
      error: parseBcsExecutionError(status.Failure)
    };
  }
  function parseTransactionEffectsBcs(effects) {
    const parsed = suiBcs.TransactionEffects.parse(effects);
    switch (parsed.$kind) {
      case "V1":
        return parseTransactionEffectsV1({
          bytes: effects,
          effects: parsed.V1
        });
      case "V2":
        return parseTransactionEffectsV2({
          bytes: effects,
          effects: parsed.V2
        });
      default:
        throw new Error(`Unknown transaction effects version: ${parsed.$kind}`);
    }
  }
  function parseTransactionEffectsV1(_2) {
    throw new Error("V1 effects are not supported yet");
  }
  function parseTransactionEffectsV2({ bytes, effects }) {
    const changedObjects = effects.changedObjects.map(([id, change]) => {
      return {
        objectId: id,
        inputState: change.inputState.$kind === "Exist" ? "Exists" : "DoesNotExist",
        inputVersion: change.inputState.Exist?.[0][0] ?? null,
        inputDigest: change.inputState.Exist?.[0][1] ?? null,
        inputOwner: change.inputState.Exist?.[1] ?? null,
        outputState: change.outputState.$kind === "NotExist" ? "DoesNotExist" : change.outputState.$kind,
        outputVersion: change.outputState.$kind === "PackageWrite" ? change.outputState.PackageWrite?.[0] : change.outputState.$kind === "ObjectWrite" ? effects.lamportVersion : null,
        outputDigest: change.outputState.$kind === "PackageWrite" ? change.outputState.PackageWrite?.[1] : change.outputState.$kind === "ObjectWrite" ? change.outputState.ObjectWrite?.[0] ?? null : null,
        outputOwner: change.outputState.$kind === "ObjectWrite" ? change.outputState.ObjectWrite[1] : null,
        idOperation: change.idOperation.$kind
      };
    });
    return {
      bcs: bytes,
      version: 2,
      status: effects.status.$kind === "Success" ? {
        success: true,
        error: null
      } : {
        success: false,
        error: parseBcsExecutionError(effects.status.Failure)
      },
      gasUsed: effects.gasUsed,
      transactionDigest: effects.transactionDigest,
      gasObject: effects.gasObjectIndex === null ? null : changedObjects[effects.gasObjectIndex] ?? null,
      eventsDigest: effects.eventsDigest,
      dependencies: effects.dependencies,
      lamportVersion: effects.lamportVersion,
      changedObjects,
      unchangedConsensusObjects: effects.unchangedConsensusObjects.map(([objectId, object2]) => {
        return {
          kind: object2.$kind,
          objectId,
          version: object2.$kind === "ReadOnlyRoot" ? object2.ReadOnlyRoot[0] : object2[object2.$kind],
          digest: object2.$kind === "ReadOnlyRoot" ? object2.ReadOnlyRoot[1] : null
        };
      }),
      auxiliaryDataDigest: effects.auxDataDigest
    };
  }

  // node_modules/jose/dist/webapi/lib/buffer_utils.js
  var encoder = new TextEncoder();
  var decoder = new TextDecoder();
  var MAX_INT32 = 2 ** 32;

  // node_modules/jose/dist/webapi/lib/base64.js
  function decodeBase64(encoded) {
    if (Uint8Array.fromBase64) {
      return Uint8Array.fromBase64(encoded);
    }
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i7 = 0; i7 < binary.length; i7++) {
      bytes[i7] = binary.charCodeAt(i7);
    }
    return bytes;
  }

  // node_modules/jose/dist/webapi/util/base64url.js
  function decode(input) {
    if (Uint8Array.fromBase64) {
      return Uint8Array.fromBase64(typeof input === "string" ? input : decoder.decode(input), {
        alphabet: "base64url"
      });
    }
    let encoded = input;
    if (encoded instanceof Uint8Array) {
      encoded = decoder.decode(encoded);
    }
    encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    try {
      return decodeBase64(encoded);
    } catch {
      throw new TypeError("The input to be decoded is not correctly encoded.");
    }
  }

  // node_modules/jose/dist/webapi/util/errors.js
  var JOSEError = class extends Error {
    constructor(message, options) {
      super(message, options);
      __publicField(this, "code", "ERR_JOSE_GENERIC");
      this.name = this.constructor.name;
      Error.captureStackTrace?.(this, this.constructor);
    }
  };
  __publicField(JOSEError, "code", "ERR_JOSE_GENERIC");
  var JWTInvalid = class extends JOSEError {
    constructor() {
      super(...arguments);
      __publicField(this, "code", "ERR_JWT_INVALID");
    }
  };
  __publicField(JWTInvalid, "code", "ERR_JWT_INVALID");
  var _a6, _b;
  var JWKSMultipleMatchingKeys = class extends (_b = JOSEError, _a6 = Symbol.asyncIterator, _b) {
    constructor(message = "multiple matching keys found in the JSON Web Key Set", options) {
      super(message, options);
      __publicField(this, _a6);
      __publicField(this, "code", "ERR_JWKS_MULTIPLE_MATCHING_KEYS");
    }
  };
  __publicField(JWKSMultipleMatchingKeys, "code", "ERR_JWKS_MULTIPLE_MATCHING_KEYS");

  // node_modules/jose/dist/webapi/lib/is_object.js
  var isObjectLike = (value) => typeof value === "object" && value !== null;
  function isObject(input) {
    if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
      return false;
    }
    if (Object.getPrototypeOf(input) === null) {
      return true;
    }
    let proto = input;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(input) === proto;
  }

  // node_modules/jose/dist/webapi/util/decode_jwt.js
  function decodeJwt(jwt) {
    if (typeof jwt !== "string")
      throw new JWTInvalid("JWTs must use Compact JWS serialization, JWT must be a string");
    const { 1: payload, length } = jwt.split(".");
    if (length === 5)
      throw new JWTInvalid("Only JWTs using Compact JWS serialization can be decoded");
    if (length !== 3)
      throw new JWTInvalid("Invalid JWT");
    if (!payload)
      throw new JWTInvalid("JWTs must contain a payload");
    let decoded;
    try {
      decoded = decode(payload);
    } catch {
      throw new JWTInvalid("Failed to base64url decode the payload");
    }
    let result;
    try {
      result = JSON.parse(decoder.decode(decoded));
    } catch {
      throw new JWTInvalid("Failed to parse the decoded payload as JSON");
    }
    if (!isObject(result))
      throw new JWTInvalid("Invalid JWT Claims Set");
    return result;
  }

  // node_modules/@mysten/window-wallet-core/dist/jwt-session/index.mjs
  var AccountSchema = object({
    address: string(),
    publicKey: string()
  });
  var JwtSessionSchema = object({
    exp: number(),
    iat: number(),
    iss: string(),
    aud: string(),
    payload: object({ accounts: array(AccountSchema) })
  });
  function decodeJwtSession(jwt) {
    const decodedJwt = decodeJwt(jwt);
    return parse(JwtSessionSchema, decodedJwt);
  }

  // node_modules/@mysten/window-wallet-core/dist/web-wallet-channel/responses.mjs
  var ResponseData = variant("type", [
    object({
      type: literal("connect"),
      session: string("`session` is required")
    }),
    object({
      type: literal("sign-transaction"),
      bytes: string(),
      signature: string()
    }),
    object({
      type: literal("sign-and-execute-transaction"),
      bytes: string(),
      signature: string(),
      digest: string(),
      effects: string()
    }),
    object({
      type: literal("sign-personal-message"),
      bytes: string(),
      signature: string()
    })
  ]);
  var ResponsePayload = variant("type", [object({
    type: literal("reject"),
    reason: optional(string("`reason` must be a string"))
  }), object({
    type: literal("resolve"),
    data: ResponseData
  })]);
  var Response = object({
    id: pipe(string(), uuid()),
    source: literal("web-wallet-channel"),
    payload: ResponsePayload,
    version: literal("1")
  });

  // node_modules/@mysten/window-wallet-core/dist/web-wallet-channel/utils.mjs
  function getClientMetadata() {
    return {
      version: "1",
      originUrl: window.location.href,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: Date.now()
    };
  }

  // node_modules/@mysten/window-wallet-core/dist/web-wallet-channel/dapp-post-message-channel.mjs
  var _popup, _version, _id, _hostOrigin, _hostPathname, _appName, _extraRequestOptions, _promise, _resolve, _reject, _interval, _isSendCalled, _listener, _DappPostMessageChannel_instances, cleanup_fn, _a7;
  var DappPostMessageChannel = (_a7 = class {
    constructor({ appName, hostOrigin, hostPathname = "dapp-request", extraRequestOptions, popupWindow }) {
      __privateAdd(this, _DappPostMessageChannel_instances);
      __privateAdd(this, _popup);
      __privateAdd(this, _version, "1");
      __privateAdd(this, _id);
      __privateAdd(this, _hostOrigin);
      __privateAdd(this, _hostPathname);
      __privateAdd(this, _appName);
      __privateAdd(this, _extraRequestOptions);
      __privateAdd(this, _promise);
      __privateAdd(this, _resolve);
      __privateAdd(this, _reject);
      __privateAdd(this, _interval, null);
      __privateAdd(this, _isSendCalled, false);
      __privateAdd(this, _listener, (event) => {
        if (event.origin !== __privateGet(this, _hostOrigin)) return;
        const { success, output } = safeParse(Response, event.data);
        if (!success || output.id !== __privateGet(this, _id)) return;
        __privateMethod(this, _DappPostMessageChannel_instances, cleanup_fn).call(this);
        if (output.payload.type === "reject") __privateGet(this, _reject).call(this, /* @__PURE__ */ new Error("User rejected the request"));
        else if (output.payload.type === "resolve") __privateGet(this, _resolve).call(this, output.payload.data);
      });
      const popup = popupWindow ?? window.open("about:blank", "_blank");
      if (!popup) throw new Error("Failed to open new window");
      __privateSet(this, _id, crypto.randomUUID());
      __privateSet(this, _popup, popup);
      __privateSet(this, _hostOrigin, hostOrigin);
      __privateSet(this, _hostPathname, hostPathname);
      __privateSet(this, _appName, appName);
      const { promise, resolve, reject } = promiseWithResolvers();
      __privateSet(this, _promise, promise);
      __privateSet(this, _resolve, resolve);
      __privateSet(this, _reject, reject);
      __privateSet(this, _extraRequestOptions, extraRequestOptions);
      __privateSet(this, _interval, setInterval(() => {
        try {
          if (__privateGet(this, _popup).closed) {
            __privateMethod(this, _DappPostMessageChannel_instances, cleanup_fn).call(this);
            reject(/* @__PURE__ */ new Error("User closed the wallet window"));
          }
        } catch {
        }
      }, 1e3));
    }
    send({ type, ...data }) {
      if (__privateGet(this, _popup).closed) throw new Error("User closed the wallet window");
      if (__privateGet(this, _isSendCalled)) throw new Error("send() can only be called once");
      __privateSet(this, _isSendCalled, true);
      window.addEventListener("message", __privateGet(this, _listener));
      const requestData = {
        version: __privateGet(this, _version),
        requestId: __privateGet(this, _id),
        appUrl: window.location.href.split("#")[0],
        appName: __privateGet(this, _appName),
        payload: {
          type,
          ...data
        },
        metadata: getClientMetadata(),
        extraRequestOptions: __privateGet(this, _extraRequestOptions)
      };
      const encodedRequestData = encodeURIComponent(btoa(JSON.stringify(requestData)));
      __privateGet(this, _popup).location.assign(`${__privateGet(this, _hostOrigin)}/${__privateGet(this, _hostPathname)}#${encodedRequestData}`);
      return __privateGet(this, _promise);
    }
    close() {
      __privateMethod(this, _DappPostMessageChannel_instances, cleanup_fn).call(this);
      __privateGet(this, _popup).close();
    }
  }, _popup = new WeakMap(), _version = new WeakMap(), _id = new WeakMap(), _hostOrigin = new WeakMap(), _hostPathname = new WeakMap(), _appName = new WeakMap(), _extraRequestOptions = new WeakMap(), _promise = new WeakMap(), _resolve = new WeakMap(), _reject = new WeakMap(), _interval = new WeakMap(), _isSendCalled = new WeakMap(), _listener = new WeakMap(), _DappPostMessageChannel_instances = new WeakSet(), cleanup_fn = function() {
    if (__privateGet(this, _interval)) {
      clearInterval(__privateGet(this, _interval));
      __privateSet(this, _interval, null);
    }
    window.removeEventListener("message", __privateGet(this, _listener));
  }, _a7);

  // node_modules/@mysten/slush-wallet/dist/wallet/index.mjs
  var DEFAULT_SLUSH_ORIGIN = "https://my.slush.app";
  var SLUSH_SESSION_KEY = "slush:session";
  var SLUSH_WALLET_NAME = "Slush";
  var SLUSH_WALLET_ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMjRDMCAxMC43NDUyIDEwLjc0NTIgMCAyNCAwQzM3LjI1NDggMCA0OCAxMC43NDUyIDQ4IDI0QzQ4IDM3LjI1NDggMzcuMjU0OCA0OCAyNCA0OEMxMC43NDUyIDQ4IDAgMzcuMjU0OCAwIDI0WiIgZmlsbD0iIzBDMEExRiIvPgo8cGF0aCBkPSJNMTMuMTM1OCAzMi4xMDg1QzE0LjE3MDEgMzUuOTY4MyAxOC4wMzMxIDM5LjQ2MjQgMjYuMDI1NSAzNy4zMjA4QzMzLjY1MTUgMzUuMjc3NCAzOC40MzA5IDI5LjAwNCAzNy4xOTE2IDI0LjM3ODlDMzYuNzYzNiAyMi43ODE3IDM1LjQ3NDYgMjEuNzAwNiAzMy40ODcyIDIxLjg3NjVMMTUuNzE2NSAyMy4zNTcyQzE0LjU5NzMgMjMuNDQzIDE0LjA4NDIgMjMuMjU5NiAxMy43ODgxIDIyLjU1NDNDMTMuNTAxIDIxLjg4MjMgMTMuNjY0NiAyMS4xNjA5IDE1LjAxNjMgMjAuNDc3N0wyOC41NDAxIDEzLjUzNzRDMjkuNTc2NyAxMy4wMSAzMC4yNjcxIDEyLjc4OTMgMzAuODk4IDEzLjAxMjZDMzEuMjkzNCAxMy4xNTYzIDMxLjU1MzggMTMuNzI4NCAzMS4zMTQ3IDE0LjQzNDRMMzAuNDM3OCAxNy4wMjMyQzI5LjM2MTcgMjAuMjAwMiAzMS42NjUzIDIwLjkzODIgMzIuOTY0MSAyMC41OTAyQzM0LjkyODkgMjAuMDYzNyAzNS4zOTExIDE4LjE5MjMgMzQuNzU4MSAxNS44Mjk5QzMzLjE1MzMgOS44NDA1NCAyNi43OTkgOC45MDQxMSAyMS4wMzc4IDEwLjQ0NzhDMTUuMTc2NyAxMi4wMTgzIDEwLjA5NiAxNi43Njc2IDExLjY0NzQgMjIuNTU3M0MxMi4wMTI5IDIzLjkyMTYgMTMuMjY4NyAyNS4wMTE2IDE0LjcyMzIgMjQuOTc4NUwxNi45NDM4IDI0Ljk3MzFDMTcuNDAwNCAyNC45NjI1IDE3LjIzNiAyNSAxOC4xMTcgMjQuOTI3MUMxOC45OTggMjQuODU0MSAyMS4zNTA5IDI0LjU2NDYgMjEuMzUwOSAyNC41NjQ2TDMyLjg5NjIgMjMuMjU4TDMzLjE5MzcgMjMuMjE0OEMzMy44Njg5IDIzLjA5OTcgMzQuMzc5MiAyMy4yNzUgMzQuODEwNiAyNC4wMTgzQzM1LjQ1NjMgMjUuMTMwNCAzNC40NzEyIDI1Ljk2OTEgMzMuMjkyIDI2Ljk3MzFDMzMuMjYwNSAyNyAzMy4yMjg4IDI3LjAyNyAzMy4xOTcgMjcuMDU0MUwyMy4wNDgyIDM1LjgwMDVDMjEuMzA4NyAzNy4zMDA4IDIwLjA4NjcgMzYuNzM2NyAxOS42NTg4IDM1LjEzOTVMMTguMTQzMSAyOS40ODI5QzE3Ljc2ODcgMjguMDg1NCAxNi40MDQxIDI2Ljk4ODkgMTQuODA1NiAyNy40MTcyQzEyLjgwNzUgMjcuOTUyNiAxMi42NDU1IDMwLjI3ODQgMTMuMTM1OCAzMi4xMDg1WiIgZmlsbD0iI0ZCRkFGRiIvPgo8L3N2Zz4K";
  var SUI_WALLET_EXTENSION_ID = "com.mystenlabs.suiwallet";
  var METADATA_API_URL = "https://api.slush.app/api/wallet/metadata";
  var FALLBACK_METADATA = {
    id: "com.mystenlabs.suiwallet.web",
    walletName: "Slush",
    description: "Trade and earn on Sui.",
    icon: SLUSH_WALLET_ICON,
    enabled: true
  };
  var WalletMetadataSchema = object({
    id: string("Wallet ID is required"),
    walletName: string("Wallet name is required"),
    icon: string("Icon must be a valid wallet icon format"),
    enabled: boolean("Enabled is required")
  });
  function setSessionToStorage(session) {
    localStorage.setItem(SLUSH_SESSION_KEY, session);
  }
  function getSessionFromStorage() {
    const session = localStorage.getItem(SLUSH_SESSION_KEY);
    if (!session) throw new Error("No session found");
    return session;
  }
  var walletAccountFeatures = [
    "sui:signTransaction",
    "sui:signAndExecuteTransaction",
    "sui:signPersonalMessage",
    "sui:signTransactionBlock",
    "sui:signAndExecuteTransactionBlock"
  ];
  function getAccountsFromSession(session) {
    const { payload } = decodeJwtSession(session);
    return payload.accounts.map((account) => {
      return new ReadonlyWalletAccount({
        address: account.address,
        chains: SUI_CHAINS,
        features: walletAccountFeatures,
        publicKey: fromBase64(account.publicKey)
      });
    });
  }
  var _id2, _events, _accounts, _origin, _walletName, _icon, _name, _signTransactionBlock, _signTransaction, _signAndExecuteTransaction, _signPersonalMessage, _on, _SlushWallet_instances, setAccounts_fn, _connect, getPreviouslyAuthorizedAccounts_fn, _disconnect, getNewPopupChannel_fn, _a8;
  var SlushWallet = (_a8 = class {
    constructor({ name, origin, metadata }) {
      __privateAdd(this, _SlushWallet_instances);
      __privateAdd(this, _id2);
      __privateAdd(this, _events);
      __privateAdd(this, _accounts);
      __privateAdd(this, _origin);
      __privateAdd(this, _walletName);
      __privateAdd(this, _icon);
      __privateAdd(this, _name);
      __privateAdd(this, _signTransactionBlock, async ({ transactionBlock, account, chain: chain2 }) => {
        const data = await transactionBlock.toJSON();
        const response = await __privateMethod(this, _SlushWallet_instances, getNewPopupChannel_fn).call(this).send({
          type: "sign-transaction",
          transaction: data,
          address: account.address,
          chain: chain2,
          session: getSessionFromStorage()
        });
        return {
          transactionBlockBytes: response.bytes,
          signature: response.signature
        };
      });
      __privateAdd(this, _signTransaction, async ({ transaction, account, chain: chain2 }) => {
        const popup = __privateMethod(this, _SlushWallet_instances, getNewPopupChannel_fn).call(this);
        const tx = await transaction.toJSON();
        const response = await popup.send({
          type: "sign-transaction",
          transaction: tx,
          address: account.address,
          chain: chain2,
          session: getSessionFromStorage()
        });
        return {
          bytes: response.bytes,
          signature: response.signature
        };
      });
      __privateAdd(this, _signAndExecuteTransaction, async ({ transaction, account, chain: chain2 }) => {
        const popup = __privateMethod(this, _SlushWallet_instances, getNewPopupChannel_fn).call(this);
        const data = await transaction.toJSON();
        const response = await popup.send({
          type: "sign-and-execute-transaction",
          transaction: data,
          address: account.address,
          chain: chain2,
          session: getSessionFromStorage()
        });
        return {
          bytes: response.bytes,
          signature: response.signature,
          digest: response.digest,
          effects: response.effects
        };
      });
      __privateAdd(this, _signPersonalMessage, async ({ message, account, chain: chain2 }) => {
        const response = await __privateMethod(this, _SlushWallet_instances, getNewPopupChannel_fn).call(this).send({
          type: "sign-personal-message",
          message: toBase64(message),
          address: account.address,
          chain: chain2 ?? account.chains[0],
          session: getSessionFromStorage()
        });
        return {
          bytes: response.bytes,
          signature: response.signature
        };
      });
      __privateAdd(this, _on, (event, listener) => {
        __privateGet(this, _events).on(event, listener);
        return () => __privateGet(this, _events).off(event, listener);
      });
      __privateAdd(this, _connect, async (input) => {
        if (input?.silent) return { accounts: this.accounts };
        const response = await __privateMethod(this, _SlushWallet_instances, getNewPopupChannel_fn).call(this).send({ type: "connect" });
        setSessionToStorage(response.session);
        __privateMethod(this, _SlushWallet_instances, setAccounts_fn).call(this, getAccountsFromSession(response.session));
        return { accounts: this.accounts };
      });
      __privateAdd(this, _disconnect, async () => {
        localStorage.removeItem(SLUSH_SESSION_KEY);
        __privateMethod(this, _SlushWallet_instances, setAccounts_fn).call(this, []);
      });
      __privateSet(this, _id2, metadata.id);
      __privateSet(this, _accounts, __privateMethod(this, _SlushWallet_instances, getPreviouslyAuthorizedAccounts_fn).call(this));
      __privateSet(this, _events, mitt());
      __privateSet(this, _origin, origin || DEFAULT_SLUSH_ORIGIN);
      __privateSet(this, _name, name);
      __privateSet(this, _walletName, metadata.walletName);
      __privateSet(this, _icon, metadata.icon);
    }
    get name() {
      return __privateGet(this, _walletName);
    }
    get id() {
      return __privateGet(this, _id2);
    }
    get icon() {
      return __privateGet(this, _icon);
    }
    get version() {
      return "1.0.0";
    }
    get chains() {
      return SUI_CHAINS;
    }
    get accounts() {
      return __privateGet(this, _accounts);
    }
    get features() {
      return {
        "standard:connect": {
          version: "1.0.0",
          connect: __privateGet(this, _connect)
        },
        "standard:disconnect": {
          version: "1.0.0",
          disconnect: __privateGet(this, _disconnect)
        },
        "standard:events": {
          version: "1.0.0",
          on: __privateGet(this, _on)
        },
        "sui:signTransactionBlock": {
          version: "1.0.0",
          signTransactionBlock: __privateGet(this, _signTransactionBlock)
        },
        "sui:signTransaction": {
          version: "2.0.0",
          signTransaction: __privateGet(this, _signTransaction)
        },
        "sui:signPersonalMessage": {
          version: "1.1.0",
          signPersonalMessage: __privateGet(this, _signPersonalMessage)
        },
        "sui:signAndExecuteTransaction": {
          version: "2.0.0",
          signAndExecuteTransaction: __privateGet(this, _signAndExecuteTransaction)
        }
      };
    }
    updateMetadata(metadata) {
      __privateSet(this, _id2, metadata.id);
      __privateSet(this, _walletName, metadata.walletName);
      __privateSet(this, _icon, metadata.icon);
    }
  }, _id2 = new WeakMap(), _events = new WeakMap(), _accounts = new WeakMap(), _origin = new WeakMap(), _walletName = new WeakMap(), _icon = new WeakMap(), _name = new WeakMap(), _signTransactionBlock = new WeakMap(), _signTransaction = new WeakMap(), _signAndExecuteTransaction = new WeakMap(), _signPersonalMessage = new WeakMap(), _on = new WeakMap(), _SlushWallet_instances = new WeakSet(), setAccounts_fn = function(accounts) {
    __privateSet(this, _accounts, accounts);
    __privateGet(this, _events).emit("change", { accounts: this.accounts });
  }, _connect = new WeakMap(), getPreviouslyAuthorizedAccounts_fn = function() {
    try {
      return getAccountsFromSession(getSessionFromStorage());
    } catch {
      return [];
    }
  }, _disconnect = new WeakMap(), getNewPopupChannel_fn = function() {
    return new DappPostMessageChannel({
      appName: __privateGet(this, _name),
      hostOrigin: __privateGet(this, _origin)
    });
  }, _a8);
  async function fetchMetadata(metadataApiUrl) {
    const response = await fetch(metadataApiUrl);
    if (!response.ok) throw new Error("Failed to fetch wallet metadata");
    return parse(WalletMetadataSchema, await response.json());
  }
  function registerSlushWallet(name, { origin, metadataApiUrl = METADATA_API_URL } = {}) {
    const wallets2 = getWallets();
    let unregister = null;
    wallets2.on("register", (wallet) => {
      if (wallet.id === SUI_WALLET_EXTENSION_ID) unregister?.();
    });
    if (wallets2.get().find((wallet) => wallet.id === SUI_WALLET_EXTENSION_ID)) return;
    const slushWalletInstance = new SlushWallet({
      name,
      origin,
      metadata: FALLBACK_METADATA
    });
    unregister = wallets2.register(slushWalletInstance);
    fetchMetadata(metadataApiUrl).then((metadata) => {
      if (!metadata.enabled) {
        console.log("Slush wallet is not currently enabled.");
        unregister?.();
        return;
      }
      slushWalletInstance.updateMetadata(metadata);
    }).catch((error) => {
      console.error("Error fetching metadata", error);
    });
    return {
      wallet: slushWalletInstance,
      unregister
    };
  }

  // node_modules/@mysten/sui/dist/cryptography/signature-scheme.mjs
  var SIGNATURE_SCHEME_TO_FLAG = {
    ED25519: 0,
    Secp256k1: 1,
    Secp256r1: 2,
    MultiSig: 3,
    ZkLogin: 5,
    Passkey: 6
  };
  var SIGNATURE_SCHEME_TO_SIZE = {
    ED25519: 32,
    Secp256k1: 33,
    Secp256r1: 33,
    Passkey: 33
  };
  var SIGNATURE_FLAG_TO_SCHEME = {
    0: "ED25519",
    1: "Secp256k1",
    2: "Secp256r1",
    3: "MultiSig",
    5: "ZkLogin",
    6: "Passkey"
  };

  // node_modules/@mysten/sui/dist/cryptography/intent.mjs
  function messageWithIntent(scope, message) {
    return suiBcs.IntentMessage(suiBcs.bytes(message.length)).serialize({
      intent: {
        scope: { [scope]: true },
        version: { V0: true },
        appId: { Sui: true }
      },
      value: message
    }).toBytes();
  }

  // node_modules/@mysten/sui/dist/cryptography/publickey.mjs
  function bytesEqual(a3, b3) {
    if (a3 === b3) return true;
    if (a3.length !== b3.length) return false;
    for (let i7 = 0; i7 < a3.length; i7++) if (a3[i7] !== b3[i7]) return false;
    return true;
  }
  var PublicKey2 = class {
    /**
    * Checks if two public keys are equal
    */
    equals(publicKey) {
      return bytesEqual(this.toRawBytes(), publicKey.toRawBytes());
    }
    /**
    * Return the base-64 representation of the public key
    */
    toBase64() {
      return toBase64(this.toRawBytes());
    }
    toString() {
      throw new Error("`toString` is not implemented on public keys. Use `toBase64()` or `toRawBytes()` instead.");
    }
    /**
    * Return the Sui representation of the public key encoded in
    * base-64. A Sui public key is formed by the concatenation
    * of the scheme flag with the raw bytes of the public key
    */
    toSuiPublicKey() {
      return toBase64(this.toSuiBytes());
    }
    verifyWithIntent(bytes, signature, intent) {
      const digest = blake2b(messageWithIntent(intent, bytes), { dkLen: 32 });
      return this.verify(digest, signature);
    }
    /**
    * Verifies that the signature is valid for for the provided PersonalMessage
    */
    verifyPersonalMessage(message, signature) {
      return this.verifyWithIntent(suiBcs.byteVector().serialize(message).toBytes(), signature, "PersonalMessage");
    }
    /**
    * Verifies that the signature is valid for for the provided Transaction
    */
    verifyTransaction(transaction, signature) {
      return this.verifyWithIntent(transaction, signature, "TransactionData");
    }
    /**
    * Verifies that the public key is associated with the provided address
    */
    verifyAddress(address) {
      return this.toSuiAddress() === address;
    }
    /**
    * Returns the bytes representation of the public key
    * prefixed with the signature scheme flag
    */
    toSuiBytes() {
      const rawBytes = this.toRawBytes();
      const suiBytes = new Uint8Array(rawBytes.length + 1);
      suiBytes.set([this.flag()]);
      suiBytes.set(rawBytes, 1);
      return suiBytes;
    }
    /**
    * Return the Sui address associated with this Ed25519 public key
    */
    toSuiAddress() {
      return normalizeSuiAddress(bytesToHex(blake2b(this.toSuiBytes(), { dkLen: 32 })).slice(0, SUI_ADDRESS_LENGTH * 2));
    }
  };
  function parseSerializedKeypairSignature(serializedSignature) {
    const bytes = fromBase64(serializedSignature);
    const signatureScheme = SIGNATURE_FLAG_TO_SCHEME[bytes[0]];
    switch (signatureScheme) {
      case "ED25519":
      case "Secp256k1":
      case "Secp256r1":
        const size2 = SIGNATURE_SCHEME_TO_SIZE[signatureScheme];
        const signature = bytes.slice(1, bytes.length - size2);
        return {
          serializedSignature,
          signatureScheme,
          signature,
          publicKey: bytes.slice(1 + signature.length),
          bytes
        };
      default:
        throw new Error("Unsupported signature scheme");
    }
  }

  // node_modules/@noble/hashes/sha2.js
  var K512 = /* @__PURE__ */ (() => split([
    "0x428a2f98d728ae22",
    "0x7137449123ef65cd",
    "0xb5c0fbcfec4d3b2f",
    "0xe9b5dba58189dbbc",
    "0x3956c25bf348b538",
    "0x59f111f1b605d019",
    "0x923f82a4af194f9b",
    "0xab1c5ed5da6d8118",
    "0xd807aa98a3030242",
    "0x12835b0145706fbe",
    "0x243185be4ee4b28c",
    "0x550c7dc3d5ffb4e2",
    "0x72be5d74f27b896f",
    "0x80deb1fe3b1696b1",
    "0x9bdc06a725c71235",
    "0xc19bf174cf692694",
    "0xe49b69c19ef14ad2",
    "0xefbe4786384f25e3",
    "0x0fc19dc68b8cd5b5",
    "0x240ca1cc77ac9c65",
    "0x2de92c6f592b0275",
    "0x4a7484aa6ea6e483",
    "0x5cb0a9dcbd41fbd4",
    "0x76f988da831153b5",
    "0x983e5152ee66dfab",
    "0xa831c66d2db43210",
    "0xb00327c898fb213f",
    "0xbf597fc7beef0ee4",
    "0xc6e00bf33da88fc2",
    "0xd5a79147930aa725",
    "0x06ca6351e003826f",
    "0x142929670a0e6e70",
    "0x27b70a8546d22ffc",
    "0x2e1b21385c26c926",
    "0x4d2c6dfc5ac42aed",
    "0x53380d139d95b3df",
    "0x650a73548baf63de",
    "0x766a0abb3c77b2a8",
    "0x81c2c92e47edaee6",
    "0x92722c851482353b",
    "0xa2bfe8a14cf10364",
    "0xa81a664bbc423001",
    "0xc24b8b70d0f89791",
    "0xc76c51a30654be30",
    "0xd192e819d6ef5218",
    "0xd69906245565a910",
    "0xf40e35855771202a",
    "0x106aa07032bbd1b8",
    "0x19a4c116b8d2d0c8",
    "0x1e376c085141ab53",
    "0x2748774cdf8eeb99",
    "0x34b0bcb5e19b48a8",
    "0x391c0cb3c5c95a63",
    "0x4ed8aa4ae3418acb",
    "0x5b9cca4f7763e373",
    "0x682e6ff3d6b2b8a3",
    "0x748f82ee5defb2fc",
    "0x78a5636f43172f60",
    "0x84c87814a1f0ab72",
    "0x8cc702081a6439ec",
    "0x90befffa23631e28",
    "0xa4506cebde82bde9",
    "0xbef9a3f7b2c67915",
    "0xc67178f2e372532b",
    "0xca273eceea26619c",
    "0xd186b8c721c0c207",
    "0xeada7dd6cde0eb1e",
    "0xf57d4f7fee6ed178",
    "0x06f067aa72176fba",
    "0x0a637dc5a2c898a6",
    "0x113f9804bef90dae",
    "0x1b710b35131c471b",
    "0x28db77f523047d84",
    "0x32caab7b40c72493",
    "0x3c9ebe0a15c9bebc",
    "0x431d67c49c100d4c",
    "0x4cc5d4becb3e42b6",
    "0x597f299cfc657e2a",
    "0x5fcb6fab3ad6faec",
    "0x6c44198c4a475817"
  ].map((n6) => BigInt(n6))))();
  var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
  var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
  var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
  var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
  var SHA2_64B = class extends HashMD {
    constructor(outputLen) {
      super(128, outputLen, 16, false);
    }
    // prettier-ignore
    get() {
      const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
      return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
    }
    // prettier-ignore
    set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
      this.Ah = Ah | 0;
      this.Al = Al | 0;
      this.Bh = Bh | 0;
      this.Bl = Bl | 0;
      this.Ch = Ch | 0;
      this.Cl = Cl | 0;
      this.Dh = Dh | 0;
      this.Dl = Dl | 0;
      this.Eh = Eh | 0;
      this.El = El | 0;
      this.Fh = Fh | 0;
      this.Fl = Fl | 0;
      this.Gh = Gh | 0;
      this.Gl = Gl | 0;
      this.Hh = Hh | 0;
      this.Hl = Hl | 0;
    }
    process(view, offset3) {
      for (let i7 = 0; i7 < 16; i7++, offset3 += 4) {
        SHA512_W_H[i7] = view.getUint32(offset3);
        SHA512_W_L[i7] = view.getUint32(offset3 += 4);
      }
      for (let i7 = 16; i7 < 80; i7++) {
        const W15h = SHA512_W_H[i7 - 15] | 0;
        const W15l = SHA512_W_L[i7 - 15] | 0;
        const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
        const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
        const W2h = SHA512_W_H[i7 - 2] | 0;
        const W2l = SHA512_W_L[i7 - 2] | 0;
        const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
        const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
        const SUMl = add4L(s0l, s1l, SHA512_W_L[i7 - 7], SHA512_W_L[i7 - 16]);
        const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i7 - 7], SHA512_W_H[i7 - 16]);
        SHA512_W_H[i7] = SUMh | 0;
        SHA512_W_L[i7] = SUMl | 0;
      }
      let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
      for (let i7 = 0; i7 < 80; i7++) {
        const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
        const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
        const CHIh = Eh & Fh ^ ~Eh & Gh;
        const CHIl = El & Fl ^ ~El & Gl;
        const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i7], SHA512_W_L[i7]);
        const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i7], SHA512_W_H[i7]);
        const T1l = T1ll | 0;
        const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
        const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
        const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
        const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
        Hh = Gh | 0;
        Hl = Gl | 0;
        Gh = Fh | 0;
        Gl = Fl | 0;
        Fh = Eh | 0;
        Fl = El | 0;
        ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
        Dh = Ch | 0;
        Dl = Cl | 0;
        Ch = Bh | 0;
        Cl = Bl | 0;
        Bh = Ah | 0;
        Bl = Al | 0;
        const All = add3L(T1l, sigma0l, MAJl);
        Ah = add3H(All, T1h, sigma0h, MAJh);
        Al = All | 0;
      }
      ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
      ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
      ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
      ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
      ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
      ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
      ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
      ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
      this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
    }
    roundClean() {
      clean2(SHA512_W_H, SHA512_W_L);
    }
    destroy() {
      clean2(this.buffer);
      this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  };
  var _SHA512 = class extends SHA2_64B {
    constructor() {
      super(64);
      __publicField(this, "Ah", SHA512_IV[0] | 0);
      __publicField(this, "Al", SHA512_IV[1] | 0);
      __publicField(this, "Bh", SHA512_IV[2] | 0);
      __publicField(this, "Bl", SHA512_IV[3] | 0);
      __publicField(this, "Ch", SHA512_IV[4] | 0);
      __publicField(this, "Cl", SHA512_IV[5] | 0);
      __publicField(this, "Dh", SHA512_IV[6] | 0);
      __publicField(this, "Dl", SHA512_IV[7] | 0);
      __publicField(this, "Eh", SHA512_IV[8] | 0);
      __publicField(this, "El", SHA512_IV[9] | 0);
      __publicField(this, "Fh", SHA512_IV[10] | 0);
      __publicField(this, "Fl", SHA512_IV[11] | 0);
      __publicField(this, "Gh", SHA512_IV[12] | 0);
      __publicField(this, "Gl", SHA512_IV[13] | 0);
      __publicField(this, "Hh", SHA512_IV[14] | 0);
      __publicField(this, "Hl", SHA512_IV[15] | 0);
    }
  };
  var sha512 = /* @__PURE__ */ createHasher(
    () => new _SHA512(),
    /* @__PURE__ */ oidNist(3)
  );

  // node_modules/@noble/curves/utils.js
  var _0n = /* @__PURE__ */ BigInt(0);
  var _1n = /* @__PURE__ */ BigInt(1);
  function abool(value, title = "") {
    if (typeof value !== "boolean") {
      const prefix = title && `"${title}" `;
      throw new Error(prefix + "expected boolean, got type=" + typeof value);
    }
    return value;
  }
  function abignumber(n6) {
    if (typeof n6 === "bigint") {
      if (!isPosBig(n6))
        throw new Error("positive bigint expected, got " + n6);
    } else
      anumber2(n6);
    return n6;
  }
  function hexToNumber(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    return hex === "" ? _0n : BigInt("0x" + hex);
  }
  function bytesToNumberBE(bytes) {
    return hexToNumber(bytesToHex(bytes));
  }
  function bytesToNumberLE(bytes) {
    return hexToNumber(bytesToHex(copyBytes(abytes(bytes)).reverse()));
  }
  function numberToBytesBE(n6, len) {
    anumber2(len);
    n6 = abignumber(n6);
    const res = hexToBytes(n6.toString(16).padStart(len * 2, "0"));
    if (res.length !== len)
      throw new Error("number too large");
    return res;
  }
  function numberToBytesLE(n6, len) {
    return numberToBytesBE(n6, len).reverse();
  }
  function copyBytes(bytes) {
    return Uint8Array.from(bytes);
  }
  var isPosBig = (n6) => typeof n6 === "bigint" && _0n <= n6;
  function inRange(n6, min2, max2) {
    return isPosBig(n6) && isPosBig(min2) && isPosBig(max2) && min2 <= n6 && n6 < max2;
  }
  function aInRange(title, n6, min2, max2) {
    if (!inRange(n6, min2, max2))
      throw new Error("expected valid " + title + ": " + min2 + " <= n < " + max2 + ", got " + n6);
  }
  var bitMask = (n6) => (_1n << BigInt(n6)) - _1n;
  function validateObject(object2, fields = {}, optFields = {}) {
    if (!object2 || typeof object2 !== "object")
      throw new Error("expected valid options object");
    function checkField(fieldName, expectedType, isOpt) {
      const val = object2[fieldName];
      if (isOpt && val === void 0)
        return;
      const current = typeof val;
      if (current !== expectedType || val === null)
        throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
    }
    const iter = (f3, isOpt) => Object.entries(f3).forEach(([k2, v2]) => checkField(k2, v2, isOpt));
    iter(fields, false);
    iter(optFields, true);
  }
  function memoized(fn) {
    const map3 = /* @__PURE__ */ new WeakMap();
    return (arg, ...args) => {
      const val = map3.get(arg);
      if (val !== void 0)
        return val;
      const computed2 = fn(arg, ...args);
      map3.set(arg, computed2);
      return computed2;
    };
  }

  // node_modules/@noble/curves/abstract/modular.js
  var _0n2 = /* @__PURE__ */ BigInt(0);
  var _1n2 = /* @__PURE__ */ BigInt(1);
  var _2n = /* @__PURE__ */ BigInt(2);
  var _3n = /* @__PURE__ */ BigInt(3);
  var _4n = /* @__PURE__ */ BigInt(4);
  var _5n = /* @__PURE__ */ BigInt(5);
  var _7n = /* @__PURE__ */ BigInt(7);
  var _8n = /* @__PURE__ */ BigInt(8);
  var _9n = /* @__PURE__ */ BigInt(9);
  var _16n = /* @__PURE__ */ BigInt(16);
  function mod(a3, b3) {
    const result = a3 % b3;
    return result >= _0n2 ? result : b3 + result;
  }
  function pow2(x2, power, modulo) {
    let res = x2;
    while (power-- > _0n2) {
      res *= res;
      res %= modulo;
    }
    return res;
  }
  function invert(number2, modulo) {
    if (number2 === _0n2)
      throw new Error("invert: expected non-zero number");
    if (modulo <= _0n2)
      throw new Error("invert: expected positive modulus, got " + modulo);
    let a3 = mod(number2, modulo);
    let b3 = modulo;
    let x2 = _0n2, y3 = _1n2, u3 = _1n2, v2 = _0n2;
    while (a3 !== _0n2) {
      const q = b3 / a3;
      const r7 = b3 % a3;
      const m2 = x2 - u3 * q;
      const n6 = y3 - v2 * q;
      b3 = a3, a3 = r7, x2 = u3, y3 = v2, u3 = m2, v2 = n6;
    }
    const gcd2 = b3;
    if (gcd2 !== _1n2)
      throw new Error("invert: does not exist");
    return mod(x2, modulo);
  }
  function assertIsSquare(Fp, root, n6) {
    if (!Fp.eql(Fp.sqr(root), n6))
      throw new Error("Cannot find square root");
  }
  function sqrt3mod4(Fp, n6) {
    const p1div4 = (Fp.ORDER + _1n2) / _4n;
    const root = Fp.pow(n6, p1div4);
    assertIsSquare(Fp, root, n6);
    return root;
  }
  function sqrt5mod8(Fp, n6) {
    const p5div8 = (Fp.ORDER - _5n) / _8n;
    const n22 = Fp.mul(n6, _2n);
    const v2 = Fp.pow(n22, p5div8);
    const nv = Fp.mul(n6, v2);
    const i7 = Fp.mul(Fp.mul(nv, _2n), v2);
    const root = Fp.mul(nv, Fp.sub(i7, Fp.ONE));
    assertIsSquare(Fp, root, n6);
    return root;
  }
  function sqrt9mod16(P2) {
    const Fp_ = Field(P2);
    const tn = tonelliShanks(P2);
    const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
    const c22 = tn(Fp_, c1);
    const c32 = tn(Fp_, Fp_.neg(c1));
    const c4 = (P2 + _7n) / _16n;
    return (Fp, n6) => {
      let tv1 = Fp.pow(n6, c4);
      let tv2 = Fp.mul(tv1, c1);
      const tv3 = Fp.mul(tv1, c22);
      const tv4 = Fp.mul(tv1, c32);
      const e1 = Fp.eql(Fp.sqr(tv2), n6);
      const e22 = Fp.eql(Fp.sqr(tv3), n6);
      tv1 = Fp.cmov(tv1, tv2, e1);
      tv2 = Fp.cmov(tv4, tv3, e22);
      const e32 = Fp.eql(Fp.sqr(tv2), n6);
      const root = Fp.cmov(tv1, tv2, e32);
      assertIsSquare(Fp, root, n6);
      return root;
    };
  }
  function tonelliShanks(P2) {
    if (P2 < _3n)
      throw new Error("sqrt is not defined for small field");
    let Q = P2 - _1n2;
    let S3 = 0;
    while (Q % _2n === _0n2) {
      Q /= _2n;
      S3++;
    }
    let Z2 = _2n;
    const _Fp = Field(P2);
    while (FpLegendre(_Fp, Z2) === 1) {
      if (Z2++ > 1e3)
        throw new Error("Cannot find square root: probably non-prime P");
    }
    if (S3 === 1)
      return sqrt3mod4;
    let cc = _Fp.pow(Z2, Q);
    const Q1div2 = (Q + _1n2) / _2n;
    return function tonelliSlow(Fp, n6) {
      if (Fp.is0(n6))
        return n6;
      if (FpLegendre(Fp, n6) !== 1)
        throw new Error("Cannot find square root");
      let M2 = S3;
      let c4 = Fp.mul(Fp.ONE, cc);
      let t5 = Fp.pow(n6, Q);
      let R2 = Fp.pow(n6, Q1div2);
      while (!Fp.eql(t5, Fp.ONE)) {
        if (Fp.is0(t5))
          return Fp.ZERO;
        let i7 = 1;
        let t_tmp = Fp.sqr(t5);
        while (!Fp.eql(t_tmp, Fp.ONE)) {
          i7++;
          t_tmp = Fp.sqr(t_tmp);
          if (i7 === M2)
            throw new Error("Cannot find square root");
        }
        const exponent = _1n2 << BigInt(M2 - i7 - 1);
        const b3 = Fp.pow(c4, exponent);
        M2 = i7;
        c4 = Fp.sqr(b3);
        t5 = Fp.mul(t5, c4);
        R2 = Fp.mul(R2, b3);
      }
      return R2;
    };
  }
  function FpSqrt(P2) {
    if (P2 % _4n === _3n)
      return sqrt3mod4;
    if (P2 % _8n === _5n)
      return sqrt5mod8;
    if (P2 % _16n === _9n)
      return sqrt9mod16(P2);
    return tonelliShanks(P2);
  }
  var isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n2) === _1n2;
  var FIELD_FIELDS = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN"
  ];
  function validateField(field) {
    const initial = {
      ORDER: "bigint",
      BYTES: "number",
      BITS: "number"
    };
    const opts = FIELD_FIELDS.reduce((map3, val) => {
      map3[val] = "function";
      return map3;
    }, initial);
    validateObject(field, opts);
    return field;
  }
  function FpPow(Fp, num, power) {
    if (power < _0n2)
      throw new Error("invalid exponent, negatives unsupported");
    if (power === _0n2)
      return Fp.ONE;
    if (power === _1n2)
      return num;
    let p3 = Fp.ONE;
    let d3 = num;
    while (power > _0n2) {
      if (power & _1n2)
        p3 = Fp.mul(p3, d3);
      d3 = Fp.sqr(d3);
      power >>= _1n2;
    }
    return p3;
  }
  function FpInvertBatch(Fp, nums, passZero = false) {
    const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
    const multipliedAcc = nums.reduce((acc, num, i7) => {
      if (Fp.is0(num))
        return acc;
      inverted[i7] = acc;
      return Fp.mul(acc, num);
    }, Fp.ONE);
    const invertedAcc = Fp.inv(multipliedAcc);
    nums.reduceRight((acc, num, i7) => {
      if (Fp.is0(num))
        return acc;
      inverted[i7] = Fp.mul(acc, inverted[i7]);
      return Fp.mul(acc, num);
    }, invertedAcc);
    return inverted;
  }
  function FpLegendre(Fp, n6) {
    const p1mod2 = (Fp.ORDER - _1n2) / _2n;
    const powered = Fp.pow(n6, p1mod2);
    const yes = Fp.eql(powered, Fp.ONE);
    const zero = Fp.eql(powered, Fp.ZERO);
    const no = Fp.eql(powered, Fp.neg(Fp.ONE));
    if (!yes && !zero && !no)
      throw new Error("invalid Legendre symbol result");
    return yes ? 1 : zero ? 0 : -1;
  }
  function nLength(n6, nBitLength) {
    if (nBitLength !== void 0)
      anumber2(nBitLength);
    const _nBitLength = nBitLength !== void 0 ? nBitLength : n6.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
  }
  var _Field = class {
    constructor(ORDER, opts = {}) {
      __publicField(this, "ORDER");
      __publicField(this, "BITS");
      __publicField(this, "BYTES");
      __publicField(this, "isLE");
      __publicField(this, "ZERO", _0n2);
      __publicField(this, "ONE", _1n2);
      __publicField(this, "_lengths");
      __publicField(this, "_sqrt");
      // cached sqrt
      __publicField(this, "_mod");
      if (ORDER <= _0n2)
        throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
      let _nbitLength = void 0;
      this.isLE = false;
      if (opts != null && typeof opts === "object") {
        if (typeof opts.BITS === "number")
          _nbitLength = opts.BITS;
        if (typeof opts.sqrt === "function")
          this.sqrt = opts.sqrt;
        if (typeof opts.isLE === "boolean")
          this.isLE = opts.isLE;
        if (opts.allowedLengths)
          this._lengths = opts.allowedLengths?.slice();
        if (typeof opts.modFromBytes === "boolean")
          this._mod = opts.modFromBytes;
      }
      const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
      if (nByteLength > 2048)
        throw new Error("invalid field: expected ORDER of <= 2048 bytes");
      this.ORDER = ORDER;
      this.BITS = nBitLength;
      this.BYTES = nByteLength;
      this._sqrt = void 0;
      Object.preventExtensions(this);
    }
    create(num) {
      return mod(num, this.ORDER);
    }
    isValid(num) {
      if (typeof num !== "bigint")
        throw new Error("invalid field element: expected bigint, got " + typeof num);
      return _0n2 <= num && num < this.ORDER;
    }
    is0(num) {
      return num === _0n2;
    }
    // is valid and invertible
    isValidNot0(num) {
      return !this.is0(num) && this.isValid(num);
    }
    isOdd(num) {
      return (num & _1n2) === _1n2;
    }
    neg(num) {
      return mod(-num, this.ORDER);
    }
    eql(lhs, rhs) {
      return lhs === rhs;
    }
    sqr(num) {
      return mod(num * num, this.ORDER);
    }
    add(lhs, rhs) {
      return mod(lhs + rhs, this.ORDER);
    }
    sub(lhs, rhs) {
      return mod(lhs - rhs, this.ORDER);
    }
    mul(lhs, rhs) {
      return mod(lhs * rhs, this.ORDER);
    }
    pow(num, power) {
      return FpPow(this, num, power);
    }
    div(lhs, rhs) {
      return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
    }
    // Same as above, but doesn't normalize
    sqrN(num) {
      return num * num;
    }
    addN(lhs, rhs) {
      return lhs + rhs;
    }
    subN(lhs, rhs) {
      return lhs - rhs;
    }
    mulN(lhs, rhs) {
      return lhs * rhs;
    }
    inv(num) {
      return invert(num, this.ORDER);
    }
    sqrt(num) {
      if (!this._sqrt)
        this._sqrt = FpSqrt(this.ORDER);
      return this._sqrt(this, num);
    }
    toBytes(num) {
      return this.isLE ? numberToBytesLE(num, this.BYTES) : numberToBytesBE(num, this.BYTES);
    }
    fromBytes(bytes, skipValidation = false) {
      abytes(bytes);
      const { _lengths: allowedLengths, BYTES, isLE: isLE2, ORDER, _mod: modFromBytes } = this;
      if (allowedLengths) {
        if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES) {
          throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
        }
        const padded = new Uint8Array(BYTES);
        padded.set(bytes, isLE2 ? 0 : padded.length - bytes.length);
        bytes = padded;
      }
      if (bytes.length !== BYTES)
        throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
      let scalar = isLE2 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
      if (modFromBytes)
        scalar = mod(scalar, ORDER);
      if (!skipValidation) {
        if (!this.isValid(scalar))
          throw new Error("invalid field element: outside of range 0..ORDER");
      }
      return scalar;
    }
    // TODO: we don't need it here, move out to separate fn
    invertBatch(lst) {
      return FpInvertBatch(this, lst);
    }
    // We can't move this out because Fp6, Fp12 implement it
    // and it's unclear what to return in there.
    cmov(a3, b3, condition) {
      return condition ? b3 : a3;
    }
  };
  function Field(ORDER, opts = {}) {
    return new _Field(ORDER, opts);
  }

  // node_modules/@noble/curves/abstract/curve.js
  var _0n3 = /* @__PURE__ */ BigInt(0);
  var _1n3 = /* @__PURE__ */ BigInt(1);
  function negateCt(condition, item) {
    const neg = item.negate();
    return condition ? neg : item;
  }
  function normalizeZ(c4, points) {
    const invertedZs = FpInvertBatch(c4.Fp, points.map((p3) => p3.Z));
    return points.map((p3, i7) => c4.fromAffine(p3.toAffine(invertedZs[i7])));
  }
  function validateW(W, bits) {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
      throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
  }
  function calcWOpts(W, scalarBits) {
    validateW(W, scalarBits);
    const windows = Math.ceil(scalarBits / W) + 1;
    const windowSize = 2 ** (W - 1);
    const maxNumber = 2 ** W;
    const mask = bitMask(W);
    const shiftBy = BigInt(W);
    return { windows, windowSize, mask, maxNumber, shiftBy };
  }
  function calcOffsets(n6, window2, wOpts) {
    const { windowSize, mask, maxNumber, shiftBy } = wOpts;
    let wbits = Number(n6 & mask);
    let nextN = n6 >> shiftBy;
    if (wbits > windowSize) {
      wbits -= maxNumber;
      nextN += _1n3;
    }
    const offsetStart = window2 * windowSize;
    const offset3 = offsetStart + Math.abs(wbits) - 1;
    const isZero = wbits === 0;
    const isNeg = wbits < 0;
    const isNegF = window2 % 2 !== 0;
    const offsetF = offsetStart;
    return { nextN, offset: offset3, isZero, isNeg, isNegF, offsetF };
  }
  var pointPrecomputes = /* @__PURE__ */ new WeakMap();
  var pointWindowSizes = /* @__PURE__ */ new WeakMap();
  function getW(P2) {
    return pointWindowSizes.get(P2) || 1;
  }
  function assert0(n6) {
    if (n6 !== _0n3)
      throw new Error("invalid wNAF");
  }
  var wNAF = class {
    // Parametrized with a given Point class (not individual point)
    constructor(Point, bits) {
      __publicField(this, "BASE");
      __publicField(this, "ZERO");
      __publicField(this, "Fn");
      __publicField(this, "bits");
      this.BASE = Point.BASE;
      this.ZERO = Point.ZERO;
      this.Fn = Point.Fn;
      this.bits = bits;
    }
    // non-const time multiplication ladder
    _unsafeLadder(elm, n6, p3 = this.ZERO) {
      let d3 = elm;
      while (n6 > _0n3) {
        if (n6 & _1n3)
          p3 = p3.add(d3);
        d3 = d3.double();
        n6 >>= _1n3;
      }
      return p3;
    }
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @param point Point instance
     * @param W window size
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(point, W) {
      const { windows, windowSize } = calcWOpts(W, this.bits);
      const points = [];
      let p3 = point;
      let base = p3;
      for (let window2 = 0; window2 < windows; window2++) {
        base = p3;
        points.push(base);
        for (let i7 = 1; i7 < windowSize; i7++) {
          base = base.add(p3);
          points.push(base);
        }
        p3 = base.double();
      }
      return points;
    }
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * More compact implementation:
     * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n6) {
      if (!this.Fn.isValid(n6))
        throw new Error("invalid scalar");
      let p3 = this.ZERO;
      let f3 = this.BASE;
      const wo = calcWOpts(W, this.bits);
      for (let window2 = 0; window2 < wo.windows; window2++) {
        const { nextN, offset: offset3, isZero, isNeg, isNegF, offsetF } = calcOffsets(n6, window2, wo);
        n6 = nextN;
        if (isZero) {
          f3 = f3.add(negateCt(isNegF, precomputes[offsetF]));
        } else {
          p3 = p3.add(negateCt(isNeg, precomputes[offset3]));
        }
      }
      assert0(n6);
      return { p: p3, f: f3 };
    }
    /**
     * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
     * @param acc accumulator point to add result of multiplication
     * @returns point
     */
    wNAFUnsafe(W, precomputes, n6, acc = this.ZERO) {
      const wo = calcWOpts(W, this.bits);
      for (let window2 = 0; window2 < wo.windows; window2++) {
        if (n6 === _0n3)
          break;
        const { nextN, offset: offset3, isZero, isNeg } = calcOffsets(n6, window2, wo);
        n6 = nextN;
        if (isZero) {
          continue;
        } else {
          const item = precomputes[offset3];
          acc = acc.add(isNeg ? item.negate() : item);
        }
      }
      assert0(n6);
      return acc;
    }
    getPrecomputes(W, point, transform2) {
      let comp = pointPrecomputes.get(point);
      if (!comp) {
        comp = this.precomputeWindow(point, W);
        if (W !== 1) {
          if (typeof transform2 === "function")
            comp = transform2(comp);
          pointPrecomputes.set(point, comp);
        }
      }
      return comp;
    }
    cached(point, scalar, transform2) {
      const W = getW(point);
      return this.wNAF(W, this.getPrecomputes(W, point, transform2), scalar);
    }
    unsafe(point, scalar, transform2, prev) {
      const W = getW(point);
      if (W === 1)
        return this._unsafeLadder(point, scalar, prev);
      return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform2), scalar, prev);
    }
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    createCache(P2, W) {
      validateW(W, this.bits);
      pointWindowSizes.set(P2, W);
      pointPrecomputes.delete(P2);
    }
    hasCache(elm) {
      return getW(elm) !== 1;
    }
  };
  function createField(order, field, isLE2) {
    if (field) {
      if (field.ORDER !== order)
        throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
      validateField(field);
      return field;
    } else {
      return Field(order, { isLE: isLE2 });
    }
  }
  function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
    if (FpFnLE === void 0)
      FpFnLE = type === "edwards";
    if (!CURVE || typeof CURVE !== "object")
      throw new Error(`expected valid ${type} CURVE object`);
    for (const p3 of ["p", "n", "h"]) {
      const val = CURVE[p3];
      if (!(typeof val === "bigint" && val > _0n3))
        throw new Error(`CURVE.${p3} must be positive bigint`);
    }
    const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
    const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
    const _b2 = type === "weierstrass" ? "b" : "d";
    const params = ["Gx", "Gy", "a", _b2];
    for (const p3 of params) {
      if (!Fp.isValid(CURVE[p3]))
        throw new Error(`CURVE.${p3} must be valid field element of CURVE.Fp`);
    }
    CURVE = Object.freeze(Object.assign({}, CURVE));
    return { CURVE, Fp, Fn };
  }
  function createKeygen(randomSecretKey, getPublicKey) {
    return function keygen(seed) {
      const secretKey = randomSecretKey(seed);
      return { secretKey, publicKey: getPublicKey(secretKey) };
    };
  }

  // node_modules/@noble/curves/abstract/edwards.js
  var _0n4 = BigInt(0);
  var _1n4 = BigInt(1);
  var _2n2 = BigInt(2);
  var _8n2 = BigInt(8);
  function isEdValidXY(Fp, CURVE, x2, y3) {
    const x22 = Fp.sqr(x2);
    const y22 = Fp.sqr(y3);
    const left = Fp.add(Fp.mul(CURVE.a, x22), y22);
    const right = Fp.add(Fp.ONE, Fp.mul(CURVE.d, Fp.mul(x22, y22)));
    return Fp.eql(left, right);
  }
  function edwards(params, extraOpts = {}) {
    const validated = createCurveFields("edwards", params, extraOpts, extraOpts.FpFnLE);
    const { Fp, Fn } = validated;
    let CURVE = validated.CURVE;
    const { h: cofactor } = CURVE;
    validateObject(extraOpts, {}, { uvRatio: "function" });
    const MASK = _2n2 << BigInt(Fn.BYTES * 8) - _1n4;
    const modP = (n6) => Fp.create(n6);
    const uvRatio2 = extraOpts.uvRatio || ((u3, v2) => {
      try {
        return { isValid: true, value: Fp.sqrt(Fp.div(u3, v2)) };
      } catch (e9) {
        return { isValid: false, value: _0n4 };
      }
    });
    if (!isEdValidXY(Fp, CURVE, CURVE.Gx, CURVE.Gy))
      throw new Error("bad curve params: generator point");
    function acoord(title, n6, banZero = false) {
      const min2 = banZero ? _1n4 : _0n4;
      aInRange("coordinate " + title, n6, min2, MASK);
      return n6;
    }
    function aedpoint(other) {
      if (!(other instanceof Point))
        throw new Error("EdwardsPoint expected");
    }
    const toAffineMemo = memoized((p3, iz) => {
      const { X, Y, Z: Z2 } = p3;
      const is0 = p3.is0();
      if (iz == null)
        iz = is0 ? _8n2 : Fp.inv(Z2);
      const x2 = modP(X * iz);
      const y3 = modP(Y * iz);
      const zz = Fp.mul(Z2, iz);
      if (is0)
        return { x: _0n4, y: _1n4 };
      if (zz !== _1n4)
        throw new Error("invZ was invalid");
      return { x: x2, y: y3 };
    });
    const assertValidMemo = memoized((p3) => {
      const { a: a3, d: d3 } = CURVE;
      if (p3.is0())
        throw new Error("bad point: ZERO");
      const { X, Y, Z: Z2, T: T2 } = p3;
      const X2 = modP(X * X);
      const Y2 = modP(Y * Y);
      const Z22 = modP(Z2 * Z2);
      const Z4 = modP(Z22 * Z22);
      const aX2 = modP(X2 * a3);
      const left = modP(Z22 * modP(aX2 + Y2));
      const right = modP(Z4 + modP(d3 * modP(X2 * Y2)));
      if (left !== right)
        throw new Error("bad point: equation left != right (1)");
      const XY = modP(X * Y);
      const ZT = modP(Z2 * T2);
      if (XY !== ZT)
        throw new Error("bad point: equation left != right (2)");
      return true;
    });
    const _Point = class _Point {
      constructor(X, Y, Z2, T2) {
        __publicField(this, "X");
        __publicField(this, "Y");
        __publicField(this, "Z");
        __publicField(this, "T");
        this.X = acoord("x", X);
        this.Y = acoord("y", Y);
        this.Z = acoord("z", Z2, true);
        this.T = acoord("t", T2);
        Object.freeze(this);
      }
      static CURVE() {
        return CURVE;
      }
      static fromAffine(p3) {
        if (p3 instanceof _Point)
          throw new Error("extended point not allowed");
        const { x: x2, y: y3 } = p3 || {};
        acoord("x", x2);
        acoord("y", y3);
        return new _Point(x2, y3, _1n4, modP(x2 * y3));
      }
      // Uses algo from RFC8032 5.1.3.
      static fromBytes(bytes, zip215 = false) {
        const len = Fp.BYTES;
        const { a: a3, d: d3 } = CURVE;
        bytes = copyBytes(abytes(bytes, len, "point"));
        abool(zip215, "zip215");
        const normed = copyBytes(bytes);
        const lastByte = bytes[len - 1];
        normed[len - 1] = lastByte & ~128;
        const y3 = bytesToNumberLE(normed);
        const max2 = zip215 ? MASK : Fp.ORDER;
        aInRange("point.y", y3, _0n4, max2);
        const y22 = modP(y3 * y3);
        const u3 = modP(y22 - _1n4);
        const v2 = modP(d3 * y22 - a3);
        let { isValid, value: x2 } = uvRatio2(u3, v2);
        if (!isValid)
          throw new Error("bad point: invalid y coordinate");
        const isXOdd = (x2 & _1n4) === _1n4;
        const isLastByteOdd = (lastByte & 128) !== 0;
        if (!zip215 && x2 === _0n4 && isLastByteOdd)
          throw new Error("bad point: x=0 and x_0=1");
        if (isLastByteOdd !== isXOdd)
          x2 = modP(-x2);
        return _Point.fromAffine({ x: x2, y: y3 });
      }
      static fromHex(hex, zip215 = false) {
        return _Point.fromBytes(hexToBytes(hex), zip215);
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      precompute(windowSize = 8, isLazy = true) {
        wnaf.createCache(this, windowSize);
        if (!isLazy)
          this.multiply(_2n2);
        return this;
      }
      // Useful in fromAffine() - not for fromBytes(), which always created valid points.
      assertValidity() {
        assertValidMemo(this);
      }
      // Compare one point to another.
      equals(other) {
        aedpoint(other);
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const { X: X2, Y: Y2, Z: Z2 } = other;
        const X1Z2 = modP(X1 * Z2);
        const X2Z1 = modP(X2 * Z1);
        const Y1Z2 = modP(Y1 * Z2);
        const Y2Z1 = modP(Y2 * Z1);
        return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
      }
      is0() {
        return this.equals(_Point.ZERO);
      }
      negate() {
        return new _Point(modP(-this.X), this.Y, this.Z, modP(-this.T));
      }
      // Fast algo for doubling Extended Point.
      // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
      // Cost: 4M + 4S + 1*a + 6add + 1*2.
      double() {
        const { a: a3 } = CURVE;
        const { X: X1, Y: Y1, Z: Z1 } = this;
        const A2 = modP(X1 * X1);
        const B2 = modP(Y1 * Y1);
        const C2 = modP(_2n2 * modP(Z1 * Z1));
        const D2 = modP(a3 * A2);
        const x1y1 = X1 + Y1;
        const E2 = modP(modP(x1y1 * x1y1) - A2 - B2);
        const G = D2 + B2;
        const F = G - C2;
        const H2 = D2 - B2;
        const X3 = modP(E2 * F);
        const Y3 = modP(G * H2);
        const T3 = modP(E2 * H2);
        const Z3 = modP(F * G);
        return new _Point(X3, Y3, Z3, T3);
      }
      // Fast algo for adding 2 Extended Points.
      // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
      // Cost: 9M + 1*a + 1*d + 7add.
      add(other) {
        aedpoint(other);
        const { a: a3, d: d3 } = CURVE;
        const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
        const { X: X2, Y: Y2, Z: Z2, T: T2 } = other;
        const A2 = modP(X1 * X2);
        const B2 = modP(Y1 * Y2);
        const C2 = modP(T1 * d3 * T2);
        const D2 = modP(Z1 * Z2);
        const E2 = modP((X1 + Y1) * (X2 + Y2) - A2 - B2);
        const F = D2 - C2;
        const G = D2 + C2;
        const H2 = modP(B2 - a3 * A2);
        const X3 = modP(E2 * F);
        const Y3 = modP(G * H2);
        const T3 = modP(E2 * H2);
        const Z3 = modP(F * G);
        return new _Point(X3, Y3, Z3, T3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      // Constant-time multiplication.
      multiply(scalar) {
        if (!Fn.isValidNot0(scalar))
          throw new Error("invalid scalar: expected 1 <= sc < curve.n");
        const { p: p3, f: f3 } = wnaf.cached(this, scalar, (p4) => normalizeZ(_Point, p4));
        return normalizeZ(_Point, [p3, f3])[0];
      }
      // Non-constant-time multiplication. Uses double-and-add algorithm.
      // It's faster, but should only be used when you don't care about
      // an exposed private key e.g. sig verification.
      // Does NOT allow scalars higher than CURVE.n.
      // Accepts optional accumulator to merge with multiply (important for sparse scalars)
      multiplyUnsafe(scalar, acc = _Point.ZERO) {
        if (!Fn.isValid(scalar))
          throw new Error("invalid scalar: expected 0 <= sc < curve.n");
        if (scalar === _0n4)
          return _Point.ZERO;
        if (this.is0() || scalar === _1n4)
          return this;
        return wnaf.unsafe(this, scalar, (p3) => normalizeZ(_Point, p3), acc);
      }
      // Checks if point is of small order.
      // If you add something to small order point, you will have "dirty"
      // point with torsion component.
      // Multiplies point by cofactor and checks if the result is 0.
      isSmallOrder() {
        return this.multiplyUnsafe(cofactor).is0();
      }
      // Multiplies point by curve order and checks if the result is 0.
      // Returns `false` is the point is dirty.
      isTorsionFree() {
        return wnaf.unsafe(this, CURVE.n).is0();
      }
      // Converts Extended point to default (x, y) coordinates.
      // Can accept precomputed Z^-1 - for example, from invertBatch.
      toAffine(invertedZ) {
        return toAffineMemo(this, invertedZ);
      }
      clearCofactor() {
        if (cofactor === _1n4)
          return this;
        return this.multiplyUnsafe(cofactor);
      }
      toBytes() {
        const { x: x2, y: y3 } = this.toAffine();
        const bytes = Fp.toBytes(y3);
        bytes[bytes.length - 1] |= x2 & _1n4 ? 128 : 0;
        return bytes;
      }
      toHex() {
        return bytesToHex(this.toBytes());
      }
      toString() {
        return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
      }
    };
    // base / generator point
    __publicField(_Point, "BASE", new _Point(CURVE.Gx, CURVE.Gy, _1n4, modP(CURVE.Gx * CURVE.Gy)));
    // zero / infinity / identity point
    __publicField(_Point, "ZERO", new _Point(_0n4, _1n4, _1n4, _0n4));
    // 0, 1, 1, 0
    // math field
    __publicField(_Point, "Fp", Fp);
    // scalar field
    __publicField(_Point, "Fn", Fn);
    let Point = _Point;
    const wnaf = new wNAF(Point, Fn.BITS);
    Point.BASE.precompute(8);
    return Point;
  }
  function eddsa(Point, cHash, eddsaOpts = {}) {
    if (typeof cHash !== "function")
      throw new Error('"hash" function param is required');
    validateObject(eddsaOpts, {}, {
      adjustScalarBytes: "function",
      randomBytes: "function",
      domain: "function",
      prehash: "function",
      mapToCurve: "function"
    });
    const { prehash } = eddsaOpts;
    const { BASE, Fp, Fn } = Point;
    const randomBytes2 = eddsaOpts.randomBytes || randomBytes;
    const adjustScalarBytes2 = eddsaOpts.adjustScalarBytes || ((bytes) => bytes);
    const domain = eddsaOpts.domain || ((data, ctx, phflag) => {
      abool(phflag, "phflag");
      if (ctx.length || phflag)
        throw new Error("Contexts/pre-hash are not supported");
      return data;
    });
    function modN_LE(hash) {
      return Fn.create(bytesToNumberLE(hash));
    }
    function getPrivateScalar(key) {
      const len = lengths.secretKey;
      abytes(key, lengths.secretKey, "secretKey");
      const hashed = abytes(cHash(key), 2 * len, "hashedSecretKey");
      const head = adjustScalarBytes2(hashed.slice(0, len));
      const prefix = hashed.slice(len, 2 * len);
      const scalar = modN_LE(head);
      return { head, prefix, scalar };
    }
    function getExtendedPublicKey(secretKey) {
      const { head, prefix, scalar } = getPrivateScalar(secretKey);
      const point = BASE.multiply(scalar);
      const pointBytes = point.toBytes();
      return { head, prefix, scalar, point, pointBytes };
    }
    function getPublicKey(secretKey) {
      return getExtendedPublicKey(secretKey).pointBytes;
    }
    function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
      const msg = concatBytes(...msgs);
      return modN_LE(cHash(domain(msg, abytes(context, void 0, "context"), !!prehash)));
    }
    function sign(msg, secretKey, options = {}) {
      msg = abytes(msg, void 0, "message");
      if (prehash)
        msg = prehash(msg);
      const { prefix, scalar, pointBytes } = getExtendedPublicKey(secretKey);
      const r7 = hashDomainToScalar(options.context, prefix, msg);
      const R2 = BASE.multiply(r7).toBytes();
      const k2 = hashDomainToScalar(options.context, R2, pointBytes, msg);
      const s5 = Fn.create(r7 + k2 * scalar);
      if (!Fn.isValid(s5))
        throw new Error("sign failed: invalid s");
      const rs = concatBytes(R2, Fn.toBytes(s5));
      return abytes(rs, lengths.signature, "result");
    }
    const verifyOpts = { zip215: true };
    function verify(sig, msg, publicKey, options = verifyOpts) {
      const { context, zip215 } = options;
      const len = lengths.signature;
      sig = abytes(sig, len, "signature");
      msg = abytes(msg, void 0, "message");
      publicKey = abytes(publicKey, lengths.publicKey, "publicKey");
      if (zip215 !== void 0)
        abool(zip215, "zip215");
      if (prehash)
        msg = prehash(msg);
      const mid = len / 2;
      const r7 = sig.subarray(0, mid);
      const s5 = bytesToNumberLE(sig.subarray(mid, len));
      let A2, R2, SB;
      try {
        A2 = Point.fromBytes(publicKey, zip215);
        R2 = Point.fromBytes(r7, zip215);
        SB = BASE.multiplyUnsafe(s5);
      } catch (error) {
        return false;
      }
      if (!zip215 && A2.isSmallOrder())
        return false;
      const k2 = hashDomainToScalar(context, R2.toBytes(), A2.toBytes(), msg);
      const RkA = R2.add(A2.multiplyUnsafe(k2));
      return RkA.subtract(SB).clearCofactor().is0();
    }
    const _size = Fp.BYTES;
    const lengths = {
      secretKey: _size,
      publicKey: _size,
      signature: 2 * _size,
      seed: _size
    };
    function randomSecretKey(seed = randomBytes2(lengths.seed)) {
      return abytes(seed, lengths.seed, "seed");
    }
    function isValidSecretKey(key) {
      return isBytes2(key) && key.length === Fn.BYTES;
    }
    function isValidPublicKey(key, zip215) {
      try {
        return !!Point.fromBytes(key, zip215);
      } catch (error) {
        return false;
      }
    }
    const utils = {
      getExtendedPublicKey,
      randomSecretKey,
      isValidSecretKey,
      isValidPublicKey,
      /**
       * Converts ed public key to x public key. Uses formula:
       * - ed25519:
       *   - `(u, v) = ((1+y)/(1-y), sqrt(-486664)*u/x)`
       *   - `(x, y) = (sqrt(-486664)*u/v, (u-1)/(u+1))`
       * - ed448:
       *   - `(u, v) = ((y-1)/(y+1), sqrt(156324)*u/x)`
       *   - `(x, y) = (sqrt(156324)*u/v, (1+u)/(1-u))`
       */
      toMontgomery(publicKey) {
        const { y: y3 } = Point.fromBytes(publicKey);
        const size2 = lengths.publicKey;
        const is25519 = size2 === 32;
        if (!is25519 && size2 !== 57)
          throw new Error("only defined for 25519 and 448");
        const u3 = is25519 ? Fp.div(_1n4 + y3, _1n4 - y3) : Fp.div(y3 - _1n4, y3 + _1n4);
        return Fp.toBytes(u3);
      },
      toMontgomerySecret(secretKey) {
        const size2 = lengths.secretKey;
        abytes(secretKey, size2);
        const hashed = cHash(secretKey.subarray(0, size2));
        return adjustScalarBytes2(hashed).subarray(0, size2);
      }
    };
    return Object.freeze({
      keygen: createKeygen(randomSecretKey, getPublicKey),
      getPublicKey,
      sign,
      verify,
      utils,
      Point,
      lengths
    });
  }

  // node_modules/@noble/curves/ed25519.js
  var _1n5 = BigInt(1);
  var _2n3 = BigInt(2);
  var _5n2 = BigInt(5);
  var _8n3 = BigInt(8);
  var ed25519_CURVE_p = BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
  var ed25519_CURVE = /* @__PURE__ */ (() => ({
    p: ed25519_CURVE_p,
    n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
    h: _8n3,
    a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
    d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
    Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
    Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
  }))();
  function ed25519_pow_2_252_3(x2) {
    const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
    const P2 = ed25519_CURVE_p;
    const x22 = x2 * x2 % P2;
    const b22 = x22 * x2 % P2;
    const b4 = pow2(b22, _2n3, P2) * b22 % P2;
    const b5 = pow2(b4, _1n5, P2) * x2 % P2;
    const b10 = pow2(b5, _5n2, P2) * b5 % P2;
    const b20 = pow2(b10, _10n, P2) * b10 % P2;
    const b40 = pow2(b20, _20n, P2) * b20 % P2;
    const b80 = pow2(b40, _40n, P2) * b40 % P2;
    const b160 = pow2(b80, _80n, P2) * b80 % P2;
    const b240 = pow2(b160, _80n, P2) * b80 % P2;
    const b250 = pow2(b240, _10n, P2) * b10 % P2;
    const pow_p_5_8 = pow2(b250, _2n3, P2) * x2 % P2;
    return { pow_p_5_8, b2: b22 };
  }
  function adjustScalarBytes(bytes) {
    bytes[0] &= 248;
    bytes[31] &= 127;
    bytes[31] |= 64;
    return bytes;
  }
  var ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
  function uvRatio(u3, v2) {
    const P2 = ed25519_CURVE_p;
    const v3 = mod(v2 * v2 * v2, P2);
    const v7 = mod(v3 * v3 * v2, P2);
    const pow = ed25519_pow_2_252_3(u3 * v7).pow_p_5_8;
    let x2 = mod(u3 * v3 * pow, P2);
    const vx2 = mod(v2 * x2 * x2, P2);
    const root1 = x2;
    const root2 = mod(x2 * ED25519_SQRT_M1, P2);
    const useRoot1 = vx2 === u3;
    const useRoot2 = vx2 === mod(-u3, P2);
    const noRoot = vx2 === mod(-u3 * ED25519_SQRT_M1, P2);
    if (useRoot1)
      x2 = root1;
    if (useRoot2 || noRoot)
      x2 = root2;
    if (isNegativeLE(x2, P2))
      x2 = mod(-x2, P2);
    return { isValid: useRoot1 || useRoot2, value: x2 };
  }
  var ed25519_Point = /* @__PURE__ */ edwards(ed25519_CURVE, { uvRatio });
  function ed(opts) {
    return eddsa(ed25519_Point, sha512, Object.assign({ adjustScalarBytes }, opts));
  }
  var ed25519 = /* @__PURE__ */ ed({});

  // node_modules/@mysten/sui/dist/keypairs/ed25519/publickey.mjs
  var PUBLIC_KEY_SIZE = 32;
  var _a9;
  var Ed25519PublicKey = (_a9 = class extends PublicKey2 {
    /**
    * Create a new Ed25519PublicKey object
    * @param value ed25519 public key as buffer or base-64 encoded string
    */
    constructor(value) {
      super();
      if (typeof value === "string") this.data = fromBase64(value);
      else if (value instanceof Uint8Array) this.data = value;
      else this.data = Uint8Array.from(value);
      if (this.data.length !== PUBLIC_KEY_SIZE) throw new Error(`Invalid public key input. Expected ${PUBLIC_KEY_SIZE} bytes, got ${this.data.length}`);
    }
    /**
    * Checks if two Ed25519 public keys are equal
    */
    equals(publicKey) {
      return super.equals(publicKey);
    }
    /**
    * Return the byte array representation of the Ed25519 public key
    */
    toRawBytes() {
      return this.data;
    }
    /**
    * Return the Sui address associated with this Ed25519 public key
    */
    flag() {
      return SIGNATURE_SCHEME_TO_FLAG["ED25519"];
    }
    /**
    * Verifies that the signature is valid for for the provided message
    */
    async verify(message, signature) {
      let bytes;
      if (typeof signature === "string") {
        const parsed = parseSerializedKeypairSignature(signature);
        if (parsed.signatureScheme !== "ED25519") throw new Error("Invalid signature scheme");
        if (!bytesEqual(this.toRawBytes(), parsed.publicKey)) throw new Error("Signature does not match public key");
        bytes = parsed.signature;
      } else bytes = signature;
      return ed25519.verify(bytes, message, this.toRawBytes());
    }
  }, _a9.SIZE = PUBLIC_KEY_SIZE, _a9);

  // node_modules/@noble/hashes/hmac.js
  var _HMAC = class {
    constructor(hash, key) {
      __publicField(this, "oHash");
      __publicField(this, "iHash");
      __publicField(this, "blockLen");
      __publicField(this, "outputLen");
      __publicField(this, "finished", false);
      __publicField(this, "destroyed", false);
      ahash(hash);
      abytes(key, void 0, "key");
      this.iHash = hash.create();
      if (typeof this.iHash.update !== "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen;
      this.outputLen = this.iHash.outputLen;
      const blockLen = this.blockLen;
      const pad = new Uint8Array(blockLen);
      pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
      for (let i7 = 0; i7 < pad.length; i7++)
        pad[i7] ^= 54;
      this.iHash.update(pad);
      this.oHash = hash.create();
      for (let i7 = 0; i7 < pad.length; i7++)
        pad[i7] ^= 54 ^ 92;
      this.oHash.update(pad);
      clean2(pad);
    }
    update(buf) {
      aexists(this);
      this.iHash.update(buf);
      return this;
    }
    digestInto(out) {
      aexists(this);
      abytes(out, this.outputLen, "output");
      this.finished = true;
      this.iHash.digestInto(out);
      this.oHash.update(out);
      this.oHash.digestInto(out);
      this.destroy();
    }
    digest() {
      const out = new Uint8Array(this.oHash.outputLen);
      this.digestInto(out);
      return out;
    }
    _cloneInto(to) {
      to || (to = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
      to = to;
      to.finished = finished;
      to.destroyed = destroyed;
      to.blockLen = blockLen;
      to.outputLen = outputLen;
      to.oHash = oHash._cloneInto(to.oHash);
      to.iHash = iHash._cloneInto(to.iHash);
      return to;
    }
    clone() {
      return this._cloneInto();
    }
    destroy() {
      this.destroyed = true;
      this.oHash.destroy();
      this.iHash.destroy();
    }
  };
  var hmac = (hash, key, message) => new _HMAC(hash, key).update(message).digest();
  hmac.create = (hash, key) => new _HMAC(hash, key);

  // node_modules/@noble/hashes/pbkdf2.js
  function pbkdf2Init(hash, _password, _salt, _opts) {
    ahash(hash);
    const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
    const { c: c4, dkLen, asyncTick } = opts;
    anumber2(c4, "c");
    anumber2(dkLen, "dkLen");
    anumber2(asyncTick, "asyncTick");
    if (c4 < 1)
      throw new Error("iterations (c) must be >= 1");
    const password = kdfInputToBytes(_password, "password");
    const salt = kdfInputToBytes(_salt, "salt");
    const DK = new Uint8Array(dkLen);
    const PRF = hmac.create(hash, password);
    const PRFSalt = PRF._cloneInto().update(salt);
    return { c: c4, dkLen, asyncTick, DK, PRF, PRFSalt };
  }
  function pbkdf2Output(PRF, PRFSalt, DK, prfW, u3) {
    PRF.destroy();
    PRFSalt.destroy();
    if (prfW)
      prfW.destroy();
    clean2(u3);
    return DK;
  }
  function pbkdf2(hash, password, salt, opts) {
    const { c: c4, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
    let prfW;
    const arr = new Uint8Array(4);
    const view = createView(arr);
    const u3 = new Uint8Array(PRF.outputLen);
    for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
      const Ti = DK.subarray(pos, pos + PRF.outputLen);
      view.setInt32(0, ti, false);
      (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u3);
      Ti.set(u3.subarray(0, Ti.length));
      for (let ui = 1; ui < c4; ui++) {
        PRF._cloneInto(prfW).update(u3).digestInto(u3);
        for (let i7 = 0; i7 < Ti.length; i7++)
          Ti[i7] ^= u3[i7];
      }
    }
    return pbkdf2Output(PRF, PRFSalt, DK, prfW, u3);
  }

  // node_modules/@scure/bip39/index.js
  function nfkd(str) {
    if (typeof str !== "string")
      throw new TypeError("invalid mnemonic type: " + typeof str);
    return str.normalize("NFKD");
  }
  function normalize(str) {
    const norm = nfkd(str);
    const words = norm.split(" ");
    if (![12, 15, 18, 21, 24].includes(words.length))
      throw new Error("Invalid mnemonic");
    return { nfkd: norm, words };
  }
  var psalt = (passphrase) => nfkd("mnemonic" + passphrase);
  function mnemonicToSeedSync(mnemonic, passphrase = "") {
    return pbkdf2(sha512, normalize(mnemonic).nfkd, psalt(passphrase), { c: 2048, dkLen: 64 });
  }

  // node_modules/@mysten/sui/dist/cryptography/mnemonics.mjs
  function isValidHardenedPath(path) {
    if (!(/* @__PURE__ */ new RegExp("^m\\/44'\\/784'\\/[0-9]+'\\/[0-9]+'\\/[0-9]+'+$")).test(path)) return false;
    return true;
  }
  function mnemonicToSeed(mnemonics) {
    return mnemonicToSeedSync(mnemonics, "");
  }
  function mnemonicToSeedHex(mnemonics) {
    return toHex(mnemonicToSeed(mnemonics));
  }

  // node_modules/@mysten/sui/dist/cryptography/signature.mjs
  function toSerializedSignature({ signature, signatureScheme, publicKey }) {
    if (!publicKey) throw new Error("`publicKey` is required");
    const pubKeyBytes = publicKey.toRawBytes();
    const serializedSignature = new Uint8Array(1 + signature.length + pubKeyBytes.length);
    serializedSignature.set([SIGNATURE_SCHEME_TO_FLAG[signatureScheme]]);
    serializedSignature.set(signature, 1);
    serializedSignature.set(pubKeyBytes, 1 + signature.length);
    return toBase64(serializedSignature);
  }

  // node_modules/@mysten/sui/dist/cryptography/keypair.mjs
  var PRIVATE_KEY_SIZE = 32;
  var SUI_PRIVATE_KEY_PREFIX = "suiprivkey";
  var Signer = class {
    /**
    * Sign messages with a specific intent. By combining the message bytes with the intent before hashing and signing,
    * it ensures that a signed message is tied to a specific purpose and domain separator is provided
    */
    async signWithIntent(bytes, intent) {
      const digest = blake2b(messageWithIntent(intent, bytes), { dkLen: 32 });
      return {
        signature: toSerializedSignature({
          signature: await this.sign(digest),
          signatureScheme: this.getKeyScheme(),
          publicKey: this.getPublicKey()
        }),
        bytes: toBase64(bytes)
      };
    }
    /**
    * Signs provided transaction by calling `signWithIntent()` with a `TransactionData` provided as intent scope
    */
    async signTransaction(bytes) {
      return this.signWithIntent(bytes, "TransactionData");
    }
    /**
    * Signs provided personal message by calling `signWithIntent()` with a `PersonalMessage` provided as intent scope
    */
    async signPersonalMessage(bytes) {
      const { signature } = await this.signWithIntent(bcs.byteVector().serialize(bytes).toBytes(), "PersonalMessage");
      return {
        bytes: toBase64(bytes),
        signature
      };
    }
    async signAndExecuteTransaction({ transaction, client }) {
      transaction.setSenderIfNotSet(this.toSuiAddress());
      const bytes = await transaction.build({ client });
      const { signature } = await this.signTransaction(bytes);
      return client.core.executeTransaction({
        transaction: bytes,
        signatures: [signature],
        include: {
          transaction: true,
          effects: true
        }
      });
    }
    toSuiAddress() {
      return this.getPublicKey().toSuiAddress();
    }
  };
  var Keypair = class extends Signer {
  };
  function decodeSuiPrivateKey(value) {
    const { prefix, words } = bech32.decode(value);
    if (prefix !== SUI_PRIVATE_KEY_PREFIX) throw new Error("invalid private key prefix");
    const extendedSecretKey = new Uint8Array(bech32.fromWords(words));
    const secretKey = extendedSecretKey.slice(1);
    return {
      scheme: SIGNATURE_FLAG_TO_SCHEME[extendedSecretKey[0]],
      secretKey
    };
  }
  function encodeSuiPrivateKey(bytes, scheme) {
    if (bytes.length !== PRIVATE_KEY_SIZE) throw new Error("Invalid bytes length");
    const flag = SIGNATURE_SCHEME_TO_FLAG[scheme];
    const privKeyBytes = new Uint8Array(bytes.length + 1);
    privKeyBytes.set([flag]);
    privKeyBytes.set(bytes, 1);
    return bech32.encode(SUI_PRIVATE_KEY_PREFIX, bech32.toWords(privKeyBytes));
  }

  // node_modules/@mysten/sui/dist/keypairs/ed25519/ed25519-hd-key.mjs
  var ED25519_CURVE = "ed25519 seed";
  var HARDENED_OFFSET = 2147483648;
  var pathRegex = /* @__PURE__ */ new RegExp("^m(\\/[0-9]+')+$");
  var replaceDerive = (val) => val.replace("'", "");
  var getMasterKeyFromSeed = (seed) => {
    const I2 = hmac.create(sha512, new TextEncoder().encode(ED25519_CURVE)).update(fromHex(seed)).digest();
    return {
      key: I2.slice(0, 32),
      chainCode: I2.slice(32)
    };
  };
  var CKDPriv = ({ key, chainCode }, index) => {
    const indexBuffer = /* @__PURE__ */ new ArrayBuffer(4);
    new DataView(indexBuffer).setUint32(0, index);
    const data = new Uint8Array(1 + key.length + indexBuffer.byteLength);
    data.set(new Uint8Array(1).fill(0));
    data.set(key, 1);
    data.set(new Uint8Array(indexBuffer, 0, indexBuffer.byteLength), key.length + 1);
    const I2 = hmac.create(sha512, chainCode).update(data).digest();
    return {
      key: I2.slice(0, 32),
      chainCode: I2.slice(32)
    };
  };
  var isValidPath = (path) => {
    if (!pathRegex.test(path)) return false;
    return !path.split("/").slice(1).map(replaceDerive).some(isNaN);
  };
  var derivePath = (path, seed, offset3 = HARDENED_OFFSET) => {
    if (!isValidPath(path)) throw new Error("Invalid derivation path");
    const { key, chainCode } = getMasterKeyFromSeed(seed);
    return path.split("/").slice(1).map(replaceDerive).map((el) => parseInt(el, 10)).reduce((parentKeys, segment) => CKDPriv(parentKeys, segment + offset3), {
      key,
      chainCode
    });
  };

  // node_modules/@mysten/sui/dist/keypairs/ed25519/keypair.mjs
  var DEFAULT_ED25519_DERIVATION_PATH = "m/44'/784'/0'/0'/0'";
  var Ed25519Keypair = class Ed25519Keypair2 extends Keypair {
    /**
    * Create a new Ed25519 keypair instance.
    * Generate random keypair if no {@link Ed25519Keypair} is provided.
    *
    * @param keypair Ed25519 keypair
    */
    constructor(keypair) {
      super();
      if (keypair) this.keypair = {
        publicKey: keypair.publicKey,
        secretKey: keypair.secretKey.slice(0, 32)
      };
      else {
        const privateKey = ed25519.utils.randomSecretKey();
        this.keypair = {
          publicKey: ed25519.getPublicKey(privateKey),
          secretKey: privateKey
        };
      }
    }
    /**
    * Get the key scheme of the keypair ED25519
    */
    getKeyScheme() {
      return "ED25519";
    }
    /**
    * Generate a new random Ed25519 keypair
    */
    static generate() {
      const secretKey = ed25519.utils.randomSecretKey();
      return new Ed25519Keypair2({
        publicKey: ed25519.getPublicKey(secretKey),
        secretKey
      });
    }
    /**
    * Create a Ed25519 keypair from a raw secret key byte array, also known as seed.
    * This is NOT the private scalar which is result of hashing and bit clamping of
    * the raw secret key.
    *
    * @throws error if the provided secret key is invalid and validation is not skipped.
    *
    * @param secretKey secret key as a byte array or Bech32 secret key string
    * @param options: skip secret key validation
    */
    static fromSecretKey(secretKey, options) {
      if (typeof secretKey === "string") {
        const decoded = decodeSuiPrivateKey(secretKey);
        if (decoded.scheme !== "ED25519") throw new Error(`Expected a ED25519 keypair, got ${decoded.scheme}`);
        return this.fromSecretKey(decoded.secretKey, options);
      }
      const secretKeyLength = secretKey.length;
      if (secretKeyLength !== PRIVATE_KEY_SIZE) throw new Error(`Wrong secretKey size. Expected ${PRIVATE_KEY_SIZE} bytes, got ${secretKeyLength}.`);
      const keypair = {
        publicKey: ed25519.getPublicKey(secretKey),
        secretKey
      };
      if (!options || !options.skipValidation) {
        const signData = new TextEncoder().encode("sui validation");
        const signature = ed25519.sign(signData, secretKey);
        if (!ed25519.verify(signature, signData, keypair.publicKey)) throw new Error("provided secretKey is invalid");
      }
      return new Ed25519Keypair2(keypair);
    }
    /**
    * The public key for this Ed25519 keypair
    */
    getPublicKey() {
      return new Ed25519PublicKey(this.keypair.publicKey);
    }
    /**
    * The Bech32 secret key string for this Ed25519 keypair
    */
    getSecretKey() {
      return encodeSuiPrivateKey(this.keypair.secretKey.slice(0, PRIVATE_KEY_SIZE), this.getKeyScheme());
    }
    /**
    * Return the signature for the provided data using Ed25519.
    */
    async sign(data) {
      return ed25519.sign(data, this.keypair.secretKey);
    }
    /**
    * Derive Ed25519 keypair from mnemonics and path. The mnemonics must be normalized
    * and validated against the english wordlist.
    *
    * If path is none, it will default to m/44'/784'/0'/0'/0', otherwise the path must
    * be compliant to SLIP-0010 in form m/44'/784'/{account_index}'/{change_index}'/{address_index}'.
    */
    static deriveKeypair(mnemonics, path) {
      if (path == null) path = DEFAULT_ED25519_DERIVATION_PATH;
      if (!isValidHardenedPath(path)) throw new Error("Invalid derivation path");
      const { key } = derivePath(path, mnemonicToSeedHex(mnemonics));
      return Ed25519Keypair2.fromSecretKey(key);
    }
    /**
    * Derive Ed25519 keypair from mnemonicSeed and path.
    *
    * If path is none, it will default to m/44'/784'/0'/0'/0', otherwise the path must
    * be compliant to SLIP-0010 in form m/44'/784'/{account_index}'/{change_index}'/{address_index}'.
    *
    * @param seed - The seed as a hex string or Uint8Array.
    */
    static deriveKeypairFromSeed(seed, path) {
      if (path == null) path = DEFAULT_ED25519_DERIVATION_PATH;
      if (!isValidHardenedPath(path)) throw new Error("Invalid derivation path");
      const seedHex = typeof seed === "string" ? seed : toHex(seed);
      const { key } = derivePath(path, seedHex);
      return Ed25519Keypair2.fromSecretKey(key);
    }
  };

  // node_modules/@mysten/dapp-kit-core/dist/index.mjs
  var DAppKitError = class extends Error {
  };
  var WalletNotConnectedError = class extends DAppKitError {
  };
  var ChainNotSupportedError = class extends DAppKitError {
  };
  var FeatureNotSupportedError = class extends DAppKitError {
  };
  var WalletNoAccountsConnectedError = class extends DAppKitError {
  };
  var WalletAccountNotFoundError = class extends DAppKitError {
  };
  function getChain(network) {
    return `sui:${network}`;
  }
  function createNetworkConfig(networks, createClient) {
    if (networks.length === 0) throw new DAppKitError("You must specify at least one Sui network for your application.");
    const networkConfig = /* @__PURE__ */ new Map();
    function getClient3(network) {
      if (networkConfig.has(network)) return networkConfig.get(network);
      const client = createClient(network);
      networkConfig.set(network, client);
      return client;
    }
    return {
      networkConfig: Object.freeze(networkConfig),
      getClient: getClient3
    };
  }
  var requiredWalletFeatures = [StandardConnect, StandardEvents];
  var signingFeatures = [SuiSignTransaction, SuiSignTransactionBlock];
  function getWalletUniqueIdentifier(walletHandle) {
    const underlyingWallet = getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(walletHandle);
    return underlyingWallet.id ?? underlyingWallet.name;
  }
  function getAccountFeature({ account, featureName, chain: chain2 }) {
    if (!account.chains.includes(chain2)) {
      const cause = new WalletStandardError(WALLET_STANDARD_ERROR__FEATURES__WALLET_ACCOUNT_CHAIN_UNSUPPORTED, {
        chain: chain2,
        featureName,
        supportedChains: [...account.chains],
        supportedFeatures: [...account.features],
        address: account.address
      });
      throw new ChainNotSupportedError(`The account ${cause.context.address} does not support the chain "${cause.context.chain}".`, { cause });
    }
    try {
      return getWalletAccountFeature(account, featureName);
    } catch (error) {
      throw new FeatureNotSupportedError(`The account ${account.address} does not support the feature "${featureName}".`, { cause: error });
    }
  }
  function tryGetAccountFeature(...args) {
    try {
      return getAccountFeature(...args);
    } catch (error) {
      if (error instanceof FeatureNotSupportedError) return null;
      throw error;
    }
  }
  function createStores({ defaultNetwork, getClient: getClient3 }) {
    const $baseConnection = map({
      status: "disconnected",
      currentAccount: null
    });
    const $currentNetwork = atom(defaultNetwork);
    const $registeredWallets = atom([]);
    const $compatibleWallets = computed([$registeredWallets, $currentNetwork], (wallets2, currentNetwork) => {
      return wallets2.filter((wallet) => {
        const areChainsCompatible = wallet.chains.some((chain2) => getChain(currentNetwork) === chain2);
        const hasRequiredFeatures = requiredWalletFeatures.every((featureName) => wallet.features.includes(featureName));
        const canSignTransactions = signingFeatures.some((featureName) => wallet.features.includes(featureName));
        return areChainsCompatible && hasRequiredFeatures && canSignTransactions;
      });
    });
    return {
      $currentNetwork,
      $registeredWallets,
      $compatibleWallets,
      $baseConnection,
      $currentClient: computed($currentNetwork, getClient3),
      $connection: computed([$baseConnection, $compatibleWallets], (connection, wallets2) => {
        switch (connection.status) {
          case "connected": {
            const wallet = wallets2.find((w2) => uiWalletAccountBelongsToUiWallet(connection.currentAccount, w2));
            if (!wallet) return {
              wallet: null,
              account: null,
              status: "disconnected",
              supportedIntents: [],
              isConnected: false,
              isConnecting: false,
              isReconnecting: false,
              isDisconnected: true
            };
            return {
              wallet,
              account: connection.currentAccount,
              status: connection.status,
              supportedIntents: connection.supportedIntents,
              isConnected: true,
              isConnecting: false,
              isReconnecting: false,
              isDisconnected: false
            };
          }
          case "connecting":
            return {
              wallet: null,
              account: connection.currentAccount,
              status: connection.status,
              supportedIntents: [],
              isConnected: false,
              isConnecting: true,
              isReconnecting: false,
              isDisconnected: false
            };
          case "reconnecting": {
            const wallet = wallets2.find((w2) => uiWalletAccountBelongsToUiWallet(connection.currentAccount, w2));
            if (!wallet) return {
              wallet: null,
              account: null,
              status: "disconnected",
              supportedIntents: [],
              isConnected: false,
              isConnecting: false,
              isReconnecting: false,
              isDisconnected: true
            };
            return {
              wallet,
              account: connection.currentAccount,
              status: connection.status,
              supportedIntents: connection.supportedIntents,
              isConnected: false,
              isConnecting: false,
              isReconnecting: true,
              isDisconnected: false
            };
          }
          case "disconnected":
            return {
              wallet: null,
              account: connection.currentAccount,
              status: connection.status,
              supportedIntents: [],
              isConnected: false,
              isConnecting: false,
              isReconnecting: false,
              isDisconnected: true
            };
          default:
            throw new Error(`Encountered unknown connection status: ${connection}`);
        }
      })
    };
  }
  function syncRegisteredWallets({ $registeredWallets }) {
    onMount($registeredWallets, () => {
      const walletsApi = getWallets();
      const unsubscribeCallbacksByWallet = /* @__PURE__ */ new Map();
      const onWalletsChanged = () => {
        const wallets2 = walletsApi.get();
        $registeredWallets.set(wallets2.map(getOrCreateUiWalletForStandardWallet_DO_NOT_USE_OR_YOU_WILL_BE_FIRED));
      };
      const subscribeToWalletEvents = (wallet) => {
        const unsubscribeFromChange = wallet.features[StandardEvents].on("change", () => {
          onWalletsChanged();
        });
        unsubscribeCallbacksByWallet.set(wallet, unsubscribeFromChange);
      };
      const unsubscribeFromRegister = walletsApi.on("register", (...addedWallets) => {
        addedWallets.filter(hasStandardEvents).forEach(subscribeToWalletEvents);
        onWalletsChanged();
      });
      const unsubscribeFromUnregister = walletsApi.on("unregister", (...removedWallets) => {
        removedWallets.filter(hasStandardEvents).forEach((wallet) => {
          const unsubscribeFromChange = unsubscribeCallbacksByWallet.get(wallet);
          if (unsubscribeFromChange) {
            unsubscribeCallbacksByWallet.delete(wallet);
            unsubscribeFromChange();
          }
        });
        onWalletsChanged();
      });
      walletsApi.get().filter(hasStandardEvents).forEach(subscribeToWalletEvents);
      onWalletsChanged();
      return () => {
        unsubscribeFromRegister();
        unsubscribeFromUnregister();
        unsubscribeCallbacksByWallet.forEach((unsubscribe) => unsubscribe());
        unsubscribeCallbacksByWallet.clear();
      };
    });
  }
  function hasStandardEvents(wallet) {
    return StandardEvents in wallet.features;
  }
  function connectWalletCreator({ $baseConnection }, supportedNetworks) {
    return async function connectWallet({ wallet, account, ...standardConnectArgs }) {
      return await task(async () => {
        const isAlreadyConnected = $baseConnection.get().status === "connected";
        try {
          $baseConnection.setKey("status", isAlreadyConnected ? "reconnecting" : "connecting");
          const { accounts: suiAccounts, supportedIntents } = await internalConnectWallet(wallet, supportedNetworks, standardConnectArgs);
          if (!isAlreadyConnected && suiAccounts.length === 0) throw new WalletNoAccountsConnectedError("No accounts were authorized.");
          if (account && !uiWalletAccountBelongsToUiWallet(account, wallet)) throw new WalletAccountNotFoundError(`No account with address ${account.address} is authorized for ${wallet.name}.`);
          $baseConnection.set({
            status: "connected",
            currentAccount: account ?? suiAccounts[0],
            supportedIntents: supportedIntents ?? []
          });
          return { accounts: suiAccounts };
        } catch (error) {
          $baseConnection.setKey("status", isAlreadyConnected ? "connected" : "disconnected");
          throw error;
        }
      });
    };
  }
  async function internalConnectWallet(wallet, supportedNetworks, args) {
    const { connect } = getWalletFeature(wallet, StandardConnect);
    const result = await connect(args);
    const underlyingWallet = getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(wallet);
    const supportedChains = supportedNetworks.map(getChain);
    const supportedIntents = result.supportedIntents ?? await getSupportedIntentsFromFeature(wallet);
    return {
      accounts: result.accounts.filter((account) => account.chains.some((chain2) => supportedChains.includes(chain2))).map(getOrCreateUiWalletAccountForStandardWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.bind(null, underlyingWallet)),
      supportedIntents
    };
  }
  async function getSupportedIntentsFromFeature(wallet) {
    if (!wallet.features.includes("sui:getCapabilities")) return [];
    return (await getWalletFeature(wallet, "sui:getCapabilities")?.getCapabilities())?.supportedIntents ?? [];
  }
  function autoConnectWallet({ networks, stores: { $baseConnection, $compatibleWallets }, storage, storageKey }) {
    onMount($compatibleWallets, () => {
      return $compatibleWallets.subscribe(async (wallets2, oldWallets) => {
        if (!wallets2) return;
        if (oldWallets && oldWallets.length > wallets2.length) return;
        if ($baseConnection.get().status !== "disconnected") return;
        const savedWalletAccount = await task(() => {
          return getSavedWalletAccount({
            networks,
            storage,
            storageKey,
            wallets: wallets2
          });
        });
        if (savedWalletAccount) $baseConnection.set({
          status: "connected",
          currentAccount: savedWalletAccount.account,
          supportedIntents: savedWalletAccount.supportedIntents
        });
      });
    });
  }
  async function getSavedWalletAccount({ networks, storage, storageKey, wallets: wallets2 }) {
    const savedWalletIdAndAddress = await storage.getItem(storageKey);
    if (!savedWalletIdAndAddress) return null;
    const [savedWalletId, savedAccountAddress, savedIntents] = savedWalletIdAndAddress.split(":");
    if (!savedWalletId || !savedAccountAddress) return null;
    const targetWallet = wallets2.find((wallet) => getWalletUniqueIdentifier(wallet) === savedWalletId);
    if (!targetWallet) return null;
    const existingAccount = targetWallet.accounts.find((account$1) => account$1.address === savedAccountAddress);
    if (existingAccount) return {
      account: existingAccount,
      supportedIntents: (savedIntents ? savedIntents.split(",") : null) ?? await getSupportedIntentsFromFeature(targetWallet)
    };
    const { accounts: alreadyAuthorizedAccounts, supportedIntents } = await internalConnectWallet(targetWallet, networks, { silent: true });
    const account = alreadyAuthorizedAccounts.find((account$1) => account$1.address === savedAccountAddress);
    return account ? {
      account,
      supportedIntents
    } : null;
  }
  var DEFAULT_STORAGE_KEY = "mysten-dapp-kit:selected-wallet-and-address";
  function getDefaultStorage() {
    return isLocalStorageAvailable() ? localStorage : createInMemoryStorage();
  }
  function createInMemoryStorage() {
    const store = /* @__PURE__ */ new Map();
    return {
      getItem(key) {
        return store.get(key) ?? null;
      },
      setItem(key, value) {
        store.set(key, value);
      },
      removeItem(key) {
        store.delete(key);
      }
    };
  }
  function isLocalStorageAvailable() {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
  function syncStateToStorage({ stores: { $connection }, storage, storageKey }) {
    onMount($connection, () => {
      return $connection.listen((connection, oldConnection) => {
        if (!oldConnection || oldConnection.status === connection.status) return;
        if (connection.account) storage.setItem(storageKey, getSavedAccountStorageKey(connection.account, connection.supportedIntents));
      });
    });
  }
  function getSavedAccountStorageKey(account, supportedIntents) {
    return `${getWalletUniqueIdentifier(account).replace(":", "_")}:${account.address}:${supportedIntents.join(",")}:`;
  }
  function manageWalletConnection({ $compatibleWallets, $baseConnection }) {
    onMount($compatibleWallets, () => {
      return $compatibleWallets.listen(async (wallets2) => {
        const connection = $baseConnection.get();
        if (connection.status !== "connected") return;
        const resolvedAccount = resolveWalletAccount(connection.currentAccount, wallets2);
        if (resolvedAccount) $baseConnection.setKey("currentAccount", resolvedAccount);
        else $baseConnection.set({
          status: "disconnected",
          currentAccount: null
        });
      });
    });
  }
  function resolveWalletAccount(currentAccount, wallets2) {
    for (const wallet of wallets2) {
      for (const walletAccount of wallet.accounts) if (uiWalletAccountsAreSame(currentAccount, walletAccount)) return walletAccount;
      if (uiWalletAccountBelongsToUiWallet(currentAccount, wallet) && wallet.accounts[0]) return wallet.accounts[0];
    }
    return null;
  }
  function switchNetworkCreator({ $currentNetwork }) {
    return function switchNetwork(network) {
      $currentNetwork.set(network);
    };
  }
  function disconnectWalletCreator({ $baseConnection, $connection }, { storage, storageKey }) {
    return async function disconnectWallet(...standardDisconnectArgs) {
      return await task(async () => {
        const { wallet } = $connection.get();
        if (!wallet) throw new WalletNotConnectedError("No wallet is connected.");
        try {
          const { disconnect } = getWalletFeature(wallet, StandardDisconnect);
          await disconnect(...standardDisconnectArgs);
        } catch (error) {
          console.warn("Failed to disconnect the current wallet from the application.", error);
        } finally {
          storage.removeItem(storageKey);
          $baseConnection.set({
            status: "disconnected",
            currentAccount: null
          });
        }
      });
    };
  }
  function switchAccountCreator({ $baseConnection, $connection }) {
    return function switchAccount({ account }) {
      const { wallet } = $connection.get();
      if (!wallet) throw new WalletNotConnectedError("No wallet is connected.");
      if (!uiWalletAccountBelongsToUiWallet(account, wallet)) throw new WalletAccountNotFoundError(`No account with address ${account.address} is connected to ${wallet.name}.`);
      $baseConnection.setKey("currentAccount", account);
    };
  }
  function signPersonalMessageCreator({ $connection, $currentNetwork }) {
    return async function signPersonalMessage({ ...standardArgs }) {
      const { account } = $connection.get();
      if (!account) throw new WalletNotConnectedError("No wallet is connected.");
      const chain2 = getChain($currentNetwork.get());
      return await getAccountFeature({
        account,
        chain: chain2,
        featureName: SuiSignPersonalMessage
      }).signPersonalMessage({
        ...standardArgs,
        account: getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(account),
        chain: chain2
      });
    };
  }
  function buildTransactionResult(digest, signature, transactionBytes, effectsBytes) {
    const status = extractStatusFromEffectsBcs(effectsBytes);
    let effects = null;
    try {
      effects = parseTransactionEffectsBcs(effectsBytes);
    } catch {
      console.warn("Parsing transaction effects failed, you may need to update the SDK to pickup the latest bcs types");
    }
    const txResult = {
      digest,
      signatures: [signature],
      epoch: null,
      status,
      effects,
      transaction: parseTransactionBcs(transactionBytes),
      balanceChanges: void 0,
      events: void 0,
      objectTypes: void 0,
      bcs: transactionBytes
    };
    return status.success ? {
      $kind: "Transaction",
      Transaction: txResult
    } : {
      $kind: "FailedTransaction",
      FailedTransaction: txResult
    };
  }
  function signAndExecuteTransactionCreator({ $connection, $currentClient }) {
    return async function signAndExecuteTransaction({ transaction, ...standardArgs }) {
      const { account, supportedIntents } = $connection.get();
      if (!account) throw new WalletNotConnectedError("No wallet is connected.");
      const underlyingAccount = getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(account);
      const suiClient = $currentClient.get();
      const chain2 = getChain(suiClient.network);
      const transactionWrapper = { toJSON: async () => {
        if (typeof transaction === "string") return transaction;
        transaction.setSenderIfNotSet(account.address);
        return await transaction.toJSON({
          client: suiClient,
          supportedIntents
        });
      } };
      const signAndExecuteTransactionFeature = tryGetAccountFeature({
        account,
        chain: chain2,
        featureName: SuiSignAndExecuteTransaction
      });
      if (signAndExecuteTransactionFeature) {
        const result = await signAndExecuteTransactionFeature.signAndExecuteTransaction({
          ...standardArgs,
          account: underlyingAccount,
          transaction: transactionWrapper,
          chain: chain2
        });
        const transactionBytes = fromBase64(result.bytes);
        const effectsBytes = fromBase64(result.effects);
        return buildTransactionResult(result.digest, result.signature, transactionBytes, effectsBytes);
      }
      const signAndExecuteTransactionBlockFeature = tryGetAccountFeature({
        account,
        chain: chain2,
        featureName: SuiSignAndExecuteTransactionBlock
      });
      if (signAndExecuteTransactionBlockFeature) {
        const transactionBlock = Transaction.from(await transactionWrapper.toJSON());
        const { digest, rawEffects, rawTransaction } = await signAndExecuteTransactionBlockFeature.signAndExecuteTransactionBlock({
          account,
          chain: chain2,
          transactionBlock,
          options: {
            showRawEffects: true,
            showRawInput: true
          }
        });
        const [{ txSignatures: [signature], intentMessage: { value: bcsTransaction } }] = suiBcs.SenderSignedData.parse(fromBase64(rawTransaction));
        return buildTransactionResult(digest, signature, suiBcs.TransactionData.serialize(bcsTransaction).toBytes(), new Uint8Array(rawEffects));
      }
      throw new FeatureNotSupportedError(`The account ${account.address} does not support signing and executing transactions.`);
    };
  }
  function signTransactionCreator({ $connection, $currentClient }) {
    return async function signTransaction({ transaction, ...standardArgs }) {
      const { account, supportedIntents } = $connection.get();
      if (!account) throw new WalletNotConnectedError("No wallet is connected.");
      const underlyingAccount = getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(account);
      const suiClient = $currentClient.get();
      const chain2 = getChain(suiClient.network);
      const transactionWrapper = { toJSON: async () => {
        if (typeof transaction === "string") return transaction;
        transaction.setSenderIfNotSet(account.address);
        return await transaction.toJSON({
          client: suiClient,
          supportedIntents
        });
      } };
      const signTransactionFeature = tryGetAccountFeature({
        account,
        chain: chain2,
        featureName: SuiSignTransaction
      });
      if (signTransactionFeature) return await signTransactionFeature.signTransaction({
        ...standardArgs,
        transaction: transactionWrapper,
        account: underlyingAccount,
        chain: chain2
      });
      const signTransactionBlockFeature = tryGetAccountFeature({
        account,
        chain: chain2,
        featureName: SuiSignTransactionBlock
      });
      if (signTransactionBlockFeature) {
        const transaction$1 = Transaction.from(await transactionWrapper.toJSON());
        const { transactionBlockBytes, signature } = await signTransactionBlockFeature.signTransactionBlock({
          transactionBlock: transaction$1,
          account: underlyingAccount,
          chain: chain2
        });
        return {
          bytes: transactionBlockBytes,
          signature
        };
      }
      throw new FeatureNotSupportedError(`The account ${account.address} does not support signing transactions.`);
    };
  }
  function slushWebWalletInitializer(config) {
    return {
      id: "slush-web-wallet-initializer",
      async initialize() {
        const result = await registerSlushWallet(config?.appName || getDefaultAppName(), {
          origin: config?.origin,
          metadataApiUrl: config?.metadataApiUrl
        });
        if (!result) throw new Error("Registration un-successful.");
        return { unregister: result.unregister };
      }
    };
  }
  function getDefaultAppName() {
    return document.querySelector(`meta[name="application-name"]`)?.content || document.title;
  }
  var initializerMap = /* @__PURE__ */ new Map();
  async function registerAdditionalWallets(initializers, args) {
    initializerMap.forEach((unregister) => unregister());
    initializerMap.clear();
    const initializePromises = [...new Map(initializers.map((init) => [init.id, init])).values()].map(async (initializer) => {
      return {
        initializer,
        result: await initializer.initialize(args)
      };
    });
    const initializerResults = await Promise.allSettled(initializePromises);
    for (const settledResult of initializerResults) if (settledResult.status === "fulfilled") {
      const { initializer, result } = settledResult.value;
      initializerMap.set(initializer.id, result.unregister);
    } else console.warn(`Skipping wallet initializer: "${settledResult.reason}".`);
  }
  function unsafeBurnerWalletInitializer() {
    return {
      id: "unsafe-burner-initalizer",
      async initialize({ networks, getClient: getClient3 }) {
        const wallet = new UnsafeBurnerWallet({ clients: networks.map(getClient3) });
        return { unregister: getWallets().register(wallet) };
      }
    };
  }
  var _chainConfig, _keypair, _account, _on2, _connect2, _signPersonalMessage2, _signTransaction2, _signAndExecuteTransaction2, _a10;
  var UnsafeBurnerWallet = (_a10 = class {
    constructor({ clients }) {
      __privateAdd(this, _chainConfig);
      __privateAdd(this, _keypair, new Ed25519Keypair());
      __privateAdd(this, _account);
      __privateAdd(this, _on2, () => {
        return () => {
        };
      });
      __privateAdd(this, _connect2, async () => {
        return { accounts: this.accounts };
      });
      __privateAdd(this, _signPersonalMessage2, async (messageInput) => {
        return await __privateGet(this, _keypair).signPersonalMessage(messageInput.message);
      });
      __privateAdd(this, _signTransaction2, async ({ transaction, signal, chain: chain2 }) => {
        signal?.throwIfAborted();
        const client = __privateGet(this, _chainConfig)[chain2];
        if (!client) throw new Error(`Invalid chain "${chain2}" specified.`);
        const builtTransaction = await Transaction.from(await transaction.toJSON()).build({ client });
        return await __privateGet(this, _keypair).signTransaction(builtTransaction);
      });
      __privateAdd(this, _signAndExecuteTransaction2, async ({ transaction, signal, chain: chain2 }) => {
        signal?.throwIfAborted();
        const client = __privateGet(this, _chainConfig)[chain2];
        if (!client) throw new Error(`Invalid chain "${chain2}" specified.`);
        const parsedTransaction = Transaction.from(await transaction.toJSON());
        const bytes = await parsedTransaction.build({ client });
        const result = await __privateGet(this, _keypair).signAndExecuteTransaction({
          transaction: parsedTransaction,
          client
        });
        const tx = result.Transaction ?? result.FailedTransaction;
        return {
          bytes: toBase64(bytes),
          signature: tx.signatures[0],
          digest: tx.digest,
          effects: toBase64(tx.effects.bcs)
        };
      });
      __privateSet(this, _chainConfig, clients.reduce((accumulator, client) => {
        const chain2 = getChain(client.network);
        accumulator[chain2] = client;
        return accumulator;
      }, {}));
      __privateSet(this, _account, new ReadonlyWalletAccount({
        address: __privateGet(this, _keypair).getPublicKey().toSuiAddress(),
        publicKey: __privateGet(this, _keypair).getPublicKey().toSuiBytes(),
        chains: this.chains,
        features: [
          SuiSignTransaction,
          SuiSignAndExecuteTransaction,
          SuiSignPersonalMessage
        ]
      }));
      console.warn("Your application is currently using the unsafe burner wallet. Make sure that this wallet is disabled in production.");
    }
    get version() {
      return "1.0.0";
    }
    get name() {
      return "Unsafe Burner Wallet";
    }
    get icon() {
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAJrElEQVR42tWbe2xT1x3H7UxAyD3XrdrSbGXlUbKWsq5rWdVuVOMRSEqSOmnVRZMmJqZNYv1nf3R/jWmVmVrtRRM/YwPd1nVTNcrE3pQCoikrIRAC4VVNY0hlD9ZOo1uCfe3ra9979v0dcy3s5Pper76Oh/STE+495/4+5/c85zqe2f7HAx5vKsS+monJj/CdHi/f4/HWW4f6AwdblmXjTM0NyS+movKtw9v+j6C5gKhyTMTTpA2x15Qwy+Pz75motOGdgKep8WF5ATgVZIt5NeO2wMqD0hfVGNPh3oYaYflsjG0l63PeyLCDnqbsLpZIhaRNFI+Ox+Le5KB0RybK8gDmJOkI07U4i/FhT1NDQl8Me5rUIfaDfELOJ0NsFa/SJQHm1WLsHcDqRWiy9BCL8s0N5t6UWWFVvxplejYm60hC91cNjPtzCTZsAptCVoeLP8PDDQJNCSodap6H+LtE8ZcdkvVkkD38vwDn4/Jvy4EhBhZSvRaUHiTXn31gJJxkUPoClBKKFizM+inhVA2cYIdM4HJouPvoe9s9H+KzDhyGK6KkmIqitBhww2C11rjQL2L4kgUwFxk8yPyzauUA3Pk/353XnA6zKbKCaQ2UlMvJF6W5uF5F8yHfZWZpC9HRmBziaEpm1bpY9XvhxuWJRldC7Mt03WlZwpjnkZUNa2DMG2EaPj9MGd2l2mofd0hQ7ZSopsXckHxVCUp32fXGdD0ZktrgFUmMqwhcWFjp87RArsD+9bn585IRaSHAKgBL3SZwOTRc8BKg7yYoskp5OJDiiPmF2Sj7ox0siYJ7lJA04EqvzZ9B1xSVt6PlW0IxZgUMJdZYAJuWngLQt9IRuZXmoTEkmci8ZtTXTViUKyasA9FRun5d8z6bfw0gYWm9mmCXxZatQgxfC7I2NVpRYQOxKWppLs4mcgn5NcibgL1K40xYp8CYY5TXEpjcb3LAJ0OZyyg3+2nySm6fjEtzkEz+7VBx3RTb+60z9dma7pkvwO2QQL5HzTtAdpKF7euw/HuzfrosBHy+ZsBimzbQshjWTVMDgez53B5MbjcGbr1ZjdUJOM5O0SLXzJ2R+uOA1dMAVoLsm5zb73JSId8t8Aa1LsAJdoTCrCaw6e3NC2DdFMUXWRg173mysJNOSUNskUJ1cOlXa2LhcbgmSszXYSn9hl3KSxTDjrZ2cbbfbWDyumsh9m3e7zCG7a3ETt+gtI7fx6lEOanZKDVvuA2cjYmt5xNOd2Louz3IQ12UZ2Zo3lkb9cDlvSs6m4Vk5Yqlabs0B97wT7PUuCXQz0Bnt9QxMPTW4iwBtmUlY8hFsHJPlzcQ1xuG75CVK1kXofCUGnU9fg1aVD7kfE9MoabtYkcAvIUYS2op3Hc3TTrDQzIAeojugTVLFolWDR6wFPtY0R66n6HltwjCIawnE2ymresk9NtN+pfUUi0mX6RJLfrh9zMRaRPOqubSA8W2MNzC0mHpK7j2ruuw5mYkxl5+2+HGQeg4yNYg7vNg+xMxFsuRMuiTsRJZG3cysAl4D9n4aC4un8L9qUyVvbCyYwFXX1nGUxFf1cCiEQqy75O+TpMwYKNKSPQUqhLyyWLsRbESLctx0YnixgfphRWA8pOPc+N4F9d+eV9V4OlCX/As5w5g+wtGhJGukp5go2R3D7EW9rSDcnGL56YgJHj+8GcFND/Vy41jj/H0jxc6HU/AA2QlR01UlH3D7CmITQnJq4lVWBi1yl8XYEh278c5H++F+Iui7r7bYR8tH/gbqoJN7fVODUhLYVVxzmYCEyOxFg7RUVa0egCHZZ55eRHnp/tKgMna6s/bbMdTxZgMzl9CCcmq7k690OzDfaeSN4QcsREjsQpgXHwyWyfg9K5WE7hc6JqTWjyihObfygOFOkv6i5K5TZx8LsL1sVS4NL8ItiB7sgAcEKcWHfUCVhK3kUVnBNbfXIs4l5xAv5sJs234eTUy93L0Au2otQOw5ORMyfQ6WwexFupVSHowG6uThXfebmlhWojMS3fazmMeGxEI6S2SUti6RAo2vKohVuH3qUG5FWm/PjH8kzutgSH5g58xrVwzIbZkxHf7OFjFC+wrMDXcpOqOKX/g01U/XPvVJyxdWsiJblqYmnZoWbDxAcR56X5WPuh4ewcL5PY9JBRUYjc7fzjG6Uc3mHBWbg23X1BLaFHOSnrw4bWiNAXSEWcWRntIignXTP/oDsfKZX66mMbZAPfhviU1AyYmJLYAMZa/QXjUSeIiixpj3UUFtd884KytjN7EjdGNNMbWwtlf3FvbQ4OQtIoYSzbxqVDLXMTxP8jnnbiyKcaJLvueGLD6kXW2sKZov1tpn7hwXf3ZUvq0K2FXOM7Op/Xgb6PhxsWIErYGVuK3WGXWkkwMMZVCVl5kWtax5A6usgemvnx4DelUcYcFC0eIbcbXKzggeyBjeXIhkftaKknJKLtnuSg7KmKQsrH+1nqbmLWY6w/tBGy/8xrruR5SM99LLIjfT/4ZbNZnQEPssIVb21rKTGRIPDagNoLdFMKgcuLc/TF6Bulk6c7ovg4TU+XvS6FNw1tDfVqH9MOPmBDui0hcK6wz744FlDjNe0m3aVldJYagtI6YbF+3ZGPsQHlN1vbeh8lJofqJ+uo9Zi4wXZxKFiXKGxbHT7pNq71oNg4Qi6MviE0FpRVqjGXILYoJ4tCjdYU1rWeMdPLc/ochj3B9pGNGL4NupGPRlUl35KMVxFLNO6ZnxYlBsUPqoMkbUqAb6VhMVKQ7MVT1dYdrL8hzEAcjpmvjHKphgaFb0ZVJZw7dwVD9q5fkgPTRbBxnzmGfgRLQsMCkG+moQdcp6GzzZsL2MGyllvBNGWM9RqMCk26kI7aBK526csVShZTfzid6FEzeiNAGP92jpCPQEbrW7EW5MbZxAz/fN9lg0IbQaaxrQ83/VoKPb/HqJx67Hw+43CDQBPsX0gm6ufXNvH4vP9rZapzx7+Nn+oxZAjfo2caZ3n350c5W6FSEdQ86sNarj3c/jRV+H42AXsdGRBfPPIlnb/mUtxzWXfALn/PmRze2Gud6E/xsXwYtnlsWN8Tc5/oyxjn/jvyJrlY82xLUfWuPr/TqxzuXQZkIP9M7CXiyuP4B4WmsTnNhzinjrD+WO9bRhmdZWLXe4EKRtV5tpN3Hx3s2G+d79/MJf4qff0LnE72kfFEs4ITQvWLMab8C131dP9n9Je1Yx000Nz2jAf+UJwCBchc3NvGR1Qx71XXY2Ww1Jvx7YalzAPkX9rp5E5Z+pv+ja8bE43uN491b9dHO9Xx4lUxziLn21Nai/wXWM6t9vkvtrwAAAABJRU5ErkJggg==";
    }
    get chains() {
      return Object.keys(__privateGet(this, _chainConfig));
    }
    get accounts() {
      return [__privateGet(this, _account)];
    }
    get features() {
      return {
        [StandardConnect]: {
          version: "1.0.0",
          connect: __privateGet(this, _connect2)
        },
        [StandardEvents]: {
          version: "1.0.0",
          on: __privateGet(this, _on2)
        },
        [SuiSignPersonalMessage]: {
          version: "1.1.0",
          signPersonalMessage: __privateGet(this, _signPersonalMessage2)
        },
        [SuiSignTransaction]: {
          version: "2.0.0",
          signTransaction: __privateGet(this, _signTransaction2)
        },
        [SuiSignAndExecuteTransaction]: {
          version: "2.0.0",
          signAndExecuteTransaction: __privateGet(this, _signAndExecuteTransaction2)
        }
      };
    }
  }, _chainConfig = new WeakMap(), _keypair = new WeakMap(), _account = new WeakMap(), _on2 = new WeakMap(), _connect2 = new WeakMap(), _signPersonalMessage2 = new WeakMap(), _signTransaction2 = new WeakMap(), _signAndExecuteTransaction2 = new WeakMap(), _a10);
  function createDAppKit({ autoConnect = true, networks, createClient, defaultNetwork = networks[0], enableBurnerWallet = false, slushWalletConfig, storage = getDefaultStorage(), storageKey = DEFAULT_STORAGE_KEY, walletInitializers = [] }) {
    const networkConfig = createNetworkConfig(networks, createClient);
    const stores = createStores({
      defaultNetwork,
      getClient: networkConfig.getClient
    });
    function getClient3(network) {
      return network ? networkConfig.getClient(network) : stores.$currentClient.get();
    }
    storage || (storage = createInMemoryStorage());
    syncStateToStorage({
      stores,
      storageKey,
      storage
    });
    syncRegisteredWallets(stores);
    manageWalletConnection(stores);
    if (autoConnect) autoConnectWallet({
      networks,
      stores,
      storageKey,
      storage
    });
    registerAdditionalWallets([
      ...walletInitializers,
      ...enableBurnerWallet ? [unsafeBurnerWalletInitializer()] : [],
      ...slushWalletConfig !== null ? [slushWebWalletInitializer(slushWalletConfig)] : []
    ], {
      networks,
      getClient: getClient3
    });
    return {
      networks,
      getClient: getClient3,
      signTransaction: signTransactionCreator(stores),
      signAndExecuteTransaction: signAndExecuteTransactionCreator(stores),
      signPersonalMessage: signPersonalMessageCreator(stores),
      connectWallet: connectWalletCreator(stores, networks),
      disconnectWallet: disconnectWalletCreator(stores, {
        storage,
        storageKey
      }),
      switchAccount: switchAccountCreator(stores),
      switchNetwork: switchNetworkCreator(stores),
      stores: {
        $wallets: stores.$compatibleWallets,
        $connection: stores.$connection,
        $currentNetwork: readonlyType(stores.$currentNetwork),
        $currentClient: stores.$currentClient
      }
    };
  }

  // node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js
  (function() {
    "use strict";
    function k2(a3) {
      var b3 = 0;
      return function() {
        return b3 < a3.length ? { done: false, value: a3[b3++] } : { done: true };
      };
    }
    var l3 = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a3, b3, d3) {
      if (a3 == Array.prototype || a3 == Object.prototype) return a3;
      a3[b3] = d3.value;
      return a3;
    };
    function m2(a3) {
      a3 = ["object" == typeof globalThis && globalThis, a3, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
      for (var b3 = 0; b3 < a3.length; ++b3) {
        var d3 = a3[b3];
        if (d3 && d3.Math == Math) return d3;
      }
      throw Error("Cannot find global object");
    }
    var n6 = m2(this);
    function p3(a3, b3) {
      if (b3) a: {
        var d3 = n6;
        a3 = a3.split(".");
        for (var e9 = 0; e9 < a3.length - 1; e9++) {
          var c4 = a3[e9];
          if (!(c4 in d3)) break a;
          d3 = d3[c4];
        }
        a3 = a3[a3.length - 1];
        e9 = d3[a3];
        b3 = b3(e9);
        b3 != e9 && null != b3 && l3(d3, a3, { configurable: true, writable: true, value: b3 });
      }
    }
    p3("Symbol", function(a3) {
      function b3(c4) {
        if (this instanceof b3) throw new TypeError("Symbol is not a constructor");
        return new d3("jscomp_symbol_" + (c4 || "") + "_" + e9++, c4);
      }
      function d3(c4, f3) {
        this.l = c4;
        l3(this, "description", { configurable: true, writable: true, value: f3 });
      }
      if (a3) return a3;
      d3.prototype.toString = function() {
        return this.l;
      };
      var e9 = 0;
      return b3;
    });
    p3("Symbol.iterator", function(a3) {
      if (a3) return a3;
      a3 = Symbol("Symbol.iterator");
      for (var b3 = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), d3 = 0; d3 < b3.length; d3++) {
        var e9 = n6[b3[d3]];
        "function" === typeof e9 && "function" != typeof e9.prototype[a3] && l3(e9.prototype, a3, { configurable: true, writable: true, value: function() {
          return aa(k2(this));
        } });
      }
      return a3;
    });
    function aa(a3) {
      a3 = { next: a3 };
      a3[Symbol.iterator] = function() {
        return this;
      };
      return a3;
    }
    function q(a3) {
      var b3 = "undefined" != typeof Symbol && Symbol.iterator && a3[Symbol.iterator];
      return b3 ? b3.call(a3) : { next: k2(a3) };
    }
    function r7(a3) {
      if (!(a3 instanceof Array)) {
        a3 = q(a3);
        for (var b3, d3 = []; !(b3 = a3.next()).done; ) d3.push(b3.value);
        a3 = d3;
      }
      return a3;
    }
    var t5 = "function" == typeof Object.create ? Object.create : function(a3) {
      function b3() {
      }
      b3.prototype = a3;
      return new b3();
    }, ba = (function() {
      function a3() {
        function d3() {
        }
        new d3();
        Reflect.construct(d3, [], function() {
        });
        return new d3() instanceof d3;
      }
      if ("undefined" != typeof Reflect && Reflect.construct) {
        if (a3()) return Reflect.construct;
        var b3 = Reflect.construct;
        return function(d3, e9, c4) {
          d3 = b3(d3, e9);
          c4 && Reflect.setPrototypeOf(d3, c4.prototype);
          return d3;
        };
      }
      return function(d3, e9, c4) {
        void 0 === c4 && (c4 = d3);
        c4 = t5(c4.prototype || Object.prototype);
        return Function.prototype.apply.call(
          d3,
          c4,
          e9
        ) || c4;
      };
    })(), v2;
    if ("function" == typeof Object.setPrototypeOf) v2 = Object.setPrototypeOf;
    else {
      var w2;
      a: {
        var ca = { a: true }, x2 = {};
        try {
          x2.__proto__ = ca;
          w2 = x2.a;
          break a;
        } catch (a3) {
        }
        w2 = false;
      }
      v2 = w2 ? function(a3, b3) {
        a3.__proto__ = b3;
        if (a3.__proto__ !== b3) throw new TypeError(a3 + " is not extensible");
        return a3;
      } : null;
    }
    var y3 = v2, z2 = window, A2;
    if (void 0 === (null == (A2 = z2.CustomElementRegistryPolyfill) ? void 0 : A2.formAssociated)) {
      var B2 = {};
      z2.CustomElementRegistryPolyfill = (B2.formAssociated = /* @__PURE__ */ new Set(), B2);
    }
    var C2 = window.HTMLElement, da = window.customElements.define, ea = window.customElements.get, D2 = window.customElements, E2 = /* @__PURE__ */ new WeakMap(), F = /* @__PURE__ */ new WeakMap(), G = /* @__PURE__ */ new WeakMap(), H2 = /* @__PURE__ */ new WeakMap();
    function fa() {
      var a3;
      this.promise = new Promise(function(b3) {
        a3 = b3;
      });
      this.resolve = a3;
    }
    function I2() {
      this.h = /* @__PURE__ */ new Map();
      this.m = /* @__PURE__ */ new Map();
      this.j = /* @__PURE__ */ new Map();
      this.i = /* @__PURE__ */ new Map();
    }
    I2.prototype.define = function(a3, b3) {
      a3 = a3.toLowerCase();
      if (void 0 !== this.h.get(a3)) throw new DOMException(`Failed to execute 'define' on 'CustomElementRegistry': the name "` + a3 + '" has already been used with this registry');
      if (void 0 !== this.m.get(b3)) throw new DOMException("Failed to execute 'define' on 'CustomElementRegistry': this constructor has already been used with this registry");
      var d3 = b3.prototype.attributeChangedCallback, e9 = new Set(b3.observedAttributes || []);
      ha(b3, e9, d3);
      var c4 = ea.call(D2, a3), f3, g2, h4 = null != (g2 = null == (f3 = c4) ? void 0 : f3.s) ? g2 : b3.formAssociated || z2.CustomElementRegistryPolyfill.formAssociated.has(a3);
      h4 && z2.CustomElementRegistryPolyfill.formAssociated.add(a3);
      if (h4 != b3.formAssociated) try {
        b3.formAssociated = h4;
      } catch (u3) {
      }
      d3 = {
        tagName: a3,
        g: b3,
        connectedCallback: b3.prototype.connectedCallback,
        disconnectedCallback: b3.prototype.disconnectedCallback,
        adoptedCallback: b3.prototype.adoptedCallback,
        attributeChangedCallback: d3,
        formAssociated: h4,
        formAssociatedCallback: b3.prototype.formAssociatedCallback,
        formDisabledCallback: b3.prototype.formDisabledCallback,
        formResetCallback: b3.prototype.formResetCallback,
        formStateRestoreCallback: b3.prototype.formStateRestoreCallback,
        observedAttributes: e9
      };
      this.h.set(a3, d3);
      this.m.set(b3, d3);
      c4 || (c4 = ia(a3), da.call(D2, a3, c4));
      this === window.customElements && (G.set(b3, d3), d3.o = c4);
      if (c4 = this.i.get(a3)) for (this.i.delete(a3), c4 = q(c4), e9 = c4.next(); !e9.done; e9 = c4.next()) e9 = e9.value, F.delete(e9), J(e9, d3, true);
      c4 = this.j.get(a3);
      void 0 !== c4 && (c4.resolve(b3), this.j.delete(a3));
      return b3;
    };
    I2.prototype.upgrade = function(a3) {
      for (var b3 = [], d3 = 0; d3 < arguments.length; ++d3) b3[d3] = arguments[d3];
      K.push(this);
      D2.upgrade.apply(D2, r7(b3));
      K.pop();
    };
    I2.prototype.get = function(a3) {
      var b3;
      return null == (b3 = this.h.get(a3)) ? void 0 : b3.g;
    };
    I2.prototype.whenDefined = function(a3) {
      var b3 = this.h.get(a3);
      if (void 0 !== b3) return Promise.resolve(b3.g);
      b3 = this.j.get(a3);
      void 0 === b3 && (b3 = new fa(), this.j.set(a3, b3));
      return b3.promise;
    };
    function L2(a3, b3, d3, e9) {
      var c4 = a3.i.get(d3);
      c4 || a3.i.set(d3, c4 = /* @__PURE__ */ new Set());
      e9 ? c4.add(b3) : c4.delete(b3);
    }
    var M2;
    window.HTMLElement = function() {
      var a3 = M2;
      if (a3) return M2 = void 0, a3;
      var b3 = G.get(this.constructor);
      if (!b3) throw new TypeError("Illegal constructor (custom element class must be registered with global customElements registry to be newable)");
      a3 = Reflect.construct(C2, [], b3.o);
      Object.setPrototypeOf(a3, this.constructor.prototype);
      E2.set(a3, b3);
      return a3;
    };
    window.HTMLElement.prototype = C2.prototype;
    function ia(a3) {
      function b3() {
        var d3 = Reflect.construct(C2, [], this.constructor);
        Object.setPrototypeOf(d3, HTMLElement.prototype);
        a: {
          var e9 = d3.getRootNode();
          if (!(e9 === document || e9 instanceof ShadowRoot)) {
            e9 = K[K.length - 1];
            if (e9 instanceof CustomElementRegistry) {
              var c4 = e9;
              break a;
            }
            e9 = e9.getRootNode();
            e9 === document || e9 instanceof ShadowRoot || (e9 = (null == (c4 = H2.get(e9)) ? void 0 : c4.getRootNode()) || document);
          }
          c4 = e9.registry;
        }
        c4 = c4 || window.customElements;
        (e9 = c4.h.get(a3)) ? J(d3, e9) : F.set(d3, c4);
        return d3;
      }
      n6.Object.defineProperty(
        b3,
        "formAssociated",
        { configurable: true, enumerable: true, get: function() {
          return z2.CustomElementRegistryPolyfill.formAssociated.has(a3);
        } }
      );
      b3.prototype.connectedCallback = function(d3) {
        for (var e9 = [], c4 = 0; c4 < arguments.length; ++c4) e9[c4] = arguments[c4];
        N2(this);
        (c4 = E2.get(this)) ? c4.connectedCallback && c4.connectedCallback.apply(this, e9) : L2(F.get(this), this, a3, true);
      };
      b3.prototype.disconnectedCallback = function(d3) {
        for (var e9 = [], c4 = 0; c4 < arguments.length; ++c4) e9[c4] = arguments[c4];
        (c4 = E2.get(this)) ? c4.disconnectedCallback && c4.disconnectedCallback.apply(this, e9) : L2(
          F.get(this),
          this,
          a3,
          false
        );
      };
      b3.prototype.adoptedCallback = function(d3) {
        for (var e9 = [], c4 = 0; c4 < arguments.length; ++c4) e9[c4] = arguments[c4];
        var f3, g2;
        null == (f3 = E2.get(this)) || null == (g2 = f3.adoptedCallback) || g2.apply(this, e9);
      };
      b3.prototype.formAssociatedCallback = function(d3) {
        for (var e9 = [], c4 = 0; c4 < arguments.length; ++c4) e9[c4] = arguments[c4];
        c4 = E2.get(this);
        if (null == c4 ? 0 : c4.formAssociated) {
          var f3;
          null == c4 || null == (f3 = c4.formAssociatedCallback) || f3.apply(this, e9);
        }
      };
      b3.prototype.formDisabledCallback = function(d3) {
        for (var e9 = [], c4 = 0; c4 < arguments.length; ++c4) e9[c4] = arguments[c4];
        c4 = E2.get(this);
        if (null == c4 ? 0 : c4.formAssociated) {
          var f3;
          null == c4 || null == (f3 = c4.formDisabledCallback) || f3.apply(this, e9);
        }
      };
      b3.prototype.formResetCallback = function(d3) {
        for (var e9 = [], c4 = 0; c4 < arguments.length; ++c4) e9[c4] = arguments[c4];
        c4 = E2.get(this);
        if (null == c4 ? 0 : c4.formAssociated) {
          var f3;
          null == c4 || null == (f3 = c4.formResetCallback) || f3.apply(this, e9);
        }
      };
      b3.prototype.formStateRestoreCallback = function(d3) {
        for (var e9 = [], c4 = 0; c4 < arguments.length; ++c4) e9[c4] = arguments[c4];
        c4 = E2.get(this);
        if (null == c4 ? 0 : c4.formAssociated) {
          var f3;
          null == c4 || null == (f3 = c4.formStateRestoreCallback) || f3.apply(this, e9);
        }
      };
      return b3;
    }
    window.CustomElementRegistry = I2;
    function ha(a3, b3, d3) {
      if (0 !== b3.size && void 0 !== d3) {
        var e9 = a3.prototype.setAttribute;
        e9 && (a3.prototype.setAttribute = function(g2, h4) {
          N2(this);
          g2 = g2.toLowerCase();
          if (b3.has(g2)) {
            var u3 = this.getAttribute(g2);
            e9.call(this, g2, h4);
            d3.call(this, g2, u3, h4);
          } else e9.call(this, g2, h4);
        });
        var c4 = a3.prototype.removeAttribute;
        c4 && (a3.prototype.removeAttribute = function(g2) {
          N2(this);
          g2 = g2.toLowerCase();
          if (b3.has(g2)) {
            var h4 = this.getAttribute(g2);
            c4.call(this, g2);
            d3.call(this, g2, h4, null);
          } else c4.call(this, g2);
        });
        var f3 = a3.prototype.toggleAttribute;
        f3 && (a3.prototype.toggleAttribute = function(g2, h4) {
          N2(this);
          g2 = g2.toLowerCase();
          if (b3.has(g2)) {
            var u3 = this.getAttribute(g2);
            f3.call(this, g2, h4);
            h4 = this.getAttribute(g2);
            u3 !== h4 && d3.call(this, g2, u3, h4);
          } else f3.call(this, g2, h4);
        });
      }
    }
    var O;
    "loading" === document.readyState && (O = /* @__PURE__ */ new Set(), document.addEventListener("readystatechange", function() {
      O.forEach(function(a3) {
        return P2(a3, E2.get(a3));
      });
    }, { once: true }));
    function N2(a3) {
      var b3;
      null != (b3 = O) && b3.has(a3) && P2(a3, E2.get(a3));
    }
    function P2(a3, b3) {
      var d3;
      null == (d3 = O) || d3.delete(a3);
      b3.attributeChangedCallback && b3.observedAttributes.forEach(function(e9) {
        a3.hasAttribute(e9) && b3.attributeChangedCallback.call(a3, e9, null, a3.getAttribute(e9));
      });
    }
    function Q(a3) {
      var b3 = Object.getPrototypeOf(a3);
      if (b3 !== window.HTMLElement) return b3 === C2 ? Object.setPrototypeOf(a3, window.HTMLElement) : Q(b3);
    }
    function J(a3, b3, d3) {
      d3 = void 0 === d3 ? false : d3;
      Object.setPrototypeOf(a3, b3.g.prototype);
      E2.set(a3, b3);
      M2 = a3;
      try {
        new b3.g();
      } catch (e9) {
        Q(b3.g), new b3.g();
      }
      b3.attributeChangedCallback && (void 0 === O || a3.hasAttributes() ? P2(a3, b3) : O.add(a3));
      d3 && b3.connectedCallback && a3.isConnected && b3.connectedCallback.call(a3);
    }
    var R2 = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function(a3, b3) {
      for (var d3 = [], e9 = 1; e9 < arguments.length; ++e9) d3[e9 - 1] = arguments[e9];
      var c4 = Object.assign({}, a3);
      e9 = a3.customElements;
      e9 = void 0 === a3.registry ? e9 : a3.registry;
      c4 = (delete c4.customElements, delete c4.registry, c4);
      d3 = R2.call.apply(R2, [this, c4].concat(r7(d3)));
      void 0 !== e9 && (d3.customElements = d3.registry = e9);
      return d3;
    };
    var K = [document];
    function S3(a3, b3, d3) {
      var e9 = (d3 ? Object.getPrototypeOf(d3) : a3.prototype)[b3];
      a3.prototype[b3] = function(c4) {
        for (var f3 = [], g2 = 0; g2 < arguments.length; ++g2) f3[g2] = arguments[g2];
        K.push(this);
        f3 = e9.apply(d3 || this, f3);
        void 0 !== f3 && H2.set(f3, this);
        K.pop();
        return f3;
      };
    }
    S3(ShadowRoot, "createElement", document);
    S3(ShadowRoot, "createElementNS", document);
    S3(ShadowRoot, "importNode", document);
    S3(Element, "insertAdjacentHTML");
    function T2(a3) {
      var b3 = Object.getOwnPropertyDescriptor(a3.prototype, "innerHTML");
      Object.defineProperty(a3.prototype, "innerHTML", Object.assign({}, b3, { set: function(d3) {
        K.push(this);
        b3.set.call(this, d3);
        K.pop();
      } }));
    }
    T2(Element);
    T2(ShadowRoot);
    Object.defineProperty(window, "customElements", { value: new CustomElementRegistry(), configurable: true, writable: true });
    if (window.ElementInternals && window.ElementInternals.prototype.setFormValue) {
      var U = /* @__PURE__ */ new WeakMap(), V2 = HTMLElement.prototype.attachInternals, methods = ["setFormValue", "setValidity", "checkValidity", "reportValidity"];
      HTMLElement.prototype.attachInternals = function(a3) {
        for (var b3 = [], d3 = 0; d3 < arguments.length; ++d3) b3[d3] = arguments[d3];
        b3 = V2.call.apply(V2, [this].concat(r7(b3)));
        U.set(b3, this);
        return b3;
      };
      methods.forEach(function(a3) {
        var b3 = window.ElementInternals.prototype, d3 = b3[a3];
        b3[a3] = function(e9) {
          for (var c4 = [], f3 = 0; f3 < arguments.length; ++f3) c4[f3] = arguments[f3];
          f3 = U.get(this);
          if (true === E2.get(f3).formAssociated) return null == d3 ? void 0 : d3.call.apply(d3, [this].concat(r7(c4)));
          throw new DOMException("Failed to execute " + d3 + " on 'ElementInternals': The target element is not a form-associated custom element.");
        };
      });
      var RadioNodeList = function(a3) {
        var b3 = ba(Array, [].concat(r7(a3)), this.constructor);
        b3.l = a3;
        return b3;
      }, W = RadioNodeList, X = Array;
      W.prototype = t5(X.prototype);
      W.prototype.constructor = W;
      if (y3) y3(W, X);
      else for (var Y in X) if ("prototype" != Y) if (Object.defineProperties) {
        var Z2 = Object.getOwnPropertyDescriptor(X, Y);
        Z2 && Object.defineProperty(W, Y, Z2);
      } else W[Y] = X[Y];
      W.u = X.prototype;
      n6.Object.defineProperty(RadioNodeList.prototype, "value", { configurable: true, enumerable: true, get: function() {
        var a3;
        return (null == (a3 = this.l.find(function(b3) {
          return true === b3.checked;
        })) ? void 0 : a3.value) || "";
      } });
      var HTMLFormControlsCollection = function(a3) {
        var b3 = this, d3 = /* @__PURE__ */ new Map();
        a3.forEach(function(e9, c4) {
          var f3 = e9.getAttribute("name"), g2 = d3.get(f3) || [];
          b3[+c4] = e9;
          g2.push(e9);
          d3.set(f3, g2);
        });
        this.length = a3.length;
        d3.forEach(function(e9, c4) {
          e9 && "length" !== c4 && "item" !== c4 && "namedItem" !== c4 && (b3[c4] = 1 === e9.length ? e9[0] : new RadioNodeList(e9));
        });
      };
      HTMLFormControlsCollection.prototype.item = function(a3) {
        var b3;
        return null != (b3 = this[a3]) ? b3 : null;
      };
      HTMLFormControlsCollection.prototype[Symbol.iterator] = function() {
        throw Error("Method not implemented.");
      };
      HTMLFormControlsCollection.prototype.namedItem = function(a3) {
        var b3;
        return null != (b3 = this[a3]) ? b3 : null;
      };
      var ja = Object.getOwnPropertyDescriptor(HTMLFormElement.prototype, "elements");
      Object.defineProperty(
        HTMLFormElement.prototype,
        "elements",
        { get: function() {
          var a3 = ja.get.call(this), b3 = [];
          a3 = q(a3);
          for (var d3 = a3.next(); !d3.done; d3 = a3.next()) {
            d3 = d3.value;
            var e9 = E2.get(d3);
            e9 && true !== e9.formAssociated || b3.push(d3);
          }
          return new HTMLFormControlsCollection(b3);
        } }
      );
    }
    ;
  }).call(typeof globalThis === "object" ? globalThis : window);

  // node_modules/@lit/reactive-element/css-tag.js
  var t = globalThis;
  var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var s = Symbol();
  var o = /* @__PURE__ */ new WeakMap();
  var n = class {
    constructor(t5, e9, o6) {
      if (this._$cssResult$ = true, o6 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t5, this.t = e9;
    }
    get styleSheet() {
      let t5 = this.o;
      const s5 = this.t;
      if (e && void 0 === t5) {
        const e9 = void 0 !== s5 && 1 === s5.length;
        e9 && (t5 = o.get(s5)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e9 && o.set(s5, t5));
      }
      return t5;
    }
    toString() {
      return this.cssText;
    }
  };
  var r = (t5) => new n("string" == typeof t5 ? t5 : t5 + "", void 0, s);
  var i = (t5, ...e9) => {
    const o6 = 1 === t5.length ? t5[0] : e9.reduce((e10, s5, o7) => e10 + ((t6) => {
      if (true === t6._$cssResult$) return t6.cssText;
      if ("number" == typeof t6) return t6;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t6 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s5) + t5[o7 + 1], t5[0]);
    return new n(o6, t5, s);
  };
  var S = (s5, o6) => {
    if (e) s5.adoptedStyleSheets = o6.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet);
    else for (const e9 of o6) {
      const o7 = document.createElement("style"), n6 = t.litNonce;
      void 0 !== n6 && o7.setAttribute("nonce", n6), o7.textContent = e9.cssText, s5.appendChild(o7);
    }
  };
  var c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
    let e9 = "";
    for (const s5 of t6.cssRules) e9 += s5.cssText;
    return r(e9);
  })(t5) : t5;

  // node_modules/@lit/reactive-element/reactive-element.js
  var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
  var a = globalThis;
  var c2 = a.trustedTypes;
  var l = c2 ? c2.emptyScript : "";
  var p = a.reactiveElementPolyfillSupport;
  var d = (t5, s5) => t5;
  var u = { toAttribute(t5, s5) {
    switch (s5) {
      case Boolean:
        t5 = t5 ? l : null;
        break;
      case Object:
      case Array:
        t5 = null == t5 ? t5 : JSON.stringify(t5);
    }
    return t5;
  }, fromAttribute(t5, s5) {
    let i7 = t5;
    switch (s5) {
      case Boolean:
        i7 = null !== t5;
        break;
      case Number:
        i7 = null === t5 ? null : Number(t5);
        break;
      case Object:
      case Array:
        try {
          i7 = JSON.parse(t5);
        } catch (t6) {
          i7 = null;
        }
    }
    return i7;
  } };
  var f = (t5, s5) => !i2(t5, s5);
  var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
  Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a.litPropertyMetadata ?? (a.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
  var y = class extends HTMLElement {
    static addInitializer(t5) {
      this._$Ei(), (this.l ?? (this.l = [])).push(t5);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t5, s5 = b) {
      if (s5.state && (s5.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t5) && ((s5 = Object.create(s5)).wrapped = true), this.elementProperties.set(t5, s5), !s5.noAccessor) {
        const i7 = Symbol(), h4 = this.getPropertyDescriptor(t5, i7, s5);
        void 0 !== h4 && e2(this.prototype, t5, h4);
      }
    }
    static getPropertyDescriptor(t5, s5, i7) {
      const { get: e9, set: r7 } = h(this.prototype, t5) ?? { get() {
        return this[s5];
      }, set(t6) {
        this[s5] = t6;
      } };
      return { get: e9, set(s6) {
        const h4 = e9?.call(this);
        r7?.call(this, s6), this.requestUpdate(t5, h4, i7);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t5) {
      return this.elementProperties.get(t5) ?? b;
    }
    static _$Ei() {
      if (this.hasOwnProperty(d("elementProperties"))) return;
      const t5 = n2(this);
      t5.finalize(), void 0 !== t5.l && (this.l = [...t5.l]), this.elementProperties = new Map(t5.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(d("finalized"))) return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
        const t6 = this.properties, s5 = [...r2(t6), ...o2(t6)];
        for (const i7 of s5) this.createProperty(i7, t6[i7]);
      }
      const t5 = this[Symbol.metadata];
      if (null !== t5) {
        const s5 = litPropertyMetadata.get(t5);
        if (void 0 !== s5) for (const [t6, i7] of s5) this.elementProperties.set(t6, i7);
      }
      this._$Eh = /* @__PURE__ */ new Map();
      for (const [t6, s5] of this.elementProperties) {
        const i7 = this._$Eu(t6, s5);
        void 0 !== i7 && this._$Eh.set(i7, t6);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s5) {
      const i7 = [];
      if (Array.isArray(s5)) {
        const e9 = new Set(s5.flat(1 / 0).reverse());
        for (const s6 of e9) i7.unshift(c(s6));
      } else void 0 !== s5 && i7.push(c(s5));
      return i7;
    }
    static _$Eu(t5, s5) {
      const i7 = s5.attribute;
      return false === i7 ? void 0 : "string" == typeof i7 ? i7 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      this._$ES = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t5) => t5(this));
    }
    addController(t5) {
      (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t5), void 0 !== this.renderRoot && this.isConnected && t5.hostConnected?.();
    }
    removeController(t5) {
      this._$EO?.delete(t5);
    }
    _$E_() {
      const t5 = /* @__PURE__ */ new Map(), s5 = this.constructor.elementProperties;
      for (const i7 of s5.keys()) this.hasOwnProperty(i7) && (t5.set(i7, this[i7]), delete this[i7]);
      t5.size > 0 && (this._$Ep = t5);
    }
    createRenderRoot() {
      const t5 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return S(t5, this.constructor.elementStyles), t5;
    }
    connectedCallback() {
      this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), this._$EO?.forEach((t5) => t5.hostConnected?.());
    }
    enableUpdating(t5) {
    }
    disconnectedCallback() {
      this._$EO?.forEach((t5) => t5.hostDisconnected?.());
    }
    attributeChangedCallback(t5, s5, i7) {
      this._$AK(t5, i7);
    }
    _$ET(t5, s5) {
      const i7 = this.constructor.elementProperties.get(t5), e9 = this.constructor._$Eu(t5, i7);
      if (void 0 !== e9 && true === i7.reflect) {
        const h4 = (void 0 !== i7.converter?.toAttribute ? i7.converter : u).toAttribute(s5, i7.type);
        this._$Em = t5, null == h4 ? this.removeAttribute(e9) : this.setAttribute(e9, h4), this._$Em = null;
      }
    }
    _$AK(t5, s5) {
      const i7 = this.constructor, e9 = i7._$Eh.get(t5);
      if (void 0 !== e9 && this._$Em !== e9) {
        const t6 = i7.getPropertyOptions(e9), h4 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== t6.converter?.fromAttribute ? t6.converter : u;
        this._$Em = e9;
        const r7 = h4.fromAttribute(s5, t6.type);
        this[e9] = r7 ?? this._$Ej?.get(e9) ?? r7, this._$Em = null;
      }
    }
    requestUpdate(t5, s5, i7, e9 = false, h4) {
      if (void 0 !== t5) {
        const r7 = this.constructor;
        if (false === e9 && (h4 = this[t5]), i7 ?? (i7 = r7.getPropertyOptions(t5)), !((i7.hasChanged ?? f)(h4, s5) || i7.useDefault && i7.reflect && h4 === this._$Ej?.get(t5) && !this.hasAttribute(r7._$Eu(t5, i7)))) return;
        this.C(t5, s5, i7);
      }
      false === this.isUpdatePending && (this._$ES = this._$EP());
    }
    C(t5, s5, { useDefault: i7, reflect: e9, wrapped: h4 }, r7) {
      i7 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t5) && (this._$Ej.set(t5, r7 ?? s5 ?? this[t5]), true !== h4 || void 0 !== r7) || (this._$AL.has(t5) || (this.hasUpdated || i7 || (s5 = void 0), this._$AL.set(t5, s5)), true === e9 && this._$Em !== t5 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t5));
    }
    async _$EP() {
      this.isUpdatePending = true;
      try {
        await this._$ES;
      } catch (t6) {
        Promise.reject(t6);
      }
      const t5 = this.scheduleUpdate();
      return null != t5 && await t5, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
          for (const [t7, s6] of this._$Ep) this[t7] = s6;
          this._$Ep = void 0;
        }
        const t6 = this.constructor.elementProperties;
        if (t6.size > 0) for (const [s6, i7] of t6) {
          const { wrapped: t7 } = i7, e9 = this[s6];
          true !== t7 || this._$AL.has(s6) || void 0 === e9 || this.C(s6, void 0, i7, e9);
        }
      }
      let t5 = false;
      const s5 = this._$AL;
      try {
        t5 = this.shouldUpdate(s5), t5 ? (this.willUpdate(s5), this._$EO?.forEach((t6) => t6.hostUpdate?.()), this.update(s5)) : this._$EM();
      } catch (s6) {
        throw t5 = false, this._$EM(), s6;
      }
      t5 && this._$AE(s5);
    }
    willUpdate(t5) {
    }
    _$AE(t5) {
      this._$EO?.forEach((t6) => t6.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
    }
    _$EM() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$ES;
    }
    shouldUpdate(t5) {
      return true;
    }
    update(t5) {
      this._$Eq && (this._$Eq = this._$Eq.forEach((t6) => this._$ET(t6, this[t6]))), this._$EM();
    }
    updated(t5) {
    }
    firstUpdated(t5) {
    }
  };
  y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ?? (a.reactiveElementVersions = [])).push("2.1.2");

  // node_modules/lit-html/lit-html.js
  var t2 = globalThis;
  var i3 = (t5) => t5;
  var s2 = t2.trustedTypes;
  var e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
  var h2 = "$lit$";
  var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
  var n3 = "?" + o3;
  var r3 = `<${n3}>`;
  var l2 = document;
  var c3 = () => l2.createComment("");
  var a2 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
  var u2 = Array.isArray;
  var d2 = (t5) => u2(t5) || "function" == typeof t5?.[Symbol.iterator];
  var f2 = "[ 	\n\f\r]";
  var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var _ = /-->/g;
  var m = />/g;
  var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var g = /'/g;
  var $ = /"/g;
  var y2 = /^(?:script|style|textarea|title)$/i;
  var x = (t5) => (i7, ...s5) => ({ _$litType$: t5, strings: i7, values: s5 });
  var b2 = x(1);
  var w = x(2);
  var T = x(3);
  var E = Symbol.for("lit-noChange");
  var A = Symbol.for("lit-nothing");
  var C = /* @__PURE__ */ new WeakMap();
  var P = l2.createTreeWalker(l2, 129);
  function V(t5, i7) {
    if (!u2(t5) || !t5.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== e3 ? e3.createHTML(i7) : i7;
  }
  var N = (t5, i7) => {
    const s5 = t5.length - 1, e9 = [];
    let n6, l3 = 2 === i7 ? "<svg>" : 3 === i7 ? "<math>" : "", c4 = v;
    for (let i8 = 0; i8 < s5; i8++) {
      const s6 = t5[i8];
      let a3, u3, d3 = -1, f3 = 0;
      for (; f3 < s6.length && (c4.lastIndex = f3, u3 = c4.exec(s6), null !== u3); ) f3 = c4.lastIndex, c4 === v ? "!--" === u3[1] ? c4 = _ : void 0 !== u3[1] ? c4 = m : void 0 !== u3[2] ? (y2.test(u3[2]) && (n6 = RegExp("</" + u3[2], "g")), c4 = p2) : void 0 !== u3[3] && (c4 = p2) : c4 === p2 ? ">" === u3[0] ? (c4 = n6 ?? v, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? p2 : '"' === u3[3] ? $ : g) : c4 === $ || c4 === g ? c4 = p2 : c4 === _ || c4 === m ? c4 = v : (c4 = p2, n6 = void 0);
      const x2 = c4 === p2 && t5[i8 + 1].startsWith("/>") ? " " : "";
      l3 += c4 === v ? s6 + r3 : d3 >= 0 ? (e9.push(a3), s6.slice(0, d3) + h2 + s6.slice(d3) + o3 + x2) : s6 + o3 + (-2 === d3 ? i8 : x2);
    }
    return [V(t5, l3 + (t5[s5] || "<?>") + (2 === i7 ? "</svg>" : 3 === i7 ? "</math>" : "")), e9];
  };
  var S2 = class _S {
    constructor({ strings: t5, _$litType$: i7 }, e9) {
      let r7;
      this.parts = [];
      let l3 = 0, a3 = 0;
      const u3 = t5.length - 1, d3 = this.parts, [f3, v2] = N(t5, i7);
      if (this.el = _S.createElement(f3, e9), P.currentNode = this.el.content, 2 === i7 || 3 === i7) {
        const t6 = this.el.content.firstChild;
        t6.replaceWith(...t6.childNodes);
      }
      for (; null !== (r7 = P.nextNode()) && d3.length < u3; ) {
        if (1 === r7.nodeType) {
          if (r7.hasAttributes()) for (const t6 of r7.getAttributeNames()) if (t6.endsWith(h2)) {
            const i8 = v2[a3++], s5 = r7.getAttribute(t6).split(o3), e10 = /([.?@])?(.*)/.exec(i8);
            d3.push({ type: 1, index: l3, name: e10[2], strings: s5, ctor: "." === e10[1] ? I : "?" === e10[1] ? L : "@" === e10[1] ? z : H }), r7.removeAttribute(t6);
          } else t6.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r7.removeAttribute(t6));
          if (y2.test(r7.tagName)) {
            const t6 = r7.textContent.split(o3), i8 = t6.length - 1;
            if (i8 > 0) {
              r7.textContent = s2 ? s2.emptyScript : "";
              for (let s5 = 0; s5 < i8; s5++) r7.append(t6[s5], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
              r7.append(t6[i8], c3());
            }
          }
        } else if (8 === r7.nodeType) if (r7.data === n3) d3.push({ type: 2, index: l3 });
        else {
          let t6 = -1;
          for (; -1 !== (t6 = r7.data.indexOf(o3, t6 + 1)); ) d3.push({ type: 7, index: l3 }), t6 += o3.length - 1;
        }
        l3++;
      }
    }
    static createElement(t5, i7) {
      const s5 = l2.createElement("template");
      return s5.innerHTML = t5, s5;
    }
  };
  function M(t5, i7, s5 = t5, e9) {
    if (i7 === E) return i7;
    let h4 = void 0 !== e9 ? s5._$Co?.[e9] : s5._$Cl;
    const o6 = a2(i7) ? void 0 : i7._$litDirective$;
    return h4?.constructor !== o6 && (h4?._$AO?.(false), void 0 === o6 ? h4 = void 0 : (h4 = new o6(t5), h4._$AT(t5, s5, e9)), void 0 !== e9 ? (s5._$Co ?? (s5._$Co = []))[e9] = h4 : s5._$Cl = h4), void 0 !== h4 && (i7 = M(t5, h4._$AS(t5, i7.values), h4, e9)), i7;
  }
  var R = class {
    constructor(t5, i7) {
      this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i7;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t5) {
      const { el: { content: i7 }, parts: s5 } = this._$AD, e9 = (t5?.creationScope ?? l2).importNode(i7, true);
      P.currentNode = e9;
      let h4 = P.nextNode(), o6 = 0, n6 = 0, r7 = s5[0];
      for (; void 0 !== r7; ) {
        if (o6 === r7.index) {
          let i8;
          2 === r7.type ? i8 = new k(h4, h4.nextSibling, this, t5) : 1 === r7.type ? i8 = new r7.ctor(h4, r7.name, r7.strings, this, t5) : 6 === r7.type && (i8 = new Z(h4, this, t5)), this._$AV.push(i8), r7 = s5[++n6];
        }
        o6 !== r7?.index && (h4 = P.nextNode(), o6++);
      }
      return P.currentNode = l2, e9;
    }
    p(t5) {
      let i7 = 0;
      for (const s5 of this._$AV) void 0 !== s5 && (void 0 !== s5.strings ? (s5._$AI(t5, s5, i7), i7 += s5.strings.length - 2) : s5._$AI(t5[i7])), i7++;
    }
  };
  var k = class _k {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t5, i7, s5, e9) {
      this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t5, this._$AB = i7, this._$AM = s5, this.options = e9, this._$Cv = e9?.isConnected ?? true;
    }
    get parentNode() {
      let t5 = this._$AA.parentNode;
      const i7 = this._$AM;
      return void 0 !== i7 && 11 === t5?.nodeType && (t5 = i7.parentNode), t5;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t5, i7 = this) {
      t5 = M(this, t5, i7), a2(t5) ? t5 === A || null == t5 || "" === t5 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t5 !== this._$AH && t5 !== E && this._(t5) : void 0 !== t5._$litType$ ? this.$(t5) : void 0 !== t5.nodeType ? this.T(t5) : d2(t5) ? this.k(t5) : this._(t5);
    }
    O(t5) {
      return this._$AA.parentNode.insertBefore(t5, this._$AB);
    }
    T(t5) {
      this._$AH !== t5 && (this._$AR(), this._$AH = this.O(t5));
    }
    _(t5) {
      this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t5 : this.T(l2.createTextNode(t5)), this._$AH = t5;
    }
    $(t5) {
      const { values: i7, _$litType$: s5 } = t5, e9 = "number" == typeof s5 ? this._$AC(t5) : (void 0 === s5.el && (s5.el = S2.createElement(V(s5.h, s5.h[0]), this.options)), s5);
      if (this._$AH?._$AD === e9) this._$AH.p(i7);
      else {
        const t6 = new R(e9, this), s6 = t6.u(this.options);
        t6.p(i7), this.T(s6), this._$AH = t6;
      }
    }
    _$AC(t5) {
      let i7 = C.get(t5.strings);
      return void 0 === i7 && C.set(t5.strings, i7 = new S2(t5)), i7;
    }
    k(t5) {
      u2(this._$AH) || (this._$AH = [], this._$AR());
      const i7 = this._$AH;
      let s5, e9 = 0;
      for (const h4 of t5) e9 === i7.length ? i7.push(s5 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s5 = i7[e9], s5._$AI(h4), e9++;
      e9 < i7.length && (this._$AR(s5 && s5._$AB.nextSibling, e9), i7.length = e9);
    }
    _$AR(t5 = this._$AA.nextSibling, s5) {
      for (this._$AP?.(false, true, s5); t5 !== this._$AB; ) {
        const s6 = i3(t5).nextSibling;
        i3(t5).remove(), t5 = s6;
      }
    }
    setConnected(t5) {
      void 0 === this._$AM && (this._$Cv = t5, this._$AP?.(t5));
    }
  };
  var H = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t5, i7, s5, e9, h4) {
      this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t5, this.name = i7, this._$AM = e9, this.options = h4, s5.length > 2 || "" !== s5[0] || "" !== s5[1] ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = A;
    }
    _$AI(t5, i7 = this, s5, e9) {
      const h4 = this.strings;
      let o6 = false;
      if (void 0 === h4) t5 = M(this, t5, i7, 0), o6 = !a2(t5) || t5 !== this._$AH && t5 !== E, o6 && (this._$AH = t5);
      else {
        const e10 = t5;
        let n6, r7;
        for (t5 = h4[0], n6 = 0; n6 < h4.length - 1; n6++) r7 = M(this, e10[s5 + n6], i7, n6), r7 === E && (r7 = this._$AH[n6]), o6 || (o6 = !a2(r7) || r7 !== this._$AH[n6]), r7 === A ? t5 = A : t5 !== A && (t5 += (r7 ?? "") + h4[n6 + 1]), this._$AH[n6] = r7;
      }
      o6 && !e9 && this.j(t5);
    }
    j(t5) {
      t5 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 ?? "");
    }
  };
  var I = class extends H {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t5) {
      this.element[this.name] = t5 === A ? void 0 : t5;
    }
  };
  var L = class extends H {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t5) {
      this.element.toggleAttribute(this.name, !!t5 && t5 !== A);
    }
  };
  var z = class extends H {
    constructor(t5, i7, s5, e9, h4) {
      super(t5, i7, s5, e9, h4), this.type = 5;
    }
    _$AI(t5, i7 = this) {
      if ((t5 = M(this, t5, i7, 0) ?? A) === E) return;
      const s5 = this._$AH, e9 = t5 === A && s5 !== A || t5.capture !== s5.capture || t5.once !== s5.once || t5.passive !== s5.passive, h4 = t5 !== A && (s5 === A || e9);
      e9 && this.element.removeEventListener(this.name, this, s5), h4 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
    }
    handleEvent(t5) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t5) : this._$AH.handleEvent(t5);
    }
  };
  var Z = class {
    constructor(t5, i7, s5) {
      this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i7, this.options = s5;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t5) {
      M(this, t5);
    }
  };
  var B = t2.litHtmlPolyfillSupport;
  B?.(S2, k), (t2.litHtmlVersions ?? (t2.litHtmlVersions = [])).push("3.3.2");
  var D = (t5, i7, s5) => {
    const e9 = s5?.renderBefore ?? i7;
    let h4 = e9._$litPart$;
    if (void 0 === h4) {
      const t6 = s5?.renderBefore ?? null;
      e9._$litPart$ = h4 = new k(i7.insertBefore(c3(), t6), t6, void 0, s5 ?? {});
    }
    return h4._$AI(t5), h4;
  };

  // node_modules/lit-element/lit-element.js
  var s3 = globalThis;
  var i4 = class extends y {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      var _a23;
      const t5 = super.createRenderRoot();
      return (_a23 = this.renderOptions).renderBefore ?? (_a23.renderBefore = t5.firstChild), t5;
    }
    update(t5) {
      const r7 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = D(r7, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(true);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(false);
    }
    render() {
      return E;
    }
  };
  i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
  var o4 = s3.litElementPolyfillSupport;
  o4?.({ LitElement: i4 });
  (s3.litElementVersions ?? (s3.litElementVersions = [])).push("4.2.2");

  // node_modules/@lit/reactive-element/decorators/custom-element.js
  var t3 = (t5) => (e9, o6) => {
    void 0 !== o6 ? o6.addInitializer(() => {
      customElements.define(t5, e9);
    }) : customElements.define(t5, e9);
  };

  // node_modules/@lit/reactive-element/decorators/property.js
  var o5 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
  var r4 = (t5 = o5, e9, r7) => {
    const { kind: n6, metadata: i7 } = r7;
    let s5 = globalThis.litPropertyMetadata.get(i7);
    if (void 0 === s5 && globalThis.litPropertyMetadata.set(i7, s5 = /* @__PURE__ */ new Map()), "setter" === n6 && ((t5 = Object.create(t5)).wrapped = true), s5.set(r7.name, t5), "accessor" === n6) {
      const { name: o6 } = r7;
      return { set(r8) {
        const n7 = e9.get.call(this);
        e9.set.call(this, r8), this.requestUpdate(o6, n7, t5, true, r8);
      }, init(e10) {
        return void 0 !== e10 && this.C(o6, void 0, t5, e10), e10;
      } };
    }
    if ("setter" === n6) {
      const { name: o6 } = r7;
      return function(r8) {
        const n7 = this[o6];
        e9.call(this, r8), this.requestUpdate(o6, n7, t5, true, r8);
      };
    }
    throw Error("Unsupported decorator location: " + n6);
  };
  function n4(t5) {
    return (e9, o6) => "object" == typeof o6 ? r4(t5, e9, o6) : ((t6, e10, o7) => {
      const r7 = e10.hasOwnProperty(o7);
      return e10.constructor.createProperty(o7, t6), r7 ? Object.getOwnPropertyDescriptor(e10, o7) : void 0;
    })(t5, e9, o6);
  }

  // node_modules/@lit/reactive-element/decorators/state.js
  function r5(r7) {
    return n4({ ...r7, state: true, attribute: false });
  }

  // node_modules/@lit/reactive-element/decorators/base.js
  var e4 = (e9, t5, c4) => (c4.configurable = true, c4.enumerable = true, Reflect.decorate && "object" != typeof t5 && Object.defineProperty(e9, t5, c4), c4);

  // node_modules/@lit/reactive-element/decorators/query.js
  function e5(e9, r7) {
    return (n6, s5, i7) => {
      const o6 = (t5) => t5.renderRoot?.querySelector(e9) ?? null;
      if (r7) {
        const { get: e10, set: r8 } = "object" == typeof s5 ? n6 : i7 ?? (() => {
          const t5 = Symbol();
          return { get() {
            return this[t5];
          }, set(e11) {
            this[t5] = e11;
          } };
        })();
        return e4(n6, s5, { get() {
          let t5 = e10.call(this);
          return void 0 === t5 && (t5 = o6(this), (null !== t5 || this.hasUpdated) && r8.call(this, t5)), t5;
        } });
      }
      return e4(n6, s5, { get() {
        return o6(this);
      } });
    };
  }

  // node_modules/@mysten/dapp-kit-core/dist/web/index.mjs
  var import_lit2 = __toESM(require_lib(), 1);

  // node_modules/@lit-labs/scoped-registry-mixin/scoped-registry-mixin.js
  function e6(e9) {
    return class extends e9 {
      createRenderRoot() {
        const e10 = this.constructor, { registry: s5, elementDefinitions: n6, shadowRootOptions: o6 } = e10;
        n6 && !s5 && (e10.registry = new CustomElementRegistry(), Object.entries(n6).forEach((([t5, s6]) => e10.registry.define(t5, s6))));
        const i7 = this.renderOptions.creationScope = this.attachShadow({ ...o6, customElements: e10.registry });
        return S(i7, this.constructor.elementStyles), i7;
      }
    };
  }

  // node_modules/lit-html/directive.js
  var t4 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
  var e7 = (t5) => (...e9) => ({ _$litDirective$: t5, values: e9 });
  var i5 = class {
    constructor(t5) {
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AT(t5, e9, i7) {
      this._$Ct = t5, this._$AM = e9, this._$Ci = i7;
    }
    _$AS(t5, e9) {
      return this.update(t5, e9);
    }
    update(t5, e9) {
      return this.render(...e9);
    }
  };

  // node_modules/lit-html/directives/class-map.js
  var e8 = e7(class extends i5 {
    constructor(t5) {
      if (super(t5), t5.type !== t4.ATTRIBUTE || "class" !== t5.name || t5.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
    }
    render(t5) {
      return " " + Object.keys(t5).filter((s5) => t5[s5]).join(" ") + " ";
    }
    update(s5, [i7]) {
      if (void 0 === this.st) {
        this.st = /* @__PURE__ */ new Set(), void 0 !== s5.strings && (this.nt = new Set(s5.strings.join(" ").split(/\s/).filter((t5) => "" !== t5)));
        for (const t5 in i7) i7[t5] && !this.nt?.has(t5) && this.st.add(t5);
        return this.render(i7);
      }
      const r7 = s5.element.classList;
      for (const t5 of this.st) t5 in i7 || (r7.remove(t5), this.st.delete(t5));
      for (const t5 in i7) {
        const s6 = !!i7[t5];
        s6 === this.st.has(t5) || this.nt?.has(t5) || (s6 ? (r7.add(t5), this.st.add(t5)) : (r7.remove(t5), this.st.delete(t5)));
      }
      return E;
    }
  });

  // node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
  var min = Math.min;
  var max = Math.max;
  var round = Math.round;
  var floor = Math.floor;
  var createCoords = (v2) => ({
    x: v2,
    y: v2
  });
  var oppositeSideMap = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  function clamp(start, value, end) {
    return max(start, min(value, end));
  }
  function evaluate(value, param) {
    return typeof value === "function" ? value(param) : value;
  }
  function getSide(placement) {
    return placement.split("-")[0];
  }
  function getAlignment(placement) {
    return placement.split("-")[1];
  }
  function getOppositeAxis(axis) {
    return axis === "x" ? "y" : "x";
  }
  function getAxisLength(axis) {
    return axis === "y" ? "height" : "width";
  }
  function getSideAxis(placement) {
    const firstChar = placement[0];
    return firstChar === "t" || firstChar === "b" ? "y" : "x";
  }
  function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
  }
  function getAlignmentSides(placement, rects, rtl) {
    if (rtl === void 0) {
      rtl = false;
    }
    const alignment = getAlignment(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const length = getAxisLength(alignmentAxis);
    let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
    if (rects.reference[length] > rects.floating[length]) {
      mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
    }
    return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
  }
  function getExpandedPlacements(placement) {
    const oppositePlacement = getOppositePlacement(placement);
    return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
  }
  function getOppositeAlignmentPlacement(placement) {
    return placement.includes("start") ? placement.replace("start", "end") : placement.replace("end", "start");
  }
  var lrPlacement = ["left", "right"];
  var rlPlacement = ["right", "left"];
  var tbPlacement = ["top", "bottom"];
  var btPlacement = ["bottom", "top"];
  function getSideList(side, isStart, rtl) {
    switch (side) {
      case "top":
      case "bottom":
        if (rtl) return isStart ? rlPlacement : lrPlacement;
        return isStart ? lrPlacement : rlPlacement;
      case "left":
      case "right":
        return isStart ? tbPlacement : btPlacement;
      default:
        return [];
    }
  }
  function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
    const alignment = getAlignment(placement);
    let list = getSideList(getSide(placement), direction === "start", rtl);
    if (alignment) {
      list = list.map((side) => side + "-" + alignment);
      if (flipAlignment) {
        list = list.concat(list.map(getOppositeAlignmentPlacement));
      }
    }
    return list;
  }
  function getOppositePlacement(placement) {
    const side = getSide(placement);
    return oppositeSideMap[side] + placement.slice(side.length);
  }
  function expandPaddingObject(padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...padding
    };
  }
  function getPaddingObject(padding) {
    return typeof padding !== "number" ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  function rectToClientRect(rect) {
    const {
      x: x2,
      y: y3,
      width,
      height
    } = rect;
    return {
      width,
      height,
      top: y3,
      left: x2,
      right: x2 + width,
      bottom: y3 + height,
      x: x2,
      y: y3
    };
  }

  // node_modules/@floating-ui/core/dist/floating-ui.core.mjs
  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {
      reference,
      floating
    } = _ref;
    const sideAxis = getSideAxis(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const alignLength = getAxisLength(alignmentAxis);
    const side = getSide(placement);
    const isVertical = sideAxis === "y";
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch (side) {
      case "top":
        coords = {
          x: commonX,
          y: reference.y - floating.height
        };
        break;
      case "bottom":
        coords = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case "right":
        coords = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case "left":
        coords = {
          x: reference.x - floating.width,
          y: commonY
        };
        break;
      default:
        coords = {
          x: reference.x,
          y: reference.y
        };
    }
    switch (getAlignment(placement)) {
      case "start":
        coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      case "end":
        coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
    }
    return coords;
  }
  async function detectOverflow(state, options) {
    var _await$platform$isEle;
    if (options === void 0) {
      options = {};
    }
    const {
      x: x2,
      y: y3,
      platform: platform2,
      rects,
      elements,
      strategy
    } = state;
    const {
      boundary = "clippingAncestors",
      rootBoundary = "viewport",
      elementContext = "floating",
      altBoundary = false,
      padding = 0
    } = evaluate(options, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === "floating" ? "reference" : "floating";
    const element = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
      element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
      boundary,
      rootBoundary,
      strategy
    }));
    const rect = elementContext === "floating" ? {
      x: x2,
      y: y3,
      width: rects.floating.width,
      height: rects.floating.height
    } : rects.reference;
    const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
    const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements,
      rect,
      offsetParent,
      strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  }
  var MAX_RESET_COUNT = 50;
  var computePosition = async (reference, floating, config) => {
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware = [],
      platform: platform2
    } = config;
    const platformWithDetectOverflow = platform2.detectOverflow ? platform2 : {
      ...platform2,
      detectOverflow
    };
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
    let rects = await platform2.getElementRects({
      reference,
      floating,
      strategy
    });
    let {
      x: x2,
      y: y3
    } = computeCoordsFromPlacement(rects, placement, rtl);
    let statefulPlacement = placement;
    let resetCount = 0;
    const middlewareData = {};
    for (let i7 = 0; i7 < middleware.length; i7++) {
      const currentMiddleware = middleware[i7];
      if (!currentMiddleware) {
        continue;
      }
      const {
        name,
        fn
      } = currentMiddleware;
      const {
        x: nextX,
        y: nextY,
        data,
        reset
      } = await fn({
        x: x2,
        y: y3,
        initialPlacement: placement,
        placement: statefulPlacement,
        strategy,
        middlewareData,
        rects,
        platform: platformWithDetectOverflow,
        elements: {
          reference,
          floating
        }
      });
      x2 = nextX != null ? nextX : x2;
      y3 = nextY != null ? nextY : y3;
      middlewareData[name] = {
        ...middlewareData[name],
        ...data
      };
      if (reset && resetCount < MAX_RESET_COUNT) {
        resetCount++;
        if (typeof reset === "object") {
          if (reset.placement) {
            statefulPlacement = reset.placement;
          }
          if (reset.rects) {
            rects = reset.rects === true ? await platform2.getElementRects({
              reference,
              floating,
              strategy
            }) : reset.rects;
          }
          ({
            x: x2,
            y: y3
          } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
        }
        i7 = -1;
      }
    }
    return {
      x: x2,
      y: y3,
      placement: statefulPlacement,
      strategy,
      middlewareData
    };
  };
  var flip = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "flip",
      options,
      async fn(state) {
        var _middlewareData$arrow, _middlewareData$flip;
        const {
          placement,
          middlewareData,
          rects,
          initialPlacement,
          platform: platform2,
          elements
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true,
          fallbackPlacements: specifiedFallbackPlacements,
          fallbackStrategy = "bestFit",
          fallbackAxisSideDirection = "none",
          flipAlignment = true,
          ...detectOverflowOptions
        } = evaluate(options, state);
        if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        const side = getSide(placement);
        const initialSideAxis = getSideAxis(initialPlacement);
        const isBasePlacement = getSide(initialPlacement) === initialPlacement;
        const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
        const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
        const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
        if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
          fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
        }
        const placements2 = [initialPlacement, ...fallbackPlacements];
        const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
        const overflows = [];
        let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
        if (checkMainAxis) {
          overflows.push(overflow[side]);
        }
        if (checkCrossAxis) {
          const sides2 = getAlignmentSides(placement, rects, rtl);
          overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
        }
        overflowsData = [...overflowsData, {
          placement,
          overflows
        }];
        if (!overflows.every((side2) => side2 <= 0)) {
          var _middlewareData$flip2, _overflowsData$filter;
          const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
          const nextPlacement = placements2[nextIndex];
          if (nextPlacement) {
            const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
            if (!ignoreCrossAxisOverflow || // We leave the current main axis only if every placement on that axis
            // overflows the main axis.
            overflowsData.every((d3) => getSideAxis(d3.placement) === initialSideAxis ? d3.overflows[0] > 0 : true)) {
              return {
                data: {
                  index: nextIndex,
                  overflows: overflowsData
                },
                reset: {
                  placement: nextPlacement
                }
              };
            }
          }
          let resetPlacement = (_overflowsData$filter = overflowsData.filter((d3) => d3.overflows[0] <= 0).sort((a3, b3) => a3.overflows[1] - b3.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
          if (!resetPlacement) {
            switch (fallbackStrategy) {
              case "bestFit": {
                var _overflowsData$filter2;
                const placement2 = (_overflowsData$filter2 = overflowsData.filter((d3) => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = getSideAxis(d3.placement);
                    return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                    // reading directions favoring greater width.
                    currentSideAxis === "y";
                  }
                  return true;
                }).map((d3) => [d3.placement, d3.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a3, b3) => a3[1] - b3[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement2) {
                  resetPlacement = placement2;
                }
                break;
              }
              case "initialPlacement":
                resetPlacement = initialPlacement;
                break;
            }
          }
          if (placement !== resetPlacement) {
            return {
              reset: {
                placement: resetPlacement
              }
            };
          }
        }
        return {};
      }
    };
  };
  var originSides = /* @__PURE__ */ new Set(["left", "top"]);
  async function convertValueToCoords(state, options) {
    const {
      placement,
      platform: platform2,
      elements
    } = state;
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getSideAxis(placement) === "y";
    const mainAxisMulti = originSides.has(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = evaluate(options, state);
    let {
      mainAxis,
      crossAxis,
      alignmentAxis
    } = typeof rawValue === "number" ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: rawValue.mainAxis || 0,
      crossAxis: rawValue.crossAxis || 0,
      alignmentAxis: rawValue.alignmentAxis
    };
    if (alignment && typeof alignmentAxis === "number") {
      crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  }
  var offset = function(options) {
    if (options === void 0) {
      options = 0;
    }
    return {
      name: "offset",
      options,
      async fn(state) {
        var _middlewareData$offse, _middlewareData$arrow;
        const {
          x: x2,
          y: y3,
          placement,
          middlewareData
        } = state;
        const diffCoords = await convertValueToCoords(state, options);
        if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        return {
          x: x2 + diffCoords.x,
          y: y3 + diffCoords.y,
          data: {
            ...diffCoords,
            placement
          }
        };
      }
    };
  };
  var shift = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "shift",
      options,
      async fn(state) {
        const {
          x: x2,
          y: y3,
          placement,
          platform: platform2
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = false,
          limiter = {
            fn: (_ref) => {
              let {
                x: x3,
                y: y4
              } = _ref;
              return {
                x: x3,
                y: y4
              };
            }
          },
          ...detectOverflowOptions
        } = evaluate(options, state);
        const coords = {
          x: x2,
          y: y3
        };
        const overflow = await platform2.detectOverflow(state, detectOverflowOptions);
        const crossAxis = getSideAxis(getSide(placement));
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        if (checkMainAxis) {
          const minSide = mainAxis === "y" ? "top" : "left";
          const maxSide = mainAxis === "y" ? "bottom" : "right";
          const min2 = mainAxisCoord + overflow[minSide];
          const max2 = mainAxisCoord - overflow[maxSide];
          mainAxisCoord = clamp(min2, mainAxisCoord, max2);
        }
        if (checkCrossAxis) {
          const minSide = crossAxis === "y" ? "top" : "left";
          const maxSide = crossAxis === "y" ? "bottom" : "right";
          const min2 = crossAxisCoord + overflow[minSide];
          const max2 = crossAxisCoord - overflow[maxSide];
          crossAxisCoord = clamp(min2, crossAxisCoord, max2);
        }
        const limitedCoords = limiter.fn({
          ...state,
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        });
        return {
          ...limitedCoords,
          data: {
            x: limitedCoords.x - x2,
            y: limitedCoords.y - y3,
            enabled: {
              [mainAxis]: checkMainAxis,
              [crossAxis]: checkCrossAxis
            }
          }
        };
      }
    };
  };

  // node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
  function hasWindow() {
    return typeof window !== "undefined";
  }
  function getNodeName(node) {
    if (isNode(node)) {
      return (node.nodeName || "").toLowerCase();
    }
    return "#document";
  }
  function getWindow(node) {
    var _node$ownerDocument;
    return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
  }
  function getDocumentElement(node) {
    var _ref;
    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
  }
  function isNode(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Node || value instanceof getWindow(value).Node;
  }
  function isElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Element || value instanceof getWindow(value).Element;
  }
  function isHTMLElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
  }
  function isShadowRoot(value) {
    if (!hasWindow() || typeof ShadowRoot === "undefined") {
      return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
  }
  function isOverflowElement(element) {
    const {
      overflow,
      overflowX,
      overflowY,
      display
    } = getComputedStyle2(element);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== "inline" && display !== "contents";
  }
  function isTableElement(element) {
    return /^(table|td|th)$/.test(getNodeName(element));
  }
  function isTopLayer(element) {
    try {
      if (element.matches(":popover-open")) {
        return true;
      }
    } catch (_e) {
    }
    try {
      return element.matches(":modal");
    } catch (_e) {
      return false;
    }
  }
  var willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
  var containRe = /paint|layout|strict|content/;
  var isNotNone = (value) => !!value && value !== "none";
  var isWebKitValue;
  function isContainingBlock(elementOrCss) {
    const css = isElement(elementOrCss) ? getComputedStyle2(elementOrCss) : elementOrCss;
    return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || "") || containRe.test(css.contain || "");
  }
  function getContainingBlock(element) {
    let currentNode = getParentNode(element);
    while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else if (isTopLayer(currentNode)) {
        return null;
      }
      currentNode = getParentNode(currentNode);
    }
    return null;
  }
  function isWebKit() {
    if (isWebKitValue == null) {
      isWebKitValue = typeof CSS !== "undefined" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none");
    }
    return isWebKitValue;
  }
  function isLastTraversableNode(node) {
    return /^(html|body|#document)$/.test(getNodeName(node));
  }
  function getComputedStyle2(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function getNodeScroll(element) {
    if (isElement(element)) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }
    return {
      scrollLeft: element.scrollX,
      scrollTop: element.scrollY
    };
  }
  function getParentNode(node) {
    if (getNodeName(node) === "html") {
      return node;
    }
    const result = (
      // Step into the shadow DOM of the parent of a slotted node.
      node.assignedSlot || // DOM Element detected.
      node.parentNode || // ShadowRoot detected.
      isShadowRoot(node) && node.host || // Fallback.
      getDocumentElement(node)
    );
    return isShadowRoot(result) ? result.host : result;
  }
  function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);
    if (isLastTraversableNode(parentNode)) {
      return node.ownerDocument ? node.ownerDocument.body : node.body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
  }
  function getOverflowAncestors(node, list, traverseIframes) {
    var _node$ownerDocument2;
    if (list === void 0) {
      list = [];
    }
    if (traverseIframes === void 0) {
      traverseIframes = true;
    }
    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
      const frameElement = getFrameElement(win);
      return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
    } else {
      return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
    }
  }
  function getFrameElement(win) {
    return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
  }

  // node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
  function getCssDimensions(element) {
    const css = getComputedStyle2(element);
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = isHTMLElement(element);
    const offsetWidth = hasOffset ? element.offsetWidth : width;
    const offsetHeight = hasOffset ? element.offsetHeight : height;
    const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
    if (shouldFallback) {
      width = offsetWidth;
      height = offsetHeight;
    }
    return {
      width,
      height,
      $: shouldFallback
    };
  }
  function unwrapElement(element) {
    return !isElement(element) ? element.contextElement : element;
  }
  function getScale(element) {
    const domElement = unwrapElement(element);
    if (!isHTMLElement(domElement)) {
      return createCoords(1);
    }
    const rect = domElement.getBoundingClientRect();
    const {
      width,
      height,
      $: $2
    } = getCssDimensions(domElement);
    let x2 = ($2 ? round(rect.width) : rect.width) / width;
    let y3 = ($2 ? round(rect.height) : rect.height) / height;
    if (!x2 || !Number.isFinite(x2)) {
      x2 = 1;
    }
    if (!y3 || !Number.isFinite(y3)) {
      y3 = 1;
    }
    return {
      x: x2,
      y: y3
    };
  }
  var noOffsets = /* @__PURE__ */ createCoords(0);
  function getVisualOffsets(element) {
    const win = getWindow(element);
    if (!isWebKit() || !win.visualViewport) {
      return noOffsets;
    }
    return {
      x: win.visualViewport.offsetLeft,
      y: win.visualViewport.offsetTop
    };
  }
  function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
      return false;
    }
    return isFixed;
  }
  function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    const clientRect = element.getBoundingClientRect();
    const domElement = unwrapElement(element);
    let scale = createCoords(1);
    if (includeScale) {
      if (offsetParent) {
        if (isElement(offsetParent)) {
          scale = getScale(offsetParent);
        }
      } else {
        scale = getScale(element);
      }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
    let x2 = (clientRect.left + visualOffsets.x) / scale.x;
    let y3 = (clientRect.top + visualOffsets.y) / scale.y;
    let width = clientRect.width / scale.x;
    let height = clientRect.height / scale.y;
    if (domElement) {
      const win = getWindow(domElement);
      const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
      let currentWin = win;
      let currentIFrame = getFrameElement(currentWin);
      while (currentIFrame && offsetParent && offsetWin !== currentWin) {
        const iframeScale = getScale(currentIFrame);
        const iframeRect = currentIFrame.getBoundingClientRect();
        const css = getComputedStyle2(currentIFrame);
        const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
        const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
        x2 *= iframeScale.x;
        y3 *= iframeScale.y;
        width *= iframeScale.x;
        height *= iframeScale.y;
        x2 += left;
        y3 += top;
        currentWin = getWindow(currentIFrame);
        currentIFrame = getFrameElement(currentWin);
      }
    }
    return rectToClientRect({
      width,
      height,
      x: x2,
      y: y3
    });
  }
  function getWindowScrollBarX(element, rect) {
    const leftScroll = getNodeScroll(element).scrollLeft;
    if (!rect) {
      return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
    }
    return rect.left + leftScroll;
  }
  function getHTMLOffset(documentElement, scroll) {
    const htmlRect = documentElement.getBoundingClientRect();
    const x2 = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
    const y3 = htmlRect.top + scroll.scrollTop;
    return {
      x: x2,
      y: y3
    };
  }
  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {
      elements,
      rect,
      offsetParent,
      strategy
    } = _ref;
    const isFixed = strategy === "fixed";
    const documentElement = getDocumentElement(offsetParent);
    const topLayer = elements ? isTopLayer(elements.floating) : false;
    if (offsetParent === documentElement || topLayer && isFixed) {
      return rect;
    }
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    let scale = createCoords(1);
    const offsets = createCoords(0);
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent);
        scale = getScale(offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    return {
      width: rect.width * scale.x,
      height: rect.height * scale.y,
      x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
      y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
    };
  }
  function getClientRects(element) {
    return Array.from(element.getClientRects());
  }
  function getDocumentRect(element) {
    const html = getDocumentElement(element);
    const scroll = getNodeScroll(element);
    const body = element.ownerDocument.body;
    const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
    const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
    let x2 = -scroll.scrollLeft + getWindowScrollBarX(element);
    const y3 = -scroll.scrollTop;
    if (getComputedStyle2(body).direction === "rtl") {
      x2 += max(html.clientWidth, body.clientWidth) - width;
    }
    return {
      width,
      height,
      x: x2,
      y: y3
    };
  }
  var SCROLLBAR_MAX = 25;
  function getViewportRect(element, strategy) {
    const win = getWindow(element);
    const html = getDocumentElement(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x2 = 0;
    let y3 = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      const visualViewportBased = isWebKit();
      if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
        x2 = visualViewport.offsetLeft;
        y3 = visualViewport.offsetTop;
      }
    }
    const windowScrollbarX = getWindowScrollBarX(html);
    if (windowScrollbarX <= 0) {
      const doc = html.ownerDocument;
      const body = doc.body;
      const bodyStyles = getComputedStyle(body);
      const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
      const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
      if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
        width -= clippingStableScrollbarWidth;
      }
    } else if (windowScrollbarX <= SCROLLBAR_MAX) {
      width += windowScrollbarX;
    }
    return {
      width,
      height,
      x: x2,
      y: y3
    };
  }
  function getInnerBoundingClientRect(element, strategy) {
    const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
    const width = element.clientWidth * scale.x;
    const height = element.clientHeight * scale.y;
    const x2 = left * scale.x;
    const y3 = top * scale.y;
    return {
      width,
      height,
      x: x2,
      y: y3
    };
  }
  function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === "viewport") {
      rect = getViewportRect(element, strategy);
    } else if (clippingAncestor === "document") {
      rect = getDocumentRect(getDocumentElement(element));
    } else if (isElement(clippingAncestor)) {
      rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
      const visualOffsets = getVisualOffsets(element);
      rect = {
        x: clippingAncestor.x - visualOffsets.x,
        y: clippingAncestor.y - visualOffsets.y,
        width: clippingAncestor.width,
        height: clippingAncestor.height
      };
    }
    return rectToClientRect(rect);
  }
  function hasFixedPositionAncestor(element, stopNode) {
    const parentNode = getParentNode(element);
    if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
      return false;
    }
    return getComputedStyle2(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
  }
  function getClippingElementAncestors(element, cache2) {
    const cachedResult = cache2.get(element);
    if (cachedResult) {
      return cachedResult;
    }
    let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
    let currentContainingBlockComputedStyle = null;
    const elementIsFixed = getComputedStyle2(element).position === "fixed";
    let currentNode = elementIsFixed ? getParentNode(element) : element;
    while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
      const computedStyle = getComputedStyle2(currentNode);
      const currentNodeIsContaining = isContainingBlock(currentNode);
      if (!currentNodeIsContaining && computedStyle.position === "fixed") {
        currentContainingBlockComputedStyle = null;
      }
      const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && (currentContainingBlockComputedStyle.position === "absolute" || currentContainingBlockComputedStyle.position === "fixed") || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
      if (shouldDropCurrentNode) {
        result = result.filter((ancestor) => ancestor !== currentNode);
      } else {
        currentContainingBlockComputedStyle = computedStyle;
      }
      currentNode = getParentNode(currentNode);
    }
    cache2.set(element, result);
    return result;
  }
  function getClippingRect(_ref) {
    let {
      element,
      boundary,
      rootBoundary,
      strategy
    } = _ref;
    const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
    const clippingAncestors = [...elementClippingAncestors, rootBoundary];
    const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
    let top = firstRect.top;
    let right = firstRect.right;
    let bottom = firstRect.bottom;
    let left = firstRect.left;
    for (let i7 = 1; i7 < clippingAncestors.length; i7++) {
      const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i7], strategy);
      top = max(rect.top, top);
      right = min(rect.right, right);
      bottom = min(rect.bottom, bottom);
      left = max(rect.left, left);
    }
    return {
      width: right - left,
      height: bottom - top,
      x: left,
      y: top
    };
  }
  function getDimensions(element) {
    const {
      width,
      height
    } = getCssDimensions(element);
    return {
      width,
      height
    };
  }
  function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const isFixed = strategy === "fixed";
    const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = createCoords(0);
    function setLeftRTLScrollbarOffset() {
      offsets.x = getWindowScrollBarX(documentElement);
    }
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } else if (documentElement) {
        setLeftRTLScrollbarOffset();
      }
    }
    if (isFixed && !isOffsetParentAnElement && documentElement) {
      setLeftRTLScrollbarOffset();
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    const x2 = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
    const y3 = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
    return {
      x: x2,
      y: y3,
      width: rect.width,
      height: rect.height
    };
  }
  function isStaticPositioned(element) {
    return getComputedStyle2(element).position === "static";
  }
  function getTrueOffsetParent(element, polyfill) {
    if (!isHTMLElement(element) || getComputedStyle2(element).position === "fixed") {
      return null;
    }
    if (polyfill) {
      return polyfill(element);
    }
    let rawOffsetParent = element.offsetParent;
    if (getDocumentElement(element) === rawOffsetParent) {
      rawOffsetParent = rawOffsetParent.ownerDocument.body;
    }
    return rawOffsetParent;
  }
  function getOffsetParent(element, polyfill) {
    const win = getWindow(element);
    if (isTopLayer(element)) {
      return win;
    }
    if (!isHTMLElement(element)) {
      let svgOffsetParent = getParentNode(element);
      while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
        if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
          return svgOffsetParent;
        }
        svgOffsetParent = getParentNode(svgOffsetParent);
      }
      return win;
    }
    let offsetParent = getTrueOffsetParent(element, polyfill);
    while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
      offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
      return win;
    }
    return offsetParent || getContainingBlock(element) || win;
  }
  var getElementRects = async function(data) {
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    const floatingDimensions = await getDimensionsFn(data.floating);
    return {
      reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
      floating: {
        x: 0,
        y: 0,
        width: floatingDimensions.width,
        height: floatingDimensions.height
      }
    };
  };
  function isRTL(element) {
    return getComputedStyle2(element).direction === "rtl";
  }
  var platform = {
    convertOffsetParentRelativeRectToViewportRelativeRect,
    getDocumentElement,
    getClippingRect,
    getOffsetParent,
    getElementRects,
    getClientRects,
    getDimensions,
    getScale,
    isElement,
    isRTL
  };
  function rectsAreEqual(a3, b3) {
    return a3.x === b3.x && a3.y === b3.y && a3.width === b3.width && a3.height === b3.height;
  }
  function observeMove(element, onMove) {
    let io = null;
    let timeoutId;
    const root = getDocumentElement(element);
    function cleanup() {
      var _io;
      clearTimeout(timeoutId);
      (_io = io) == null || _io.disconnect();
      io = null;
    }
    function refresh(skip, threshold) {
      if (skip === void 0) {
        skip = false;
      }
      if (threshold === void 0) {
        threshold = 1;
      }
      cleanup();
      const elementRectForRootMargin = element.getBoundingClientRect();
      const {
        left,
        top,
        width,
        height
      } = elementRectForRootMargin;
      if (!skip) {
        onMove();
      }
      if (!width || !height) {
        return;
      }
      const insetTop = floor(top);
      const insetRight = floor(root.clientWidth - (left + width));
      const insetBottom = floor(root.clientHeight - (top + height));
      const insetLeft = floor(left);
      const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
      const options = {
        rootMargin,
        threshold: max(0, min(1, threshold)) || 1
      };
      let isFirstUpdate = true;
      function handleObserve(entries) {
        const ratio = entries[0].intersectionRatio;
        if (ratio !== threshold) {
          if (!isFirstUpdate) {
            return refresh();
          }
          if (!ratio) {
            timeoutId = setTimeout(() => {
              refresh(false, 1e-7);
            }, 1e3);
          } else {
            refresh(false, ratio);
          }
        }
        if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
          refresh();
        }
        isFirstUpdate = false;
      }
      try {
        io = new IntersectionObserver(handleObserve, {
          ...options,
          // Handle <iframe>s
          root: root.ownerDocument
        });
      } catch (_e) {
        io = new IntersectionObserver(handleObserve, options);
      }
      io.observe(element);
    }
    refresh(true);
    return cleanup;
  }
  function autoUpdate(reference, floating, update, options) {
    if (options === void 0) {
      options = {};
    }
    const {
      ancestorScroll = true,
      ancestorResize = true,
      elementResize = typeof ResizeObserver === "function",
      layoutShift = typeof IntersectionObserver === "function",
      animationFrame = false
    } = options;
    const referenceEl = unwrapElement(reference);
    const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...floating ? getOverflowAncestors(floating) : []] : [];
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.addEventListener("scroll", update, {
        passive: true
      });
      ancestorResize && ancestor.addEventListener("resize", update);
    });
    const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
    let reobserveFrame = -1;
    let resizeObserver = null;
    if (elementResize) {
      resizeObserver = new ResizeObserver((_ref) => {
        let [firstEntry] = _ref;
        if (firstEntry && firstEntry.target === referenceEl && resizeObserver && floating) {
          resizeObserver.unobserve(floating);
          cancelAnimationFrame(reobserveFrame);
          reobserveFrame = requestAnimationFrame(() => {
            var _resizeObserver;
            (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
          });
        }
        update();
      });
      if (referenceEl && !animationFrame) {
        resizeObserver.observe(referenceEl);
      }
      if (floating) {
        resizeObserver.observe(floating);
      }
    }
    let frameId;
    let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
    if (animationFrame) {
      frameLoop();
    }
    function frameLoop() {
      const nextRefRect = getBoundingClientRect(reference);
      if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
        update();
      }
      prevRefRect = nextRefRect;
      frameId = requestAnimationFrame(frameLoop);
    }
    update();
    return () => {
      var _resizeObserver2;
      ancestors.forEach((ancestor) => {
        ancestorScroll && ancestor.removeEventListener("scroll", update);
        ancestorResize && ancestor.removeEventListener("resize", update);
      });
      cleanupIo == null || cleanupIo();
      (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
      resizeObserver = null;
      if (animationFrame) {
        cancelAnimationFrame(frameId);
      }
    };
  }
  var offset2 = offset;
  var shift2 = shift;
  var flip2 = flip;
  var computePosition2 = (reference, floating, options) => {
    const cache2 = /* @__PURE__ */ new Map();
    const mergedOptions = {
      platform,
      ...options
    };
    const platformWithCache = {
      ...mergedOptions.platform,
      _c: cache2
    };
    return computePosition(reference, floating, {
      ...mergedOptions,
      platform: platformWithCache
    });
  };

  // node_modules/lit-html/directives/when.js
  function n5(n6, r7, t5) {
    return n6 ? r7(n6) : t5?.(n6);
  }

  // node_modules/@lit/task/task.js
  var i6 = Symbol();
  var h3 = class {
    get taskComplete() {
      return this.t || (1 === this.i ? this.t = new Promise(((t5, s5) => {
        this.o = t5, this.h = s5;
      })) : 3 === this.i ? this.t = Promise.reject(this.l) : this.t = Promise.resolve(this.u)), this.t;
    }
    constructor(t5, s5, i7) {
      this.p = 0, this.i = 0, (this._ = t5).addController(this);
      const h4 = "object" == typeof s5 ? s5 : { task: s5, args: i7 };
      this.v = h4.task, this.j = h4.args, this.m = h4.argsEqual ?? r6, this.k = h4.onComplete, this.A = h4.onError, this.autoRun = h4.autoRun ?? true, "initialValue" in h4 && (this.u = h4.initialValue, this.i = 2, this.O = this.T?.());
    }
    hostUpdate() {
      true === this.autoRun && this.S();
    }
    hostUpdated() {
      "afterUpdate" === this.autoRun && this.S();
    }
    T() {
      if (void 0 === this.j) return;
      const t5 = this.j();
      if (!Array.isArray(t5)) throw Error("The args function must return an array");
      return t5;
    }
    async S() {
      const t5 = this.T(), s5 = this.O;
      this.O = t5, t5 === s5 || void 0 === t5 || void 0 !== s5 && this.m(s5, t5) || await this.run(t5);
    }
    async run(t5) {
      let s5, h4;
      t5 ?? (t5 = this.T()), this.O = t5, 1 === this.i ? this.q?.abort() : (this.t = void 0, this.o = void 0, this.h = void 0), this.i = 1, "afterUpdate" === this.autoRun ? queueMicrotask((() => this._.requestUpdate())) : this._.requestUpdate();
      const r7 = ++this.p;
      this.q = new AbortController();
      let e9 = false;
      try {
        s5 = await this.v(t5, { signal: this.q.signal });
      } catch (t6) {
        e9 = true, h4 = t6;
      }
      if (this.p === r7) {
        if (s5 === i6) this.i = 0;
        else {
          if (false === e9) {
            try {
              this.k?.(s5);
            } catch {
            }
            this.i = 2, this.o?.(s5);
          } else {
            try {
              this.A?.(h4);
            } catch {
            }
            this.i = 3, this.h?.(h4);
          }
          this.u = s5, this.l = h4;
        }
        this._.requestUpdate();
      }
    }
    abort(t5) {
      1 === this.i && this.q?.abort(t5);
    }
    get value() {
      return this.u;
    }
    get error() {
      return this.l;
    }
    get status() {
      return this.i;
    }
    render(t5) {
      switch (this.i) {
        case 0:
          return t5.initial?.();
        case 1:
          return t5.pending?.();
        case 2:
          return t5.complete?.(this.value);
        case 3:
          return t5.error?.(this.error);
        default:
          throw Error("Unexpected status: " + this.i);
      }
    }
  };
  var r6 = (s5, i7) => s5 === i7 || s5.length === i7.length && s5.every(((s6, h4) => !f(s6, i7[h4])));

  // node_modules/@mysten/dapp-kit-core/dist/web/index.mjs
  function storeProperty() {
    return function(target, propertyKey) {
      const controllerKey = Symbol();
      const valueKey = Symbol();
      Object.defineProperty(target, propertyKey, {
        get() {
          return this[valueKey];
        },
        set(newInstance) {
          const oldInstance = this[valueKey];
          if (oldInstance === newInstance) return;
          this[valueKey] = newInstance;
          const existingController = this[controllerKey];
          if (existingController) {
            existingController.hostDisconnected();
            this.removeController(existingController);
          }
          const newController = newInstance ? new import_lit2.MultiStoreController(this, Object.values(newInstance.stores)) : void 0;
          this[controllerKey] = newController;
          if (existingController && !newController) this.requestUpdate(propertyKey, oldInstance);
        },
        configurable: true,
        enumerable: true
      });
    };
  }
  var resetStyles = i`
	* {
		box-sizing: border-box;
		-webkit-font-smoothing: antialiased;
		font-family: var(--dapp-kit-font-sans);
		outline-color: color-mix(in oklab, var(--dapp-kit-ring) 50%, transparent);
	}

	button {
		appearance: none;
		background-color: transparent;
		font-size: inherit;
		font-family: inherit;
		line-height: inherit;
		letter-spacing: inherit;
		color: inherit;
		border: 0;
		padding: 0;
		margin: 0;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	p,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-size: inherit;
		font-weight: inherit;
		color: var(--dapp-kit-foreground);
		margin: 0;
	}
`;
  var themeStyles = i`
	:host {
		/** Colors */
		--dapp-kit-background: var(--background, oklch(1 0 0));
		--dapp-kit-foreground: var(--foreground, oklch(0.145 0 0));
		--dapp-kit-primary: var(--primary, oklch(0.216 0.006 56.043));
		--dapp-kit-primary-foreground: var(--primary-foreground, oklch(0.985 0.001 106.423));
		--dapp-kit-secondary: var(--secondary, oklch(0.97 0.001 106.424));
		--dapp-kit-secondary-foreground: var(--secondary-foreground, oklch(0.216 0.006 56.043));
		--dapp-kit-border: var(--border, oklch(0.922 0 0));
		--dapp-kit-accent: var(--accent, oklch(0.97 0.001 106.424));
		--dapp-kit-accent-foreground: var(--accent-foreground, oklch(0.205 0 0));
		--dapp-kit-muted: var(--muted, oklch(0.97 0.001 106.424));
		--dapp-kit-muted-foreground: var(--muted-foreground, oklch(0.553 0.013 58.071));
		--dapp-kit-popover: var(--popover, oklch(1 0 0));
		--dapp-kit-popover-foreground: var(--popover-foreground, oklch(0.145 0 0));
		--dapp-kit-destructive: var(--destructive, oklch(0.577 0.245 27.325));
		--dapp-kit-positive: var(--positive, oklch(0.862 0.127 146.2));
		--dapp-kit-ring: var(--ring, oklch(0.708 0 0));
		--dapp-kit-input: var(--input, oklch(0.922 0 0));

		/** Radii */
		--dapp-kit-radius: var(--radius, 12px);
		--dapp-kit-radius-xs: calc(var(--dapp-kit-radius) - 4px);
		--dapp-kit-radius-sm: calc(var(--dapp-kit-radius) - 4px);
		--dapp-kit-radius-md: calc(var(--dapp-kit-radius) - 2px);
		--dapp-kit-radius-lg: var(--dapp-kit-radius);
		--dapp-kit-radius-xl: calc(var(--dapp-kit-radius) + 4px);

		/** Typography */
		--dapp-kit-font-sans: var(
			--font-sans,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			'Helvetica Neue',
			Arial,
			'Noto Sans',
			sans-serif,
			'Apple Color Emoji',
			'Segoe UI Emoji',
			'Segoe UI Symbol',
			'Noto Color Emoji'
		);
		--dapp-kit-font-weight-medium: var(--font-medium, 500);
		--dapp-kit-font-weight-semibold: var(--font-semibold, 600);
	}
`;
  var sharedStyles = [themeStyles, resetStyles];
  var styles$5 = [sharedStyles, i`
		.wallet-button {
			transition-property: background-color;
			transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
			transition-duration: 0.15s;
			text-decoration: none;
			background-color: var(--dapp-kit-secondary);
			border-radius: var(--dapp-kit-radius-lg);
			display: flex;
			align-items: center;
			gap: 12px;
			width: 100%;
			padding: 12px;
		}

		.wallet-button:hover {
			background-color: oklab(from var(--dapp-kit-secondary) calc(l - 0.01) a b);
		}

		img {
			width: 32px;
			height: 32px;
			border-radius: var(--dapp-kit-radius-lg);
		}

		p {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			font-weight: var(--dapp-kit-font-weight-medium);
		}
	`];
  function __decorate(decorators, target, key, desc) {
    var c4 = arguments.length, r7 = c4 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d3;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r7 = Reflect.decorate(decorators, target, key, desc);
    else for (var i7 = decorators.length - 1; i7 >= 0; i7--) if (d3 = decorators[i7]) r7 = (c4 < 3 ? d3(r7) : c4 > 3 ? d3(target, key, r7) : d3(target, key)) || r7;
    return c4 > 3 && r7 && Object.defineProperty(target, key, r7), r7;
  }
  var __this_instances, walletClicked_fn, _a11;
  var WalletListItem = (_a11 = class extends i4 {
    constructor(..._args) {
      super(..._args);
      __privateAdd(this, __this_instances);
      this.autofocus = false;
    }
    render() {
      return b2`
			<li>
				<button
					type="button"
					class="wallet-button"
					@click=${__privateMethod(this, __this_instances, walletClicked_fn)}
					?autofocus=${this.autofocus}
				>
					<img src=${this.wallet.icon} alt=${`${this.wallet.name} logo`} />
					<p>${this.wallet.name}</p>
				</button>
			</li>
		`;
    }
  }, __this_instances = new WeakSet(), walletClicked_fn = function() {
    this.dispatchEvent(new CustomEvent("wallet-selected", {
      detail: { wallet: this.wallet },
      bubbles: true,
      composed: true
    }));
  }, _a11.styles = styles$5, _a11);
  __decorate([n4()], WalletListItem.prototype, "wallet", void 0);
  __decorate([n4({
    type: Boolean,
    reflect: true
  })], WalletListItem.prototype, "autofocus", void 0);
  var styles$4 = [sharedStyles, i`
		:host {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
		}

		ul {
			display: flex;
			flex-direction: column;
			gap: 12px;
		}

		.no-wallets-container {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
		}

		.no-wallets-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			flex-grow: 1;
			gap: 32px;
		}

		.title {
			font-weight: var(--dapp-kit-font-weight-semibold);
			text-align: center;
			font-size: 28px;
		}

		.wallet-cta {
			display: flex;
			flex-direction: column;
			width: 100%;
		}
	`];
  var styles$3 = [sharedStyles, i`
		.button {
			transition-property: background-color;
			transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
			transition-duration: 0.15s;
			border-radius: var(--dapp-kit-radius-md);
			font-weight: var(--dapp-kit-font-weight-semibold);
			text-decoration: none;
			outline-style: none;
			display: inline-flex;
			justify-content: center;
			align-items: center;
			gap: 12px;
			padding-left: 16px;
			padding-right: 16px;
			padding-top: 8px;
			padding-bottom: 8px;
			height: 40px;
		}

		.button:focus-visible {
			border-color: var(--dapp-kit-ring);
			box-shadow:
				0 0 0 3px color-mix(in oklab, var(--dapp-kit-ring) 50%, transparent),
				rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
		}

		.button.primary {
			background-color: var(--dapp-kit-primary);
			color: var(--dapp-kit-primary-foreground);
		}

		.button.primary:hover:not(:disabled) {
			background-color: color-mix(in oklab, var(--dapp-kit-primary) 90%, transparent);
		}

		.button.secondary {
			background-color: var(--dapp-kit-secondary);
			color: var(--dapp-kit-secondary-foreground);
		}

		.button.secondary:hover:not(:disabled) {
			background-color: color-mix(in oklab, var(--dapp-kit-secondary) 80%, transparent);
		}
	`];
  var _a12;
  var Button = (_a12 = class extends i4 {
    constructor(..._args) {
      super(..._args);
      this.variant = "primary";
      this.href = "";
      this.disabled = false;
    }
    render() {
      return this.href ? b2`
					<a
						part="trigger"
						href=${this.href}
						?disabled=${this.disabled}
						target="_blank"
						rel="noreferrer"
						class=${e8({
        button: true,
        [this.variant]: true
      })}
					>
						<slot part="button-content"></slot>
					</a>
				` : b2`
					<button
						part="trigger"
						type="button"
						?disabled=${this.disabled}
						class=${e8({
        button: true,
        [this.variant]: true
      })}
					>
						<slot part="button-content"></slot>
					</button>
				`;
    }
  }, _a12.shadowRootOptions = {
    ...i4.shadowRootOptions,
    delegatesFocus: true
  }, _a12.styles = styles$3, _a12);
  __decorate([n4({ type: String })], Button.prototype, "variant", void 0);
  __decorate([n4({ type: String })], Button.prototype, "href", void 0);
  __decorate([n4({
    type: Boolean,
    reflect: true
  })], Button.prototype, "disabled", void 0);
  var downloadIcon = b2`<svg
	width="80"
	height="80"
	viewBox="0 0 80 80"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M0 40C0 17.9086 17.9086 0 40 0C62.0914 0 80 17.9086 80 40C80 62.0914 62.0914 80 40 80C17.9086 80 0 62.0914 0 40Z"
		fill="currentColor"
		fill-opacity="0.08"
	/>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M39.6881 28.8311C39.4347 28.9111 39.1675 29.1669 39.0607 29.4318L39.0041 29.572L38.9977 35.5349L38.9914 41.4978L37.8217 40.3324C36.5477 39.063 36.5486 39.0637 36.228 39.0138C35.7909 38.9458 35.3452 39.1858 35.1541 39.592C35.0986 39.7101 35.0921 39.7532 35.0921 40C35.0921 40.4608 34.9004 40.2321 37.3099 42.6471C39.1553 44.4968 39.4299 44.763 39.5579 44.8263C39.8344 44.9632 40.1614 44.9624 40.4441 44.8244C40.5705 44.7626 40.843 44.4987 42.679 42.659C45.0881 40.2451 44.9081 40.4599 44.9081 40C44.9081 39.7458 44.9027 39.7132 44.8403 39.586C44.6384 39.1748 44.2051 38.9438 43.7678 39.0142C43.4501 39.0654 43.4497 39.0657 42.1784 40.3324L41.0087 41.4978L41.0024 35.5349L40.9961 29.572L40.9395 29.4318C40.8294 29.1587 40.5615 28.9075 40.2964 28.8288C40.1444 28.7836 39.8347 28.7848 39.6881 28.8311ZM31.114 46.0981C30.9593 46.1346 30.7812 46.2398 30.647 46.374C30.4216 46.5994 30.3357 46.8708 30.3627 47.272C30.3949 47.7507 30.4603 48.0732 30.6081 48.484C31.0707 49.7693 32.1522 50.7474 33.4841 51.0852C33.9919 51.2141 33.6619 51.2078 39.9943 51.2079C46.331 51.208 46.0036 51.2142 46.5161 51.085C47.8428 50.7503 48.9303 49.7668 49.392 48.484C49.5851 47.9478 49.6896 47.2429 49.6266 46.9026C49.5428 46.4495 49.1756 46.1129 48.7285 46.0791C48.3302 46.0489 47.9715 46.2363 47.7705 46.5793C47.687 46.7218 47.6625 46.8267 47.6335 47.1663C47.5846 47.7384 47.4064 48.16 47.0574 48.5289C46.6981 48.9088 46.2476 49.1338 45.7272 49.1934C45.5791 49.2103 43.6721 49.2161 39.8441 49.2112L34.1801 49.204L33.9966 49.1516C33.5867 49.0347 33.3159 48.8845 33.0317 48.6166C32.6281 48.2363 32.4192 47.7806 32.3667 47.1663C32.3377 46.8267 32.3132 46.7218 32.2297 46.5793C32.1479 46.4397 31.9572 46.2518 31.8327 46.1882C31.6225 46.0807 31.3388 46.0451 31.114 46.0981Z"
		fill="currentColor"
	/>
</svg>`;
  var arrowRightUpIcon = b2`<svg
	width="17"
	height="16"
	viewBox="0 0 17 16"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M4.19888 1.05645C4.0026 1.08501 3.7911 1.24624 3.706 1.43215C3.62348 1.61237 3.62622 1.84103 3.71297 2.01403C3.79982 2.18722 3.99089 2.3325 4.17827 2.36781C4.23528 2.37855 5.77091 2.38405 8.71417 2.38405H13.1639L7.41745 8.13205C2.23561 13.3153 1.66614 13.8898 1.62155 13.9796C1.48908 14.2462 1.5436 14.5657 1.75579 14.7664C1.95884 14.9584 2.23582 15.003 2.50305 14.8868C2.59953 14.8449 2.8643 14.5828 8.36009 9.0896L14.1161 3.33629V7.78598C14.1161 10.7292 14.1216 12.2649 14.1323 12.3219C14.1819 12.5852 14.4093 12.8046 14.6761 12.8467C15.0449 12.9048 15.3918 12.6521 15.4446 12.2868C15.4668 12.1329 15.465 1.71239 15.4427 1.59173C15.3934 1.32528 15.1749 1.10672 14.9084 1.05746C14.7978 1.03703 4.33916 1.03603 4.19888 1.05645Z"
		fill="currentColor"
	/>
</svg> `;
  var _a13;
  var WalletList = (_a13 = class extends e6(i4) {
    constructor(..._args) {
      super(..._args);
      this.wallets = [];
    }
    render() {
      return this.wallets.length === 0 ? b2`<div class="no-wallets-container">
					<div class="no-wallets-content">
						${downloadIcon}
						<h2 class="title">Install a wallet to get started on Sui</h2>
					</div>
					<internal-button class="wallet-cta" href="https://sui.io/get-started">
						Select a wallet to install ${arrowRightUpIcon}
					</internal-button>
				</div>` : b2`<ul class="wallet-list">
					${this.wallets.map((wallet, index) => b2`<wallet-list-item
								.wallet=${wallet}
								?autofocus=${index === 0}
							></wallet-list-item>`)}
				</ul>`;
    }
  }, _a13.elementDefinitions = {
    "wallet-list-item": WalletListItem,
    "internal-button": Button
  }, _a13.styles = styles$4, _a13);
  __decorate([n4({ type: Object })], WalletList.prototype, "wallets", void 0);
  var _isOpen, _isOpening, _isConnected, _returnValue, _nextClickIsFromContent, _a14;
  var BaseModal = (_a14 = class extends i4 {
    constructor() {
      super(...arguments);
      __privateAdd(this, _isOpen, false);
      __privateAdd(this, _isOpening, false);
      __privateAdd(this, _isConnected, promiseWithResolvers());
      __privateAdd(this, _returnValue);
      __privateAdd(this, _nextClickIsFromContent, false);
    }
    /**
    * Opens the dialog when set to `true` and closes it when set to `false`.
    */
    get open() {
      return __privateGet(this, _isOpen);
    }
    set open(open) {
      if (open === __privateGet(this, _isOpen)) return;
      __privateSet(this, _isOpen, open);
      if (__privateGet(this, _isOpen)) {
        this.setAttribute("open", "");
        this.show();
      } else {
        this.removeAttribute("open");
        this.close();
      }
    }
    /**
    * Opens the dialog and fires a cancelable `open` event. An `opened` event
    * is fired after the dialog opens.
    *
    * @returns A `Promise` that resolves after the `opened` event was fired.
    */
    async show() {
      __privateSet(this, _isOpening, true);
      await __privateGet(this, _isConnected).promise;
      await this.updateComplete;
      if (this._dialog.open || !__privateGet(this, _isOpening)) {
        __privateSet(this, _isOpening, false);
        return;
      }
      if (!this.dispatchEvent(new Event("open", { cancelable: true }))) {
        this.open = false;
        __privateSet(this, _isOpening, false);
        return;
      }
      this._dialog.showModal();
      this.open = true;
      this.dispatchEvent(new Event("opened"));
      __privateSet(this, _isOpening, false);
    }
    /**
    * Closes the dialog and fires a cancelable `close` event. After a dialog's
    * animation, a `closed` event is fired.
    *
    * @param returnValue A return value usually indicating which button was used
    *     to close a dialog. If a dialog is canceled by clicking the backdrop or
    *     pressing Escape, it will not change the return value after closing.
    * @returns A Promise that resolves after the `closed` event was fired.
    */
    async close(returnValue = __privateGet(this, _returnValue)) {
      __privateSet(this, _isOpening, false);
      if (!this.isConnected) {
        this.open = false;
        return;
      }
      await this.updateComplete;
      if (!this._dialog.open || __privateGet(this, _isOpening)) {
        this.open = false;
        return;
      }
      const prevReturnValue = __privateGet(this, _returnValue);
      __privateSet(this, _returnValue, returnValue);
      if (!this.dispatchEvent(new Event("close", { cancelable: true }))) {
        __privateSet(this, _returnValue, prevReturnValue);
        return;
      }
      this._dialog.close(__privateGet(this, _returnValue));
      this.open = false;
      this.dispatchEvent(new Event("closed"));
    }
    connectedCallback() {
      super.connectedCallback();
      __privateGet(this, _isConnected).resolve();
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      __privateSet(this, _isConnected, Promise.withResolvers());
    }
    handleContentClick() {
      __privateSet(this, _nextClickIsFromContent, true);
    }
    handleDialogClick() {
      if (__privateGet(this, _nextClickIsFromContent)) {
        __privateSet(this, _nextClickIsFromContent, false);
        return;
      }
      if (!this.dispatchEvent(new Event("cancel", { cancelable: true }))) return;
      this.close();
    }
  }, _isOpen = new WeakMap(), _isOpening = new WeakMap(), _isConnected = new WeakMap(), _returnValue = new WeakMap(), _nextClickIsFromContent = new WeakMap(), _a14.shadowRootOptions = {
    ...i4.shadowRootOptions,
    delegatesFocus: true
  }, _a14);
  __decorate([n4({ type: Boolean })], BaseModal.prototype, "open", null);
  __decorate([e5("dialog")], BaseModal.prototype, "_dialog", void 0);
  var closeIcon = b2`<svg
	width="16"
	height="16"
	viewBox="0 0 16 16"
	fill="currentColor"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M2.04841 1.59812C2.00001 1.61375 1.93695 1.63878 1.90828 1.65375C1.83709 1.69091 1.68775 1.84287 1.65047 1.91606C1.54047 2.13201 1.54381 2.37028 1.6597 2.57601C1.68564 2.62206 2.66404 3.61254 4.37417 5.32401L7.04809 8.00001L4.37417 10.676C2.67052 12.381 1.68551 13.3781 1.65959 13.424C1.49234 13.7201 1.56607 14.0843 1.83583 14.2945C2.04141 14.4547 2.34161 14.4734 2.57641 14.3408C2.62228 14.3149 3.61943 13.3299 5.32441 11.6262L8.00041 8.95233L10.6764 11.6262C12.3814 13.3299 13.3785 14.3149 13.4244 14.3408C13.6592 14.4734 13.9594 14.4547 14.165 14.2945C14.4347 14.0843 14.5085 13.7201 14.3412 13.424C14.3153 13.3781 13.3303 12.381 11.6266 10.676L8.95273 8.00001L11.6266 5.32401C13.3303 3.61903 14.3153 2.62188 14.3412 2.57601C14.4738 2.34121 14.4551 2.04102 14.2949 1.83543C14.0847 1.56567 13.7205 1.49195 13.4244 1.65919C13.3785 1.68511 12.3814 2.67012 10.6764 4.37377L8.00041 7.04769L5.32441 4.37377C3.61293 2.66364 2.62245 1.68524 2.57641 1.65931C2.41372 1.56766 2.21439 1.54457 2.04841 1.59812Z"
	/>
</svg> `;
  var backIcon = b2`<svg
	width="15"
	height="16"
	viewBox="0 0 15 16"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M6.90786 1.05824C6.70479 1.08877 6.91965 0.871204 3.62561 4.38197C0.943351 7.24072 0.593731 7.6189 0.554431 7.70397C0.501166 7.81932 0.480376 7.96424 0.497641 8.09997C0.525721 8.32084 0.315931 8.08477 3.59808 11.5887C5.25324 13.3557 6.6377 14.8229 6.67466 14.8493C6.76715 14.9153 6.88374 14.9481 7.01883 14.9464C7.19993 14.9441 7.32822 14.8862 7.45368 14.7503C7.6404 14.5479 7.68581 14.2362 7.56597 13.9793C7.53443 13.9117 7.06523 13.403 5.08008 11.2841L2.63307 8.67231L8.31776 8.66796C13.6185 8.66392 14.0073 8.6618 14.0739 8.63648C14.173 8.59888 14.3009 8.50512 14.3625 8.425C14.5276 8.21008 14.553 7.89213 14.4239 7.65714C14.3438 7.51138 14.1733 7.38224 14.013 7.34596C13.9549 7.33282 12.4096 7.32797 8.28312 7.32797H2.63276L5.07993 4.71597C7.0652 2.59698 7.53443 2.08824 7.56597 2.02063C7.68584 1.76365 7.6404 1.452 7.45358 1.24956C7.30854 1.09239 7.1201 1.02632 6.90786 1.05824Z"
		fill="currentColor"
	/>
</svg> `;
  var styles$2 = [sharedStyles, i`
		:host {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			flex-grow: 1;
			gap: 40px;
		}

		.logo {
			width: 120px;
			height: 120px;
			border-radius: var(--dapp-kit-radius-lg);
		}

		.container {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			gap: 12px;
		}

		.title {
			font-size: 24px;
			font-weight: var(--dapp-kit-font-weight-medium);
		}

		.copy {
			color: var(--dapp-kit-muted-foreground);
		}

		::slotted(*) {
			display: flex;
			flex-direction: column;
			width: 100%;
		}
	`];
  var _a15;
  var ConnectionStatus = (_a15 = class extends i4 {
    constructor(..._args) {
      super(..._args);
      this.title = "";
      this.copy = "";
    }
    render() {
      return b2`
			<img class="logo" src=${this.wallet.icon} alt=${`${this.wallet.name} logo`} />
			<div class="container">
				<h3 class="title">${this.title}</h3>
				<p class="copy">${this.copy}</p>
			</div>
			<slot name="call-to-action"></slot>
		`;
    }
  }, _a15.styles = styles$2, _a15);
  __decorate([n4({ type: Object })], ConnectionStatus.prototype, "wallet", void 0);
  __decorate([n4({ type: String })], ConnectionStatus.prototype, "title", void 0);
  __decorate([n4({ type: String })], ConnectionStatus.prototype, "copy", void 0);
  var styles$1 = [sharedStyles, i`
		dialog {
			width: 360px;
			height: 480px;
			border: 1px solid var(--dapp-kit-border);
			padding: 0;
			background: var(--dapp-kit-background);
			border-radius: var(--dapp-kit-radius-lg);
		}

		.content {
			display: flex;
			flex-direction: column;
			height: 100%;
			gap: 32px;
			padding: 24px;
		}

		.connect-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 8px;
		}

		.title {
			font-size: 18px;
			font-weight: var(--dapp-kit-font-weight-semibold);
			white-space: nowrap;
		}

		.close-button {
			margin-left: auto;
		}

		.cancel-button {
			margin-top: auto;
		}
	`];
  var iconButtonStyles = i`
	.icon-button {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: inherit;
		color: var(--dapp-kit-foreground);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition:
			background-color 200ms,
			transform 100ms;
	}

	.icon-button:hover {
		background-color: var(--dapp-kit-accent);
	}

	.icon-button:active {
		transform: scale(0.9);
	}
`;
  var _abortController, _DAppKitConnectModal$1_instances, renderModalView_fn, attemptConnect_fn, resetSelection_fn, getWallets_fn, _a16;
  var DAppKitConnectModal = (_a16 = class extends e6(BaseModal) {
    constructor(..._args) {
      super(..._args);
      __privateAdd(this, _DAppKitConnectModal$1_instances);
      __privateAdd(this, _abortController);
      this._state = { view: "wallet-selection" };
    }
    render() {
      const showBackButton = this._state.view === "connecting" || this._state.view === "error";
      const wallets2 = __privateMethod(this, _DAppKitConnectModal$1_instances, getWallets_fn).call(this);
      return b2`<dialog @click=${this.handleDialogClick} @close=${__privateMethod(this, _DAppKitConnectModal$1_instances, resetSelection_fn)}>
			<div class="content" @click=${this.handleContentClick}>
				<div class="connect-header">
					${showBackButton ? b2`<button
								class="icon-button back-button"
								aria-label="Go back"
								@click=${__privateMethod(this, _DAppKitConnectModal$1_instances, resetSelection_fn)}
							>
								${backIcon}
							</button>` : A}
					<h2 class="title">${wallets2.length > 0 ? "Connect a wallet" : "No wallets installed"}</h2>
					<button
						class="icon-button close-button"
						aria-label="Close"
						@click=${() => {
        this.close("cancel");
      }}
					>
						${closeIcon}
					</button>
				</div>
				${__privateMethod(this, _DAppKitConnectModal$1_instances, renderModalView_fn).call(this, wallets2)}
			</div>
		</dialog>`;
    }
  }, _abortController = new WeakMap(), _DAppKitConnectModal$1_instances = new WeakSet(), renderModalView_fn = function(wallets2) {
    switch (this._state.view) {
      case "wallet-selection":
        return b2`<wallet-list
					.wallets=${wallets2}
					@wallet-selected=${async (event) => {
          __privateMethod(this, _DAppKitConnectModal$1_instances, attemptConnect_fn).call(this, event.detail.wallet);
        }}
				></wallet-list>`;
      case "connecting":
        return b2`<connection-status
					.title=${"Awaiting connection..."}
					.copy=${`Accept the request from ${this._state.wallet.name} in order to proceed`}
					.wallet=${this._state.wallet}
				>
					<internal-button
						slot="call-to-action"
						.variant=${"secondary"}
						@click=${__privateMethod(this, _DAppKitConnectModal$1_instances, resetSelection_fn)}
					>
						Cancel
					</internal-button>
				</connection-status>`;
      case "error":
        const { wallet, error } = this._state;
        const wasRequestCancelled = isWalletStandardError(error, WALLET_STANDARD_ERROR__USER__REQUEST_REJECTED);
        return b2`<connection-status
					.title=${wasRequestCancelled ? "Request canceled" : "Connection failed"}
					.copy=${wasRequestCancelled ? `You canceled the request` : "Something went wrong. Please try again"}
					.wallet=${wallet}
				>
					<internal-button
						slot="call-to-action"
						@click=${() => {
          __privateMethod(this, _DAppKitConnectModal$1_instances, attemptConnect_fn).call(this, wallet);
        }}
					>
						Retry
					</internal-button>
				</connection-status>`;
      default:
        throw new Error(`Encountered unknown view state: ${this._state}`);
    }
  }, attemptConnect_fn = async function(wallet) {
    let delayTimeout;
    try {
      const abortPromise = new Promise((_2, reject) => {
        __privateSet(this, _abortController, new AbortController());
        __privateGet(this, _abortController).signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
      });
      delayTimeout = setTimeout(() => {
        this._state = {
          view: "connecting",
          wallet
        };
      }, 100);
      await Promise.race([abortPromise, this.instance.connectWallet({ wallet })]);
      this.close("successful-connection");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") this._state = { view: "wallet-selection" };
      else this._state = {
        view: "error",
        wallet,
        error
      };
    } finally {
      clearTimeout(delayTimeout);
    }
  }, resetSelection_fn = function() {
    if (this._state.view === "connecting") __privateGet(this, _abortController)?.abort("cancelled");
    else this._state = { view: "wallet-selection" };
  }, getWallets_fn = function() {
    const wallets2 = this.instance.stores.$wallets.get();
    const filtered = this.filterFn ? wallets2.filter(this.filterFn) : wallets2;
    return this.sortFn ? filtered.toSorted(this.sortFn) : filtered;
  }, _a16.styles = [styles$1, iconButtonStyles], _a16.elementDefinitions = {
    "wallet-list": WalletList,
    "internal-button": Button,
    "connection-status": ConnectionStatus
  }, _a16);
  __decorate([storeProperty()], DAppKitConnectModal.prototype, "instance", void 0);
  __decorate([r5()], DAppKitConnectModal.prototype, "_state", void 0);
  __decorate([n4({ attribute: false })], DAppKitConnectModal.prototype, "filterFn", void 0);
  __decorate([n4({ attribute: false })], DAppKitConnectModal.prototype, "sortFn", void 0);
  DAppKitConnectModal = __decorate([t3("mysten-dapp-kit-connect-modal")], DAppKitConnectModal);
  var unlinkIcon = b2`<svg
	width="17"
	height="16"
	viewBox="0 0 17 16"
	fill="currentColor"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M11.22 0.538749C10.6265 0.598285 10.1912 0.722509 9.66001 0.983949C9.37775 1.12286 9.12319 1.28297 8.87601 1.47704C8.69228 1.62129 6.93319 3.37158 6.85697 3.48597C6.78033 3.60101 6.75383 3.69451 6.75437 3.84801C6.75508 4.04564 6.81122 4.18171 6.94887 4.31936C7.14239 4.51288 7.43207 4.56667 7.68401 4.45585C7.78109 4.41317 7.84866 4.34988 8.70001 3.50432C9.20161 3.00612 9.65881 2.56196 9.71601 2.51731C10.0519 2.25499 10.4706 2.05141 10.892 1.94537C11.2092 1.86557 11.7213 1.84326 12.0514 1.89489C12.9243 2.03139 13.651 2.49584 14.1437 3.23201C14.3077 3.47704 14.4669 3.8423 14.5477 4.15877C14.6587 4.59373 14.6616 5.18297 14.5546 5.60801C14.4471 6.03561 14.2443 6.45003 13.9762 6.79022C13.9268 6.85281 13.489 7.30361 13.0031 7.79201C12.5173 8.28041 12.1015 8.7095 12.0793 8.74557C12.0217 8.83864 11.988 8.96494 11.9882 9.08693C11.9885 9.27032 12.0513 9.42179 12.1808 9.55125C12.3159 9.68635 12.4532 9.74419 12.644 9.74638C12.7905 9.74808 12.9047 9.71592 13.016 9.64171C13.1301 9.56558 14.864 7.82219 15.0147 7.63201C15.502 7.01705 15.8117 6.30936 15.9321 5.53601C15.9672 5.31038 15.9813 4.73297 15.9576 4.48801C15.9054 3.94678 15.7771 3.48822 15.5414 3.00001C15.3126 2.52614 15.0685 2.18312 14.6927 1.80733C13.9789 1.09355 13.1035 0.668781 12.1059 0.552077C11.9206 0.530397 11.3837 0.522333 11.22 0.538749ZM5.2445 1.05827C5.0433 1.08664 4.84421 1.23966 4.75012 1.43825L4.70001 1.54401L4.69549 2.46219C4.69154 3.26985 4.69412 3.39117 4.71692 3.47019C4.76266 3.62872 4.85655 3.75208 5.00476 3.84838C5.20802 3.98045 5.48217 3.98582 5.69402 3.8619C5.77233 3.81611 5.90889 3.67566 5.94727 3.60145C6.01841 3.46387 6.01965 3.44486 6.01983 2.49262C6.02001 1.61425 6.01895 1.58238 5.98692 1.49678C5.87002 1.18435 5.57716 1.01137 5.2445 1.05827ZM2.59673 1.58549C2.4178 1.62057 2.22357 1.77176 2.14122 1.94009C2.08143 2.06232 2.05881 2.21302 2.08055 2.34425C2.11277 2.53877 2.15631 2.60016 2.52401 2.96969C2.81721 3.26435 2.87423 3.31429 2.97162 3.36169C3.07791 3.41342 3.09167 3.41601 3.25962 3.41601C3.4238 3.41601 3.44327 3.41257 3.541 3.36627C3.67756 3.30155 3.80154 3.17757 3.86626 3.04101C3.91257 2.94328 3.91601 2.9238 3.91601 2.75963C3.91601 2.59168 3.91341 2.57792 3.86169 2.47163C3.81428 2.37424 3.76434 2.31721 3.46969 2.02401C3.10991 1.66603 3.04322 1.61725 2.86836 1.58408C2.77031 1.56549 2.69684 1.56587 2.59673 1.58549ZM2.02801 4.21445C1.85482 4.26936 1.69453 4.40416 1.61634 4.56062C1.53162 4.73012 1.5306 4.97821 1.61388 5.14899C1.67375 5.27179 1.8045 5.39857 1.93497 5.46037L2.04401 5.51201L2.96401 5.51667C3.92485 5.52155 3.95385 5.51987 4.09084 5.45173C4.17271 5.41101 4.31301 5.27763 4.36189 5.19403C4.57817 4.82427 4.38473 4.33845 3.97309 4.21753C3.89789 4.19545 3.76553 4.19216 2.98909 4.19309C2.31132 4.19389 2.07636 4.19912 2.02801 4.21445ZM10.4794 5.24865C10.4373 5.25573 10.3545 5.28401 10.2954 5.3115C10.1935 5.35891 10.0767 5.47275 8.02474 7.52475C5.98373 9.56576 5.85868 9.694 5.81218 9.794C5.68556 10.0662 5.73263 10.3648 5.93393 10.5661C6.13521 10.7674 6.4338 10.8145 6.70602 10.6878C6.80602 10.6413 6.93426 10.5163 8.97527 8.47528C11.0163 6.43427 11.1413 6.30603 11.1878 6.20603C11.2829 6.00173 11.2838 5.80633 11.1907 5.61C11.1022 5.42347 10.9104 5.28238 10.6982 5.24763C10.5933 5.23045 10.5875 5.23048 10.4794 5.24865ZM4.25201 6.25709C4.13005 6.27627 4.07709 6.29624 3.98469 6.35787C3.87025 6.43421 2.13679 8.17691 1.98524 8.36801C1.7866 8.61848 1.62597 8.87236 1.48417 9.16001C1.25775 9.61931 1.14644 9.96928 1.0669 10.472C1.03255 10.6891 1.01855 11.2894 1.04242 11.5218C1.13201 12.3938 1.44233 13.1559 1.99106 13.8515C2.11753 14.0118 2.48823 14.3825 2.64853 14.509C3.34417 15.0577 4.10626 15.368 4.9782 15.4576C5.21338 15.4818 5.80996 15.4674 6.03601 15.4322C6.811 15.3113 7.51625 15.0026 8.13201 14.5147C8.32218 14.364 10.0656 12.6301 10.1417 12.516C10.2159 12.4047 10.2481 12.2905 10.2464 12.144C10.2442 11.9532 10.1863 11.8159 10.0512 11.6808C9.92178 11.5513 9.77031 11.4885 9.58692 11.4882C9.46493 11.488 9.33863 11.5217 9.24556 11.5793C9.20949 11.6015 8.78041 12.0173 8.29201 12.5031C7.80361 12.989 7.35281 13.4268 7.29021 13.4762C6.95002 13.7443 6.53561 13.9471 6.10801 14.0547C5.68297 14.1616 5.09372 14.1587 4.65876 14.0477C4.1114 13.9079 3.64604 13.6439 3.25109 13.2489C2.7846 12.7824 2.49877 12.2158 2.39489 11.5514C2.35978 11.3269 2.35981 10.8808 2.39497 10.656C2.47809 10.1242 2.69338 9.62913 3.02385 9.20981C3.07317 9.14721 3.51778 8.68921 4.01186 8.19201C4.85073 7.34785 4.91322 7.28113 4.95589 7.18401C5.06609 6.93325 5.01277 6.6423 4.82162 6.45115C4.66466 6.29419 4.45981 6.2244 4.25201 6.25709ZM13.548 10.5024C13.3666 10.56 13.2147 10.6922 13.1337 10.863C13.0874 10.9607 13.084 10.9802 13.084 11.1444C13.084 11.3106 13.0869 11.3268 13.1354 11.4252C13.2206 11.5981 13.3733 11.7304 13.5493 11.7838C13.6613 11.8178 14.8548 11.819 14.9659 11.7852C15.1861 11.7184 15.3611 11.5473 15.4232 11.3381C15.455 11.2312 15.4542 11.0513 15.4215 10.9388C15.3698 10.7611 15.1977 10.5858 15.0032 10.5131C14.919 10.4816 14.8842 10.4801 14.2634 10.4811C13.7842 10.4819 13.5951 10.4875 13.548 10.5024ZM11.4431 12.5983C11.2533 12.6712 11.1165 12.7929 11.0377 12.959L10.988 13.064L10.9834 13.7377C10.9789 14.3897 10.9798 14.4143 11.0124 14.5015C11.0858 14.6977 11.2604 14.8696 11.4388 14.9215C11.8061 15.0283 12.1748 14.8298 12.2852 14.4659C12.319 14.3548 12.3177 13.1613 12.2838 13.0494C12.2305 12.8735 12.0981 12.7206 11.9257 12.6357C11.8326 12.5899 11.8052 12.5842 11.6609 12.5806C11.5544 12.5779 11.4808 12.5839 11.4431 12.5983ZM13.5391 12.5983C13.3493 12.6712 13.2125 12.7929 13.1337 12.959C13.0874 13.0567 13.084 13.0762 13.084 13.2404C13.084 13.4083 13.0866 13.4221 13.1383 13.5284C13.1857 13.6258 13.2357 13.6828 13.5303 13.976C13.9023 14.3462 13.9559 14.3839 14.1582 14.4172C14.3748 14.453 14.5719 14.3886 14.7303 14.2303C14.8886 14.0719 14.953 13.8748 14.9172 13.6582C14.8838 13.4559 14.8462 13.4023 14.476 13.0303C14.1833 12.7362 14.1257 12.6857 14.0289 12.6386C13.9283 12.5896 13.9028 12.5842 13.7569 12.5806C13.6504 12.5779 13.5768 12.5839 13.5391 12.5983Z"
	/>
</svg>`;
  var styles = [
    sharedStyles,
    iconButtonStyles,
    i`
		:host {
			display: block;
			width: fit-content;
		}

		.menu {
			display: none;
		}

		[aria-expanded='true'] + .menu {
			display: flex;
			flex-direction: column;
			max-width: fit-content;
			min-width: 396px;
			gap: 16px;
			padding: 16px;
			position: absolute;
			outline: none;
			background-color: var(--dapp-kit-popover);
			color: var(--dapp-kit-popover-foreground);
			border-radius: var(--dapp-kit-radius-lg);
			border: 1px solid var(--dapp-kit-border);
			box-shadow:
				0 4px 6px -1px rgba(0, 0, 0, 0.1),
				0 2px 4px -2px rgba(0, 0, 0, 0.1);
		}

		.header-container {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.header-title {
			font-size: 18px;
			font-weight: var(--dapp-kit-font-weight-semibold);
			letter-spacing: -0.18px;
		}

		img {
			width: 24px;
			height: 24px;
			border-radius: 96px;
		}

		[aria-expanded='true'] .chevron {
			transition: transform 0.3s ease;
			transform: rotate(180deg);
		}

		.chevron {
			display: flex;
		}

		.chevron svg {
			width: 12px;
			height: 12px;
		}

		.trigger-content {
			display: flex;
			align-items: center;
			font-weight: var(--dapp-kit-font-weight-semibold);
			gap: 12px;
		}

		.accounts-list {
			display: flex;
			flex-direction: column;
			gap: 12px;
			max-height: 240px;
			overflow-y: auto;
		}

		.disconnect-button {
			background-color: rgba(0, 0, 0, 0.8);
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			background-color: var(--dapp-kit-secondary);
			color: var(--dapp-kit-destructive);
			border-radius: var(--dapp-kit-radius-md);
			font-weight: var(--dapp-kit-font-weight-medium);
			height: 48px;
			padding: 16px;
			gap: 8px;
		}

		.disconnect-button:hover {
			background-color: color-mix(in oklab, var(--dapp-kit-secondary) 80%, transparent);
		}

		.container {
			padding-top: 12px;
			padding-bottom: 12px;
			padding-left: 16px;
			padding-right: 16px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 8px;
			width: 100%;
			border-radius: var(--dapp-kit-radius-sm);
		}

		.container[data-checked='true'] {
			background-color: var(--dapp-kit-accent);
		}

		.account-title {
			font-weight: var(--dapp-kit-font-weight-semibold);
		}

		.account-subtitle {
			color: var(--dapp-kit-muted-foreground);
			font-weight: var(--dapp-kit-font-weight-medium);
			font-size: 14px;
		}

		.account-info {
			display: flex;
			flex-direction: column;
			gap: 4px;
		}

		.content {
			display: flex;
			flex-grow: 1;
			gap: 12px;
		}

		.copy-address-button {
			display: inline-flex;
		}

		.copy-address-button svg {
			width: 16px;
			height: 16px;
		}

		.radio-indicator {
			width: 20px;
			height: 20px;
			border-radius: 100%;
			background-color: var(--dapp-kit-input);
			border: 1px solid var(--dapp-kit-border);
			display: inline-flex;
			justify-content: center;
			align-items: center;
		}

		.content:focus-visible .radio-indicator {
			border-color: var(--dapp-kit-ring);
			box-shadow: 0 0 0 3px var(--dapp-kit-ring) / 0.5;
			outline: none;
		}

		[data-checked='true'] .radio-indicator {
			color: var(--dapp-kit-positive);
			border-color: var(--dapp-kit-positive);
		}

		.radio-input {
			appearance: none;
			-webkit-appearance: none;
			width: 20px;
			height: 20px;
			margin: 0;
			border-radius: 50%;
			background-color: var(--dapp-kit-input);
			border: 1px solid var(--dapp-kit-input);
			cursor: pointer;
			position: relative;
			outline: none;
			transition: box-shadow 0.2s;
		}

		.radio-input::before {
			content: '';
			position: absolute;
			top: 50%;
			left: 50%;
			width: 8px;
			height: 8px;
			background-color: var(--dapp-kit-positive);
			border-radius: 100%;
			transform: translate(-50%, -50%) scale(0);
			transition: transform 0.2s ease;
		}

		.radio-input:checked {
			background-color: transparent;
			border-color: var(--dapp-kit-positive);
		}

		.radio-input:checked::before {
			transform: translate(-50%, -50%) scale(1);
		}

		.radio-input:focus-visible {
			border-color: var(--dapp-kit-ring);
			box-shadow: 0 0 0 3px var(--dapp-kit-ring);
		}
	`
  ];
  var copyIcon = b2`<svg
	width="16"
	height="16"
	viewBox="0 0 16 16"
	fill="currentColor"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M2.57602 1.05841C1.96473 1.12213 1.42869 1.52667 1.18005 2.11198C1.1061 2.28603 1.0777 2.39982 1.05682 2.60568C1.03369 2.83379 1.03361 9.476 1.05673 9.71992C1.12471 10.4367 1.60071 11.0082 2.31202 11.227L2.45602 11.2713L3.58402 11.2796L4.71202 11.288L4.72098 12.416C4.7307 13.6405 4.7262 13.5765 4.82061 13.8331C4.95698 14.2037 5.26674 14.5566 5.62014 14.7439C5.85567 14.8688 6.02999 14.9204 6.29721 14.9443C6.5825 14.9699 13.4137 14.9564 13.544 14.9301C14.2457 14.7881 14.7885 14.2454 14.9301 13.544C14.9564 13.4135 14.9699 6.582 14.9444 6.29717C14.9204 6.02992 14.8688 5.8556 14.744 5.62009C14.5566 5.2667 14.2038 4.95694 13.8332 4.82057C13.5766 4.72616 13.6405 4.73065 12.416 4.72094L11.288 4.71198L11.2797 3.58398L11.2713 2.45598L11.227 2.31198C11.1329 2.00597 10.9791 1.74963 10.7655 1.54273C10.4634 1.25013 10.1311 1.09568 9.71996 1.05669C9.50114 1.03595 2.77607 1.03757 2.57602 1.05841ZM2.64002 2.40489C2.56149 2.42965 2.42756 2.56833 2.40348 2.64984C2.38845 2.70067 2.3841 3.50549 2.38437 6.17784C2.38473 9.62633 2.38485 9.64027 2.41732 9.71198C2.45749 9.80075 2.51625 9.86424 2.60002 9.90945C2.66343 9.94366 2.67351 9.94403 3.69159 9.94843L4.71916 9.95288L4.72359 8.03643L4.72802 6.11998L4.77265 5.97758C4.96105 5.37641 5.37855 4.9584 5.97602 4.77273L6.12002 4.72798L8.03647 4.72355L9.95292 4.71912L9.94847 3.69155C9.94407 2.67347 9.9437 2.66339 9.9095 2.59998C9.86428 2.51621 9.80079 2.45745 9.71202 2.41728C9.64026 2.3848 9.62818 2.38469 6.16802 2.38597C3.68466 2.38688 2.68007 2.39227 2.64002 2.40489ZM6.33593 6.06286C6.22594 6.09651 6.14185 6.16683 6.08585 6.27198C6.05701 6.32613 6.05602 6.44379 6.05602 9.83198V13.336L6.09108 13.4015C6.1358 13.4851 6.21761 13.5568 6.30634 13.5904C6.37039 13.6146 6.65799 13.6164 9.86402 13.6124C13.1284 13.6083 13.3553 13.6062 13.4023 13.5804C13.4667 13.5452 13.5453 13.4666 13.5805 13.4023C13.6063 13.3552 13.6083 13.1283 13.6124 9.86398C13.6164 6.65795 13.6146 6.37035 13.5904 6.3063C13.5569 6.21757 13.4851 6.13576 13.4015 6.09104L13.336 6.05598L9.85602 6.05328C7.94202 6.05181 6.35798 6.05611 6.33593 6.06286Z"
	/>
</svg> `;
  var cache = /* @__PURE__ */ new Map();
  async function resolveNameServiceName(client, address) {
    if (cache.has(address)) return cache.get(address);
    try {
      const name = (await client.core.defaultNameServiceName?.({ address }))?.data.name;
      cache.set(address, name ? normalizeSuiNSName(name, "at") : null);
      return name;
    } catch {
      cache.set(address, null);
      return null;
    }
  }
  var circleCheckIcon = b2`<svg
	xmlns="http://www.w3.org/2000/svg"
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="none"
	stroke="var(--dapp-kit-positive)"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<circle cx="12" cy="12" r="10" />
	<path d="m9 12 2 2 4-4" />
</svg> `;
  var _resolveNameTask, _AccountMenuItem_instances, copyAddressToClipboard_fn, _renderAccountInfo, accountSelected_fn, _a17;
  var AccountMenuItem = (_a17 = class extends i4 {
    constructor(..._args) {
      super(..._args);
      __privateAdd(this, _AccountMenuItem_instances);
      __privateAdd(this, _resolveNameTask, new h3(this, {
        args: () => [this.client, this.account.address],
        task: async ([client, address]) => resolveNameServiceName(client, address)
      }));
      __privateAdd(this, _renderAccountInfo, (name) => {
        const { address, label } = this.account;
        const formattedAddress = formatAddress(address);
        const title = name || label;
        return b2`<div class="account-info">
			<div class="account-title">${title || formattedAddress}</div>
			${n5(title, () => b2`<div class="account-subtitle">${formattedAddress}</div>`)}
		</div>`;
      });
      this.selected = false;
      this._wasCopySuccessful = false;
    }
    createRenderRoot() {
      return this;
    }
    connectedCallback() {
      super.connectedCallback();
      this.addEventListener("click", __privateMethod(this, _AccountMenuItem_instances, accountSelected_fn));
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeEventListener("click", __privateMethod(this, _AccountMenuItem_instances, accountSelected_fn));
    }
    render() {
      return b2`
			<div class="container" data-checked=${this.selected}>
				<input
					type="radio"
					name="wallet-address"
					tabindex="${this.selected ? "0" : "-1"}"
					value=${this.account.address}
					?checked=${this.selected}
					@change=${__privateMethod(this, _AccountMenuItem_instances, accountSelected_fn)}
					class="radio-input"
					id=${this.account.address}
				/>
				<label class="content" for=${this.account.address}>
					${n5(this.account.icon, (icon) => b2`<img src=${icon} alt="" />`)}
					${__privateGet(this, _resolveNameTask).render({
        pending: __privateGet(this, _renderAccountInfo),
        complete: __privateGet(this, _renderAccountInfo),
        error: () => __privateGet(this, _renderAccountInfo).call(this)
      })}
				</label>
				<button
					class="copy-address-button"
					@click=${__privateMethod(this, _AccountMenuItem_instances, copyAddressToClipboard_fn)}
					aria-label="Copy address"
				>
					${this._wasCopySuccessful ? circleCheckIcon : copyIcon}
				</button>
			</div>
		`;
    }
  }, _resolveNameTask = new WeakMap(), _AccountMenuItem_instances = new WeakSet(), copyAddressToClipboard_fn = async function(event) {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(this.account.address);
      this._wasCopySuccessful = true;
      setTimeout(() => {
        this._wasCopySuccessful = false;
      }, 2e3);
    } catch {
    }
  }, _renderAccountInfo = new WeakMap(), accountSelected_fn = function() {
    this.dispatchEvent(new CustomEvent("account-selected", {
      detail: { account: this.account },
      bubbles: true,
      composed: true
    }));
  }, _a17);
  __decorate([n4({ type: Object })], AccountMenuItem.prototype, "account", void 0);
  __decorate([n4({ type: Object })], AccountMenuItem.prototype, "client", void 0);
  __decorate([n4({ type: Boolean })], AccountMenuItem.prototype, "selected", void 0);
  __decorate([r5()], AccountMenuItem.prototype, "_wasCopySuccessful", void 0);
  var chevronDownIcon = b2`<svg
	width="12"
	height="12"
	viewBox="0 0 12 12"
	fill="currentColor"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M0.749783 3.16083C0.616367 3.20313 0.499715 3.30493 0.439031 3.432C0.404351 3.50463 0.401783 3.5191 0.401783 3.642C0.401783 3.8842 0.122795 3.58063 2.91474 6.3763C4.25842 7.72175 5.39718 8.85432 5.44534 8.8931C5.61112 9.02664 5.77771 9.084 5.99978 9.084C6.22186 9.084 6.38845 9.02664 6.55423 8.8931C6.60239 8.85432 7.74115 7.72175 9.08483 6.3763C11.8768 3.58063 11.5978 3.8842 11.5978 3.642C11.5978 3.5191 11.5952 3.50463 11.5605 3.432C11.512 3.33045 11.4169 3.23542 11.3163 3.18797C11.2247 3.14475 11.0777 3.13074 10.9826 3.15618C10.8399 3.19439 10.9127 3.12454 8.39678 5.63854L5.99978 8.03374L3.60278 5.6387C1.98712 4.02436 1.18712 3.23308 1.14854 3.21119C1.11707 3.19332 1.06577 3.17095 1.03454 3.16149C0.965327 3.14049 0.815051 3.14014 0.749783 3.16083Z"
	/>
</svg>`;
  var plusIcon = b2`<svg
	width="16"
	height="16"
	viewBox="0 0 16 16"
	fill="currentColor"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M7.89082 1.05657C7.62439 1.0948 7.38895 1.33323 7.34347 1.61086C7.33421 1.66737 7.32818 2.80358 7.32813 4.49999L7.32803 7.296H4.4625C1.27722 7.296 1.51488 7.28764 1.34404 7.40553C1.22967 7.48444 1.11213 7.63921 1.07837 7.75534C1.04733 7.86214 1.04613 8.06073 1.07597 8.15199C1.1289 8.3138 1.2622 8.47769 1.39693 8.54657C1.55365 8.62668 1.43055 8.6236 4.47604 8.6238L7.32803 8.62399L7.32813 11.46C7.32818 13.2384 7.33408 14.3318 7.34392 14.392C7.38999 14.6737 7.62421 14.9044 7.90416 14.944C8.26109 14.9945 8.59807 14.7471 8.65615 14.392C8.66599 14.3318 8.67189 13.2384 8.67194 11.46L8.67203 8.62399L11.524 8.6238C14.5695 8.6236 14.4464 8.62668 14.6031 8.54657C14.7379 8.47769 14.8712 8.3138 14.9241 8.15199C14.9539 8.06073 14.9527 7.86214 14.9217 7.75534C14.8879 7.63921 14.7704 7.48444 14.656 7.40553C14.4852 7.28764 14.7229 7.296 11.5376 7.296H8.67203L8.67194 4.49999C8.67189 2.80358 8.66586 1.66737 8.65659 1.61086C8.6172 1.37032 8.44339 1.16228 8.21551 1.08292C8.12912 1.05284 7.99355 1.04184 7.89082 1.05657Z"
	/>
</svg>`;
  var _unsubscribeFromAutoUpdate, _resolveNameTask2, __this_instances2, onDisconnectClick_fn, onManageConnectionClick_fn, _getAccountTitle, _onDocumentClick, toggleMenu_fn, openMenu_fn, closeMenu_fn, startPositioning_fn, stopPositioning_fn, _a18;
  var ConnectedAccountMenu = (_a18 = class extends e6(i4) {
    constructor(..._args) {
      super(..._args);
      __privateAdd(this, __this_instances2);
      __privateAdd(this, _unsubscribeFromAutoUpdate);
      __privateAdd(this, _resolveNameTask2, new h3(this, {
        args: () => [this.client, this.connection.account.address],
        task: async ([client, address]) => resolveNameServiceName(client, address)
      }));
      __privateAdd(this, _getAccountTitle, (name) => {
        return name || this.connection.account.label || formatAddress(this.connection.account.address);
      });
      __privateAdd(this, _onDocumentClick, (event) => {
        if (!this._open) return;
        if (!event.composedPath().includes(this)) __privateMethod(this, __this_instances2, closeMenu_fn).call(this);
      });
      this._open = false;
    }
    connectedCallback() {
      super.connectedCallback();
      document.addEventListener("click", __privateGet(this, _onDocumentClick));
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      __privateMethod(this, __this_instances2, stopPositioning_fn).call(this);
      document.removeEventListener("click", __privateGet(this, _onDocumentClick));
    }
    render() {
      return b2`<internal-button
				exportparts="trigger"
				id="menu-button"
				aria-haspopup="true"
				aria-controls="menu"
				aria-expanded="${this._open}"
				@click=${__privateMethod(this, __this_instances2, toggleMenu_fn)}
			>
				<div class="trigger-content">
					<img src=${this.connection.account.icon ?? this.connection.wallet.icon} alt="" />
					${__privateGet(this, _resolveNameTask2).render({
        pending: __privateGet(this, _getAccountTitle),
        complete: __privateGet(this, _getAccountTitle),
        error: () => __privateGet(this, _getAccountTitle)
      })}
					<div class="chevron">${chevronDownIcon}</div>
				</div>
			</internal-button>
			<div class="menu" id="menu" tabindex="-1" aria-labelledby="menu-button">
				<div class="header-container">
					<h2 class="header-title">Connected accounts</h2>
					${n5(this.connection.wallet.name.startsWith(SLUSH_WALLET_NAME), () => b2`<button
								class="icon-button"
								aria-label="Add more accounts"
								@click=${__privateMethod(this, __this_instances2, onManageConnectionClick_fn)}
							>
								${plusIcon}
							</button>`)}
				</div>
				<div class="accounts-container" role="radiogroup">
					<ul class="accounts-list">
						${this.connection.wallet.accounts.map((account) => b2`
								<li>
									<account-menu-item
										.account=${account}
										.client=${this.client}
										.selected=${account.address === this.connection.account.address}
									></account-menu-item>
								</li>
							`)}
					</ul>
				</div>
				<button class="disconnect-button" @click=${__privateMethod(this, __this_instances2, onDisconnectClick_fn)}>
					${unlinkIcon} Disconnect all
				</button>
			</div>`;
    }
  }, _unsubscribeFromAutoUpdate = new WeakMap(), _resolveNameTask2 = new WeakMap(), __this_instances2 = new WeakSet(), onDisconnectClick_fn = function() {
    this.dispatchEvent(new CustomEvent("disconnect-click", {
      bubbles: true,
      composed: true
    }));
  }, onManageConnectionClick_fn = function() {
    this.dispatchEvent(new CustomEvent("manage-connection-click", {
      bubbles: true,
      composed: true
    }));
  }, _getAccountTitle = new WeakMap(), _onDocumentClick = new WeakMap(), toggleMenu_fn = function() {
    if (this._open) __privateMethod(this, __this_instances2, closeMenu_fn).call(this);
    else __privateMethod(this, __this_instances2, openMenu_fn).call(this);
  }, openMenu_fn = async function() {
    this._open = true;
    await this.updateComplete;
    this._menu.focus();
    __privateMethod(this, __this_instances2, startPositioning_fn).call(this);
  }, closeMenu_fn = function() {
    this._open = false;
    __privateMethod(this, __this_instances2, stopPositioning_fn).call(this);
  }, startPositioning_fn = function() {
    __privateSet(this, _unsubscribeFromAutoUpdate, autoUpdate(this._trigger, this._menu, async () => {
      const result = await computePosition2(this._trigger, this._menu, {
        placement: "bottom-end",
        middleware: [
          offset2(12),
          flip2(),
          shift2({ padding: 16 })
        ]
      });
      Object.assign(this._menu.style, {
        left: `${result.x}px`,
        top: `${result.y}px`
      });
    }));
  }, stopPositioning_fn = function() {
    if (__privateGet(this, _unsubscribeFromAutoUpdate)) {
      __privateGet(this, _unsubscribeFromAutoUpdate).call(this);
      __privateSet(this, _unsubscribeFromAutoUpdate, void 0);
    }
  }, _a18.elementDefinitions = {
    "internal-button": Button,
    "account-menu-item": AccountMenuItem
  }, _a18.styles = styles, _a18);
  __decorate([n4({ type: Object })], ConnectedAccountMenu.prototype, "connection", void 0);
  __decorate([n4({ type: Object })], ConnectedAccountMenu.prototype, "client", void 0);
  __decorate([e5("#menu-button")], ConnectedAccountMenu.prototype, "_trigger", void 0);
  __decorate([e5("#menu")], ConnectedAccountMenu.prototype, "_menu", void 0);
  __decorate([r5()], ConnectedAccountMenu.prototype, "_open", void 0);
  var _DAppKitConnectButton$1_instances, openModal_fn, _a19;
  var DAppKitConnectButton = (_a19 = class extends e6(i4) {
    constructor() {
      super(...arguments);
      __privateAdd(this, _DAppKitConnectButton$1_instances);
    }
    render() {
      const connection = this.instance.stores.$connection.get();
      const client = this.instance.stores.$currentClient.get();
      return connection.account ? b2`<connected-account-menu
					exportparts="trigger"
					.connection=${connection}
					.client=${client}
					@account-selected=${(event) => {
        this.instance.switchAccount({ account: event.detail.account });
      }}
					@disconnect-click=${() => {
        this.instance.disconnectWallet();
      }}
					@manage-connection-click=${() => {
        this.instance.connectWallet({ wallet: connection.wallet });
      }}
				></connected-account-menu>` : b2`<internal-button exportparts="trigger" @click=${__privateMethod(this, _DAppKitConnectButton$1_instances, openModal_fn)}>
						<slot>Connect Wallet</slot>
					</internal-button>
					<mysten-dapp-kit-connect-modal
						.instance=${this.instance}
						.filterFn=${this.modalOptions?.filterFn}
						.sortFn=${this.modalOptions?.sortFn}
					></mysten-dapp-kit-connect-modal>`;
    }
  }, _DAppKitConnectButton$1_instances = new WeakSet(), openModal_fn = function() {
    this._modal.show();
  }, _a19.elementDefinitions = {
    "internal-button": Button,
    "mysten-dapp-kit-connect-modal": DAppKitConnectModal,
    "connected-account-menu": ConnectedAccountMenu
  }, _a19.shadowRootOptions = {
    ...i4.shadowRootOptions,
    delegatesFocus: true
  }, _a19.styles = sharedStyles, _a19);
  __decorate([n4({ type: Object })], DAppKitConnectButton.prototype, "modalOptions", void 0);
  __decorate([storeProperty()], DAppKitConnectButton.prototype, "instance", void 0);
  __decorate([e5("mysten-dapp-kit-connect-modal")], DAppKitConnectButton.prototype, "_modal", void 0);
  DAppKitConnectButton = __decorate([t3("mysten-dapp-kit-connect-button")], DAppKitConnectButton);

  // node_modules/@mysten/sui/dist/jsonRpc/errors.mjs
  var CODE_TO_ERROR_TYPE = {
    "-32700": "ParseError",
    "-32701": "OversizedRequest",
    "-32702": "OversizedResponse",
    "-32600": "InvalidRequest",
    "-32601": "MethodNotFound",
    "-32602": "InvalidParams",
    "-32603": "InternalError",
    "-32604": "ServerBusy",
    "-32000": "CallExecutionFailed",
    "-32001": "UnknownError",
    "-32003": "SubscriptionClosed",
    "-32004": "SubscriptionClosedWithError",
    "-32005": "BatchesNotSupported",
    "-32006": "TooManySubscriptions",
    "-32050": "TransientError",
    "-32002": "TransactionExecutionClientError"
  };
  var SuiHTTPTransportError = class extends Error {
  };
  var JsonRpcError = class extends SuiHTTPTransportError {
    constructor(message, code) {
      super(message);
      this.code = code;
      this.type = CODE_TO_ERROR_TYPE[code] ?? "ServerError";
    }
  };
  var SuiHTTPStatusError = class extends SuiHTTPTransportError {
    constructor(message, status, statusText) {
      super(message);
      this.status = status;
      this.statusText = statusText;
    }
  };

  // node_modules/@mysten/sui/dist/jsonRpc/rpc-websocket-client.mjs
  function getWebsocketUrl(httpUrl) {
    const url = new URL(httpUrl);
    url.protocol = url.protocol.replace("http", "ws");
    return url.toString();
  }
  var DEFAULT_CLIENT_OPTIONS = {
    WebSocketConstructor: typeof WebSocket !== "undefined" ? WebSocket : void 0,
    callTimeout: 3e4,
    reconnectTimeout: 3e3,
    maxReconnects: 5
  };
  var _requestId, _disconnects, _webSocket, _connectionPromise, _subscriptions, _pendingRequests, _WebsocketClient_instances, setupWebSocket_fn, reconnect_fn, _a20;
  var WebsocketClient = (_a20 = class {
    constructor(endpoint, options = {}) {
      __privateAdd(this, _WebsocketClient_instances);
      __privateAdd(this, _requestId, 0);
      __privateAdd(this, _disconnects, 0);
      __privateAdd(this, _webSocket, null);
      __privateAdd(this, _connectionPromise, null);
      __privateAdd(this, _subscriptions, /* @__PURE__ */ new Set());
      __privateAdd(this, _pendingRequests, /* @__PURE__ */ new Map());
      this.endpoint = endpoint;
      this.options = {
        ...DEFAULT_CLIENT_OPTIONS,
        ...options
      };
      if (!this.options.WebSocketConstructor) throw new Error("Missing WebSocket constructor");
      if (this.endpoint.startsWith("http")) this.endpoint = getWebsocketUrl(this.endpoint);
    }
    async makeRequest(method, params, signal) {
      const webSocket = await __privateMethod(this, _WebsocketClient_instances, setupWebSocket_fn).call(this);
      return new Promise((resolve, reject) => {
        __privateSet(this, _requestId, __privateGet(this, _requestId) + 1);
        __privateGet(this, _pendingRequests).set(__privateGet(this, _requestId), {
          resolve,
          reject,
          timeout: setTimeout(() => {
            __privateGet(this, _pendingRequests).delete(__privateGet(this, _requestId));
            reject(/* @__PURE__ */ new Error(`Request timeout: ${method}`));
          }, this.options.callTimeout)
        });
        signal?.addEventListener("abort", () => {
          __privateGet(this, _pendingRequests).delete(__privateGet(this, _requestId));
          reject(signal.reason);
        });
        webSocket.send(JSON.stringify({
          jsonrpc: "2.0",
          id: __privateGet(this, _requestId),
          method,
          params
        }));
      }).then(({ error, result }) => {
        if (error) throw new JsonRpcError(error.message, error.code);
        return result;
      });
    }
    async subscribe(input) {
      const subscription = new RpcSubscription(input);
      __privateGet(this, _subscriptions).add(subscription);
      await subscription.subscribe(this);
      return () => subscription.unsubscribe(this);
    }
  }, _requestId = new WeakMap(), _disconnects = new WeakMap(), _webSocket = new WeakMap(), _connectionPromise = new WeakMap(), _subscriptions = new WeakMap(), _pendingRequests = new WeakMap(), _WebsocketClient_instances = new WeakSet(), setupWebSocket_fn = function() {
    if (__privateGet(this, _connectionPromise)) return __privateGet(this, _connectionPromise);
    __privateSet(this, _connectionPromise, new Promise((resolve) => {
      __privateGet(this, _webSocket)?.close();
      __privateSet(this, _webSocket, new this.options.WebSocketConstructor(this.endpoint));
      __privateGet(this, _webSocket).addEventListener("open", () => {
        __privateSet(this, _disconnects, 0);
        resolve(__privateGet(this, _webSocket));
      });
      __privateGet(this, _webSocket).addEventListener("close", () => {
        __privateWrapper(this, _disconnects)._++;
        if (__privateGet(this, _disconnects) <= this.options.maxReconnects) setTimeout(() => {
          __privateMethod(this, _WebsocketClient_instances, reconnect_fn).call(this);
        }, this.options.reconnectTimeout);
      });
      __privateGet(this, _webSocket).addEventListener("message", ({ data }) => {
        let json;
        try {
          json = JSON.parse(data);
        } catch (error) {
          console.error(new Error(`Failed to parse RPC message: ${data}`, { cause: error }));
          return;
        }
        if ("id" in json && json.id != null && __privateGet(this, _pendingRequests).has(json.id)) {
          const { resolve: resolve$1, timeout } = __privateGet(this, _pendingRequests).get(json.id);
          clearTimeout(timeout);
          resolve$1(json);
        } else if ("params" in json) {
          const { params } = json;
          __privateGet(this, _subscriptions).forEach((subscription) => {
            if (subscription.subscriptionId === params.subscription) {
              if (params.subscription === subscription.subscriptionId) subscription.onMessage(params.result);
            }
          });
        }
      });
    }));
    return __privateGet(this, _connectionPromise);
  }, reconnect_fn = async function() {
    __privateGet(this, _webSocket)?.close();
    __privateSet(this, _connectionPromise, null);
    return Promise.allSettled([...__privateGet(this, _subscriptions)].map((subscription) => subscription.subscribe(this)));
  }, _a20);
  var RpcSubscription = class {
    constructor(input) {
      this.subscriptionId = null;
      this.subscribed = false;
      this.input = input;
    }
    onMessage(message) {
      if (this.subscribed) this.input.onMessage(message);
    }
    async unsubscribe(client) {
      const { subscriptionId } = this;
      this.subscribed = false;
      if (subscriptionId == null) return false;
      this.subscriptionId = null;
      return client.makeRequest(this.input.unsubscribe, [subscriptionId]);
    }
    async subscribe(client) {
      this.subscriptionId = null;
      this.subscribed = true;
      const newSubscriptionId = await client.makeRequest(this.input.method, this.input.params, this.input.signal);
      if (this.subscribed) this.subscriptionId = newSubscriptionId;
    }
  };

  // node_modules/@mysten/sui/dist/jsonRpc/http-transport.mjs
  var _requestId2, _options, _websocketClient, _JsonRpcHTTPTransport_instances, getWebsocketClient_fn, _a21;
  var JsonRpcHTTPTransport = (_a21 = class {
    constructor(options) {
      __privateAdd(this, _JsonRpcHTTPTransport_instances);
      __privateAdd(this, _requestId2, 0);
      __privateAdd(this, _options);
      __privateAdd(this, _websocketClient);
      __privateSet(this, _options, options);
    }
    fetch(input, init) {
      const fetchFn = __privateGet(this, _options).fetch ?? fetch;
      if (!fetchFn) throw new Error("The current environment does not support fetch, you can provide a fetch implementation in the options for SuiHTTPTransport.");
      return fetchFn(input, init);
    }
    async request(input) {
      __privateSet(this, _requestId2, __privateGet(this, _requestId2) + 1);
      const res = await this.fetch(__privateGet(this, _options).rpc?.url ?? __privateGet(this, _options).url, {
        method: "POST",
        signal: input.signal,
        headers: {
          "Content-Type": "application/json",
          "Client-Sdk-Type": "typescript",
          "Client-Sdk-Version": PACKAGE_VERSION,
          "Client-Target-Api-Version": TARGETED_RPC_VERSION,
          "Client-Request-Method": input.method,
          ...__privateGet(this, _options).rpc?.headers
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: __privateGet(this, _requestId2),
          method: input.method,
          params: input.params
        })
      });
      if (!res.ok) throw new SuiHTTPStatusError(`Unexpected status code: ${res.status}`, res.status, res.statusText);
      const data = await res.json();
      if ("error" in data && data.error != null) throw new JsonRpcError(data.error.message, data.error.code);
      return data.result;
    }
    async subscribe(input) {
      const unsubscribe = await __privateMethod(this, _JsonRpcHTTPTransport_instances, getWebsocketClient_fn).call(this).subscribe(input);
      if (input.signal) {
        input.signal.throwIfAborted();
        input.signal.addEventListener("abort", () => {
          unsubscribe();
        });
      }
      return async () => !!await unsubscribe();
    }
  }, _requestId2 = new WeakMap(), _options = new WeakMap(), _websocketClient = new WeakMap(), _JsonRpcHTTPTransport_instances = new WeakSet(), getWebsocketClient_fn = function() {
    if (!__privateGet(this, _websocketClient)) {
      const WebSocketConstructor = __privateGet(this, _options).WebSocketConstructor ?? WebSocket;
      if (!WebSocketConstructor) throw new Error("The current environment does not support WebSocket, you can provide a WebSocketConstructor in the options for SuiHTTPTransport.");
      __privateSet(this, _websocketClient, new WebsocketClient(__privateGet(this, _options).websocket?.url ?? __privateGet(this, _options).url, {
        WebSocketConstructor,
        ...__privateGet(this, _options).websocket
      }));
    }
    return __privateGet(this, _websocketClient);
  }, _a21);

  // node_modules/@mysten/sui/dist/jsonRpc/core.mjs
  var MAX_GAS2 = 5e10;
  function parseJsonRpcExecutionStatus(status, abortError) {
    if (status.status === "success") return {
      success: true,
      error: null
    };
    const rawMessage = status.error ?? "Unknown";
    if (abortError) {
      const commandMatch = rawMessage.match(/in command (\d+)/);
      const command = commandMatch ? parseInt(commandMatch[1], 10) : void 0;
      const instructionMatch = rawMessage.match(/instruction:\s*(\d+)/);
      const instruction = instructionMatch ? parseInt(instructionMatch[1], 10) : void 0;
      const moduleParts = abortError.module_id?.split("::") ?? [];
      const pkg = moduleParts[0] ? normalizeSuiAddress(moduleParts[0]) : void 0;
      const module = moduleParts[1];
      return {
        success: false,
        error: {
          $kind: "MoveAbort",
          message: formatMoveAbortMessage({
            command,
            location: pkg && module ? {
              package: pkg,
              module,
              functionName: abortError.function ?? void 0,
              instruction
            } : void 0,
            abortCode: String(abortError.error_code ?? 0),
            cleverError: abortError.line != null ? { lineNumber: abortError.line } : void 0
          }),
          command,
          MoveAbort: {
            abortCode: String(abortError.error_code ?? 0),
            location: abortError.module_id ? {
              package: normalizeSuiAddress(abortError.module_id.split("::")[0] ?? ""),
              module: abortError.module_id.split("::")[1] ?? "",
              functionName: abortError.function ?? void 0,
              instruction
            } : void 0
          }
        }
      };
    }
    return {
      success: false,
      error: {
        $kind: "Unknown",
        message: rawMessage,
        Unknown: null
      }
    };
  }
  var _jsonRpcClient, _a22;
  var JSONRpcCoreClient = (_a22 = class extends CoreClient {
    constructor({ jsonRpcClient, mvr }) {
      super({
        network: jsonRpcClient.network,
        base: jsonRpcClient,
        mvr
      });
      __privateAdd(this, _jsonRpcClient);
      __privateSet(this, _jsonRpcClient, jsonRpcClient);
    }
    async getObjects(options) {
      const batches = chunk(options.objectIds, 50);
      const results = [];
      for (const batch of batches) {
        const objects = await __privateGet(this, _jsonRpcClient).multiGetObjects({
          ids: batch,
          options: {
            showOwner: true,
            showType: true,
            showBcs: options.include?.content || options.include?.objectBcs ? true : false,
            showPreviousTransaction: options.include?.previousTransaction || options.include?.objectBcs ? true : false,
            showStorageRebate: options.include?.objectBcs ?? false,
            showContent: options.include?.json ?? false
          },
          signal: options.signal
        });
        for (const [idx, object2] of objects.entries()) if (object2.error) results.push(ObjectError.fromResponse(object2.error, batch[idx]));
        else results.push(parseObject(object2.data, options.include));
      }
      return { objects: results };
    }
    async listOwnedObjects(options) {
      let filter = null;
      if (options.type) {
        const parts = options.type.split("::");
        if (parts.length === 1) filter = { Package: options.type };
        else if (parts.length === 2) filter = { MoveModule: {
          package: parts[0],
          module: parts[1]
        } };
        else filter = { StructType: options.type };
      }
      const objects = await __privateGet(this, _jsonRpcClient).getOwnedObjects({
        owner: options.owner,
        limit: options.limit,
        cursor: options.cursor,
        options: {
          showOwner: true,
          showType: true,
          showBcs: options.include?.content || options.include?.objectBcs ? true : false,
          showPreviousTransaction: options.include?.previousTransaction || options.include?.objectBcs ? true : false,
          showStorageRebate: options.include?.objectBcs ?? false,
          showContent: options.include?.json ?? false
        },
        filter,
        signal: options.signal
      });
      return {
        objects: objects.data.map((result) => {
          if (result.error) throw ObjectError.fromResponse(result.error);
          return parseObject(result.data, options.include);
        }),
        hasNextPage: objects.hasNextPage,
        cursor: objects.nextCursor ?? null
      };
    }
    async listCoins(options) {
      const coins = await __privateGet(this, _jsonRpcClient).getCoins({
        owner: options.owner,
        coinType: options.coinType,
        limit: options.limit,
        cursor: options.cursor,
        signal: options.signal
      });
      return {
        objects: coins.data.map((coin) => ({
          objectId: coin.coinObjectId,
          version: coin.version,
          digest: coin.digest,
          balance: coin.balance,
          type: normalizeStructTag(`0x2::coin::Coin<${coin.coinType}>`),
          owner: {
            $kind: "AddressOwner",
            AddressOwner: options.owner
          }
        })),
        hasNextPage: coins.hasNextPage,
        cursor: coins.nextCursor ?? null
      };
    }
    async getBalance(options) {
      const balance = await __privateGet(this, _jsonRpcClient).getBalance({
        owner: options.owner,
        coinType: options.coinType,
        signal: options.signal
      });
      const addressBalance = balance.fundsInAddressBalance ?? "0";
      const coinBalance = String(BigInt(balance.totalBalance) - BigInt(addressBalance));
      return { balance: {
        coinType: normalizeStructTag(balance.coinType),
        balance: balance.totalBalance,
        coinBalance,
        addressBalance
      } };
    }
    async getCoinMetadata(options) {
      const coinType = (await this.mvr.resolveType({ type: options.coinType })).type;
      const result = await __privateGet(this, _jsonRpcClient).getCoinMetadata({
        coinType,
        signal: options.signal
      });
      if (!result) return { coinMetadata: null };
      return { coinMetadata: {
        id: result.id ?? null,
        decimals: result.decimals,
        name: result.name,
        symbol: result.symbol,
        description: result.description,
        iconUrl: result.iconUrl ?? null
      } };
    }
    async listBalances(options) {
      return {
        balances: (await __privateGet(this, _jsonRpcClient).getAllBalances({
          owner: options.owner,
          signal: options.signal
        })).map((balance) => {
          const addressBalance = balance.fundsInAddressBalance ?? "0";
          const coinBalance = String(BigInt(balance.totalBalance) - BigInt(addressBalance));
          return {
            coinType: normalizeStructTag(balance.coinType),
            balance: balance.totalBalance,
            coinBalance,
            addressBalance
          };
        }),
        hasNextPage: false,
        cursor: null
      };
    }
    async getTransaction(options) {
      return parseTransaction(await __privateGet(this, _jsonRpcClient).getTransactionBlock({
        digest: options.digest,
        options: {
          showRawInput: true,
          showEffects: true,
          showObjectChanges: options.include?.objectTypes ?? false,
          showRawEffects: options.include?.effects ?? false,
          showEvents: options.include?.events ?? false,
          showBalanceChanges: options.include?.balanceChanges ?? false
        },
        signal: options.signal
      }), options.include);
    }
    async executeTransaction(options) {
      return parseTransaction(await __privateGet(this, _jsonRpcClient).executeTransactionBlock({
        transactionBlock: options.transaction,
        signature: options.signatures,
        options: {
          showRawInput: true,
          showEffects: true,
          showRawEffects: options.include?.effects ?? false,
          showEvents: options.include?.events ?? false,
          showObjectChanges: options.include?.objectTypes ?? false,
          showBalanceChanges: options.include?.balanceChanges ?? false
        },
        signal: options.signal
      }), options.include);
    }
    async simulateTransaction(options) {
      if (!(options.transaction instanceof Uint8Array)) await options.transaction.prepareForSerialization({ client: this });
      const tx = Transaction.from(options.transaction);
      const data = options.transaction instanceof Uint8Array ? null : TransactionDataBuilder.restore(options.transaction.getData());
      const transactionBytes = data ? data.build({ overrides: { gasData: {
        budget: data.gasData.budget ?? String(MAX_GAS2),
        price: data.gasData.price ?? String(await __privateGet(this, _jsonRpcClient).getReferenceGasPrice()),
        payment: data.gasData.payment ?? []
      } } }) : options.transaction;
      const result = await __privateGet(this, _jsonRpcClient).dryRunTransactionBlock({
        transactionBlock: transactionBytes,
        signal: options.signal
      });
      const { effects, objectTypes } = parseTransactionEffectsJson({
        effects: result.effects,
        objectChanges: result.objectChanges
      });
      const transactionData = {
        digest: TransactionDataBuilder.getDigestFromBytes(transactionBytes),
        epoch: null,
        status: effects.status,
        effects: options.include?.effects ? effects : void 0,
        objectTypes: options.include?.objectTypes ? objectTypes : void 0,
        signatures: [],
        transaction: options.include?.transaction ? parseTransactionBcs(options.transaction instanceof Uint8Array ? options.transaction : await options.transaction.build({ client: this }).catch(() => null)) : void 0,
        bcs: options.include?.bcs ? transactionBytes : void 0,
        balanceChanges: options.include?.balanceChanges ? result.balanceChanges.map((change) => ({
          coinType: normalizeStructTag(change.coinType),
          address: parseOwnerAddress(change.owner),
          amount: change.amount
        })) : void 0,
        events: options.include?.events ? result.events?.map((event) => ({
          packageId: event.packageId,
          module: event.transactionModule,
          sender: event.sender,
          eventType: event.type,
          bcs: "bcs" in event ? fromBase64(event.bcs) : new Uint8Array(),
          json: event.parsedJson ?? null
        })) ?? [] : void 0
      };
      let commandResults;
      if (options.include?.commandResults) try {
        const sender = tx.getData().sender ?? normalizeSuiAddress("0x0");
        const devInspectResult = await __privateGet(this, _jsonRpcClient).devInspectTransactionBlock({
          sender,
          transactionBlock: tx,
          signal: options.signal
        });
        if (devInspectResult.results) commandResults = devInspectResult.results.map((result$1) => ({
          returnValues: (result$1.returnValues ?? []).map(([bytes]) => ({ bcs: new Uint8Array(bytes) })),
          mutatedReferences: (result$1.mutableReferenceOutputs ?? []).map(([, bytes]) => ({ bcs: new Uint8Array(bytes) }))
        }));
      } catch {
      }
      return effects.status.success ? {
        $kind: "Transaction",
        Transaction: transactionData,
        commandResults
      } : {
        $kind: "FailedTransaction",
        FailedTransaction: transactionData,
        commandResults
      };
    }
    async getReferenceGasPrice(options) {
      const referenceGasPrice = await __privateGet(this, _jsonRpcClient).getReferenceGasPrice({ signal: options?.signal });
      return { referenceGasPrice: String(referenceGasPrice) };
    }
    async getCurrentSystemState(options) {
      const systemState = await __privateGet(this, _jsonRpcClient).getLatestSuiSystemState({ signal: options?.signal });
      return { systemState: {
        systemStateVersion: systemState.systemStateVersion,
        epoch: systemState.epoch,
        protocolVersion: systemState.protocolVersion,
        referenceGasPrice: systemState.referenceGasPrice?.toString() ?? null,
        epochStartTimestampMs: systemState.epochStartTimestampMs,
        safeMode: systemState.safeMode,
        safeModeStorageRewards: systemState.safeModeStorageRewards,
        safeModeComputationRewards: systemState.safeModeComputationRewards,
        safeModeStorageRebates: systemState.safeModeStorageRebates,
        safeModeNonRefundableStorageFee: systemState.safeModeNonRefundableStorageFee,
        parameters: {
          epochDurationMs: systemState.epochDurationMs,
          stakeSubsidyStartEpoch: systemState.stakeSubsidyStartEpoch,
          maxValidatorCount: systemState.maxValidatorCount,
          minValidatorJoiningStake: systemState.minValidatorJoiningStake,
          validatorLowStakeThreshold: systemState.validatorLowStakeThreshold,
          validatorLowStakeGracePeriod: systemState.validatorLowStakeGracePeriod
        },
        storageFund: {
          totalObjectStorageRebates: systemState.storageFundTotalObjectStorageRebates,
          nonRefundableBalance: systemState.storageFundNonRefundableBalance
        },
        stakeSubsidy: {
          balance: systemState.stakeSubsidyBalance,
          distributionCounter: systemState.stakeSubsidyDistributionCounter,
          currentDistributionAmount: systemState.stakeSubsidyCurrentDistributionAmount,
          stakeSubsidyPeriodLength: systemState.stakeSubsidyPeriodLength,
          stakeSubsidyDecreaseRate: systemState.stakeSubsidyDecreaseRate
        }
      } };
    }
    async listDynamicFields(options) {
      const dynamicFields = await __privateGet(this, _jsonRpcClient).getDynamicFields({
        parentId: options.parentId,
        limit: options.limit,
        cursor: options.cursor
      });
      return {
        dynamicFields: dynamicFields.data.map((dynamicField) => {
          const isDynamicObject = dynamicField.type === "DynamicObject";
          const fullType = isDynamicObject ? `0x2::dynamic_field::Field<0x2::dynamic_object_field::Wrapper<${dynamicField.name.type}>, 0x2::object::ID>` : `0x2::dynamic_field::Field<${dynamicField.name.type}, ${dynamicField.objectType}>`;
          const bcsBytes = fromBase64(dynamicField.bcsName);
          const derivedNameType = isDynamicObject ? `0x2::dynamic_object_field::Wrapper<${dynamicField.name.type}>` : dynamicField.name.type;
          return {
            $kind: isDynamicObject ? "DynamicObject" : "DynamicField",
            fieldId: deriveDynamicFieldID(options.parentId, derivedNameType, bcsBytes),
            type: normalizeStructTag(fullType),
            name: {
              type: dynamicField.name.type,
              bcs: bcsBytes
            },
            valueType: dynamicField.objectType,
            childId: isDynamicObject ? dynamicField.objectId : void 0
          };
        }),
        hasNextPage: dynamicFields.hasNextPage,
        cursor: dynamicFields.nextCursor
      };
    }
    async verifyZkLoginSignature(options) {
      const result = await __privateGet(this, _jsonRpcClient).verifyZkLoginSignature({
        bytes: options.bytes,
        signature: options.signature,
        intentScope: options.intentScope,
        author: options.address
      });
      return {
        success: result.success,
        errors: result.errors
      };
    }
    async defaultNameServiceName(options) {
      return { data: { name: (await __privateGet(this, _jsonRpcClient).resolveNameServiceNames(options)).data[0] } };
    }
    resolveTransactionPlugin() {
      return coreClientResolveTransactionPlugin;
    }
    async getMoveFunction(options) {
      const resolvedPackageId = (await this.mvr.resolvePackage({ package: options.packageId })).package;
      const result = await __privateGet(this, _jsonRpcClient).getNormalizedMoveFunction({
        package: resolvedPackageId,
        module: options.moduleName,
        function: options.name
      });
      return { function: {
        packageId: normalizeSuiAddress(resolvedPackageId),
        moduleName: options.moduleName,
        name: options.name,
        visibility: parseVisibility(result.visibility),
        isEntry: result.isEntry,
        typeParameters: result.typeParameters.map((abilities) => ({
          isPhantom: false,
          constraints: parseAbilities(abilities)
        })),
        parameters: result.parameters.map((param) => parseNormalizedSuiMoveType(param)),
        returns: result.return.map((ret) => parseNormalizedSuiMoveType(ret))
      } };
    }
    async getChainIdentifier(_options2) {
      return this.cache.read(["chainIdentifier"], async () => {
        return { chainIdentifier: (await __privateGet(this, _jsonRpcClient).getCheckpoint({ id: "0" })).digest };
      });
    }
  }, _jsonRpcClient = new WeakMap(), _a22);
  function serializeObjectToBcs(object2) {
    if (object2.bcs?.dataType !== "moveObject") return;
    try {
      const typeStr = normalizeStructTag(object2.bcs.type);
      let moveObjectType;
      const normalizedSuiFramework = normalizeSuiAddress(SUI_FRAMEWORK_ADDRESS);
      const gasCoinType = normalizeStructTag(`${SUI_FRAMEWORK_ADDRESS}::coin::Coin<${SUI_FRAMEWORK_ADDRESS}::sui::SUI>`);
      const stakedSuiType = normalizeStructTag(`${SUI_SYSTEM_ADDRESS}::staking_pool::StakedSui`);
      const coinPrefix = `${normalizedSuiFramework}::coin::Coin<`;
      if (typeStr === gasCoinType) moveObjectType = { GasCoin: null };
      else if (typeStr === stakedSuiType) moveObjectType = { StakedSui: null };
      else if (typeStr.startsWith(coinPrefix)) {
        const innerTypeMatch = typeStr.match(/* @__PURE__ */ new RegExp(`${normalizedSuiFramework.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}::coin::Coin<(.+)>$`));
        if (innerTypeMatch) moveObjectType = { Coin: TypeTagSerializer.parseFromStr(innerTypeMatch[1], true) };
        else throw new Error("Failed to parse Coin type");
      } else {
        const typeTag = TypeTagSerializer.parseFromStr(typeStr, true);
        if (typeof typeTag !== "object" || !("struct" in typeTag)) throw new Error("Expected struct type tag");
        moveObjectType = { Other: typeTag.struct };
      }
      const contents = fromBase64(object2.bcs.bcsBytes);
      const owner = convertOwnerToBcs(object2.owner);
      return suiBcs.Object.serialize({
        data: { Move: {
          type: moveObjectType,
          hasPublicTransfer: object2.bcs.hasPublicTransfer,
          version: object2.bcs.version,
          contents
        } },
        owner,
        previousTransaction: object2.previousTransaction,
        storageRebate: object2.storageRebate
      }).toBytes();
    } catch {
      return;
    }
  }
  function parseObject(object2, include) {
    const bcsContent = object2.bcs?.dataType === "moveObject" ? fromBase64(object2.bcs.bcsBytes) : void 0;
    const objectBcs = include?.objectBcs ? serializeObjectToBcs(object2) : void 0;
    const type = object2.type && object2.type.includes("::") ? normalizeStructTag(object2.type) : object2.type ?? "";
    const jsonContent = include?.json && object2.content?.dataType === "moveObject" ? object2.content.fields : include?.json ? null : void 0;
    return {
      objectId: object2.objectId,
      version: object2.version,
      digest: object2.digest,
      type,
      content: include?.content ? bcsContent : void 0,
      owner: parseOwner(object2.owner),
      previousTransaction: include?.previousTransaction ? object2.previousTransaction ?? void 0 : void 0,
      objectBcs,
      json: jsonContent
    };
  }
  function parseOwner(owner) {
    if (owner === "Immutable") return {
      $kind: "Immutable",
      Immutable: true
    };
    if ("ConsensusAddressOwner" in owner) return {
      $kind: "ConsensusAddressOwner",
      ConsensusAddressOwner: {
        owner: owner.ConsensusAddressOwner.owner,
        startVersion: owner.ConsensusAddressOwner.start_version
      }
    };
    if ("AddressOwner" in owner) return {
      $kind: "AddressOwner",
      AddressOwner: owner.AddressOwner
    };
    if ("ObjectOwner" in owner) return {
      $kind: "ObjectOwner",
      ObjectOwner: owner.ObjectOwner
    };
    if ("Shared" in owner) return {
      $kind: "Shared",
      Shared: { initialSharedVersion: owner.Shared.initial_shared_version }
    };
    throw new Error(`Unknown owner type: ${JSON.stringify(owner)}`);
  }
  function convertOwnerToBcs(owner) {
    if (owner === "Immutable") return { Immutable: null };
    if ("AddressOwner" in owner) return { AddressOwner: owner.AddressOwner };
    if ("ObjectOwner" in owner) return { ObjectOwner: owner.ObjectOwner };
    if ("Shared" in owner) return { Shared: { initialSharedVersion: owner.Shared.initial_shared_version } };
    if (typeof owner === "object" && owner !== null && "ConsensusAddressOwner" in owner) return { ConsensusAddressOwner: {
      startVersion: owner.ConsensusAddressOwner.start_version,
      owner: owner.ConsensusAddressOwner.owner
    } };
    throw new Error(`Unknown owner type: ${JSON.stringify(owner)}`);
  }
  function parseOwnerAddress(owner) {
    if (owner === "Immutable") return null;
    if ("ConsensusAddressOwner" in owner) return owner.ConsensusAddressOwner.owner;
    if ("AddressOwner" in owner) return owner.AddressOwner;
    if ("ObjectOwner" in owner) return owner.ObjectOwner;
    if ("Shared" in owner) return null;
    throw new Error(`Unknown owner type: ${JSON.stringify(owner)}`);
  }
  function parseTransaction(transaction, include) {
    const objectTypes = {};
    if (include?.objectTypes) transaction.objectChanges?.forEach((change) => {
      if (change.type !== "published") objectTypes[change.objectId] = normalizeStructTag(change.objectType);
    });
    let transactionData;
    let signatures = [];
    let bcsBytes;
    if (transaction.rawTransaction) {
      const parsedTx = suiBcs.SenderSignedData.parse(fromBase64(transaction.rawTransaction))[0];
      signatures = parsedTx.txSignatures;
      if (include?.transaction || include?.bcs) {
        const bytes = suiBcs.TransactionData.serialize(parsedTx.intentMessage.value).toBytes();
        if (include?.bcs) bcsBytes = bytes;
        if (include?.transaction) transactionData = { ...TransactionDataBuilder.restore({
          version: 2,
          sender: parsedTx.intentMessage.value.V1.sender,
          expiration: parsedTx.intentMessage.value.V1.expiration,
          gasData: parsedTx.intentMessage.value.V1.gasData,
          inputs: parsedTx.intentMessage.value.V1.kind.ProgrammableTransaction.inputs,
          commands: parsedTx.intentMessage.value.V1.kind.ProgrammableTransaction.commands
        }) };
      }
    }
    const status = transaction.effects?.status ? parseJsonRpcExecutionStatus(transaction.effects.status, transaction.effects.abortError) : {
      success: false,
      error: {
        $kind: "Unknown",
        message: "Unknown",
        Unknown: null
      }
    };
    const effectsBytes = transaction.rawEffects ? new Uint8Array(transaction.rawEffects) : null;
    const result = {
      digest: transaction.digest,
      epoch: transaction.effects?.executedEpoch ?? null,
      status,
      effects: include?.effects && effectsBytes ? parseTransactionEffectsBcs(effectsBytes) : void 0,
      objectTypes: include?.objectTypes ? objectTypes : void 0,
      transaction: transactionData,
      bcs: bcsBytes,
      signatures,
      balanceChanges: include?.balanceChanges ? transaction.balanceChanges?.map((change) => ({
        coinType: normalizeStructTag(change.coinType),
        address: parseOwnerAddress(change.owner),
        amount: change.amount
      })) ?? [] : void 0,
      events: include?.events ? transaction.events?.map((event) => ({
        packageId: event.packageId,
        module: event.transactionModule,
        sender: event.sender,
        eventType: event.type,
        bcs: "bcs" in event ? fromBase64(event.bcs) : new Uint8Array(),
        json: event.parsedJson ?? null
      })) ?? [] : void 0
    };
    return status.success ? {
      $kind: "Transaction",
      Transaction: result
    } : {
      $kind: "FailedTransaction",
      FailedTransaction: result
    };
  }
  function parseTransactionEffectsJson({ bytes, effects, objectChanges }) {
    const changedObjects = [];
    const unchangedConsensusObjects = [];
    const objectTypes = {};
    objectChanges?.forEach((change) => {
      switch (change.type) {
        case "published":
          changedObjects.push({
            objectId: change.packageId,
            inputState: "DoesNotExist",
            inputVersion: null,
            inputDigest: null,
            inputOwner: null,
            outputState: "PackageWrite",
            outputVersion: change.version,
            outputDigest: change.digest,
            outputOwner: null,
            idOperation: "Created"
          });
          break;
        case "transferred":
          changedObjects.push({
            objectId: change.objectId,
            inputState: "Exists",
            inputVersion: change.version,
            inputDigest: change.digest,
            inputOwner: {
              $kind: "AddressOwner",
              AddressOwner: change.sender
            },
            outputState: "ObjectWrite",
            outputVersion: change.version,
            outputDigest: change.digest,
            outputOwner: parseOwner(change.recipient),
            idOperation: "None"
          });
          objectTypes[change.objectId] = normalizeStructTag(change.objectType);
          break;
        case "mutated":
          changedObjects.push({
            objectId: change.objectId,
            inputState: "Exists",
            inputVersion: change.previousVersion,
            inputDigest: null,
            inputOwner: parseOwner(change.owner),
            outputState: "ObjectWrite",
            outputVersion: change.version,
            outputDigest: change.digest,
            outputOwner: parseOwner(change.owner),
            idOperation: "None"
          });
          objectTypes[change.objectId] = normalizeStructTag(change.objectType);
          break;
        case "deleted":
          changedObjects.push({
            objectId: change.objectId,
            inputState: "Exists",
            inputVersion: change.version,
            inputDigest: effects.deleted?.find((d3) => d3.objectId === change.objectId)?.digest ?? null,
            inputOwner: null,
            outputState: "DoesNotExist",
            outputVersion: null,
            outputDigest: null,
            outputOwner: null,
            idOperation: "Deleted"
          });
          objectTypes[change.objectId] = normalizeStructTag(change.objectType);
          break;
        case "wrapped":
          changedObjects.push({
            objectId: change.objectId,
            inputState: "Exists",
            inputVersion: change.version,
            inputDigest: null,
            inputOwner: {
              $kind: "AddressOwner",
              AddressOwner: change.sender
            },
            outputState: "ObjectWrite",
            outputVersion: change.version,
            outputDigest: effects.wrapped?.find((w2) => w2.objectId === change.objectId)?.digest ?? null,
            outputOwner: {
              $kind: "ObjectOwner",
              ObjectOwner: change.sender
            },
            idOperation: "None"
          });
          objectTypes[change.objectId] = normalizeStructTag(change.objectType);
          break;
        case "created":
          changedObjects.push({
            objectId: change.objectId,
            inputState: "DoesNotExist",
            inputVersion: null,
            inputDigest: null,
            inputOwner: null,
            outputState: "ObjectWrite",
            outputVersion: change.version,
            outputDigest: change.digest,
            outputOwner: parseOwner(change.owner),
            idOperation: "Created"
          });
          objectTypes[change.objectId] = normalizeStructTag(change.objectType);
          break;
      }
    });
    return {
      objectTypes,
      effects: {
        bcs: bytes ?? null,
        version: 2,
        status: parseJsonRpcExecutionStatus(effects.status, effects.abortError),
        gasUsed: effects.gasUsed,
        transactionDigest: effects.transactionDigest,
        gasObject: {
          objectId: effects.gasObject?.reference.objectId,
          inputState: "Exists",
          inputVersion: null,
          inputDigest: null,
          inputOwner: null,
          outputState: "ObjectWrite",
          outputVersion: effects.gasObject.reference.version,
          outputDigest: effects.gasObject.reference.digest,
          outputOwner: parseOwner(effects.gasObject.owner),
          idOperation: "None"
        },
        eventsDigest: effects.eventsDigest ?? null,
        dependencies: effects.dependencies ?? [],
        lamportVersion: effects.gasObject.reference.version,
        changedObjects,
        unchangedConsensusObjects,
        auxiliaryDataDigest: null
      }
    };
  }
  function parseNormalizedSuiMoveType(type) {
    if (typeof type !== "string") {
      if ("Reference" in type) return {
        reference: "immutable",
        body: parseNormalizedSuiMoveTypeBody(type.Reference)
      };
      if ("MutableReference" in type) return {
        reference: "mutable",
        body: parseNormalizedSuiMoveTypeBody(type.MutableReference)
      };
    }
    return {
      reference: null,
      body: parseNormalizedSuiMoveTypeBody(type)
    };
  }
  function parseNormalizedSuiMoveTypeBody(type) {
    switch (type) {
      case "Address":
        return { $kind: "address" };
      case "Bool":
        return { $kind: "bool" };
      case "U8":
        return { $kind: "u8" };
      case "U16":
        return { $kind: "u16" };
      case "U32":
        return { $kind: "u32" };
      case "U64":
        return { $kind: "u64" };
      case "U128":
        return { $kind: "u128" };
      case "U256":
        return { $kind: "u256" };
    }
    if (typeof type === "string") throw new Error(`Unknown type: ${type}`);
    if ("Vector" in type) return {
      $kind: "vector",
      vector: parseNormalizedSuiMoveTypeBody(type.Vector)
    };
    if ("Struct" in type) return {
      $kind: "datatype",
      datatype: {
        typeName: `${normalizeSuiAddress(type.Struct.address)}::${type.Struct.module}::${type.Struct.name}`,
        typeParameters: type.Struct.typeArguments.map((t5) => parseNormalizedSuiMoveTypeBody(t5))
      }
    };
    if ("TypeParameter" in type) return {
      $kind: "typeParameter",
      index: type.TypeParameter
    };
    throw new Error(`Unknown type: ${JSON.stringify(type)}`);
  }
  function parseAbilities(abilitySet) {
    return abilitySet.abilities.map((ability) => {
      switch (ability) {
        case "Copy":
          return "copy";
        case "Drop":
          return "drop";
        case "Store":
          return "store";
        case "Key":
          return "key";
        default:
          return "unknown";
      }
    });
  }
  function parseVisibility(visibility) {
    switch (visibility) {
      case "Public":
        return "public";
      case "Private":
        return "private";
      case "Friend":
        return "friend";
      default:
        return "unknown";
    }
  }

  // node_modules/@mysten/sui/dist/jsonRpc/client.mjs
  var SUI_CLIENT_BRAND = Symbol.for("@mysten/SuiJsonRpcClient");
  var COIN_RESERVATION_MAGIC = new Uint8Array([
    172,
    172,
    172,
    172,
    172,
    172,
    172,
    172,
    172,
    172,
    172,
    172,
    172,
    172,
    172,
    172,
    172,
    172,
    172,
    172
  ]);
  function isCoinReservationDigest(digestBase58) {
    return fromBase58(digestBase58).slice(12, 32).every((byte, i7) => byte === COIN_RESERVATION_MAGIC[i7]);
  }
  var SuiJsonRpcClient = class extends BaseClient {
    get [SUI_CLIENT_BRAND]() {
      return true;
    }
    /**
    * Establish a connection to a Sui RPC endpoint
    *
    * @param options configuration options for the API Client
    */
    constructor(options) {
      super({ network: options.network });
      this.jsonRpc = this;
      this.transport = options.transport ?? new JsonRpcHTTPTransport({ url: options.url });
      this.core = new JSONRpcCoreClient({
        jsonRpcClient: this,
        mvr: options.mvr
      });
    }
    async getRpcApiVersion({ signal } = {}) {
      return (await this.transport.request({
        method: "rpc.discover",
        params: [],
        signal
      })).info.version;
    }
    /**
    * Get all Coin<`coin_type`> objects owned by an address.
    */
    async getCoins({ coinType, owner, cursor, limit, signal }) {
      if (!owner || !isValidSuiAddress(normalizeSuiAddress(owner))) throw new Error("Invalid Sui address");
      if (coinType && hasMvrName(coinType)) coinType = (await this.core.mvr.resolveType({ type: coinType })).type;
      const result = await this.transport.request({
        method: "suix_getCoins",
        params: [
          owner,
          coinType,
          cursor,
          limit
        ],
        signal
      });
      return {
        ...result,
        data: result.data.filter((coin) => !isCoinReservationDigest(coin.digest))
      };
    }
    /**
    * Get all Coin objects owned by an address.
    */
    async getAllCoins(input) {
      if (!input.owner || !isValidSuiAddress(normalizeSuiAddress(input.owner))) throw new Error("Invalid Sui address");
      const result = await this.transport.request({
        method: "suix_getAllCoins",
        params: [
          input.owner,
          input.cursor,
          input.limit
        ],
        signal: input.signal
      });
      return {
        ...result,
        data: result.data.filter((coin) => !isCoinReservationDigest(coin.digest))
      };
    }
    /**
    * Get the total coin balance for one coin type, owned by the address owner.
    */
    async getBalance({ owner, coinType, signal }) {
      if (!owner || !isValidSuiAddress(normalizeSuiAddress(owner))) throw new Error("Invalid Sui address");
      if (coinType && hasMvrName(coinType)) coinType = (await this.core.mvr.resolveType({ type: coinType })).type;
      return await this.transport.request({
        method: "suix_getBalance",
        params: [owner, coinType],
        signal
      });
    }
    /**
    * Get the total coin balance for all coin types, owned by the address owner.
    */
    async getAllBalances(input) {
      if (!input.owner || !isValidSuiAddress(normalizeSuiAddress(input.owner))) throw new Error("Invalid Sui address");
      return await this.transport.request({
        method: "suix_getAllBalances",
        params: [input.owner],
        signal: input.signal
      });
    }
    /**
    * Fetch CoinMetadata for a given coin type
    */
    async getCoinMetadata({ coinType, signal }) {
      if (coinType && hasMvrName(coinType)) coinType = (await this.core.mvr.resolveType({ type: coinType })).type;
      return await this.transport.request({
        method: "suix_getCoinMetadata",
        params: [coinType],
        signal
      });
    }
    /**
    *  Fetch total supply for a coin
    */
    async getTotalSupply({ coinType, signal }) {
      if (coinType && hasMvrName(coinType)) coinType = (await this.core.mvr.resolveType({ type: coinType })).type;
      return await this.transport.request({
        method: "suix_getTotalSupply",
        params: [coinType],
        signal
      });
    }
    /**
    * Invoke any RPC method
    * @param method the method to be invoked
    * @param args the arguments to be passed to the RPC request
    */
    async call(method, params, { signal } = {}) {
      return await this.transport.request({
        method,
        params,
        signal
      });
    }
    /**
    * Get Move function argument types like read, write and full access
    */
    async getMoveFunctionArgTypes({ package: pkg, module, function: fn, signal }) {
      if (pkg && isValidNamedPackage(pkg)) pkg = (await this.core.mvr.resolvePackage({ package: pkg })).package;
      return await this.transport.request({
        method: "sui_getMoveFunctionArgTypes",
        params: [
          pkg,
          module,
          fn
        ],
        signal
      });
    }
    /**
    * Get a map from module name to
    * structured representations of Move modules
    */
    async getNormalizedMoveModulesByPackage({ package: pkg, signal }) {
      if (pkg && isValidNamedPackage(pkg)) pkg = (await this.core.mvr.resolvePackage({ package: pkg })).package;
      return await this.transport.request({
        method: "sui_getNormalizedMoveModulesByPackage",
        params: [pkg],
        signal
      });
    }
    /**
    * Get a structured representation of Move module
    */
    async getNormalizedMoveModule({ package: pkg, module, signal }) {
      if (pkg && isValidNamedPackage(pkg)) pkg = (await this.core.mvr.resolvePackage({ package: pkg })).package;
      return await this.transport.request({
        method: "sui_getNormalizedMoveModule",
        params: [pkg, module],
        signal
      });
    }
    /**
    * Get a structured representation of Move function
    */
    async getNormalizedMoveFunction({ package: pkg, module, function: fn, signal }) {
      if (pkg && isValidNamedPackage(pkg)) pkg = (await this.core.mvr.resolvePackage({ package: pkg })).package;
      return await this.transport.request({
        method: "sui_getNormalizedMoveFunction",
        params: [
          pkg,
          module,
          fn
        ],
        signal
      });
    }
    /**
    * Get a structured representation of Move struct
    */
    async getNormalizedMoveStruct({ package: pkg, module, struct, signal }) {
      if (pkg && isValidNamedPackage(pkg)) pkg = (await this.core.mvr.resolvePackage({ package: pkg })).package;
      return await this.transport.request({
        method: "sui_getNormalizedMoveStruct",
        params: [
          pkg,
          module,
          struct
        ],
        signal
      });
    }
    /**
    * Get all objects owned by an address
    */
    async getOwnedObjects(input) {
      if (!input.owner || !isValidSuiAddress(normalizeSuiAddress(input.owner))) throw new Error("Invalid Sui address");
      const filter = input.filter ? { ...input.filter } : void 0;
      if (filter && "MoveModule" in filter && isValidNamedPackage(filter.MoveModule.package)) filter.MoveModule = {
        module: filter.MoveModule.module,
        package: (await this.core.mvr.resolvePackage({ package: filter.MoveModule.package })).package
      };
      else if (filter && "StructType" in filter && hasMvrName(filter.StructType)) filter.StructType = (await this.core.mvr.resolveType({ type: filter.StructType })).type;
      return await this.transport.request({
        method: "suix_getOwnedObjects",
        params: [
          input.owner,
          {
            filter,
            options: input.options
          },
          input.cursor,
          input.limit
        ],
        signal: input.signal
      });
    }
    /**
    * Get details about an object
    */
    async getObject(input) {
      if (!input.id || !isValidSuiObjectId(normalizeSuiObjectId(input.id))) throw new Error("Invalid Sui Object id");
      return await this.transport.request({
        method: "sui_getObject",
        params: [input.id, input.options],
        signal: input.signal
      });
    }
    async tryGetPastObject(input) {
      return await this.transport.request({
        method: "sui_tryGetPastObject",
        params: [
          input.id,
          input.version,
          input.options
        ],
        signal: input.signal
      });
    }
    /**
    * Batch get details about a list of objects. If any of the object ids are duplicates the call will fail
    */
    async multiGetObjects(input) {
      input.ids.forEach((id) => {
        if (!id || !isValidSuiObjectId(normalizeSuiObjectId(id))) throw new Error(`Invalid Sui Object id ${id}`);
      });
      if (input.ids.length !== new Set(input.ids).size) throw new Error(`Duplicate object ids in batch call ${input.ids}`);
      return await this.transport.request({
        method: "sui_multiGetObjects",
        params: [input.ids, input.options],
        signal: input.signal
      });
    }
    /**
    * Get transaction blocks for a given query criteria
    */
    async queryTransactionBlocks({ filter, options, cursor, limit, order, signal }) {
      if (filter && "MoveFunction" in filter && isValidNamedPackage(filter.MoveFunction.package)) filter = {
        ...filter,
        MoveFunction: { package: (await this.core.mvr.resolvePackage({ package: filter.MoveFunction.package })).package }
      };
      return await this.transport.request({
        method: "suix_queryTransactionBlocks",
        params: [
          {
            filter,
            options
          },
          cursor,
          limit,
          (order || "descending") === "descending"
        ],
        signal
      });
    }
    async getTransactionBlock(input) {
      if (!isValidTransactionDigest(input.digest)) throw new Error("Invalid Transaction digest");
      return await this.transport.request({
        method: "sui_getTransactionBlock",
        params: [input.digest, input.options],
        signal: input.signal
      });
    }
    async multiGetTransactionBlocks(input) {
      input.digests.forEach((d3) => {
        if (!isValidTransactionDigest(d3)) throw new Error(`Invalid Transaction digest ${d3}`);
      });
      if (input.digests.length !== new Set(input.digests).size) throw new Error(`Duplicate digests in batch call ${input.digests}`);
      return await this.transport.request({
        method: "sui_multiGetTransactionBlocks",
        params: [input.digests, input.options],
        signal: input.signal
      });
    }
    async executeTransactionBlock({ transactionBlock, signature, options, signal }) {
      return await this.transport.request({
        method: "sui_executeTransactionBlock",
        params: [
          typeof transactionBlock === "string" ? transactionBlock : toBase64(transactionBlock),
          Array.isArray(signature) ? signature : [signature],
          options
        ],
        signal
      });
    }
    async signAndExecuteTransaction({ transaction, signer, ...input }) {
      let transactionBytes;
      if (transaction instanceof Uint8Array) transactionBytes = transaction;
      else {
        transaction.setSenderIfNotSet(signer.toSuiAddress());
        transactionBytes = await transaction.build({ client: this });
      }
      const { signature, bytes } = await signer.signTransaction(transactionBytes);
      return this.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        ...input
      });
    }
    /**
    * Get total number of transactions
    */
    async getTotalTransactionBlocks({ signal } = {}) {
      const resp = await this.transport.request({
        method: "sui_getTotalTransactionBlocks",
        params: [],
        signal
      });
      return BigInt(resp);
    }
    /**
    * Getting the reference gas price for the network
    */
    async getReferenceGasPrice({ signal } = {}) {
      const resp = await this.transport.request({
        method: "suix_getReferenceGasPrice",
        params: [],
        signal
      });
      return BigInt(resp);
    }
    /**
    * Return the delegated stakes for an address
    */
    async getStakes(input) {
      if (!input.owner || !isValidSuiAddress(normalizeSuiAddress(input.owner))) throw new Error("Invalid Sui address");
      return await this.transport.request({
        method: "suix_getStakes",
        params: [input.owner],
        signal: input.signal
      });
    }
    /**
    * Return the delegated stakes queried by id.
    */
    async getStakesByIds(input) {
      input.stakedSuiIds.forEach((id) => {
        if (!id || !isValidSuiObjectId(normalizeSuiObjectId(id))) throw new Error(`Invalid Sui Stake id ${id}`);
      });
      return await this.transport.request({
        method: "suix_getStakesByIds",
        params: [input.stakedSuiIds],
        signal: input.signal
      });
    }
    /**
    * Return the latest system state content.
    */
    async getLatestSuiSystemState({ signal } = {}) {
      return await this.transport.request({
        method: "suix_getLatestSuiSystemState",
        params: [],
        signal
      });
    }
    /**
    * Get events for a given query criteria
    */
    async queryEvents({ query, cursor, limit, order, signal }) {
      if (query && "MoveEventType" in query && hasMvrName(query.MoveEventType)) query = {
        ...query,
        MoveEventType: (await this.core.mvr.resolveType({ type: query.MoveEventType })).type
      };
      if (query && "MoveEventModule" in query && isValidNamedPackage(query.MoveEventModule.package)) query = {
        ...query,
        MoveEventModule: {
          module: query.MoveEventModule.module,
          package: (await this.core.mvr.resolvePackage({ package: query.MoveEventModule.package })).package
        }
      };
      if ("MoveModule" in query && isValidNamedPackage(query.MoveModule.package)) query = {
        ...query,
        MoveModule: {
          module: query.MoveModule.module,
          package: (await this.core.mvr.resolvePackage({ package: query.MoveModule.package })).package
        }
      };
      return await this.transport.request({
        method: "suix_queryEvents",
        params: [
          query,
          cursor,
          limit,
          (order || "descending") === "descending"
        ],
        signal
      });
    }
    /**
    * Runs the transaction block in dev-inspect mode. Which allows for nearly any
    * transaction (or Move call) with any arguments. Detailed results are
    * provided, including both the transaction effects and any return values.
    */
    async devInspectTransactionBlock(input) {
      let devInspectTxBytes;
      if (isTransaction(input.transactionBlock)) {
        input.transactionBlock.setSenderIfNotSet(input.sender);
        devInspectTxBytes = toBase64(await input.transactionBlock.build({
          client: this,
          onlyTransactionKind: true
        }));
      } else if (typeof input.transactionBlock === "string") devInspectTxBytes = input.transactionBlock;
      else if (input.transactionBlock instanceof Uint8Array) devInspectTxBytes = toBase64(input.transactionBlock);
      else throw new Error("Unknown transaction block format.");
      input.signal?.throwIfAborted();
      return await this.transport.request({
        method: "sui_devInspectTransactionBlock",
        params: [
          input.sender,
          devInspectTxBytes,
          input.gasPrice?.toString(),
          input.epoch
        ],
        signal: input.signal
      });
    }
    /**
    * Dry run a transaction block and return the result.
    */
    async dryRunTransactionBlock(input) {
      return await this.transport.request({
        method: "sui_dryRunTransactionBlock",
        params: [typeof input.transactionBlock === "string" ? input.transactionBlock : toBase64(input.transactionBlock)]
      });
    }
    /**
    * Return the list of dynamic field objects owned by an object
    */
    async getDynamicFields(input) {
      if (!input.parentId || !isValidSuiObjectId(normalizeSuiObjectId(input.parentId))) throw new Error("Invalid Sui Object id");
      return await this.transport.request({
        method: "suix_getDynamicFields",
        params: [
          input.parentId,
          input.cursor,
          input.limit
        ],
        signal: input.signal
      });
    }
    /**
    * Return the dynamic field object information for a specified object
    */
    async getDynamicFieldObject(input) {
      return await this.transport.request({
        method: "suix_getDynamicFieldObject",
        params: [input.parentId, input.name],
        signal: input.signal
      });
    }
    /**
    * Get the sequence number of the latest checkpoint that has been executed
    */
    async getLatestCheckpointSequenceNumber({ signal } = {}) {
      const resp = await this.transport.request({
        method: "sui_getLatestCheckpointSequenceNumber",
        params: [],
        signal
      });
      return String(resp);
    }
    /**
    * Returns information about a given checkpoint
    */
    async getCheckpoint(input) {
      return await this.transport.request({
        method: "sui_getCheckpoint",
        params: [input.id],
        signal: input.signal
      });
    }
    /**
    * Returns historical checkpoints paginated
    */
    async getCheckpoints(input) {
      return await this.transport.request({
        method: "sui_getCheckpoints",
        params: [
          input.cursor,
          input?.limit,
          input.descendingOrder
        ],
        signal: input.signal
      });
    }
    /**
    * Return the committee information for the asked epoch
    */
    async getCommitteeInfo(input) {
      return await this.transport.request({
        method: "suix_getCommitteeInfo",
        params: [input?.epoch],
        signal: input?.signal
      });
    }
    async getNetworkMetrics({ signal } = {}) {
      return await this.transport.request({
        method: "suix_getNetworkMetrics",
        params: [],
        signal
      });
    }
    async getAddressMetrics({ signal } = {}) {
      return await this.transport.request({
        method: "suix_getLatestAddressMetrics",
        params: [],
        signal
      });
    }
    async getEpochMetrics(input) {
      return await this.transport.request({
        method: "suix_getEpochMetrics",
        params: [
          input?.cursor,
          input?.limit,
          input?.descendingOrder
        ],
        signal: input?.signal
      });
    }
    async getAllEpochAddressMetrics(input) {
      return await this.transport.request({
        method: "suix_getAllEpochAddressMetrics",
        params: [input?.descendingOrder],
        signal: input?.signal
      });
    }
    /**
    * Return the committee information for the asked epoch
    */
    async getEpochs(input) {
      return await this.transport.request({
        method: "suix_getEpochs",
        params: [
          input?.cursor,
          input?.limit,
          input?.descendingOrder
        ],
        signal: input?.signal
      });
    }
    /**
    * Returns list of top move calls by usage
    */
    async getMoveCallMetrics({ signal } = {}) {
      return await this.transport.request({
        method: "suix_getMoveCallMetrics",
        params: [],
        signal
      });
    }
    /**
    * Return the committee information for the asked epoch
    */
    async getCurrentEpoch({ signal } = {}) {
      return await this.transport.request({
        method: "suix_getCurrentEpoch",
        params: [],
        signal
      });
    }
    /**
    * Return the Validators APYs
    */
    async getValidatorsApy({ signal } = {}) {
      return await this.transport.request({
        method: "suix_getValidatorsApy",
        params: [],
        signal
      });
    }
    async getChainIdentifier({ signal } = {}) {
      return toHex(fromBase58((await this.getCheckpoint({
        id: "0",
        signal
      })).digest).slice(0, 4));
    }
    async resolveNameServiceAddress(input) {
      return await this.transport.request({
        method: "suix_resolveNameServiceAddress",
        params: [input.name],
        signal: input.signal
      });
    }
    async resolveNameServiceNames({ format = "dot", ...input }) {
      const { nextCursor, hasNextPage, data } = await this.transport.request({
        method: "suix_resolveNameServiceNames",
        params: [
          input.address,
          input.cursor,
          input.limit
        ],
        signal: input.signal
      });
      return {
        hasNextPage,
        nextCursor,
        data: data.map((name) => normalizeSuiNSName(name, format))
      };
    }
    async getProtocolConfig(input) {
      return await this.transport.request({
        method: "sui_getProtocolConfig",
        params: [input?.version],
        signal: input?.signal
      });
    }
    async verifyZkLoginSignature(input) {
      return await this.transport.request({
        method: "sui_verifyZkLoginSignature",
        params: [
          input.bytes,
          input.signature,
          input.intentScope,
          input.author
        ],
        signal: input.signal
      });
    }
    /**
    * Wait for a transaction block result to be available over the API.
    * This can be used in conjunction with `executeTransactionBlock` to wait for the transaction to
    * be available via the API.
    * This currently polls the `getTransactionBlock` API to check for the transaction.
    */
    async waitForTransaction({ signal, timeout = 60 * 1e3, pollInterval = 2 * 1e3, ...input }) {
      const timeoutSignal = AbortSignal.timeout(timeout);
      const timeoutPromise = new Promise((_2, reject) => {
        timeoutSignal.addEventListener("abort", () => reject(timeoutSignal.reason));
      });
      timeoutPromise.catch(() => {
      });
      while (!timeoutSignal.aborted) {
        signal?.throwIfAborted();
        try {
          return await this.getTransactionBlock(input);
        } catch {
          await Promise.race([new Promise((resolve) => setTimeout(resolve, pollInterval)), timeoutPromise]);
        }
      }
      timeoutSignal.throwIfAborted();
      throw new Error("Unexpected error while waiting for transaction block.");
    }
  };

  // node_modules/@mysten/sui/dist/jsonRpc/network.mjs
  function getJsonRpcFullnodeUrl(network) {
    switch (network) {
      case "mainnet":
        return "https://fullnode.mainnet.sui.io:443";
      case "testnet":
        return "https://fullnode.testnet.sui.io:443";
      case "devnet":
        return "https://fullnode.devnet.sui.io:443";
      case "localnet":
        return "http://127.0.0.1:9000";
      default:
        throw new Error(`Unknown network: ${network}`);
    }
  }

  // web-src/wallet-auth.ts
  function normalizeNetwork(network) {
    switch (String(network || "").trim().toLowerCase()) {
      case "testnet":
        return "testnet";
      case "devnet":
        return "devnet";
      default:
        return "mainnet";
    }
  }
  function createSnapshot(dAppKit) {
    const connection = dAppKit.stores.$connection.get();
    return {
      status: connection?.status || "disconnected",
      isConnected: Boolean(connection?.account?.address),
      walletAddress: connection?.account?.address || "",
      walletName: connection?.wallet?.name || "",
      accountLabel: connection?.account?.label || connection?.account?.address || ""
    };
  }
  function bindConnectButton(dAppKit, connectButtonId) {
    if (!connectButtonId || typeof document === "undefined") {
      return;
    }
    const element = document.getElementById(connectButtonId);
    if (element) {
      element.instance = dAppKit;
    }
  }
  function createWalletLoginClient(options = {}) {
    const network = normalizeNetwork(options.network);
    const dAppKit = createDAppKit({
      networks: [network],
      defaultNetwork: network,
      createClient: (selectedNetwork) => new SuiJsonRpcClient({
        url: getJsonRpcFullnodeUrl(normalizeNetwork(selectedNetwork))
      })
    });
    bindConnectButton(dAppKit, options.connectButtonId);
    const emitState = () => {
      options.onStateChange?.(createSnapshot(dAppKit));
    };
    const connectionStore = dAppKit.stores.$connection;
    let cleanup = () => {
    };
    if (typeof connectionStore.listen === "function") {
      cleanup = connectionStore.listen(() => emitState());
    } else if (typeof connectionStore.subscribe === "function") {
      cleanup = connectionStore.subscribe(() => emitState());
    }
    emitState();
    return {
      getConnection() {
        return createSnapshot(dAppKit);
      },
      async signPersonalMessage(message) {
        return dAppKit.signPersonalMessage({ message: new TextEncoder().encode(message) });
      },
      async disconnect() {
        await dAppKit.disconnectWallet();
        emitState();
      },
      destroy() {
        cleanup();
      }
    };
  }
  return __toCommonJS(wallet_auth_exports);
})();
/*! Bundled license information:

@scure/base/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/utils.js:
@noble/curves/abstract/modular.js:
@noble/curves/abstract/curve.js:
@noble/curves/abstract/edwards.js:
@noble/curves/ed25519.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/bip39/index.js:
  (*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) *)

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
lit-html/directive.js:
@lit/task/task.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
@lit-labs/scoped-registry-mixin/scoped-registry-mixin.js:
lit-html/directives/when.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
