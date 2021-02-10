export type Callback = () => unknown;

export type Json = string | number | boolean | null | { [property: string]: Json } | Json[];

export type StateUpdater<T extends Json> = T | ((prevState: T) => T);
