import { PluginContext, SharedPluginContext } from '../types';

type PluginContextCache = { [pluginName: string]: PluginContext<any> };

const pluginContextCache = new WeakMap<
  SharedPluginContext,
  PluginContextCache
>();

export function getPluginContextCache(
  pluginName: string,
  sharedContext: SharedPluginContext,
) {
  const sharedContextCache = pluginContextCache.get(sharedContext);
  return sharedContextCache ? sharedContextCache[pluginName] : null;
}

export function setPluginContextCache(
  pluginName: string,
  sharedContext: SharedPluginContext,
  pluginContext: PluginContext<any>,
) {
  let sharedContextCache = pluginContextCache.get(sharedContext);
  if (!sharedContextCache) {
    sharedContextCache = {};
    pluginContextCache.set(sharedContext, sharedContextCache);
  }
  sharedContextCache[pluginName] = pluginContext;
}
