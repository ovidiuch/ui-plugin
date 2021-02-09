import { PluginSpec, PluginContext, SharedPluginContext } from '../types';
import { getEventKey } from '../shared';
import { getPlugin, getPlugins, emitStateChange } from '../store';
import { getPluginContextCache, setPluginContextCache } from './pluginContextCache';
import { getPluginMethodsCache, setPluginMethodsCache } from './pluginMethodsCache';

// Why are contexts and methods cached? Because they are passed down to
// components and used as dependencies for child callbacks and effects (eg.
// React Hooks). By reusing methods handlers at the plugin system level,
// we enable downstream memoization at any level.
export function createPluginContext<Spec extends PluginSpec>(
  pluginName: Spec['name'],
  sharedContext: SharedPluginContext,
): PluginContext<Spec> {
  const plugin = getPlugin<Spec>(pluginName);
  if (!plugin.enabled) {
    throw new Error(`Plugin "${pluginName}" is disabled`);
  }

  const cachedPluginContext = getPluginContextCache(pluginName, sharedContext);
  if (cachedPluginContext) {
    return cachedPluginContext;
  }

  const pluginContext: PluginContext<Spec> = {
    pluginName,

    getConfig() {
      return sharedContext.config[pluginName];
    },

    getState() {
      return sharedContext.state[pluginName];
    },

    setState(newState, cb) {
      sharedContext.setState(pluginName, newState);
      emitStateChange();
      if (cb) {
        cb();
      }
    },

    getMethodsOf<OtherSpec extends PluginSpec>(
      otherPluginName: OtherSpec['name'],
    ): OtherSpec['methods'] {
      return createPluginMethods<OtherSpec>(otherPluginName, sharedContext);
    },

    emit(eventName, ...eventArgs) {
      const eventKey = getEventKey(pluginName, eventName);
      const plugins = getPlugins();

      Object.keys(plugins).forEach(otherPluginName => {
        const { enabled, eventHandlers } = plugins[otherPluginName];

        if (enabled && eventHandlers[eventKey]) {
          eventHandlers[eventKey].forEach(handler => {
            handler(createPluginContext(otherPluginName, sharedContext), ...eventArgs);
          });
        }
      });
    },
  };

  setPluginContextCache(pluginName, sharedContext, pluginContext);
  return pluginContext;
}

function createPluginMethods<Spec extends PluginSpec>(
  pluginName: Spec['name'],
  sharedContext: SharedPluginContext,
) {
  const cachedPluginMethods = getPluginMethodsCache(pluginName, sharedContext);
  if (cachedPluginMethods) {
    return cachedPluginMethods;
  }

  type Methods = Spec['methods'];
  type ValidMethodName = Extract<keyof Methods, string>;

  const { methodHandlers } = getPlugin<Spec>(pluginName);
  const otherPluginContext = createPluginContext(pluginName, sharedContext);
  const methodNames = Object.keys(methodHandlers).filter(key =>
    methodHandlers.hasOwnProperty(key),
  ) as ValidMethodName[];

  const pluginMethods = methodNames.reduce(
    <MethodName extends ValidMethodName>(methods: Methods, methodName: MethodName) => ({
      ...methods,
      [methodName]: (...args: Parameters<Methods[MethodName]>): ReturnType<Methods[MethodName]> =>
        methodHandlers[methodName](otherPluginContext, ...args),
    }),
    {},
  );

  setPluginMethodsCache(pluginName, sharedContext, pluginMethods);
  return pluginMethods;
}
