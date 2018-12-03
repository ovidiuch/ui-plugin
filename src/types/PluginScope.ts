import { IPluginConfigs, IPluginStates } from './shared';

export interface IPluginScope {
  unmounted: boolean;
  config: IPluginConfigs;
  state: IPluginStates;
}
