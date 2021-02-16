import {
  PluginEventHandler,
  PluginLoadHandler,
  PluginMethodHandlers,
} from './PluginContextHandlers';
import { PluginConfig, PluginState } from './PluginSpec';

export type PluginRecord = {
  name: string;
  enabled: boolean;
  defaultConfig: PluginConfig | undefined;
  initialState: PluginState | undefined;
  methodHandlers: PluginMethodHandlers<any>;
  loadHandlers: PluginLoadHandler<any>[];
  eventHandlers: { [eventPath: string]: PluginEventHandler<any, any>[] };
};

export type PluginRecordsByName = { [pluginName: string]: PluginRecord };
