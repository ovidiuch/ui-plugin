import { EventHandler, InitHandler, MethodHandler } from './PluginApi';

interface IPlugin {
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

export function getPluginStore(): IPluginStore {
  return {
    plugins,
    addPlugin,
    addInitHandler,
    addMethodHandler,
    addEventHandler,
  };
}

export function resetPluginStore() {
  plugins = {};
}

// TODO: Attach to global namespace
let plugins: IPlugins = {};

function addPlugin({
  name,
  defaultConfig,
  initialState,
}: {
  name: string;
  defaultConfig: object;
  initialState: any;
}) {
  plugins[name] = {
    defaultConfig,
    initialState,
    initHandlers: [],
    methodHandlers: [],
    eventHandlers: [],
  };
}

function addInitHandler({
  pluginName,
  handler,
}: {
  pluginName: string;
  handler: InitHandler<any, any>;
}) {
  // TODO: Throw if plugin doesn't exist
  plugins[pluginName].initHandlers.push(handler);
}

function addMethodHandler({
  pluginName,
  methodName,
  handler,
}: {
  pluginName: string;
  methodName: string;
  handler: MethodHandler<any, any>;
}) {
  // TODO: Throw if plugin doesn't exist
  plugins[pluginName].methodHandlers.push({ methodName, handler });
}

function addEventHandler({
  pluginName,
  eventPath,
  handler,
}: {
  pluginName: string;
  eventPath: string;
  handler: EventHandler<any, any>;
}) {
  // TODO: Throw if plugin doesn't exist
  plugins[pluginName].eventHandlers.push({ eventPath, handler });
}
