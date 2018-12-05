import { getGlobalStore } from './global';
import { EventHandler, InitHandler, MethodHandler } from './shared';

export function resetPlugins() {
  unmountPlugins();
  getGlobalStore().plugins = {};
}

export function setUnmountCallback(cb: () => void) {
  const store = getGlobalStore();
  store.unmount = cb;
}

export function unmountPlugins() {
  const store = getGlobalStore();

  if (typeof store.unmount === 'function') {
    store.unmount();
    store.unmount = null;
  }
}

export function getPlugins() {
  return getGlobalStore().plugins;
}

export function addPlugin({
  name,
  defaultConfig,
  initialState,
}: {
  name: string;
  defaultConfig: object;
  initialState: any;
}) {
  const { plugins } = getGlobalStore();

  plugins[name] = {
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
