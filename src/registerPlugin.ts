import { getPluginApi } from './getPluginApi';
import { createPlugin, getLoadedScope, reloadPlugins } from './pluginStore';
import { IPluginDef } from './shared';

export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
) {
  const { name, enabled = true, defaultConfig = {}, initialState } = pluginDef;

  createPlugin({
    name,
    enabled,
    defaultConfig,
    initialState,
  });

  if (getLoadedScope()) {
    // Wait until all the plugin parts have been registered using the API
    // returned by this function (eg. init, method, on, etc). All such calls
    // must occur right after this one (synchronously) for the automatic
    // activation of this plugin to work properly.
    setTimeout(reloadPlugins, 0);
  }

  return getPluginApi<PluginConfig, PluginState>(name);
}
