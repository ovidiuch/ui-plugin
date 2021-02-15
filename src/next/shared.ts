import { Json, StateUpdater } from '../types/shared';

export function getEventKey(pluginName: string, eventName: string) {
  return `${pluginName}.${eventName}`;
}

export function updateState<T extends Json>(
  prevState: T,
  newState: StateUpdater<T>,
): T {
  return typeof newState === 'function' ? newState(prevState) : newState;
}
