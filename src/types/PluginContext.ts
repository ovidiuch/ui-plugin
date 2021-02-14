import {
  PluginConfig,
  PluginEvents,
  PluginMethods,
  PluginSpec,
  PluginState,
} from './PluginSpec';
import { StateUpdater } from './shared';

type SetState<T extends PluginState> = (newState: StateUpdater<T>) => void;

type Emit<T extends PluginEvents> = <EventName extends keyof T>(
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

// The plugin context implementation cannot cannot be constructed to return a
// value that matches PublicContext type statically. PublicContext only includes
// methods relevant to the plugin spec (eg. getConfig if plugin has config). The
// implementation actually has a getConfig method for every plugin, but it will
// throw an error when trying to access the config of a plugin with no config.
export type PluginContextImpl = {
  pluginName: string;
  getConfig: () => PluginConfig;
  getState: () => PluginState;
  setState: SetState<PluginState>;
  emit: Emit<PluginEvents>;
  getMethodsOf: GetMethodsOf;
};
