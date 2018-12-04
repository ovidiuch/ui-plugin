import { IPluginStore } from './types';
import { EventHandler, InitHandler, MethodHandler } from './types/PluginApi';
import { IPlugins } from './types/PluginStore';

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
