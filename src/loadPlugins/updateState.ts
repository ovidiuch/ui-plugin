import { StateUpdater } from '../types';

interface NotAFunction {
  call?: never;
}

export function updateState<State extends NotAFunction>(
  prevState: State,
  updater: StateUpdater<State>,
): State {
  return typeof updater === 'function' ? updater(prevState) : updater;
}
