import { getPluginChangeHandlers } from './pluginStore';
import { PluginChangeHandler, removeHandler } from './shared';

export function onPluginChange(handler: PluginChangeHandler) {
  const pluginChangeHandlers = getPluginChangeHandlers();
  pluginChangeHandlers.push(handler);

  return () => {
    removeHandler(pluginChangeHandlers, handler);
  };
}
