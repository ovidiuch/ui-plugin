import { IPluginConfigs, IPluginStates } from './shared';

// TODO: Remove this type
export interface IPluginScope {
  unmounted: boolean;
  config: IPluginConfigs;
  state: IPluginStates;
}
