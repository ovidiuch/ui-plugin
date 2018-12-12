import { IPluginStore } from './shared';

declare var global: {
  UiPluginStore: undefined | IPluginStore;
};

// Plugins are shared between multiple code bundles that run in the same page
export function getGlobalStore() {
  if (!global.UiPluginStore) {
    global.UiPluginStore = {
      plugins: {},
      pluginChangeHandlers: [],
      stateChangeHandlers: [],
      loadedScope: null,
    };
  }

  return global.UiPluginStore;
}
