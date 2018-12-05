import {
  addEventHandler,
  addInitHandler,
  addMethodHandler,
  addPlugin,
} from './pluginStore';
import { EventHandler, InitHandler, MethodHandler } from './shared';

interface IPluginDef<PluginConfig extends object, PluginState> {
  name: string;
  defaultConfig?: PluginConfig;
  initialState?: PluginState;
}

export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
) {
  const { name, defaultConfig = {}, initialState } = pluginDef;

  addPlugin({
    name,
    defaultConfig,
    initialState,
  });

  function init(handler: InitHandler<PluginConfig, PluginState>) {
    addInitHandler({ pluginName: name, handler });
  }

  function method(
    methodName: string,
    handler: MethodHandler<PluginConfig, PluginState>,
  ) {
    addMethodHandler({ pluginName: name, methodName, handler });
  }

  function on(
    eventPath: string,
    handler: EventHandler<PluginConfig, PluginState>,
  ) {
    addEventHandler({ pluginName: name, eventPath, handler });
  }

  return {
    init,
    method,
    on,
  };
}
