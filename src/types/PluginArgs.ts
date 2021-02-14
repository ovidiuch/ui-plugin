import { PluginMethodHandlers } from './PluginContextHandlers';
import {
  PluginSpec,
  PluginConfig,
  PluginMethods,
  PluginState,
} from './PluginSpec';

export type PluginArgs<T extends PluginSpec> = {
  name: T['name'];
} & (T['config'] extends PluginConfig ? { defaultConfig: T['config'] } : {}) &
  (T['state'] extends PluginState ? { initialState: T['state'] } : {}) &
  (T['methods'] extends PluginMethods
    ? { methods: PluginMethodHandlers<T, T['methods']> }
    : {});
