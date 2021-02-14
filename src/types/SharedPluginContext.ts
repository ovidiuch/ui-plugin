import { PluginConfig, PluginState } from './PluginSpec';
import { Callback, StateUpdater } from './shared';

export type SharedPluginContext = {
  config: Record<string, PluginConfig>;
  state: Record<string, PluginState>;
  setState: (
    pluginName: string,
    newState: StateUpdater<PluginState>,
    cb?: Callback,
  ) => void;
};
