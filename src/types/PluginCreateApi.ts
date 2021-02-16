import {
  PluginEventHandlers,
  PluginLoadHandler,
} from './PluginContextHandlers';
import { PluginSpec, PluginWithEvents } from './PluginSpec';

type On<T extends PluginSpec> = <TEmitter extends PluginWithEvents>(
  otherPluginName: TEmitter['name'],
  handlers: PluginEventHandlers<T, TEmitter['events']>,
) => void;

export interface PluginCreateApi<T extends PluginSpec> {
  onLoad: (handler: PluginLoadHandler<T>) => void;
  on: On<T>;
  register: () => void;
}
