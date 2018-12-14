import { PluginId } from '../shared';

let lastPluginId = 0;

export function getNextPluginId(): PluginId {
  return ++lastPluginId;
}
