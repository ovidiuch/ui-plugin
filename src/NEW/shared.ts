export function getEventKey(pluginName: string, eventName: string) {
  return `${pluginName}.${eventName}`;
}
