import { PluginContext } from './PluginContext';
import { PluginSpec, PluginSpecEvents, PluginSpecMethods } from './PluginSpec';
import { Callback } from './shared';

type PluginContextHandler<TSpec extends PluginSpec, TArgs extends any[], TReturn> = (
  context: PluginContext<TSpec>,
  ...args: TArgs
) => TReturn;

type LoadHandlerReturn = void | null | Callback | Array<void | null | Callback>;

export type PluginLoadHandler<T extends PluginSpec> = PluginContextHandler<T, [], LoadHandlerReturn>;

export type PluginMethodHandlers<TSpec extends PluginSpec, TMethods extends PluginSpecMethods> = {
  // Map the public signature of each method to its handler signature
  [MethodName in keyof TMethods]: PluginContextHandler<
    TSpec,
    Parameters<TMethods[MethodName]>,
    ReturnType<TMethods[MethodName]>
  >;
};

export type PluginEventHandler<T extends PluginSpec, Args extends any[]> = PluginContextHandler<T, Args, void>;

export type PluginEventHandlers<T extends PluginSpec, TEmitterEvents extends PluginSpecEvents> = {
  // Listener can define handlers for a subset of the emitter's events
  [EventName in keyof TEmitterEvents]?: PluginEventHandler<T, Parameters<TEmitterEvents[EventName]>>;
};
