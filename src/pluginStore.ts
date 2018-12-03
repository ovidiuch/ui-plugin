import { IPluginStore } from './types';

// TODO: Attach to global namespace
const pluginStore = {
  defaultConfigs: {},
  initialStates: {},
  initHandlers: {},
  methodHandlers: {},
  eventHandlers: {},
};

export function getPluginStore(): IPluginStore {
  return pluginStore;
}
