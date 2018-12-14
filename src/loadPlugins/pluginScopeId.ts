import { PluginScopeId } from '../shared';

let lastPluginScopeId = 0;

export function getNextPluginScopeId(): PluginScopeId {
  return ++lastPluginScopeId;
}
