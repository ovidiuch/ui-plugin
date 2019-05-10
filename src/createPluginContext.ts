import { PluginSpec, PluginContext, SharedPluginContext } from './types';
import { getPlugin, getPlugins, emitStateChange } from './store';
import { getEventKey } from './shared';

export function createPluginContext<Spec extends PluginSpec>(
  pluginName: Spec['name'],
  sharedContext: SharedPluginContext,
): PluginContext<Spec> {
  const plugin = getPlugin<Spec>(pluginName);
  if (!plugin.enabled) {
    throw new Error(`Plugin "${pluginName}" is disabled`);
  }

  return {
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
      return getCachedPluginMethods<OtherSpec>(otherPluginName, sharedContext);
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
}

// Why are methods cached? Because plugin method handlers are passed down to
// components, which use them as dependencies for child callbacks and effects
// (eg. React Hooks). By reusing methods handlers at the plugin system level,
// we enable downstream memoization at any level.
type PluginMethods = ReturnType<PluginContext<any>['getMethodsOf']>;
type PluginMethodsCache = { [pluginName: string]: PluginMethods };
const cachedPluginMethods = new WeakMap<SharedPluginContext, PluginMethodsCache>();

function getCachedPluginMethods<Spec extends PluginSpec>(
  pluginName: Spec['name'],
  sharedContext: SharedPluginContext,
) {
  let cachedMethods = cachedPluginMethods.get(sharedContext);
  if (!cachedMethods) {
    cachedMethods = {};
    cachedPluginMethods.set(sharedContext, cachedMethods);
  }

  let pluginMethods = cachedMethods[pluginName];
  if (!pluginMethods) {
    pluginMethods = getPluginMethods(pluginName, sharedContext);
    cachedMethods[pluginName] = pluginMethods;
  }

  return pluginMethods;
}

function getPluginMethods<Spec extends PluginSpec>(
  pluginName: Spec['name'],
  sharedContext: SharedPluginContext,
) {
  type Methods = Spec['methods'];
  type ValidMethodName = Extract<keyof Methods, string>;

  const { methodHandlers } = getPlugin<Spec>(pluginName);
  const otherPluginContext = createPluginContext(pluginName, sharedContext);
  const methodNames = Object.keys(methodHandlers).filter(key =>
    methodHandlers.hasOwnProperty(key),
  ) as ValidMethodName[];

  return methodNames.reduce(
    <MethodName extends ValidMethodName>(methods: Methods, methodName: MethodName) => ({
      ...methods,
      [methodName]: (
        ...args: Parameters<Methods[MethodName]>
      ): ReturnType<Methods[MethodName]> =>
        methodHandlers[methodName](otherPluginContext, ...args),
    }),
    {},
  );
}
