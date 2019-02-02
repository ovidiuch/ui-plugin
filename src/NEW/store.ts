import { IPlugin, IPluginSpec } from './types';

let plugins: {
  [pluginName: string]: IPlugin<any>;
} = {};

export function removeAllPlugins() {
  plugins = {};
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

export function addPlugin(plugin: IPlugin<any>) {
  plugins = { ...plugins, [plugin.name]: plugin };
}

export function updatePlugin<PluginSpec extends IPluginSpec>(
  pluginName: string,
  change: (plugin: IPlugin<PluginSpec>) => IPlugin<PluginSpec>,
) {
  const plugin = getPlugin<PluginSpec>(pluginName);
  plugins = {
    [pluginName]: change(plugin),
  };
}
