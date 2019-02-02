import {
  Callback,
  IPluginSpec,
  IPluginConfigs,
  IPluginStates,
  ISharedPluginContext,
} from '../types';
import { getPlugins, getPlugin, removeAllPlugins } from '../store';
import { createPluginContext } from '../createPluginContext';
import { updateState } from './updateState';

interface ILoadPluginArgs {
  config?: IPluginConfigs;
  state?: IPluginStates;
}

interface ILoadedPlugins {
  args: ILoadPluginArgs;
  sharedContext: ISharedPluginContext;
  unloadCallbacks: Callback[];
}

let loadedPlugins: null | ILoadedPlugins = null;

export function loadPlugins(args: ILoadPluginArgs = {}) {
  unloadPlugins();

  const sharedContext: ISharedPluginContext = {
    config: args.config || {},
    state: args.state || {},

    setState: (pluginName, change, cb) => {
      sharedContext.state[pluginName] = updateState(sharedContext.state[pluginName], change);
      if (cb) {
        cb();
      }
    },
  };
  const unloadCallbacks = runLoadHandlers(sharedContext);

  loadedPlugins = {
    args,
    sharedContext,
    unloadCallbacks,
  };
}

export function unloadPlugins() {
  if (loadedPlugins) {
    loadedPlugins.unloadCallbacks.forEach(handler => handler());
    loadedPlugins.unloadCallbacks = [];
    loadedPlugins = null;
  }
}

export function reloadPlugins() {
  if (loadedPlugins) {
    loadPlugins(loadedPlugins.args);
  }
}

export function resetPlugins() {
  unloadPlugins();
  removeAllPlugins();
}

export function getPluginContext<PluginSpec extends IPluginSpec>(pluginName: PluginSpec['name']) {
  if (!loadedPlugins) {
    throw new Error(`Can't get plugin context because plugins aren't loaded`);
  }

  const plugin = getPlugin<PluginSpec>(pluginName);
  if (!plugin.enabled) {
    throw new Error(`Plugin "terry" is disabled`);
  }

  return createPluginContext<PluginSpec>(pluginName, loadedPlugins.sharedContext);
}

function runLoadHandlers(sharedContext: ISharedPluginContext) {
  const plugins = getPlugins();
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
