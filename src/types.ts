export type Callback = () => unknown;

export type StateUpdater<State> = State | ((prevState: State) => State);

type PluginConfig = { [configProp: string]: any };

type PluginMethods = { [methodName: string]: (...args: any[]) => any };

// Note: All event signatures will have void return type. Users could
// specify just the event args as a tuple, but the labels would be lost
// because tuple elements don't support labels:
// https://github.com/Microsoft/TypeScript/issues/28259
type PluginEvents = { [eventName: string]: (...args: any[]) => void };

export interface PluginSpec<
  Config extends PluginConfig = any,
  Methods extends PluginMethods = any,
  Events extends PluginEvents = any
> {
  name: string;
  config?: Config;
  state?: any;
  methods?: Methods;
  events?: Events;
}

export interface PluginContext<Spec extends PluginSpec> {
  pluginName: Spec['name'];

  getConfig(): Spec['config'];

  getState(): Spec['state'];

  setState(change: Spec extends Record<'state', infer State> ? StateUpdater<State> : never, cb?: Callback): void;

  getMethodsOf<OtherSpec extends PluginSpec>(
    otherPluginName: OtherSpec['name'],
  ): OtherSpec extends Record<'methods', OtherSpec['methods']> ? OtherSpec['methods'] : {};

  emit<EventName extends Extract<keyof Spec['events'], string>>(
    eventName: EventName,
    ...eventArgs: Parameters<Spec['events'][EventName]>
  ): void;
}

type PluginContextHandler<Spec extends PluginSpec, Args extends any[], Ret> = (
  context: PluginContext<Spec>,
  ...args: Args
) => Ret;

export type LoadHandler<Spec extends PluginSpec> = PluginContextHandler<
  Spec,
  [],
  void | null | Callback | Array<void | null | Callback>
>;

export type EventHandler<Spec extends PluginSpec, Args extends any[]> = PluginContextHandler<Spec, Args, void>;

// Map the public signature of each method to its handler signature
export type MethodHandlers<Spec extends PluginSpec> = {
  [MethodName in keyof Spec['methods']]: PluginContextHandler<
    Spec,
    Parameters<Spec['methods'][MethodName]>,
    ReturnType<Spec['methods'][MethodName]>
  >;
};

// Map public event signature to event handler signature
export type EventHandlers<ListenerSpec extends PluginSpec, EmitterSpec extends PluginSpec> = EmitterSpec extends Record<
  'events',
  EmitterSpec['events']
>
  ? {
      // Listener can define handlers for a subset of the emitter's events
      [EventName in keyof EmitterSpec['events']]?: EventHandler<
        ListenerSpec,
        Parameters<EmitterSpec['events'][EventName]>
      >;
    }
  : { [eventName: string]: never };

export type PluginCreateArgs<Spec extends PluginSpec> = {
  name: Spec['name'];
} & (Spec extends Record<'config', infer Config> ? { defaultConfig: Config } : {}) &
  (Spec extends Record<'state', infer State> ? { initialState: State } : {}) &
  (Spec extends Record<'methods', Spec['methods']> ? { methods: MethodHandlers<Spec> } : {});

export interface PluginCreateApi<Spec extends PluginSpec> {
  onLoad(handler: LoadHandler<Spec>): void;

  on<EmitterSpec extends PluginSpec>(
    otherPluginName: EmitterSpec['name'],
    handlers: EventHandlers<Spec, EmitterSpec>,
  ): void;

  register(): void;
}

export type Plugin<Spec extends PluginSpec = any> = {
  name: string;
  enabled: boolean;
  defaultConfig: Spec extends Record<'config', infer Config> ? Config : void;
  initialState: Spec extends Record<'state', infer State> ? State : void;
  methodHandlers: MethodHandlers<Spec>;
  loadHandlers: Array<LoadHandler<Spec>>;
  eventHandlers: {
    [eventPath: string]: Array<EventHandler<Spec, any>>;
  };
};

export type PluginsByName = { [pluginName: string]: Plugin };

export type PluginConfigs = { [pluginName: string]: any };

export type PluginStates = { [pluginName: string]: any };

export type SharedPluginContext = {
  config: PluginConfigs;
  state: PluginStates;
  setState(pluginName: string, newState: StateUpdater<any>, cb?: Callback): void;
};
