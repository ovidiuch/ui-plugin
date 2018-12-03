import { getPluginStore } from './pluginStore';

export function unregisterPlugins() {
  const {
    defaultConfigs,
    initialStates,
    initHandlers,
    methodHandlers,
    eventHandlers,
  } = getPluginStore();

  // unmount all plugins

  // Remove all plugins from store
  Object.keys(defaultConfigs).forEach(pluginName => {
    delete defaultConfigs[pluginName];
    delete initialStates[pluginName];
    delete initHandlers[pluginName];
    delete methodHandlers[pluginName];
    delete eventHandlers[pluginName];
  });
}
