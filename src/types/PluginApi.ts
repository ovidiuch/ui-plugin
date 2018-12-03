import { PluginHandler } from './PluginHandler';

type RegisterInitHandler<PluginConfig extends object, PluginState> = (
  handler: PluginHandler<PluginConfig, PluginState>,
) => void;

type RegisterMethod<PluginConfig extends object, PluginState> = (
  methodName: string,
  handler: PluginHandler<PluginConfig, PluginState>,
) => any;

type RegisterEventListener<PluginConfig extends object, PluginState> = (
  eventName: string,
  handler: PluginHandler<PluginConfig, PluginState>,
) => any;

export interface IPluginApi<PluginConfig extends object, PluginState> {
  init: RegisterInitHandler<PluginConfig, PluginState>;
  method: RegisterMethod<PluginConfig, PluginState>;
  on: RegisterEventListener<PluginConfig, PluginState>;
  // TODO: onStateChange
}
