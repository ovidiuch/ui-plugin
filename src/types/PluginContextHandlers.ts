import { PluginContext } from './PluginContext';
import { PluginSpec, PluginWithEvents, PluginWithMethods } from './PluginSpec';
import { Callback } from './shared';

type PluginContextHandler<
  TSpec extends PluginSpec,
  TArgs extends any[],
  TReturn
> = (context: PluginContext<TSpec>, ...args: TArgs) => TReturn;

type LoadHandlerReturn = void | null | Callback | (void | null | Callback)[];

export type PluginLoadHandler<T extends PluginSpec> = PluginContextHandler<
  T,
  [],
  LoadHandlerReturn
>;

export type PluginMethodHandlers<T extends PluginWithMethods> = {
  // Map the public signature of each method to the handler signature.
  // All methods need to be defined.
  [MethodName in keyof T['methods']]: PluginContextHandler<
    T,
    Parameters<T['methods'][MethodName]>,
    ReturnType<T['methods'][MethodName]>
  >;
};

export type PluginEventHandler<
  T extends PluginSpec,
  Args extends any[]
> = PluginContextHandler<T, Args, void>;

export type PluginEventHandlers<
  T extends PluginSpec,
  TEmitter extends PluginWithEvents
> = {
  // Map the public signature of each event to the listener handler signature.
  // Listener can define handlers for a subset of the emitter's events.
  [EventName in keyof TEmitter['events']]?: PluginEventHandler<
    T,
    Parameters<TEmitter['events'][EventName]>
  >;
};
