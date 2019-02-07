import { PluginCreateArgs, PluginCreateApi, PluginSpec, Plugin } from './types';
import { addPlugin } from './store';
import { getEventKey } from './shared';

export function createPlugin<Spec extends PluginSpec>(
  args: PluginCreateArgs<Spec>,
): PluginCreateApi<Spec>;
export function createPlugin<Spec extends PluginSpec>(args: {
  name: string;
  defaultConfig?: Spec['config'];
  initialState?: Spec['state'];
  methods?: Spec['methods'];
}): PluginCreateApi<Spec> {
  const plugin: Plugin<Spec> = {
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
