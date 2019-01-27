import { MethodHandlers, EventHandlers, IPluginSpec, IPlugin } from './types';
import { addPlugin } from './pluginStore';
import { getEventKey } from './shared';

export function createPlugin<PluginSpec extends IPluginSpec>(opts: {
  name: PluginSpec['name'];
  methods: MethodHandlers<PluginSpec>;
}) {
  const plugin: IPlugin<PluginSpec> = {
    name: opts.name,
    methodHandlers: opts.methods,
    eventHandlers: {},
  };

  return {
    on,
    register,
  };

  function on<EmitterPluginSpec extends IPluginSpec>(
    otherPluginName: EmitterPluginSpec['name'],
    handlers: EventHandlers<PluginSpec, EmitterPluginSpec>,
  ) {
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
  }

  function register() {
    addPlugin(plugin);
  }
}
