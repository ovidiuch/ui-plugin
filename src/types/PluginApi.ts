import { IPluginContext } from './PluginContext';

export type InitHandler<PluginConfig extends object, PluginState> = (
  context: IPluginContext<PluginConfig, PluginState>,
) => void | (() => unknown);

export type MethodHandler<PluginConfig extends object, PluginState> = (
  context: IPluginContext<PluginConfig, PluginState>,
  ...args: any[]
) => any;

export type EventHandler<PluginConfig extends object, PluginState> = (
  context: IPluginContext<PluginConfig, PluginState>,
  ...args: any[]
) => void;

export interface IPluginApi<PluginConfig extends object, PluginState> {
  init: (handler: InitHandler<PluginConfig, PluginState>) => void;
  method: (
    eventName: string,
    handler: MethodHandler<PluginConfig, PluginState>,
  ) => void;
  on: (
    eventName: string,
    handler: EventHandler<PluginConfig, PluginState>,
  ) => void;
  // TODO: onStateChange
}
