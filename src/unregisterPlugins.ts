import { resetPluginStore } from './pluginStore';

export function unregisterPlugins() {
  // TODO: Unmount plugin scope
  resetPluginStore();
}
