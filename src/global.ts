import { IPluginContext, IPlugins } from './shared';

export interface IMountedApi {
  unmount: () => void;
  reload: () => void;
  getPluginContext: (pluginName: string) => IPluginContext<any, any>;
}

interface IGlobalStore {
  plugins: IPlugins;
  mountedApi: null | IMountedApi;
}

declare var global: {
  UiPlugin: undefined | IGlobalStore;
};

// Plugins are shared between multiple code bundles that run in the same page
export function getGlobalStore() {
  if (!global.UiPlugin) {
    global.UiPlugin = {
      plugins: {},
      mountedApi: null,
    };
  }

  return global.UiPlugin;
}
