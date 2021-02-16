import { PluginContext } from './types/PluginContext';
import { PluginMethods } from './types/PluginSpec';

const cache = new WeakMap<
  PluginContext<any>,
  { [pluginName: string]: PluginMethods }
>();

export function getCachedPluginMethods(
  pluginName: string,
  context: PluginContext<any>,
) {
  const methods = cache.get(context);
  return methods ? methods[pluginName] : null;
}

export function cachePluginMethods(
  pluginName: string,
  context: PluginContext<any>,
  pluginMethods: PluginMethods,
) {
  let methods = cache.get(context);
  if (!methods) {
    methods = {};
    cache.set(context, methods);
  }
  methods[pluginName] = pluginMethods;
}
