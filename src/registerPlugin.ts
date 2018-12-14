import { getPluginApi } from './getPluginApi';
import { createPlugin } from './pluginStore';
import { IPluginDef } from './shared';

export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
) {
  const plugin = createPlugin(pluginDef);

  return getPluginApi<PluginConfig, PluginState>(plugin.id);
}
