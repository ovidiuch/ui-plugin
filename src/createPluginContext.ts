import { PluginSpec, PluginContext, SharedPluginContext } from './types';
import { getPlugin, getPlugins, emitStateChange } from './store';
import { getEventKey } from './shared';

// Plugin contexts are cached mainly to cache the method handlers. Why? Method
// handlers are passed down to components, which use them as dependencies for
// child callbacks and effects (eg. React Hooks). By reusing methods handlers
// at the plugin system level, we enable downstream memoization at any level.
type PluginContextCache = { [pluginName: string]: PluginContext<any> };
const cachedPluginContexts = new WeakMap<SharedPluginContext, PluginContextCache>();

export function getCachedPluginContext<Spec extends PluginSpec>(
  pluginName: Spec['name'],
  sharedContext: SharedPluginContext,
): PluginContext<Spec> {
  let contexts = cachedPluginContexts.get(sharedContext);
  if (!contexts) {
    contexts = {};
    cachedPluginContexts.set(sharedContext, contexts);
  }

  let pluginContext = contexts[pluginName];
  if (!pluginContext) {
    pluginContext = createPluginContext(pluginName, sharedContext);
    contexts[pluginName] = pluginContext;
  }

  return pluginContext;
}

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
      type Methods = OtherSpec['methods'];
      type ValidMethodName = Extract<keyof Methods, string>;

      const { methodHandlers } = getPlugin<OtherSpec>(otherPluginName);
      const otherPluginContext = getCachedPluginContext(otherPluginName, sharedContext);
      const methodNames = Object.keys(methodHandlers).filter(key =>
        methodHandlers.hasOwnProperty(key),
      ) as ValidMethodName[];

      return methodNames.reduce(
        <MethodName extends ValidMethodName>(
          methods: Methods,
          methodName: MethodName,
        ) => ({
          ...methods,
          [methodName]: (
            ...args: Parameters<Methods[MethodName]>
          ): ReturnType<Methods[MethodName]> =>
            methodHandlers[methodName](otherPluginContext, ...args),
        }),
        {},
      );
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
