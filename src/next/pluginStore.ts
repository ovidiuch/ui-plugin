import { PluginRecord } from '../types/PluginRecord';
import { Callback } from '../types/shared';

type PluginRecordsByName = { [pluginName: string]: PluginRecord };

let plugins: PluginRecordsByName = {};
let stateChangeHandlers: Callback[] = [];

export function getPlugins(): PluginRecordsByName {
  return plugins;
}

export function getPlugin(pluginName: string): PluginRecord {
  if (!plugins[pluginName])
    throw new Error(`Plugin does not exist: ${pluginName}`);

  return plugins[pluginName];
}

export function addPlugin(plugin: PluginRecord) {
  plugins = { ...plugins, [plugin.name]: plugin };
}

export function emitPluginStateChange() {
  stateChangeHandlers.forEach(handler => handler());
}
