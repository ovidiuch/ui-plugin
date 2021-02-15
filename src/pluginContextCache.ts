import { PluginContext } from './types/PluginContext';
import { SharedPluginContext } from './types/SharedPluginContext';

type ContextByPlugin = { [pluginName: string]: PluginContext<any> };

const cache = new WeakMap<SharedPluginContext, ContextByPlugin>();

export function getCachedPluginContext(
  pluginName: string,
  sharedContext: SharedPluginContext,
) {
  const contextByPlugin = cache.get(sharedContext);
  return contextByPlugin ? contextByPlugin[pluginName] : null;
}

export function cachePluginContext(
  pluginName: string,
  sharedContext: SharedPluginContext,
  context: PluginContext<any>,
) {
  let contextByPlugin = cache.get(sharedContext);
  if (!contextByPlugin) {
    contextByPlugin = {};
    cache.set(sharedContext, contextByPlugin);
  }
  contextByPlugin[pluginName] = context;
}
