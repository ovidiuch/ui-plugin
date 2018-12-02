import { IPluginApi, IPluginDef, IPluginStore } from './types';

// TODO: Move to pluginStore.js (Abstract global namespace)
const Store: IPluginStore = {
  defaultConfigs: {},
  initialStates: {},
  initHandlers: {},
  methodHandlers: {},
  eventHandlers: {},
};

// TODO: Move to registerPlugin.js
export function registerPlugin<PluginConfig extends object, PluginState>(
  pluginDef: IPluginDef<PluginConfig, PluginState>,
): IPluginApi<PluginConfig, PluginState> {
  const { name: pluginName, defaultConfig = {}, initialState } = pluginDef;

  Store.defaultConfigs[pluginName] = defaultConfig;
  Store.initialStates[pluginName] = initialState;

  return {
    init: handler => {
      registerPluginHandler(Store.initHandlers, pluginName, handler);
    },
    method: (methodName, handler) => {
      registerPluginHandler(Store.methodHandlers, pluginName, {
        methodName,
        handler,
      });
    },
    on: (eventName, handler) => {
      registerPluginHandler(Store.eventHandlers, pluginName, {
        eventName,
        handler,
      });
    },
  };
}

function registerPluginHandler<T>(
  handlers: { [pluginName: string]: T[] },
  pluginName: string,
  entry: T,
) {
  if (!handlers[pluginName]) {
    handlers[pluginName] = [];
  }

  handlers[pluginName].push(entry);
}

// Test usage

const { init, method, on } = registerPlugin({
  name: 'test-plugin',
  defaultConfig: { enabled: false },
  initialState: { name: 'Ron' },
});

init(({ getState }) => {
  // console.log(getState().name);
});

method('doIt', ({ setState }) => {
  setState(() => ({ name: 'Ronnie' }));
});

on('other-plugin.didSomething', ({ getConfig }) => {
  // console.log(getConfig().enabled);
});

// Works
registerPlugin({
  name: 'test-plugin',
});

registerPlugin({
  name: 'test-plugin',
  initialState: false,
});

// Doesn't work
// registerPlugin({
//   name: 'test-plugin',
//   defaultConfig: 3,
// });
