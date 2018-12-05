import { IPlugins } from './shared';

interface IGlobalStore {
  plugins: IPlugins;
  unmount: null | (() => void);
}

declare var global: {
  UiPlugin: undefined | IGlobalStore;
};

// Plugins are shared between multiple code bundles that run in the same page
export function getGlobalStore() {
  if (!global.UiPlugin) {
    global.UiPlugin = {
      plugins: {},
      unmount: null,
    };
  }

  return global.UiPlugin;
}
