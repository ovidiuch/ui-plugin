import { Callback, IPluginConfigs, IPluginStates, ISharedPluginContext } from '../types';
import { getPlugins, removeAllPlugins } from '../store';
import { getPluginContext } from '../getPluginContext';
import { updateState } from './updateState';

interface IOpts {
  config?: IPluginConfigs;
  state?: IPluginStates;
}

interface ILoadedPlugins {
  sharedContext: ISharedPluginContext;
  unloadCallbacks: Callback[];
}

let loadedPlugins: null | ILoadedPlugins = null;

export function loadPlugins(opts: IOpts = {}) {
  unloadPlugins();

  const sharedContext: ISharedPluginContext = {
    config: opts.config || {},
    state: opts.state || {},

    setState: (pluginName, change, cb) => {
      sharedContext.state[pluginName] = updateState(sharedContext.state[pluginName], change);
      if (cb) {
        cb();
      }
    },
  };

  const unloadCallbacks = collectUnloadCallbacks(sharedContext);

  loadedPlugins = {
    sharedContext,
    unloadCallbacks,
  };

  return sharedContext;
}

export function unloadPlugins() {
  if (loadedPlugins) {
    loadedPlugins.unloadCallbacks.forEach(handler => handler());
    loadedPlugins.unloadCallbacks = [];
    loadedPlugins = null;
  }
}

export function resetPlugins() {
  unloadPlugins();
  removeAllPlugins();
}

function collectUnloadCallbacks(sharedContext: ISharedPluginContext) {
  const plugins = getPlugins();
  const unloadCallbacks: Callback[] = [];

  Object.keys(plugins).forEach(pluginName => {
    plugins[pluginName].loadHandlers.forEach(handler => {
      const handlerReturn = handler(getPluginContext(pluginName, sharedContext));

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
