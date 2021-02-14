import { Plugin, PluginsByName, PluginSpec } from './types';
import { removeHandler } from './shared';

type PluginLoadHandler = (plugins: PluginsByName) => unknown;
type StateChangeHandler = () => unknown;

let plugins: PluginsByName = {};
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

export function getPlugin<Spec extends PluginSpec>(
  pluginName: string,
): Plugin<Spec> {
  if (!plugins[pluginName]) {
    throw new Error(`Plugin does not exist: ${pluginName}`);
  }

  return plugins[pluginName];
}

export function addPlugin(plugin: Plugin) {
  plugins = { ...plugins, [plugin.name]: plugin };
}

export function updatePlugin<Spec extends PluginSpec>(
  pluginName: string,
  change: (plugin: Plugin<Spec>) => Plugin<Spec>,
) {
  const plugin = getPlugin<Spec>(pluginName);
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
