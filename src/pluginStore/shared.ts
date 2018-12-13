import {
  IPlugins,
  IPluginScope,
  PluginChangeHandler,
  StateChangeHandler,
} from '../shared';

export interface IPluginStore {
  plugins: IPlugins;
  pluginChangeHandlers: PluginChangeHandler[];
  stateChangeHandlers: StateChangeHandler[];
  loadedScope: null | IPluginScope;
}
