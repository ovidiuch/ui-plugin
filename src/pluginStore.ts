import { EventHandler, InitHandler, MethodHandler } from './shared';

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

// TODO: Attach to global namespace
let plugins: IPlugins = {};

export function getPluginStore() {
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
