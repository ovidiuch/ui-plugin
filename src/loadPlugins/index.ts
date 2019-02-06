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
import { runLoadHandlers } from './loadHandlers';

interface ILoadPluginArgs {
  config?: IPluginConfigs;
  state?: IPluginStates;
}

let loadedArgs: ILoadPluginArgs = {};
let sharedContext: null | ISharedPluginContext = null;
let unloadCallbacks: null | Callback[] = null;

export function loadPlugins(args: ILoadPluginArgs = {}) {
  const prevStates = sharedContext ? sharedContext.state : {};
  unloadPlugins();

  loadedArgs = args;
  sharedContext = {
    config: createDefaultConfigs(getPlugins(), args.config || {}),
    state: createInitialStates(getPlugins(), args.state || {}, prevStates),
    setState: (pluginName, change, cb) => {
      if (!sharedContext) {
        throw new Error(`Can't set state because plugins aren't loaded`);
      }

      sharedContext.state[pluginName] = updateState(sharedContext.state[pluginName], change);
      if (cb) {
        cb();
      }
    },
  };
  unloadCallbacks = runLoadHandlers(getPlugins(), sharedContext);

  emitPluginLoad();
}

export function unloadPlugins() {
  if (sharedContext) {
    sharedContext = null;
  }
  if (unloadCallbacks) {
    unloadCallbacks.forEach(handler => handler());
    unloadCallbacks = null;
  }
}

export function reloadPlugins() {
  if (loadedArgs) {
    loadPlugins(loadedArgs);
  }
}

export function resetPlugins() {
  unloadPlugins();
  removeAllPlugins();
}

export function getPluginContext<PluginSpec extends IPluginSpec>(pluginName: PluginSpec['name']) {
  if (!sharedContext) {
    throw new Error(`Can't get plugin context because plugins aren't loaded`);
  }

  const plugin = getPlugin<PluginSpec>(pluginName);
  if (!plugin.enabled) {
    throw new Error(`Plugin "terry" is disabled`);
  }

  return createPluginContext<PluginSpec>(pluginName, sharedContext);
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
