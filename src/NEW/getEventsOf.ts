import { IPluginSpec } from './IPluginSpec';

export function getEventsOf<PluginSpec extends IPluginSpec>(
  pluginName: PluginSpec['name'],
) {
  return <EventName extends keyof PluginSpec['events']>(
    eventName: EventName,
    eventArgs: (...args: PluginSpec['events'][EventName]) => void,
  ) => {
    console.log('on', { eventName, eventArgs });
  };
}
