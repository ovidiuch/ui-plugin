import { reloadPlugins, updatePlugin } from './pluginStore';

export function enablePlugin(pluginName: string, enabled: boolean) {
  updatePlugin(pluginName, plugin => ({
    ...plugin,
    enabled,
  }));
  reloadPlugins();
}
