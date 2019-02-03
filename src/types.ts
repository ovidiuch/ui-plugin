export type Callback = () => unknown;

export type StateUpdater<State> = State | ((prevState: State) => State);

interface IPluginConfig {
  [configProp: string]: any;
}

interface IPluginMethods {
  [methodName: string]: (...args: any[]) => any;
}

interface IPluginEvents {
  // Note: All event signatures will have void return type. Users could
  // specify just the event args as a tuple, but the labels would be lost
  // because tuple elements don't support labels:
  // https://github.com/Microsoft/TypeScript/issues/28259
  [eventName: string]: (...args: any[]) => void;
}

export interface IPluginSpec<
  Config extends IPluginConfig = any,
  Methods extends IPluginMethods = any,
  Events extends IPluginEvents = any
> {
  name: string;
  config?: Config;
  state?: any;
  methods?: Methods;
  events?: Events;
}

export interface IPluginContext<PluginSpec extends IPluginSpec> {
  pluginName: PluginSpec['name'];

  getConfig(): PluginSpec['config'];

  getState(): PluginSpec['state'];

  setState(
    change: PluginSpec extends Record<'state', infer State> ? StateUpdater<State> : never,
    cb?: Callback,
  ): void;

  getMethodsOf<OtherPluginSpec extends IPluginSpec>(
    otherPluginName: OtherPluginSpec['name'],
  ): OtherPluginSpec extends Record<'methods', OtherPluginSpec['methods']>
    ? OtherPluginSpec['methods']
    : {};

  emit<EventName extends Extract<keyof PluginSpec['events'], string>>(
    eventName: EventName,
    ...eventArgs: Parameters<PluginSpec['events'][EventName]>
  ): void;
}

type PluginContextHandler<PluginSpec extends IPluginSpec, Args extends any[], Ret> = (
  context: IPluginContext<PluginSpec>,
  ...args: Args
) => Ret;

export type LoadHandler<PluginSpec extends IPluginSpec> = PluginContextHandler<
  PluginSpec,
  [],
  void | null | Callback | Array<void | null | Callback>
>;

export type EventHandler<PluginSpec extends IPluginSpec, Args extends any[]> = PluginContextHandler<
  PluginSpec,
  Args,
  void
>;

// Map the public signature of each method to its handler signature
export type MethodHandlers<PluginSpec extends IPluginSpec> = {
  [MethodName in keyof PluginSpec['methods']]: PluginContextHandler<
    PluginSpec,
    Parameters<PluginSpec['methods'][MethodName]>,
    ReturnType<PluginSpec['methods'][MethodName]>
  >
};

// Map public event signature to event handler signature
export type EventHandlers<
  ListenerSpec extends IPluginSpec,
  EmitterSpec extends IPluginSpec
> = EmitterSpec extends Record<'events', EmitterSpec['events']>
  ? {
      // Listener can define handlers for a subset of the emitter's events
      [EventName in keyof EmitterSpec['events']]?: EventHandler<
        ListenerSpec,
        Parameters<EmitterSpec['events'][EventName]>
      >
    }
  : { [eventName: string]: never };

export type PluginCreateArgs<PluginSpec extends IPluginSpec> = {
  name: PluginSpec['name'];
} & (PluginSpec extends Record<'config', infer Config> ? { defaultConfig: Config } : {}) &
  (PluginSpec extends Record<'state', infer State> ? { initialState: State } : {}) &
  (PluginSpec extends Record<'methods', PluginSpec['methods']>
    ? { methods: MethodHandlers<PluginSpec> }
    : {});

export interface IPluginCreateApi<PluginSpec extends IPluginSpec> {
  onLoad(handler: LoadHandler<PluginSpec>): void;

  on<EmitterSpec extends IPluginSpec>(
    otherPluginName: EmitterSpec['name'],
    handlers: EventHandlers<PluginSpec, EmitterSpec>,
  ): void;

  register(): void;
}

export interface IPlugin<PluginSpec extends IPluginSpec = any> {
  name: string;
  enabled: boolean;
  defaultConfig: PluginSpec extends Record<'config', infer Config> ? Config : void;
  initialState: PluginSpec extends Record<'state', infer State> ? State : void;
  methodHandlers: MethodHandlers<PluginSpec>;
  loadHandlers: Array<LoadHandler<PluginSpec>>;
  eventHandlers: {
    [eventPath: string]: Array<EventHandler<PluginSpec, any>>;
  };
}

export interface IPluginsByName {
  [pluginName: string]: IPlugin;
}

export interface IPluginConfigs {
  [pluginName: string]: any;
}

export interface IPluginStates {
  [pluginName: string]: any;
}

export interface ISharedPluginContext {
  config: IPluginConfigs;
  state: IPluginStates;
  setState(pluginName: string, newState: StateUpdater<any>, cb?: Callback): void;
}
