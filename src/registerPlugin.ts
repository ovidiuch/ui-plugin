import { getPluginStore } from './pluginStore';
import { EventHandler, InitHandler, MethodHandler } from './shared';

interface IPluginApi<PluginConfig extends object, PluginState> {
  init: (handler: InitHandler<PluginConfig, PluginState>) => void;
  method: (
    methodName: string,
    handler: MethodHandler<PluginConfig, PluginState>,
  ) => void;
  on: (
    eventPath: string,
    handler: EventHandler<PluginConfig, PluginState>,
  ) => void;
  // TODO: onStateChange
}

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
