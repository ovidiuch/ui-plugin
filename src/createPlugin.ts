import { addPlugin } from './pluginStore';
import { getEventKey } from './shared';
import { PluginArgs } from './types/PluginArgs';
import { PluginCreateApi } from './types/PluginCreateApi';
import { PluginRecord } from './types/PluginRecord';
import {
  PluginConfig,
  PluginMethods,
  PluginSpec,
  PluginState,
} from './types/PluginSpec';

export function createPlugin<T extends PluginSpec>(
  args: PluginArgs<T>,
): PluginCreateApi<T>;
export function createPlugin(args: {
  name: string;
  defaultConfig?: PluginConfig;
  initialState?: PluginState;
  methods?: PluginMethods;
}): PluginCreateApi<any> {
  const plugin: PluginRecord = {
    name: args.name,
    enabled: true,
    defaultConfig: args.defaultConfig,
    initialState: args.initialState,
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
          const prevHandlers = plugin.eventHandlers[eventKey];
          plugin.eventHandlers[eventKey] = prevHandlers
            ? [...prevHandlers, handler]
            : [handler];
        }
      });
    },

    register: () => {
      addPlugin(plugin);
    },
  };
}
