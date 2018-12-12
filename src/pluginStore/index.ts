import { EventHandler, InitHandler, IPlugin, MethodHandler } from '../shared';
import { getGlobalStore } from './global';
import { ILoadedScope } from './shared';

// Meant for testing cleanup purposes
export function resetPlugins() {
  unloadPlugins();
  getGlobalStore().plugins = {};
}

export function getPlugins() {
  return getGlobalStore().plugins;
}

export function getPluginChangeHandlers() {
  return getGlobalStore().pluginChangeHandlers;
}

export function getStateChangeHandlers() {
  return getGlobalStore().stateChangeHandlers;
}

export function getLoadedScope(): null | ILoadedScope {
  return getGlobalStore().loadedScope;
}

export function exposeLoadedScope(scope: ILoadedScope) {
  const store = getGlobalStore();
  store.loadedScope = scope;
}

export function reloadPlugins() {
  const store = getGlobalStore();

  if (store.loadedScope) {
    store.loadedScope.reload();
    emitPluginChange();
  }
}

export function unloadPlugins() {
  const store = getGlobalStore();

  if (store.loadedScope) {
    store.loadedScope.unload();
    store.loadedScope = null;
  }
}

export function createPlugin({
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
  const { plugins } = getGlobalStore();

  plugins[name] = {
    name,
    enabled,
    defaultConfig,
    initialState,
    initHandlers: [],
    methodHandlers: [],
    eventHandlers: [],
  };
}

export function updatePlugin(
  pluginName: string,
  change: (plugin: IPlugin) => IPlugin,
) {
  const { plugins } = getGlobalStore();
  const plugin = getPlugin(pluginName);

  plugins[pluginName] = change(plugin);
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

function getPlugin(pluginName: string) {
  const { plugins } = getGlobalStore();

  if (!plugins[pluginName]) {
    throw new Error(`Plugin not found ${pluginName}`);
  }

  return plugins[pluginName];
}

function emitPluginChange() {
  const { pluginChangeHandlers } = getGlobalStore();

  pluginChangeHandlers.forEach(handler => {
    handler(getPlugins());
  });
}
