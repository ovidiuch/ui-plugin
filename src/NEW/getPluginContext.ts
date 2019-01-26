import { IPluginSpec } from './IPluginSpec';
import { getPluginDef } from './pluginStore';

export function getPluginContext<PluginSpec extends IPluginSpec>(
  pluginName: PluginSpec['name'],
) {
  return {
    getMethodsOf<OtherPluginSpec extends IPluginSpec>(
      otherPluginName: OtherPluginSpec['name'],
    ): OtherPluginSpec['methods'] {
      return getPluginDef(otherPluginName).methods;
    },
    emit<EventName extends keyof PluginSpec['events']>(
      eventName: EventName,
      ...eventArgs: PluginSpec['events'][EventName]
    ) {
      console.log('emit', { eventName, eventArgs });
    },
  };
}
