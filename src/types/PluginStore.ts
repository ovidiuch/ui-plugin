import { EventHandler, InitHandler, MethodHandler } from './PluginApi';

export interface IPlugin {
  defaultConfig: object;
  initialState: any;
  initHandlers: Array<InitHandler<any, any>>;
  methodHandlers: Array<{
    methodName: string;
    handler: MethodHandler<any, any>;
  }>;
  eventHandlers: Array<{
    eventPath: string;
    handler: MethodHandler<any, any>;
  }>;
}

export interface IPlugins {
  [plugiName: string]: IPlugin;
}

export interface IPluginStore {
  plugins: IPlugins;
  addPlugin: (
    params: { name: string; defaultConfig: object; initialState: any },
  ) => void;
  addInitHandler: (
    params: { pluginName: string; handler: InitHandler<any, any> },
  ) => void;
  addMethodHandler: (
    params: {
      pluginName: string;
      methodName: string;
      handler: MethodHandler<any, any>;
    },
  ) => void;
  addEventHandler: (
    params: {
      pluginName: string;
      eventPath: string;
      handler: EventHandler<any, any>;
    },
  ) => void;
}
