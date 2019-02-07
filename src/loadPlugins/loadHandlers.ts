import { createPluginContext } from '../createPluginContext';
import { Callback, PluginsByName, SharedPluginContext } from '../types';

export function runLoadHandlers(
  plugins: PluginsByName,
  sharedContext: SharedPluginContext,
) {
  const unloadCallbacks: Callback[] = [];

  Object.keys(plugins).forEach(pluginName => {
    plugins[pluginName].loadHandlers.forEach(handler => {
      const handlerReturn = handler(createPluginContext(pluginName, sharedContext));

      if (handlerReturn) {
        const callbacks = Array.isArray(handlerReturn) ? handlerReturn : [handlerReturn];
        callbacks.forEach(callback => {
          if (typeof callback === 'function') {
            unloadCallbacks.push(callback);
          }
        });
      }
    });
  });

  return unloadCallbacks;
}
