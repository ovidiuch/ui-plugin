export interface IPluginDef<PluginConfig extends object, PluginState> {
  name: string;
  defaultConfig?: PluginConfig;
  initialState?: PluginState;
}
