type StateUpdater<State> = State | ((prevState: State) => State);

export type PluginHandler<PluginContext> = (
  context: PluginContext,
) => void | (() => unknown);

export interface IPluginContext<PluginConfig, PluginState> {
  getConfig: () => PluginConfig;
  getConfigOf: (pluginName: string) => object;
  getState: () => PluginState;
  // TODO: Support multiple plugins (eg. const [{ webUrl }, { urlParams }] = getStateOf("renderer", "router"))
  getStateOf: (pluginName: string) => any;
  setState: (change: StateUpdater<PluginState>, cb?: () => unknown) => void;
  callMethod: (methodName: string, ...args: Array<unknown>) => any;
  emitEvent: (eventName: string, ...args: Array<unknown>) => void;
}

export interface IPluginDef<PluginConfig, PluginState> {
  name: string;
  defaultConfig?: PluginConfig;
  initialState?: PluginState;
}

type Init<PluginConfig, PluginState> = (
  handler: PluginHandler<IPluginContext<PluginConfig, PluginState>>,
) => void;

type Method<PluginConfig, PluginState> = (
  methodName: string,
  handler: PluginHandler<IPluginContext<PluginConfig, PluginState>>,
) => any;

type Event<PluginConfig, PluginState> = (
  eventName: string,
  handler: PluginHandler<IPluginContext<PluginConfig, PluginState>>,
) => any;

export interface IPluginApi<PluginConfig, PluginState> {
  init: Init<PluginConfig, PluginState>;
  method: Method<PluginConfig, PluginState>;
  on: Event<PluginConfig, PluginState>;
}

export interface IPluginStore {
  defaultConfigs: { [pluginName: string]: object };
  initialStates: { [pluginName: string]: any };
  initHandlers: {
    [pluginName: string]: Array<PluginHandler<IPluginContext<any, any>>>;
  };
  methodHandlers: {
    [pluginName: string]: Array<{
      methodName: string;
      handler: PluginHandler<IPluginContext<any, any>>;
    }>;
  };
  eventHandlers: {
    [pluginName: string]: Array<{
      eventName: string;
      handler: PluginHandler<IPluginContext<any, any>>;
    }>;
  };
}

// TODO: IPluginInstance
