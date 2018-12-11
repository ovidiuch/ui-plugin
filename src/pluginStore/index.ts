import {
  EventHandler,
  InitHandler,
  IPlugin,
  MethodHandler,
  StateHandler,
} from '../shared';
import { getGlobalStore } from './global';
import { ILoadedScope, PluginChangeHandler } from './shared';

// Meant for testing cleanup purposes
export function resetPlugins() {
  unloadPlugins();
  getGlobalStore().plugins = {};
}

export function exposeLoadedScope(scope: ILoadedScope) {
  const store = getGlobalStore();
  store.loadedScope = scope;
}

export function reloadPlugins() {
  const store = getGlobalStore();

  if (store.loadedScope) {
    store.loadedScope.reload();
  }
}

export function unloadPlugins() {
  const store = getGlobalStore();

  if (store.loadedScope) {
    store.loadedScope.unload();
    store.loadedScope = null;
  }
}

export function getPlugins() {
  return getGlobalStore().plugins;
}

export function onPluginChange(handler: PluginChangeHandler) {
  const { pluginChangeHandlers } = getGlobalStore();
  pluginChangeHandlers.push(handler);

  return () => {
    removePluginChangeHandler(handler);
  };
}

export function enablePlugin(pluginName: string, enabled: boolean) {
  const plugin = getPlugin(pluginName);

  setPlugin(pluginName, {
    ...plugin,
    enabled,
  });
}

export function getPluginContext(pluginName: string) {
  const { loadedScope } = getGlobalStore();

  if (!loadedScope) {
    throw new Error('getPluginContext called before loading plugins');
  }

  return loadedScope.getPluginContext(pluginName);
}

export function addPlugin({
  name,
  enabled,
  defaultConfig,
  initialState,
}: {
  name: string;
  enabled: boolean;
  defaultConfig: object;
  initialState: any;
}) {
  setPlugin(name, {
    name,
    enabled,
    defaultConfig,
    initialState,
    initHandlers: [],
    methodHandlers: [],
    eventHandlers: [],
    stateHandlers: [],
  });
}

export function addInitHandler({
  pluginName,
  handler,
}: {
  pluginName: string;
  handler: InitHandler<any, any>;
}) {
  const { initHandlers } = getPlugin(pluginName);
  initHandlers.push(handler);
}

export function addMethodHandler({
  pluginName,
  methodName,
  handler,
}: {
  pluginName: string;
  methodName: string;
  handler: MethodHandler<any, any>;
}) {
  const { methodHandlers } = getPlugin(pluginName);
  methodHandlers.push({ methodName, handler });
}

export function addEventHandler({
  pluginName,
  eventPath,
  handler,
}: {
  pluginName: string;
  eventPath: string;
  handler: EventHandler<any, any>;
}) {
  const { eventHandlers } = getPlugin(pluginName);
  eventHandlers.push({ eventPath, handler });
}

export function addStateHandler({
  pluginName,
  handler,
}: {
  pluginName: string;
  handler: StateHandler<any, any>;
}) {
  const { stateHandlers } = getPlugin(pluginName);
  stateHandlers.push(handler);
}

export function removeStateHandler({
  pluginName,
  handler,
}: {
  pluginName: string;
  handler: StateHandler<any, any>;
}) {
  const { stateHandlers } = getPlugin(pluginName);
  const index = stateHandlers.indexOf(handler);

  if (index !== -1) {
    stateHandlers.splice(index, 1);
  }
}

function getPlugin(pluginName: string) {
  const { plugins } = getGlobalStore();

  if (!plugins[pluginName]) {
    throw new Error(`Plugin not found ${pluginName}`);
  }

  return plugins[pluginName];
}

function setPlugin(pluginName: string, plugin: IPlugin) {
  const store = getGlobalStore();
  store.plugins[pluginName] = plugin;
  emitPluginChange();
}

function removePluginChangeHandler(handler: PluginChangeHandler) {
  const { pluginChangeHandlers } = getGlobalStore();
  const index = pluginChangeHandlers.indexOf(handler);

  if (index !== -1) {
    pluginChangeHandlers.splice(index, 1);
  }
}

function emitPluginChange() {
  const { pluginChangeHandlers } = getGlobalStore();

  pluginChangeHandlers.forEach(handler => {
    handler(getPlugins());
  });
}
