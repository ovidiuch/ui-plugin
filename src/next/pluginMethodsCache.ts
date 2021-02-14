import { PluginContext } from '../types/PluginContext';
import { PluginMethods } from '../types/PluginSpec';

type MethodsByPlugin = { [pluginName: string]: PluginMethods };

const cache = new WeakMap<PluginContext<any>, MethodsByPlugin>();

export function getCachedPluginMethods(
  pluginName: string,
  context: PluginContext<any>,
) {
  const methodsByPlugin = cache.get(context);
  return methodsByPlugin ? methodsByPlugin[pluginName] : null;
}

export function cachePluginMethods(
  pluginName: string,
  context: PluginContext<any>,
  pluginMethods: PluginMethods,
) {
  let methodsByPlugin = cache.get(context);
  if (!methodsByPlugin) {
    methodsByPlugin = {};
    cache.set(context, methodsByPlugin);
  }
  methodsByPlugin[pluginName] = pluginMethods;
}
