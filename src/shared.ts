export type StateUpdater<State> = State | ((prevState: State) => State);

export interface IPluginDef<PluginConfig extends object, PluginState> {
  name: string;
  enabled?: boolean;
  defaultConfig?: PluginConfig;
  initialState?: PluginState;
}

export interface IPluginContext<PluginConfig extends object, PluginState> {
  getConfig: () => PluginConfig;
  getConfigOf: (pluginName: string) => { [attr: string]: any };
  getState: () => PluginState;
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

export interface IPluginApi<PluginConfig extends object, PluginState> {
  init: (handler: InitHandler<PluginConfig, PluginState>) => void;
  method: (
    methodName: string,
    handler: MethodHandler<PluginConfig, PluginState>,
  ) => void;
  on: (
    eventPath: string,
    handler: EventHandler<PluginConfig, PluginState>,
  ) => void;
}

export interface IPlugin {
  name: string;
  enabled: boolean;
  defaultConfig: object;
  initialState: any;
  initHandlers: Array<InitHandler<any, any>>;
  methodHandlers: Array<{
    methodName: string;
    handler: MethodHandler<any, any>;
  }>;
  eventHandlers: Array<{
    eventPath: string;
    handler: EventHandler<any, any>;
  }>;
}

export interface IPlugins {
  [plugiName: string]: IPlugin;
}

export interface IPluginConfigs {
  [pluginName: string]: { [attr: string]: any };
}

export interface IPluginStates {
  [pluginName: string]: any;
}

export interface ILoadPluginsOpts {
  config?: IPluginConfigs;
  state?: IPluginStates;
}

export type PluginChangeHandler = (plugins: IPlugins) => unknown;

export type StateChangeHandler = () => unknown;

export function removeHandler<H>(handlers: H[], handler: H) {
  const index = handlers.indexOf(handler);

  if (index !== -1) {
    handlers.splice(index, 1);
  }
}
