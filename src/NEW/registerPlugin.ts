import { IPluginSpec } from './IPluginSpec';
import { addPluginDef } from './pluginStore';

export function registerPlugin<PluginSpec extends IPluginSpec>(pluginDef: {
  name: PluginSpec['name'];
  methods: PluginSpec['methods'];
}) {
  addPluginDef(pluginDef);
}

export function getPluginRegisterApi<PluginSpec extends IPluginSpec>(
  pluginName: PluginSpec['name'],
) {
  return {
    getEventsOf,
  };

  function getEventsOf<OtherPluginSpec extends IPluginSpec>(
    otherPluginName: OtherPluginSpec['name'],
  ) {
    return <EventName extends keyof OtherPluginSpec['events']>(
      eventName: EventName,
      eventArgs: (...args: OtherPluginSpec['events'][EventName]) => void,
    ) => {
      console.log('on', { eventName, eventArgs });
    };
  }
}
