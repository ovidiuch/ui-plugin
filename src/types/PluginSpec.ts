import { Json } from './shared';

export type PluginConfig = Record<string, Json>;

export type PluginState = Record<string, Json>;

export type PluginMethods = Record<string, (...args: any) => unknown>;

export type PluginEvents = Record<string, (...args: any) => void>;

export interface PluginSpec {
  name: string;
  config?: PluginConfig;
  state?: PluginState;
  methods?: PluginMethods;
  events?: PluginEvents;
}
