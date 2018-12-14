import {
  IPluginsById,
  IPluginScope,
  PluginChangeHandler,
  StateChangeHandler,
} from '../shared';

export interface IPluginStore {
  plugins: IPluginsById;
  pluginChangeHandlers: PluginChangeHandler[];
  stateChangeHandlers: StateChangeHandler[];
  loadedScope: null | IPluginScope;
}
