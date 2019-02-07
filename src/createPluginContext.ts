import { PluginSpec, PluginContext, SharedPluginContext } from './types';
import { getPlugin, getPlugins, emitStateChange } from './store';
import { getEventKey } from './shared';

export function createPluginContext<Spec extends PluginSpec>(
  pluginName: Spec['name'],
  sharedContext: SharedPluginContext,
): PluginContext<Spec> {
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
            methodHandlers[methodName](
              createPluginContext(otherPluginName, sharedContext),
              ...args,
            ),
        }),
        {},
      );
    },

    emit(eventName, ...eventArgs) {
      const eventKey = getEventKey(pluginName, eventName);
      const plugins = getPlugins();

      Object.keys(plugins).forEach(otherPluginName => {
        const plugin = plugins[otherPluginName];
        const { eventHandlers } = plugin;

        if (eventHandlers[eventKey]) {
          eventHandlers[eventKey].forEach(handler => {
            handler(createPluginContext(otherPluginName, sharedContext), ...eventArgs);
          });
        }
      });
    },
  };
}
