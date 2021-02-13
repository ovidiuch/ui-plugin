import { PluginEventHandlers, PluginLoadHandler } from './PluginContextHandlers';
import { PluginSpec, PluginSpecEvents } from './PluginSpec';

type On<T extends PluginSpec> = <TEmitter extends PluginSpec>(
  otherPluginName: TEmitter['name'],
  handlers: TEmitter['events'] extends PluginSpecEvents ? PluginEventHandlers<T, TEmitter['events']> : never,
) => void;

export interface PluginCreateApi<T extends PluginSpec> {
  onLoad: (handler: PluginLoadHandler<T>) => void;
  on: On<T>;
  register: () => void;
}
