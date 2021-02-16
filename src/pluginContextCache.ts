import { PluginContext } from './types/PluginContext';
import { SharedPluginContext } from './types/SharedPluginContext';

const cache = new WeakMap<
  SharedPluginContext,
  { [pluginName: string]: PluginContext<any> }
>();

export function getCachedPluginContext(
  pluginName: string,
  sharedContext: SharedPluginContext,
) {
  const contexts = cache.get(sharedContext);
  return contexts ? contexts[pluginName] : null;
}

export function cachePluginContext(
  pluginName: string,
  sharedContext: SharedPluginContext,
  context: PluginContext<any>,
) {
  let contexts = cache.get(sharedContext);
  if (!contexts) {
    contexts = {};
    cache.set(sharedContext, contexts);
  }
  contexts[pluginName] = context;
}
