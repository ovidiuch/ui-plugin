import { IPluginContext } from './PluginContext';

export type PluginHandler<PluginConfig extends object, PluginState> = (
  context: IPluginContext<PluginConfig, PluginState>,
) => void | (() => unknown);
