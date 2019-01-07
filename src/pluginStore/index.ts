import {
  EventHandler,
  InitHandler,
  IPlugin,
  IPluginDef,
  IPluginScope,
  MethodHandler,
} from '../shared';
import { getGlobalStore, resetGlobalStore } from './global';

// Meant for testing cleanup purposes
export function resetPlugins() {
  unloadPlugins();
  resetGlobalStore();
}

// Unregisters plugins but preserves global handlers
export function unregisterPlugins() {
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
  enabled = true,
  defaultConfig = {},
  initialState,
}: IPluginDef<any, any>): IPlugin {
  const { plugins } = getGlobalStore();

  if (plugins[name]) {
    throw new Error(`Plugin already registered: ${name}`);
  }

  const plugin = {
    name,
    enabled,
    defaultConfig,
    initialState,
    initHandlers: [],
    methodHandlers: [],
    eventHandlers: [],
  };
  plugins[name] = plugin;

  if (enabled && getLoadedScope()) {
    // Wait until all the plugin parts have been registered using the plugin
    // API (init, method, on, etc). All such calls must occur right after this
    // one (synchronously) for the automatic activation of this plugin to work
    // properly.
    schedulePluginsReload();
  }

  return plugin;
}

export function updatePlugin(
  pluginName: string,
  change: (plugin: IPlugin) => IPlugin,
) {
  const { plugins } = getGlobalStore();
  const plugin = getExpectedPlugin(pluginName);

  plugins[pluginName] = change(plugin);
}

export function registerInitHandler({
  pluginName,
  handler,
}: {
  pluginName: string;
  handler: InitHandler<any, any>;
}) {
  const plugin = getExpectedPlugin(pluginName);

  if (isPluginLoaded(pluginName)) {
    throw new Error('Registered init handler after plugin loaded');
  }

  plugin.initHandlers.push(handler);
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
  const plugin = getExpectedPlugin(pluginName);

  if (isPluginLoaded(pluginName)) {
    throw new Error('Registered method after plugin loaded');
  }

  plugin.methodHandlers.push({ methodName, handler });
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
  const plugin = getExpectedPlugin(pluginName);

  if (isPluginLoaded(pluginName)) {
    throw new Error('Registered event handler after plugin loaded');
  }

  plugin.eventHandlers.push({ eventPath, handler });
}

export function emitPluginChange() {
  const { pluginChangeHandlers } = getGlobalStore();

  pluginChangeHandlers.forEach(handler => {
    handler(getPlugins());
  });
}

export function isPluginLoaded(pluginName: string) {
  const { loadedScope } = getGlobalStore();

  return loadedScope && loadedScope.plugins[pluginName];
}

function getExpectedPlugin(pluginName: string) {
  const { plugins } = getGlobalStore();

  if (!plugins[pluginName]) {
    throw new Error(`Plugin not found: ${pluginName}`);
  }

  return plugins[pluginName];
}

let reloadTimeoutId: null | number = null;

function schedulePluginsReload() {
  clearReloadTimeout();
  reloadTimeoutId = setTimeout(reloadPlugins, 0);
}

function clearReloadTimeout() {
  if (reloadTimeoutId !== null) {
    clearTimeout(reloadTimeoutId);
    reloadTimeoutId = null;
  }
}
