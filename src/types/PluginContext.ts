import { PluginSpec, PluginSpecConfig, PluginSpecEvents, PluginSpecMethods, PluginSpecState } from './PluginSpec';
import { StateUpdater } from './shared';

type SetState<T extends PluginSpecState> = (change: StateUpdater<T>) => void;

type Emit<T extends PluginSpecEvents> = <EventName extends keyof T>(
  eventName: EventName,
  ...eventArgs: Parameters<T[EventName]>
) => void;

type GetMethodsOf = <T extends PluginSpec>(
  pluginName: T['name'],
) => T['methods'] extends PluginSpecMethods ? T['methods'] : never;

export interface PluginContext<T extends PluginSpec> {
  pluginName: T['name'];
  getConfig(): T['config'] extends PluginSpecConfig ? T['config'] : never;
  getState(): T['state'] extends PluginSpecState ? T['state'] : never;
  setState: T['state'] extends PluginSpecState ? SetState<T['state']> : never;
  emit: T['events'] extends PluginSpecEvents ? Emit<T['events']> : never;
  getMethodsOf: GetMethodsOf;
}
