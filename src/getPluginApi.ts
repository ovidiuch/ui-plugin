import {
  registerEventHandler,
  registerInitHandler,
  registerMethodHandler,
} from './pluginStore';
import { IPluginApi, PluginId } from './shared';

export function getPluginApi<PluginConfig extends object, PluginState>(
  pluginId: PluginId,
): IPluginApi<PluginConfig, PluginState> {
  return {
    pluginId,
    init: handler => {
      registerInitHandler({ pluginId, handler });
    },
    method: (methodName, handler) => {
      registerMethodHandler({ pluginId, methodName, handler });
    },
    on: (eventPath, handler) => {
      registerEventHandler({ pluginId, eventPath, handler });
    },
  };
}
