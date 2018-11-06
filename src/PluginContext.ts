export type StateGet<PluginState> = () => PluginState;

export type StateSet<PluginState> = (pluginState: PluginState) => void;

export type MethodCall = (methodName: string) => any;

export type EventEmit = (eventName: string, eventParams: object) => void;

export interface IPluginContext<PluginState> {
  // Get and set (private) plugin state
  readonly getState: StateGet<PluginState>;
  readonly setState: StateSet<PluginState>;
  // Call public method of other plugin
  readonly callMethod: MethodCall;
  // Emit event that other plugins can listen to
  readonly emitEvent: EventEmit;
}
