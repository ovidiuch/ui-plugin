import {
  IPluginsByName,
  IPluginScope,
  PluginChangeHandler,
  StateChangeHandler,
} from '../shared';

export interface IPluginStore {
  plugins: IPluginsByName;
  pluginChangeHandlers: PluginChangeHandler[];
  stateChangeHandlers: StateChangeHandler[];
  loadedScope: null | IPluginScope;
}
