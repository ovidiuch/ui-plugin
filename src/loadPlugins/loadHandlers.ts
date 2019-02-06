import { createPluginContext } from '../createPluginContext';
import { Callback, IPluginsByName, ISharedPluginContext } from '../types';

export function runLoadHandlers(plugins: IPluginsByName, sharedContext: ISharedPluginContext) {
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
