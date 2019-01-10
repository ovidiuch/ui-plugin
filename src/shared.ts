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

type Callback = () => unknown;

export type InitHandler<PluginConfig extends object, PluginState> = (
  context: IPluginContext<PluginConfig, PluginState>,
) => void | Callback | Callback[];

export type MethodHandler<PluginConfig extends object, PluginState> = (
  context: IPluginContext<PluginConfig, PluginState>,
  ...args: any[]
) => any;

export type EventHandler<PluginConfig extends object, PluginState> = (
  context: IPluginContext<PluginConfig, PluginState>,
  ...args: any[]
) => void;

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

export interface IPluginsByName {
  [pluginName: string]: IPlugin;
}

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

export type PluginChangeHandler = (plugins: IPluginsByName) => unknown;

export type StateChangeHandler = () => unknown;

type UnloadHandlers = () => unknown;

export type PluginScopeId = number;

export interface IPluginScope {
  id: PluginScopeId;
  plugins: IPluginsByName;
  config: IPluginConfigs;
  state: IPluginStates;
  unloadHandlers: UnloadHandlers[];
  unload: () => void;
  reload: () => void;
  getPluginContext: (pluginName: string) => IPluginContext<any, any>;
}

export function removeHandler<H>(handlers: H[], handler: H) {
  const index = handlers.indexOf(handler);

  if (index !== -1) {
    handlers.splice(index, 1);
  }
}
