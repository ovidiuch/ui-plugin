import { PluginArgs } from './PluginArgs';
import { PluginEventHandler, PluginLoadHandler } from './PluginContextHandlers';
import { PluginSpec } from './PluginSpec';

export type PluginData<T extends PluginSpec> = {
  enabled: boolean;
  args: PluginArgs<T>;
  handlers: {
    load: PluginLoadHandler<T>[];
    events: { [eventPath: string]: PluginEventHandler<T, any>[] };
  };
};
