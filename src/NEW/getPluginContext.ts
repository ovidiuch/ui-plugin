import { IPluginSpec, IPluginContext } from './types';
import { getPlugin, getPlugins } from './pluginStore';
import { getEventKey } from './shared';

interface ISharedPluginContext {
  config: { [pluginName: string]: any };
  state: { [pluginName: string]: any };
  setState(pluginName: string, newState: any): void;
}

export function getPluginContext<PluginSpec extends IPluginSpec>(
  pluginName: PluginSpec['name'],
  sharedContext: ISharedPluginContext,
): IPluginContext<PluginSpec> {
  return {
    pluginName,

    getConfig() {
      return sharedContext.config[pluginName] as PluginSpec['state'];
    },

    getState() {
      return sharedContext.state[pluginName] as PluginSpec['state'];
    },

    setState(newState: PluginSpec['state']) {
      sharedContext.setState(pluginName, newState);
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
