import { Callback, IPluginConfigs, IPluginStates, ISharedPluginContext } from '../types';
import { removeAllPlugins } from '../pluginStore';
import { updateState } from './updateState';

interface IOpts {
  config?: IPluginConfigs;
  state?: IPluginStates;
}

interface ILoadedPlugins {
  sharedContext: ISharedPluginContext;
  unloadHandlers: Callback[];
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

  const unloadHandlers: Callback[] = [];
  // TODO: Run load handlers and collect unloadHandlers

  loadedPlugins = {
    sharedContext,
    unloadHandlers,
  };

  return sharedContext;
}

export function unloadPlugins() {
  if (loadedPlugins) {
    loadedPlugins.unloadHandlers.forEach(handler => handler());
    loadedPlugins.unloadHandlers = [];
    loadedPlugins = null;
  }
}

export function resetPlugins() {
  unloadPlugins();
  removeAllPlugins();
}
