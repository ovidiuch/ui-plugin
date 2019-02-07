import { updatePlugin } from './store';
import { reloadPlugins } from './loadPlugins';

export function enablePlugin(pluginName: string, enabled: boolean) {
  updatePlugin(pluginName, plugin => ({
    ...plugin,
    enabled,
  }));
  reloadPlugins();
}
