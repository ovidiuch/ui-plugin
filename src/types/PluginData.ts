import { PluginContext } from './PluginContext';
import { PluginSpec, PluginSpecConfig, PluginSpecMethods, PluginSpecState } from './PluginSpec';
import { Callback } from './shared';

type PluginContextHandler<TSpec extends PluginSpec, TArgs extends any[], TReturn> = (
  context: PluginContext<TSpec>,
  ...args: TArgs
) => TReturn;

export type PluginMethodHandlers<TSpec extends PluginSpec, TMethods extends PluginSpecMethods> = {
  // Map the public signature of each method to its handler signature
  [MethodName in keyof TMethods]: PluginContextHandler<
    TSpec,
    Parameters<TMethods[MethodName]>,
    ReturnType<TMethods[MethodName]>
  >;
};

type LoadHandlerReturn = void | null | Callback | Array<void | null | Callback>;

export type PluginLoadHandler<T extends PluginSpec> = PluginContextHandler<T, [], LoadHandlerReturn>;

export type PluginEventHandler<T extends PluginSpec, Args extends any[]> = PluginContextHandler<T, Args, void>;

export type PluginData<T extends PluginSpec> = {
  name: T['name'];
  enabled: boolean;
  defaultConfig: T['config'] extends PluginSpecConfig ? T['config'] : undefined;
  initialState: T['state'] extends PluginSpecState ? T['state'] : undefined;
  methodHandlers: T['methods'] extends PluginSpecMethods ? PluginMethodHandlers<T, T['methods']> : undefined;
  loadHandlers: PluginLoadHandler<T>[];
  eventHandlers: { [eventPath: string]: PluginEventHandler<T, any>[] };
};
