export type StateUpdater<State> = State | ((prevState: State) => State);
