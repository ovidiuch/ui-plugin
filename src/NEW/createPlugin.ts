import { PluginCreateArgs, IPluginCreateApi, IPluginSpec, IPlugin } from './types';
import { addPlugin } from './store';
import { getEventKey } from './shared';

export function createPlugin<PluginSpec extends IPluginSpec>(
  args: PluginCreateArgs<PluginSpec>,
): IPluginCreateApi<PluginSpec>;
export function createPlugin<PluginSpec extends IPluginSpec>(args: {
  name: string;
  defaultConfig?: PluginSpec['config'];
  initialState?: PluginSpec['state'];
  methods?: PluginSpec['methods'];
}): IPluginCreateApi<PluginSpec> {
  const plugin: IPlugin<PluginSpec> = {
    name: args.name,
    enabled: true,
    defaultConfig: args.defaultConfig || {},
    initialState: args.initialState || undefined,
    methodHandlers: args.methods || {},
    loadHandlers: [],
    eventHandlers: {},
  };

  return {
    onLoad: handler => {
      plugin.loadHandlers.push(handler);
    },

    on: (otherPluginName, handlers) => {
      Object.keys(handlers).forEach(eventName => {
        const handler = handlers[eventName];
        // https://github.com/Microsoft/TypeScript/pull/12253#issuecomment-263132208
        if (handler) {
          const eventKey = getEventKey(otherPluginName, eventName);
          plugin.eventHandlers[eventKey] = plugin.eventHandlers[eventKey]
            ? [...plugin.eventHandlers[eventKey], handler]
            : [handler];
        }
      });
    },

    register: () => {
      addPlugin(plugin);
    },
  };
}
