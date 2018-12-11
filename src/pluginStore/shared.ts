import { IPluginContext, IPlugins } from '../shared';

export interface ILoadedScope {
  unload: () => void;
  reload: () => void;
  getPluginContext: (pluginName: string) => IPluginContext<any, any>;
}

export interface IPluginStore {
  plugins: IPlugins;
  loadedScope: null | ILoadedScope;
}
