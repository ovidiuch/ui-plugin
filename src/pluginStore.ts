import { getGlobalStore, IMountedApi } from './global';
import { EventHandler, InitHandler, MethodHandler } from './shared';

export function resetPlugins() {
  unmountPlugins();
  getGlobalStore().plugins = {};
}

export function exposeMountedApi(mountedApi: IMountedApi) {
  const store = getGlobalStore();
  store.mountedApi = mountedApi;
}

export function unmountPlugins() {
  const store = getGlobalStore();

  if (store.mountedApi) {
    store.mountedApi.unmount();
    store.mountedApi = null;
  }
}

export function getPlugins() {
  return getGlobalStore().plugins;
}

export function enablePlugin(pluginName: string, enabled: boolean) {
  const store = getGlobalStore();
  const plugin = getPlugin(pluginName);

  store.plugins[pluginName] = {
    ...plugin,
    enabled,
  };

  if (store.mountedApi) {
    store.mountedApi.reload();
  }
}

export function getPluginContext(pluginName: string) {
  const { mountedApi } = getGlobalStore();

  if (!mountedApi) {
    throw new Error('getPluginContext called before mounting plugins');
  }

  return mountedApi.getPluginContext(pluginName);
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
  const { plugins } = getGlobalStore();

  plugins[name] = {
    enabled,
    defaultConfig,
    initialState,
    initHandlers: [],
    methodHandlers: [],
    eventHandlers: [],
    stateHandlers: [],
  };
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
  handler: EventHandler<any, any>;
}) {
  const { stateHandlers } = getPlugin(pluginName);
  stateHandlers.push(handler);
}

function getPlugin(pluginName: string) {
  const { plugins } = getGlobalStore();

  if (!plugins[pluginName]) {
    throw new Error(`Plugin not found ${pluginName}`);
  }

  return plugins[pluginName];
}
