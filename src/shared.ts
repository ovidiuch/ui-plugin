export type StateUpdater<State> = State | ((prevState: State) => State);

export interface IPluginConfigs {
  [pluginName: string]: object;
}

export interface IPluginStates {
  [pluginName: string]: any;
}
