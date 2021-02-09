import { Json } from './shared';

export type PluginSpecConfig = Record<string, Json>;

export type PluginSpecState = Record<string, Json>;

export type PluginSpecMethods = Record<string, (...args: any) => unknown>;

export type PluginSpecEvents = Record<string, (...args: any) => void>;

export interface PluginSpec {
  name: string;
  config?: PluginSpecConfig;
  state?: PluginSpecState;
  methods?: PluginSpecMethods;
  events?: PluginSpecEvents;
}
