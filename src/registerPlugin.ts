import { getPluginStore } from './pluginStore';
import { IPluginApi, IPluginDef } from './types';

export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
): IPluginApi<PluginConfig, PluginState> {
  const { name: pluginName, defaultConfig = {}, initialState } = pluginDef;

  const {
    defaultConfigs,
    initialStates,
    initHandlers,
    methodHandlers,
    eventHandlers,
  } = getPluginStore();

  defaultConfigs[pluginName] = defaultConfig;
  initialStates[pluginName] = initialState;

  return {
    init: handler => {
      pushPluginHandler(initHandlers, pluginName, handler);
    },
    method: (methodName, handler) => {
      mapPluginHandler(methodHandlers, pluginName, methodName, handler);
    },
    on: (eventName, handler) => {
      mapPluginHandler(eventHandlers, pluginName, eventName, handler);
    },
  };
}

function pushPluginHandler<T>(
  handlers: { [pluginName: string]: T[] },
  pluginName: string,
  entry: T,
) {
  if (!handlers[pluginName]) {
    handlers[pluginName] = [];
  }

  handlers[pluginName].push(entry);
}

function mapPluginHandler<T>(
  handlers: { [pluginName: string]: { [entryName: string]: T } },
  pluginName: string,
  entryName: string,
  entry: T,
) {
  if (!handlers[pluginName]) {
    handlers[pluginName] = {};
  }

  handlers[pluginName][entryName] = entry;
}
