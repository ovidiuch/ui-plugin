export function getEventKey(pluginName: string, eventName: string) {
  return `${pluginName}.${eventName}`;
}

export function removeHandler<H>(handlers: H[], handler: H) {
  const index = handlers.indexOf(handler);

  if (index !== -1) {
    handlers.splice(index, 1);
  }
}
