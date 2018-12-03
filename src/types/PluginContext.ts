import { StateUpdater } from './shared';

export interface IPluginContext<PluginConfig extends object, PluginState> {
  getConfig: () => PluginConfig;
  getConfigOf: (pluginName: string) => object;
  getState: () => PluginState;
  // TODO: Support multiple plugins (eg. const [{ webUrl }, { urlParams }] = getStateOf("renderer", "router"))
  getStateOf: (pluginName: string) => any;
  setState: (change: StateUpdater<PluginState>, cb?: () => unknown) => void;
  callMethod: (methodName: string, ...args: Array<unknown>) => any;
  emitEvent: (eventName: string, ...args: Array<unknown>) => void;
}
