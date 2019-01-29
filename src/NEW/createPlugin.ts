import { MethodHandlers, EventHandlers, IPluginSpec, IPlugin } from './types';
import { addPlugin } from './pluginStore';
import { getEventKey } from './shared';

interface IPluginOpts<PluginSpec extends IPluginSpec> {
  name: PluginSpec['name'];
  initialState: PluginSpec['state'];
  methods: MethodHandlers<PluginSpec>;
}

export function createPlugin<PluginSpec extends IPluginSpec>(
  opts: IPluginOpts<PluginSpec>,
) {
  const plugin: IPlugin<PluginSpec> = {
    name: opts.name,
    initialState: opts.initialState,
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
