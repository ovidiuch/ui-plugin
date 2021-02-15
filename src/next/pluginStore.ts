import { PluginRecord, PluginRecordsByName } from '../types/PluginRecord';
import { Callback } from '../types/shared';

type LoadHandler = (plugins: PluginRecordsByName) => unknown;

let plugins: PluginRecordsByName = {};
let loadHandlers: LoadHandler[] = [];
let stateChangeHandlers: Callback[] = [];

export function removeAllPlugins() {
  plugins = {};
  loadHandlers = [];
  stateChangeHandlers = [];
}

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

export function emitPluginLoad() {
  loadHandlers.forEach(handler => handler(getPlugins()));
}

export function emitPluginStateChange() {
  stateChangeHandlers.forEach(handler => handler());
}
