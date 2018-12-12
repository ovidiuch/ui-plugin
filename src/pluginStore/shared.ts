import {
  IPluginContext,
  IPlugins,
  PluginChangeHandler,
  StateChangeHandler,
} from '../shared';

export interface ILoadedScope {
  unload: () => void;
  reload: () => void;
  getPluginContext: (pluginName: string) => IPluginContext<any, any>;
}

export interface IPluginStore {
  plugins: IPlugins;
  pluginChangeHandlers: PluginChangeHandler[];
  stateChangeHandlers: StateChangeHandler[];
  loadedScope: null | ILoadedScope;
}
