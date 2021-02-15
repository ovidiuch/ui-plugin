import { createPluginContext } from './createPluginContext';
import { emitPluginLoad, getPlugins, removeAllPlugins } from './pluginStore';
import { updateState } from './shared';
import { PluginSpec } from './types/PluginSpec';
import { Callback } from './types/shared';
import {
  PluginConfigs,
  PluginStates,
  SharedPluginContext,
} from './types/SharedPluginContext';

type LoadPluginArgs = {
  config?: PluginConfigs;
  state?: PluginStates;
};

let loadedArgs: LoadPluginArgs = {};
let sharedContext: null | SharedPluginContext = null;
let unloadCallbacks: null | Callback[] = null;

export function loadPlugins(args: LoadPluginArgs = {}) {
  const currentState = sharedContext ? sharedContext.state : {};
  unloadPlugins();
  loadedArgs = args;
  sharedContext = {
    config: createDefaultConfigs(args.config || {}),
    state: createInitialStates(args.state || {}, currentState),
    setState: (pluginName, change, cb) => {
      if (!sharedContext)
        throw new Error(`Can't set state because plugins aren't loaded`);

      sharedContext.state[pluginName] = updateState(
        sharedContext.state[pluginName],
        change,
      );
      if (cb) cb();
    },
  };
  unloadCallbacks = runLoadHandlers(sharedContext);
  emitPluginLoad();
}

export function unloadPlugins() {
  if (unloadCallbacks) {
    unloadCallbacks.forEach(handler => handler());
    unloadCallbacks = null;
  }
  if (sharedContext) sharedContext = null;
}

export function reloadPlugins() {
  if (sharedContext) loadPlugins(loadedArgs);
}

export function resetPlugins() {
  unloadPlugins();
  removeAllPlugins();
}

export function getPluginContext<T extends PluginSpec>(pluginName: T['name']) {
  if (!sharedContext)
    throw new Error(`Can't get plugin context because plugins aren't loaded`);

  return createPluginContext<T>(pluginName, sharedContext);
}

function createDefaultConfigs(configOverride: PluginConfigs): PluginConfigs {
  const plugins = getPlugins();
  return Object.keys(plugins).reduce(
    (configs, pluginName) => ({
      ...configs,
      [pluginName]: {
        ...plugins[pluginName].defaultConfig,
        ...configOverride[pluginName],
      },
    }),
    {},
  );
}

function createInitialStates(
  stateOverride: PluginStates,
  currentState: PluginStates,
): PluginStates {
  const plugins = getPlugins();
  return Object.keys(plugins).reduce(
    (states, pluginName) => ({
      ...states,
      [pluginName]:
        currentState[pluginName] !== undefined
          ? currentState[pluginName]
          : stateOverride[pluginName] !== undefined
          ? stateOverride[pluginName]
          : plugins[pluginName].initialState,
    }),
    {},
  );
}

function runLoadHandlers(sharedContext: SharedPluginContext) {
  const plugins = getPlugins();
  const unloadCallbacks: Callback[] = [];

  Object.keys(plugins).forEach(pluginName => {
    const { enabled, loadHandlers } = plugins[pluginName];
    if (!enabled) return;

    loadHandlers.forEach(handler => {
      const handlerReturn = handler(
        createPluginContext(pluginName, sharedContext),
      );

      if (handlerReturn) {
        const callbacks = Array.isArray(handlerReturn)
          ? handlerReturn
          : [handlerReturn];
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
