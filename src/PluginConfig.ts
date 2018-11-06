import { IPluginContext, StateGet } from './PluginContext';

type Handler<State> = (pluginContext: IPluginContext<State>) => unknown;

type UnsubscribeHandler<State> = (
  pluginContext: IPluginContext<State>,
) => () => unknown;

export interface IPluginConfig<State> {
  readonly name: string;
  readonly getInitialState: StateGet<State>;
  readonly init?: Array<UnsubscribeHandler<State>>;
  readonly methods?: {
    [name: string]: Array<Handler<State>>;
  };
  readonly listeners?: {
    [eventName: string]: Array<Handler<State>>;
  };
}
