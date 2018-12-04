export type StateUpdater<State> = State | ((prevState: State) => State);

export interface IPluginContext<PluginConfig extends object, PluginState> {
  getConfig: () => PluginConfig;
  getConfigOf: (pluginName: string) => { [attr: string]: any };
  getState: () => PluginState;
  // TODO: Support multiple plugins (eg. const [{ webUrl }, { urlParams }] = getStateOf("renderer", "router"))
  getStateOf: (pluginName: string) => any;
  setState: (change: StateUpdater<PluginState>, cb?: () => unknown) => void;
  callMethod: (methodPath: string, ...args: Array<unknown>) => any;
  emitEvent: (eventName: string, ...args: Array<unknown>) => void;
}

export type InitHandler<PluginConfig extends object, PluginState> = (
  context: IPluginContext<PluginConfig, PluginState>,
) => void | (() => unknown);

export type MethodHandler<PluginConfig extends object, PluginState> = (
  context: IPluginContext<PluginConfig, PluginState>,
  ...args: any[]
) => any;

export type EventHandler<PluginConfig extends object, PluginState> = (
  context: IPluginContext<PluginConfig, PluginState>,
  ...args: any[]
) => void;
