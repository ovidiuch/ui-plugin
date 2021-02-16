import { PluginConfig, PluginState } from './PluginSpec';
import { Callback, StateUpdater } from './shared';

export type PluginConfigs = Record<string, PluginConfig>;
export type PluginStates = Record<string, PluginState>;

export type SharedPluginContext = {
  config: PluginConfigs;
  state: PluginStates;
  setState: (
    pluginName: string,
    newState: StateUpdater<PluginState>,
    cb?: Callback,
  ) => void;
};
