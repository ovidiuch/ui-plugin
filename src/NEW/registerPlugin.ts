import { IPluginSpec, IPluginDef } from './IPluginSpec';
import { addPluginDef } from './pluginStore';

export function registerPlugin<PluginSpec extends IPluginSpec>(
  pluginDef: IPluginDef,
) {
  addPluginDef(pluginDef);
}
