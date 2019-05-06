import {
  Callback,
  PluginSpec,
  PluginsByName,
  PluginConfigs,
  PluginStates,
  SharedPluginContext,
} from '../types';
import { getPlugins, removeAllPlugins, emitPluginLoad } from '../store';
import { getCachedPluginContext } from '../createPluginContext';
import { updateState } from './updateState';
import { runLoadHandlers } from './loadHandlers';

type LoadPluginArgs = {
  config?: PluginConfigs;
  state?: PluginStates;
};

let loadedArgs: LoadPluginArgs = {};
let sharedContext: null | SharedPluginContext = null;
let unloadCallbacks: null | Callback[] = null;

export function loadPlugins(args: LoadPluginArgs = {}) {
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

      sharedContext.state[pluginName] = updateState(
        sharedContext.state[pluginName],
        change,
      );
      if (cb) {
        cb();
      }
    },
  };
  unloadCallbacks = runLoadHandlers(getPlugins(), sharedContext);

  emitPluginLoad();
}

export function unloadPlugins() {
  if (unloadCallbacks) {
    unloadCallbacks.forEach(handler => handler());
    unloadCallbacks = null;
  }
  if (sharedContext) {
    sharedContext = null;
  }
}

export function reloadPlugins() {
  if (sharedContext) {
    loadPlugins(loadedArgs);
  }
}

export function resetPlugins() {
  unloadPlugins();
  removeAllPlugins();
}

export function getPluginContext<Spec extends PluginSpec>(pluginName: Spec['name']) {
  if (!sharedContext) {
    throw new Error(`Can't get plugin context because plugins aren't loaded`);
  }

  return getCachedPluginContext<Spec>(pluginName, sharedContext);
}

function createDefaultConfigs(
  plugins: PluginsByName,
  customConfigs: PluginConfigs,
): PluginConfigs {
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
  plugins: PluginsByName,
  customStates: PluginStates,
  prevStates: PluginStates,
): PluginStates {
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
