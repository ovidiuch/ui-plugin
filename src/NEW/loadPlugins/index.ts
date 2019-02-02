import {
  Callback,
  IPluginSpec,
  IPluginsByName,
  IPluginConfigs,
  IPluginStates,
  ISharedPluginContext,
} from '../types';
import { getPlugins, getPlugin, removeAllPlugins, emitPluginLoad } from '../store';
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
  const plugins = getPlugins();
  const prevStates = loadedPlugins ? loadedPlugins.sharedContext.state : {};
  const sharedContext: ISharedPluginContext = {
    config: createDefaultConfigs(plugins, args.config || {}),
    state: createInitialStates(plugins, args.state || {}, prevStates),
    setState: (pluginName, change, cb) => {
      sharedContext.state[pluginName] = updateState(sharedContext.state[pluginName], change);
      if (cb) {
        cb();
      }
    },
  };

  unloadPlugins();
  const unloadCallbacks = runLoadHandlers(plugins, sharedContext);
  loadedPlugins = {
    args,
    sharedContext,
    unloadCallbacks,
  };

  emitPluginLoad();
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

function createDefaultConfigs(
  plugins: IPluginsByName,
  customConfigs: IPluginConfigs,
): IPluginConfigs {
  return Object.keys(plugins).reduce(
    (configs, pluginName) => ({
      ...configs,
      [pluginName]: {
        ...plugins[pluginName].defaultConfig,
        ...customConfigs[pluginName],
      },
    }),
    {},
  );
}

function createInitialStates(
  plugins: IPluginsByName,
  customStates: IPluginStates,
  prevStates: IPluginStates,
): IPluginStates {
  return Object.keys(plugins).reduce(
    (states, pluginName) => ({
      ...states,
      [pluginName]:
        (prevStates && prevStates[pluginName]) ||
        (customStates && customStates[pluginName]) ||
        plugins[pluginName].initialState,
    }),
    {},
  );
}

function runLoadHandlers(plugins: IPluginsByName, sharedContext: ISharedPluginContext) {
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
