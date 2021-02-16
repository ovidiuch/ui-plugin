import { PluginRecord } from './types/PluginRecord';
import { Callback } from './types/shared';

type PluginRecordsByName = { [pluginName: string]: PluginRecord };
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
    throw new Error(`Plugin doesn't exist: ${pluginName}`);

  return plugins[pluginName];
}

export function addPlugin(plugin: PluginRecord) {
  plugins = { ...plugins, [plugin.name]: plugin };
}

export function updatePlugin(
  pluginName: string,
  change: (plugin: PluginRecord) => PluginRecord,
) {
  const plugin = getPlugin(pluginName);
  plugins = { ...plugins, [pluginName]: change(plugin) };
}

export function onPluginLoad(handler: LoadHandler) {
  loadHandlers.push(handler);
  return () => removeHandler(loadHandlers, handler);
}

export function onStateChange(handler: Callback) {
  stateChangeHandlers.push(handler);
  return () => removeHandler(stateChangeHandlers, handler);
}

export function emitPluginLoad() {
  loadHandlers.forEach(handler => handler(getPlugins()));
}

export function emitPluginStateChange() {
  stateChangeHandlers.forEach(handler => handler());
}

function removeHandler<T>(handlers: T[], handler: T) {
  const index = handlers.indexOf(handler);
  if (index !== -1) handlers.splice(index, 1);
}
