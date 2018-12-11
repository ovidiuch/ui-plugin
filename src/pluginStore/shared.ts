import { IPluginContext, IPlugins } from '../shared';

export interface ILoadedScope {
  unload: () => void;
  reload: () => void;
  getPluginContext: (pluginName: string) => IPluginContext<any, any>;
}

export type PluginChangeHandler = (plugins: IPlugins) => unknown;

export interface IPluginStore {
  plugins: IPlugins;
  pluginChangeHandlers: PluginChangeHandler[];
  loadedScope: null | ILoadedScope;
}
