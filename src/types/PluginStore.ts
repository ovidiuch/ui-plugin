import { PluginHandler } from './PluginHandler';
import { IPluginConfigs, IPluginStates } from './shared';

export interface IPluginStore {
  defaultConfigs: IPluginConfigs;
  initialStates: IPluginStates;
  initHandlers: {
    [pluginName: string]: Array<PluginHandler<any, any>>;
  };
  methodHandlers: {
    [pluginName: string]: Array<{
      methodName: string;
      handler: PluginHandler<any, any>;
    }>;
  };
  eventHandlers: {
    [pluginName: string]: Array<{
      eventName: string;
      handler: PluginHandler<any, any>;
    }>;
  };
}
