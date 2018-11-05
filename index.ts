type StateGet<PluginState> = () => PluginState;

type StateSet<PluginState> = (PluginState) => unknown;

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

type Handler = (pluginContext: IPluginContext) => unknown;

type UnsubscribeHandler = (pluginContext: IPluginContext) => () => unknown;

export interface IPluginDef<PluginState> {
  readonly name: string;
  readonly getInitialState: StateGet<PluginState>;
  readonly init: UnsubscribeHandler[];
  readonly methods: {
    [name: string]: Handler[];
  };
  readonly listeners: {
    [eventName: string]: Handler[];
  };
  // readonly plugs;
}
