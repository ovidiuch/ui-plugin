import {
  PluginConfig,
  PluginEvents,
  PluginMethods,
  PluginSpec,
  PluginState,
} from './PluginSpec';
import { Callback, StateUpdater } from './shared';

type SetState<T extends PluginState> = (
  newState: StateUpdater<T>,
  cb?: Callback,
) => void;

type Emit<T extends PluginEvents> = <
  EventName extends Extract<keyof T, string>
>(
  eventName: EventName,
  ...eventArgs: Parameters<T[EventName]>
) => void;

type GetMethodsOf = <T extends PluginSpec>(
  pluginName: T['name'],
) => T['methods'] extends PluginMethods ? T['methods'] : never;

export type PluginContext<T extends PluginSpec> = {
  pluginName: T['name'];
  getMethodsOf: GetMethodsOf;
} & (T['config'] extends PluginConfig ? { getConfig: () => T['config'] } : {}) &
  (T['state'] extends PluginConfig ? { getState: () => T['state'] } : {}) &
  (T['state'] extends PluginConfig ? { setState: SetState<T['state']> } : {}) &
  (T['events'] extends PluginEvents ? { emit: Emit<T['events']> } : {});
