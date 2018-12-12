import {
  addEventHandler,
  addInitHandler,
  addMethodHandler,
  createPlugin,
  getLoadedScope,
  reloadPlugins,
} from './pluginStore';
import { EventHandler, InitHandler, IPluginDef, MethodHandler } from './shared';

export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
) {
  const { name, enabled = true, defaultConfig = {}, initialState } = pluginDef;

  createPlugin({
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

  if (getLoadedScope()) {
    // Wait until all the plugin parts have been registered using the API
    // returned by this function (eg. init, method, on, etc). All such calls
    // must occur right after this one (synchronously) for the automatic
    // activation of this plugin to work properly.
    setTimeout(reloadPlugins, 0);
  }

  return {
    init,
    method,
    on,
  };
}
