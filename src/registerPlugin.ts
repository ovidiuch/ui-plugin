import {
  addEventHandler,
  addInitHandler,
  addMethodHandler,
  addPlugin,
  addStateHandler,
} from './pluginStore';
import {
  EventHandler,
  InitHandler,
  IPluginDef,
  MethodHandler,
  StateHandler,
} from './shared';

export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
) {
  const { name, enabled = true, defaultConfig = {}, initialState } = pluginDef;

  addPlugin({
    name,
    enabled,
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

  function onState(handler: StateHandler<PluginConfig, PluginState>) {
    addStateHandler({ pluginName: name, handler });
  }

  return {
    init,
    method,
    on,
    onState,
  };
}
