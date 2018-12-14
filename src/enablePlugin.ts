import { reloadPlugins, updatePlugin } from './pluginStore';
import { PluginId } from './shared';

export function enablePlugin(pluginId: PluginId, enabled: boolean) {
  updatePlugin(pluginId, plugin => ({
    ...plugin,
    enabled,
  }));

  reloadPlugins();
}
