import {
  EventHandler,
  InitHandler,
  IPlugin,
  IPluginScope,
  MethodHandler,
} from '../shared';
import { getGlobalStore, resetGlobalStore } from './global';

// Meant for testing cleanup purposes
export function resetPlugins() {
  unloadPlugins();
  resetGlobalStore();
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

export function getLoadedScope(): null | IPluginScope {
  return getGlobalStore().loadedScope;
}

export function exposeLoadedScope(scope: IPluginScope) {
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

export function registerInitHandler({
  pluginName,
  handler,
}: {
  pluginName: string;
  handler: InitHandler<any, any>;
}) {
  const { loadedScope } = getGlobalStore();
  const { initHandlers } = getPlugin(pluginName);

  if (loadedScope && loadedScope.plugins[pluginName]) {
    throw new Error('Registered init handler after plugin loaded');
  }

  initHandlers.push(handler);
}

export function registerMethodHandler({
  pluginName,
  methodName,
  handler,
}: {
  pluginName: string;
  methodName: string;
  handler: MethodHandler<any, any>;
}) {
  const { loadedScope } = getGlobalStore();
  const { methodHandlers } = getPlugin(pluginName);

  if (loadedScope && loadedScope.plugins[pluginName]) {
    throw new Error('Registered method after plugin loaded');
  }

  methodHandlers.push({ methodName, handler });
}

export function registerEventHandler({
  pluginName,
  eventPath,
  handler,
}: {
  pluginName: string;
  eventPath: string;
  handler: EventHandler<any, any>;
}) {
  const { loadedScope } = getGlobalStore();
  const { eventHandlers } = getPlugin(pluginName);

  if (loadedScope && loadedScope.plugins[pluginName]) {
    throw new Error('Registered event handler after plugin loaded');
  }

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
