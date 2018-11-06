import { IPluginDef } from "./PluginDef";

export function registerPlugin<PluginState>(
  pluginDef: IPluginDef<PluginState>,
): void {
  console.log(pluginDef);
  console.log(pluginDef);
}
