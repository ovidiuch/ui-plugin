import { getLoadedScope } from './pluginStore';

export function getPluginContext(pluginName: string) {
  const loadedScope = getLoadedScope();

  if (!loadedScope) {
    throw new Error('getPluginContext called before loading plugins');
  }

  return loadedScope.getPluginContext(pluginName);
}
