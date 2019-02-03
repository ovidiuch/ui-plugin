import { IPlugin, IPluginsByName, IPluginSpec } from './types';
import { removeHandler } from './shared';

type PluginLoadHandler = (plugins: IPluginsByName) => unknown;
type StateChangeHandler = () => unknown;

let plugins: IPluginsByName = {};
let pluginLoadHandlers: PluginLoadHandler[] = [];
let stateChangeHandlers: StateChangeHandler[] = [];

export function removeAllPlugins() {
  plugins = {};
  pluginLoadHandlers = [];
  stateChangeHandlers = [];
}

export function getPlugins() {
  return plugins;
}

export function getPlugin<PluginSpec extends IPluginSpec>(pluginName: string): IPlugin<PluginSpec> {
  if (!plugins[pluginName]) {
    throw new Error(`Plugin does not exist: ${pluginName}`);
  }

  return plugins[pluginName];
}

export function addPlugin(plugin: IPlugin) {
  plugins = { ...plugins, [plugin.name]: plugin };
}

export function updatePlugin<PluginSpec extends IPluginSpec>(
  pluginName: string,
  change: (plugin: IPlugin<PluginSpec>) => IPlugin<PluginSpec>,
) {
  const plugin = getPlugin<PluginSpec>(pluginName);
  plugins = {
    ...plugins,
    [pluginName]: change(plugin),
  };
}

export function onPluginLoad(handler: PluginLoadHandler) {
  pluginLoadHandlers.push(handler);

  return () => removeHandler(pluginLoadHandlers, handler);
}

export function onStateChange(handler: StateChangeHandler) {
  stateChangeHandlers.push(handler);

  return () => removeHandler(stateChangeHandlers, handler);
}

export function emitPluginLoad() {
  pluginLoadHandlers.forEach(handler => handler(getPlugins()));
}

export function emitStateChange() {
  stateChangeHandlers.forEach(handler => handler());
}
