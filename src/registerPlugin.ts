import { getPluginStore } from './pluginStore';
import { IPluginApi } from './types';

interface IPluginDef<PluginConfig extends object, PluginState> {
  name: string;
  defaultConfig?: PluginConfig;
  initialState?: PluginState;
}

export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
): IPluginApi<PluginConfig, PluginState> {
  const { name, defaultConfig = {}, initialState } = pluginDef;

  const {
    addPlugin,
    addInitHandler,
    addMethodHandler,
    addEventHandler,
  } = getPluginStore();

  addPlugin({
    name,
    defaultConfig,
    initialState,
  });

  return {
    init: handler => {
      addInitHandler({ pluginName: name, handler });
    },
    method: (methodName, handler) => {
      addMethodHandler({ pluginName: name, methodName, handler });
    },
    on: (eventPath, handler) => {
      addEventHandler({ pluginName: name, eventPath, handler });
    },
  };
}
