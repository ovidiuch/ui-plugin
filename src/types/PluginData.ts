import { PluginContext } from './PluginContext';
import { PluginSpec, PluginSpecConfig, PluginSpecMethods, PluginSpecState } from './PluginSpec';

type Callback = () => unknown;

type PluginContextHandler<TSpec extends PluginSpec, TArgs extends any[], TReturn> = (
  context: PluginContext<TSpec>,
  ...args: TArgs
) => TReturn;

type MethodHandlers<TSpec extends PluginSpec, TMethods extends PluginSpecMethods> = {
  // Map the public signature of each method to its handler signature
  [MethodName in keyof TMethods]: PluginContextHandler<
    TSpec,
    Parameters<TMethods[MethodName]>,
    ReturnType<TMethods[MethodName]>
  >;
};

type LoaderHandlerReturn = void | null | Callback | Array<void | null | Callback>;

type LoadHandler<T extends PluginSpec> = PluginContextHandler<T, [], LoaderHandlerReturn>;

type EventHandlers<T extends PluginSpec> = {
  [eventPath: string]: PluginContextHandler<T, any[], void>[];
};

export type PluginData<T extends PluginSpec> = {
  name: T['name'];
  enabled: boolean;
  defaultConfig: T['config'] extends PluginSpecConfig ? T['config'] : void;
  initialState: T['state'] extends PluginSpecState ? T['state'] : void;
  methodHandlers: T['methods'] extends PluginSpecMethods ? MethodHandlers<T, T['methods']> : void;
  loadHandlers: LoadHandler<T>[];
  eventHandlers: EventHandlers<T>;
};
