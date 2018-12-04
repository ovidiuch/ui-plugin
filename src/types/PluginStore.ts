import { EventHandler, InitHandler, MethodHandler } from './PluginApi';
import { IPluginConfigs, IPluginStates } from './shared';

export interface IPluginStore {
  defaultConfigs: IPluginConfigs;
  initialStates: IPluginStates;
  initHandlers: {
    [pluginName: string]: Array<InitHandler<any, any>>;
  };
  methodHandlers: {
    [pluginName: string]: {
      [methodName: string]: MethodHandler<any, any>;
    };
  };
  eventHandlers: {
    [pluginName: string]: {
      [eventName: string]: EventHandler<any, any>;
    };
  };
}
