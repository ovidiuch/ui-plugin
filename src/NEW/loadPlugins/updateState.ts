import { StateUpdater } from '../types';

interface INotAFunction {
  call?: never;
}

export function updateState<State extends INotAFunction>(
  prevState: State,
  updater: StateUpdater<State>,
): State {
  return typeof updater === 'function' ? updater(prevState) : updater;
}
