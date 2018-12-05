export type StateUpdater<State> = State | ((prevState: State) => State);

export interface IPluginDef<PluginConfig extends object, PluginState> {
  name: string;
  defaultConfig?: PluginConfig;
  initialState?: PluginState;
}

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

export type StateHandler<PluginConfig extends object, PluginState> = (
  context: IPluginContext<PluginConfig, PluginState>,
) => void;

interface IPlugin {
  defaultConfig: object;
  initialState: any;
  initHandlers: Array<InitHandler<any, any>>;
  methodHandlers: Array<{
    methodName: string;
    handler: MethodHandler<any, any>;
  }>;
  eventHandlers: Array<{
    eventPath: string;
    handler: MethodHandler<any, any>;
  }>;
  // At the moment state handlers fire on state changes from any plugin
  // TODO: Bind state handlers to the plugins they draw state from
  stateHandlers: Array<StateHandler<any, any>>;
}

export interface IPlugins {
  [plugiName: string]: IPlugin;
}

export interface IPluginConfigs {
  [pluginName: string]: object;
}

export interface IPluginStates {
  [pluginName: string]: any;
}

export interface IPluginMountOpts {
  config?: IPluginConfigs;
  state?: IPluginStates;
}
