export type Callback = () => unknown;

export type UnknownRecord = Record<string, unknown>;

export type StateUpdater<T extends UnknownRecord> = T | ((prevState: T) => T);
