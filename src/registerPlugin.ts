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
      registerPluginHandler(initHandlers, pluginName, handler);
    },
    method: (methodName, handler) => {
      registerPluginHandler(methodHandlers, pluginName, {
        methodName,
        handler,
      });
    },
    on: (eventName, handler) => {
      registerPluginHandler(eventHandlers, pluginName, {
        eventName,
        handler,
      });
    },
  };
}

function registerPluginHandler<T>(
  handlers: { [pluginName: string]: T[] },
  pluginName: string,
  entry: T,
) {
  if (!handlers[pluginName]) {
    handlers[pluginName] = [];
  }

  handlers[pluginName].push(entry);
}
