type StateGet<PluginState> = () => PluginState;

type StateSet<PluginState> = (pluginState: PluginState) => unknown;

type MethodCall = (methodName: string) => any;

type EventEmit = (eventName: string, eventParams: object) => undefined;

export interface IPluginContext<PluginState> {
  // Get and set (private) plugin state
  readonly getState: StateGet<PluginState>;
  readonly setState: StateSet<PluginState>;
  // Call public method of other plugin
  readonly callMethod: MethodCall;
  // Emit event that other plugins can listen to
  readonly emitEvent: EventEmit;
}

type Handler<PluginState> = (
  pluginContext: IPluginContext<PluginState>,
) => unknown;

type UnsubscribeHandler<PluginState> = (
  pluginContext: IPluginContext<PluginState>,
) => () => unknown;

export interface IPluginDef<PluginState> {
  readonly name: string;
  readonly getInitialState: StateGet<PluginState>;
  readonly init: Array<UnsubscribeHandler<PluginState>>;
  readonly methods: {
    [name: string]: Array<Handler<PluginState>>;
  };
  readonly listeners: {
    [eventName: string]: Array<Handler<PluginState>>;
  };
  // readonly plugs;
}
