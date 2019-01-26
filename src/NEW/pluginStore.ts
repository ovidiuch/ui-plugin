import { IPluginDef } from './IPluginSpec';

let pluginDefs: {
  [pluginName: string]: IPluginDef;
};

export function addPluginDef(pluginDef: IPluginDef) {
  pluginDefs = { ...pluginDefs, [pluginDef.name]: pluginDef };
}

export function getPluginDef(pluginName: string): IPluginDef {
  // TODO: Throw if plugin doesn't exist
  return pluginDefs[pluginName];
}
