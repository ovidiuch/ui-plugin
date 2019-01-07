import {
  registerEventHandler,
  registerInitHandler,
  registerMethodHandler,
} from './pluginStore';
import { IPluginApi } from './shared';

export function getPluginApi<PluginConfig extends object, PluginState>(
  pluginName: string,
): IPluginApi<PluginConfig, PluginState> {
  return {
    init: handler => {
      registerInitHandler({ pluginName, handler });
    },
    method: (methodName, handler) => {
      registerMethodHandler({ pluginName, methodName, handler });
    },
    on: (eventPath, handler) => {
      registerEventHandler({ pluginName, eventPath, handler });
    },
  };
}
