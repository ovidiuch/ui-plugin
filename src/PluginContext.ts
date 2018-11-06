export type StateGet<State> = () => State;

export type StateSet<State> = (state: State) => void;

export type MethodCall = (methodName: string) => any;

export type EventEmit = (eventName: string, eventParams: object) => void;

export interface IPluginContext<State> {
  // Get and set (private) plugin state
  readonly getState: StateGet<State>;
  readonly setState: StateSet<State>;
  // Call public method of other plugin
  readonly callMethod: MethodCall;
  // Emit event that other plugins can listen to
  readonly emitEvent: EventEmit;
}
