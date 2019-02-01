import { IPlugin, IPluginSpec } from './types';

let plugins: {
  [pluginName: string]: IPlugin<any>;
};

export function addPlugin(plugin: IPlugin<any>) {
  plugins = { ...plugins, [plugin.name]: plugin };
}

export function getPlugin<PluginSpec extends IPluginSpec>(pluginName: string): IPlugin<PluginSpec> {
  if (!plugins[pluginName]) {
    throw new Error(`Plugin does not exist: ${pluginName}`);
  }

  return plugins[pluginName];
}

export function getPlugins() {
  return plugins;
}
