import { IPluginSpec, IPluginContext, ISharedPluginContext } from './types';
import { getPlugin, getPlugins } from './store';
import { getEventKey } from './shared';

export function getPluginContext<PluginSpec extends IPluginSpec>(
  pluginName: PluginSpec['name'],
  sharedContext: ISharedPluginContext,
): IPluginContext<PluginSpec> {
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
      if (cb) {
        cb();
      }
    },

    getMethodsOf<OtherPluginSpec extends IPluginSpec>(
      otherPluginName: OtherPluginSpec['name'],
    ): OtherPluginSpec['methods'] {
      type Methods = OtherPluginSpec['methods'];
      type ValidMethodName = Extract<keyof Methods, string>;

      const { methodHandlers } = getPlugin<OtherPluginSpec>(otherPluginName);
      const methodNames = Object.keys(methodHandlers).filter(key =>
        methodHandlers.hasOwnProperty(key),
      ) as ValidMethodName[];

      return methodNames.reduce(
        <MethodName extends ValidMethodName>(methods: Methods, methodName: MethodName) => ({
          ...methods,
          [methodName]: (
            ...args: Parameters<Methods[MethodName]>
          ): ReturnType<Methods[MethodName]> =>
            methodHandlers[methodName](getPluginContext(otherPluginName, sharedContext), ...args),
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
            handler(getPluginContext(otherPluginName, sharedContext), ...eventArgs);
          });
        }
      });
    },
  };
}
