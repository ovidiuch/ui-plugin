import { getStateChangeHandlers } from './pluginStore';
import { removeHandler, StateChangeHandler } from './shared';

export function onStateChange(handler: StateChangeHandler) {
  const stateChangeHandlers = getStateChangeHandlers();
  stateChangeHandlers.push(handler);

  return () => {
    removeHandler(stateChangeHandlers, handler);
  };
}
