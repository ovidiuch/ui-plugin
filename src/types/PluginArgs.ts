import { PluginMethodHandlers } from './PluginContextHandlers';
import {
  PluginConfig,
  PluginMethods,
  PluginSpec,
  PluginState,
} from './PluginSpec';

export type PluginArgs<T extends PluginSpec> = {
  name: T['name'];
} & (T['config'] extends PluginConfig ? { defaultConfig: T['config'] } : {}) &
  (T['state'] extends PluginState ? { initialState: T['state'] } : {}) &
  (T['methods'] extends PluginMethods
    ? { methods: PluginMethodHandlers<T & { methods: T['methods'] }> }
    : {});
