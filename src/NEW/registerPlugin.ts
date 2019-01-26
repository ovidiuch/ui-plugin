import { IPluginSpec } from './IPluginSpec';
import { addPluginDef } from './pluginStore';

export function registerPlugin<PluginSpec extends IPluginSpec>(pluginDef: {
  name: PluginSpec['name'];
  methods: PluginSpec['methods'];
}) {
  addPluginDef(pluginDef);
}
