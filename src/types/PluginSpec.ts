import { UnknownRecord } from './shared';

export type PluginConfig = UnknownRecord;

export type PluginState = UnknownRecord;

export type PluginMethods = Record<string, (...args: any) => unknown>;

export type PluginEvents = Record<string, (...args: any) => void>;

export interface PluginSpec {
  name: string;
  config?: PluginConfig;
  state?: PluginState;
  methods?: PluginMethods;
  events?: PluginEvents;
}

export interface PluginWithEvents extends PluginSpec {
  events: PluginEvents;
}

export interface PluginWithMethods extends PluginSpec {
  methods: PluginMethods;
}
