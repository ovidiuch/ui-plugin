interface IPluginMethods {
  [methodName: string]: (...args: any[]) => any;
}

export interface IPluginSpec<Methods extends IPluginMethods = any> {
  name: string;
  // TODO
  // config: {};
  // state: any;
  methods: Methods;
  events: {
    // Note: All event signatures will have void return type. Users could
    // specify just the event args as a tuple, but the labels would be lost
    // because tuple elements don't support labels:
    // https://github.com/Microsoft/TypeScript/issues/28259
    [eventName: string]: (...args: any[]) => void;
  };
}

export interface IPluginContext<PluginSpec extends IPluginSpec> {
  pluginName: PluginSpec['name'];

  getMethodsOf<OtherPluginSpec extends IPluginSpec>(
    otherPluginName: OtherPluginSpec['name'],
  ): OtherPluginSpec['methods'];

  emit<EventName extends Extract<keyof PluginSpec['events'], string>>(
    eventName: EventName,
    ...eventArgs: Parameters<PluginSpec['events'][EventName]>
  ): void;
}

type PluginContextHandler<
  PluginSpec extends IPluginSpec,
  Args extends any[],
  Ret
> = (context: IPluginContext<PluginSpec>, ...args: Args) => Ret;

export type EventHandler<
  PluginSpec extends IPluginSpec,
  Args extends any[]
> = PluginContextHandler<PluginSpec, Args, void>;

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
  ListenerPluginSpec extends IPluginSpec,
  EmitterPluginSpec extends IPluginSpec
> = {
  // Listener can define handlers for a subset of the emitter's events
  [EventName in keyof EmitterPluginSpec['events']]?: EventHandler<
    ListenerPluginSpec,
    Parameters<EmitterPluginSpec['events'][EventName]>
  >
};

export interface IPlugin<PluginSpec extends IPluginSpec> {
  name: string;
  methodHandlers: MethodHandlers<PluginSpec>;
  eventHandlers: {
    [eventPath: string]: Array<EventHandler<PluginSpec, any>>;
  };
}
