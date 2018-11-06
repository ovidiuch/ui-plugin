import { IPluginContext, StateGet } from './PluginContext';

type Handler<PluginState> = (
  pluginContext: IPluginContext<PluginState>,
) => unknown;

type UnsubscribeHandler<PluginState> = (
  pluginContext: IPluginContext<PluginState>,
) => () => unknown;

export interface IPluginConfig<PluginState> {
  readonly name: string;
  readonly getInitialState: StateGet<PluginState>;
  readonly init?: Array<UnsubscribeHandler<PluginState>>;
  readonly methods?: {
    [name: string]: Array<Handler<PluginState>>;
  };
  readonly listeners?: {
    [eventName: string]: Array<Handler<PluginState>>;
  };
}
