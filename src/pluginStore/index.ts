import {
  EventHandler,
  InitHandler,
  IPlugin,
  IPluginDef,
  IPluginScope,
  MethodHandler,
  PluginId,
} from '../shared';
import { getGlobalStore, resetGlobalStore } from './global';
import { getNextPluginId } from './pluginId';

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
  const id = getNextPluginId();
  const plugin = {
    id,
    name,
    enabled,
    defaultConfig,
    initialState,
    initHandlers: [],
    methodHandlers: [],
    eventHandlers: [],
  };

  const { plugins } = getGlobalStore();
  plugins[id] = plugin;

  if (getLoadedScope()) {
    // Wait until all the plugin parts have been registered using the plugin
    // API (init, method, on, etc). All such calls must occur right after this
    // one (synchronously) for the automatic activation of this plugin to work
    // properly.
    setTimeout(reloadPlugins, 0);
  }

  return plugin;
}

export function updatePlugin(
  pluginId: PluginId,
  change: (plugin: IPlugin) => IPlugin,
) {
  const { plugins } = getGlobalStore();
  const plugin = getExpectedPlugin(pluginId);

  plugins[pluginId] = change(plugin);
}

export function registerInitHandler({
  pluginId,
  handler,
}: {
  pluginId: PluginId;
  handler: InitHandler<any, any>;
}) {
  const plugin = getExpectedPlugin(pluginId);

  if (isPluginLoaded(plugin)) {
    throw new Error('Registered init handler after plugin loaded');
  }

  plugin.initHandlers.push(handler);
}

export function registerMethodHandler({
  pluginId,
  methodName,
  handler,
}: {
  pluginId: PluginId;
  methodName: string;
  handler: MethodHandler<any, any>;
}) {
  const plugin = getExpectedPlugin(pluginId);

  if (isPluginLoaded(plugin)) {
    throw new Error('Registered method after plugin loaded');
  }

  plugin.methodHandlers.push({ methodName, handler });
}

export function registerEventHandler({
  pluginId,
  eventPath,
  handler,
}: {
  pluginId: PluginId;
  eventPath: string;
  handler: EventHandler<any, any>;
}) {
  const plugin = getExpectedPlugin(pluginId);

  if (isPluginLoaded(plugin)) {
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

export function isPluginLoaded({ id, name }: IPlugin) {
  const { loadedScope } = getGlobalStore();

  return (
    loadedScope &&
    loadedScope.plugins[name] &&
    loadedScope.plugins[name].id === id
  );
}

function getExpectedPlugin(pluginId: PluginId) {
  const { plugins } = getGlobalStore();

  if (!plugins[pluginId]) {
    throw new Error(`Plugin not found ${pluginId}`);
  }

  return plugins[pluginId];
}
