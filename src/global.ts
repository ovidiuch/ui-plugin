import { IPluginContext, IPlugins } from './shared';

export interface ILoadedScope {
  unload: () => void;
  reload: () => void;
  getPluginContext: (pluginName: string) => IPluginContext<any, any>;
}

interface IGlobalStore {
  plugins: IPlugins;
  loadedScope: null | ILoadedScope;
}

declare var global: {
  UiPlugin: undefined | IGlobalStore;
};

// Plugins are shared between multiple code bundles that run in the same page
export function getGlobalStore() {
  if (!global.UiPlugin) {
    global.UiPlugin = {
      plugins: {},
      loadedScope: null,
    };
  }

  return global.UiPlugin;
}
