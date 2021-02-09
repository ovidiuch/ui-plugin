import { PluginContext, SharedPluginContext } from '../types';

type PluginMethods = ReturnType<PluginContext<any>['getMethodsOf']>;
type PluginMethodsCache = { [pluginName: string]: PluginMethods };

const pluginMethodsCache = new WeakMap<SharedPluginContext, PluginMethodsCache>();

export function getPluginMethodsCache(pluginName: string, sharedContext: SharedPluginContext) {
  const sharedContextCache = pluginMethodsCache.get(sharedContext);
  return sharedContextCache ? sharedContextCache[pluginName] : null;
}

export function setPluginMethodsCache(
  pluginName: string,
  sharedContext: SharedPluginContext,
  pluginMethods: PluginMethods,
) {
  let sharedContextCache = pluginMethodsCache.get(sharedContext);
  if (!sharedContextCache) {
    sharedContextCache = {};
    pluginMethodsCache.set(sharedContext, sharedContextCache);
  }
  sharedContextCache[pluginName] = pluginMethods;
}
