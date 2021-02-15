import {
  cachePluginContext,
  getCachedPluginContext,
} from './pluginContextCache';
import {
  cachePluginMethods,
  getCachedPluginMethods,
} from './pluginMethodsCache';
import { emitPluginStateChange, getPlugin, getPlugins } from './pluginStore';
import { getEventKey } from './shared';
import { PluginContext } from './types/PluginContext';
import { PluginMethods, PluginSpec, PluginState } from './types/PluginSpec';
import { Callback, StateUpdater } from './types/shared';
import { SharedPluginContext } from './types/SharedPluginContext';

// Why are contexts and methods cached? Because they are passed down to
// components and used as dependencies for child callbacks and effects (eg.
// React Hooks). By reusing methods handlers at the plugin system level,
// we enable downstream memoization at any level.
export function createPluginContext<T extends PluginSpec>(
  pluginName: T['name'],
  sharedContext: SharedPluginContext,
): PluginContext<T>;
export function createPluginContext(
  pluginName: string,
  sharedContext: SharedPluginContext,
): PluginContext<any> {
  const plugin = getPlugin(pluginName);
  if (!plugin.enabled) throw Error(`Plugin is disabled: ${pluginName}`);

  const cachedContext = getCachedPluginContext(pluginName, sharedContext);
  if (cachedContext) return cachedContext;

  function getConfig() {
    if (plugin.defaultConfig === undefined)
      throw Error(`Plugin does not have config: ${pluginName}`);

    return sharedContext.config[pluginName];
  }

  function getState() {
    if (plugin.initialState === undefined)
      throw Error(`Plugin does not have state: ${pluginName}`);

    return sharedContext.state[pluginName];
  }

  function setState(newState: StateUpdater<PluginState>, cb?: Callback) {
    if (plugin.initialState === undefined)
      throw Error(`Plugin does not have state: ${pluginName}`);

    sharedContext.setState(pluginName, newState);
    emitPluginStateChange();
    if (cb) cb();
  }

  function emit(eventName: string, ...eventArgs: any[]) {
    const eventKey = getEventKey(pluginName, eventName);
    const plugins = getPlugins();

    Object.keys(plugins).forEach(otherPluginName => {
      const { enabled, eventHandlers } = plugins[otherPluginName];
      if (enabled && eventHandlers[eventKey])
        eventHandlers[eventKey].forEach(handler => {
          handler(
            createPluginContext(otherPluginName, sharedContext),
            ...eventArgs,
          );
        });
    });
  }

  const getMethodsOf = (otherPluginName: string) =>
    createPluginMethods(otherPluginName, sharedContext);

  const context = {
    pluginName,
    getConfig,
    getState,
    setState,
    getMethodsOf,
    emit,
  };

  cachePluginContext(pluginName, sharedContext, context);
  return context;
}

function createPluginMethods<T extends PluginSpec>(
  pluginName: T['name'],
  sharedContext: SharedPluginContext,
): T['methods'] extends PluginMethods ? T['methods'] : never;
function createPluginMethods(
  pluginName: string,
  sharedContext: SharedPluginContext,
): PluginMethods {
  const context = createPluginContext(pluginName, sharedContext);
  const cachedMethods = getCachedPluginMethods(pluginName, context);
  if (cachedMethods) return cachedMethods;

  const { methodHandlers } = getPlugin(pluginName);
  const methods = Object.keys(methodHandlers).reduce(
    (acc, methodName) => ({
      ...acc,
      [methodName]: (...args: any): unknown =>
        methodHandlers[methodName](context, ...args),
    }),
    {},
  );

  cachePluginMethods(pluginName, context, methods);
  return methods;
}
