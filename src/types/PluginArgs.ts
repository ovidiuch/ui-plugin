import { PluginMethodHandlers } from './PluginContextHandlers';
import { PluginSpec, PluginSpecConfig, PluginSpecMethods, PluginSpecState } from './PluginSpec';

export type PluginArgs<T extends PluginSpec> = {
  name: T['name'];
} & (T['config'] extends PluginSpecConfig ? { defaultConfig: T['config'] } : {}) &
  (T['state'] extends PluginSpecState ? { initialState: T['state'] } : {}) &
  (T['methods'] extends PluginSpecMethods ? { methods: PluginMethodHandlers<T, T['methods']> } : {});
