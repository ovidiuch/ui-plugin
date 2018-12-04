import { find, merge } from 'lodash';
import { getPluginStore } from './pluginStore';
import {
  IPluginConfigs,
  IPluginContext,
  IPluginScope,
  IPluginStates,
} from './types';
import { IPlugins } from './types/PluginStore';

export function mountPlugins({
  config,
  state,
}: { config?: IPluginConfigs; state?: IPluginStates } = {}) {
  // TODO: unmount plugins if mountPlugins is called again

  const { plugins } = getPluginStore();
  const pluginNames = Object.keys(plugins);

  const defaultConfigs: IPluginConfigs = {};
  pluginNames.forEach(pluginName => {
    defaultConfigs[pluginName] = plugins[pluginName].defaultConfig;
  });

  const initialStates: IPluginStates = {};
  pluginNames.forEach(pluginName => {
    initialStates[pluginName] = plugins[pluginName].initialState;
  });

  const pluginScope: IPluginScope = {
    unmounted: false,
    config: merge({}, defaultConfigs, config),
    state: merge({}, initialStates, state),
  };

  const unmountHandlers: Array<() => unknown> = [];

  // Run all "init" handlers
  pluginNames.forEach(pluginName => {
    plugins[pluginName].initHandlers.forEach(handler => {
      const returnCb = handler(
        getPluginContext(plugins, pluginScope, pluginName),
      );

      if (typeof returnCb === 'function') {
        unmountHandlers.push(returnCb);
      }
    });
  });

  // TODO: Attach unmountPlugins to store, so it can be called in unregisterPlugins?
  const unmountPlugins = () => {
    // Mark scope as unmounted
    pluginScope.unmounted = true;

    // Run all "init" handler return handlers
    unmountHandlers.forEach(handler => handler());

    // TODO: Remove unmountPlugins reference
  };

  return unmountPlugins;
}

// TODO: Memoize per pluginScope & pluginName?
function getPluginContext(
  plugins: IPlugins,
  pluginScope: IPluginScope,
  pluginName: string,
): IPluginContext<object, any> {
  return {
    getConfig: () => pluginScope.config[pluginName],
    getConfigOf: otherPluginName => pluginScope.config[otherPluginName],
    getState: () => pluginScope.state[pluginName],
    getStateOf: otherPluginName => pluginScope.state[otherPluginName],
    setState: (change, cb) => {
      pluginScope.state[pluginName] = updateState(
        pluginScope.state[pluginName],
        change,
      );

      if (typeof cb === 'function') {
        cb();
      }
    },
    callMethod: (methodPath, ...args) => {
      const [otherPluginName, methodName] = methodPath.split('.');

      const methodHandler = find(
        plugins[otherPluginName].methodHandlers,
        i => i.methodName === methodName,
      );

      if (!methodHandler) {
        // TODO: Throw
        return;
      }

      return methodHandler.handler(
        getPluginContext(plugins, pluginScope, otherPluginName),
        ...args,
      );
    },
    emitEvent: (eventName, ...args) => {
      Object.keys(plugins).forEach(otherPluginName => {
        plugins[otherPluginName].eventHandlers.forEach(i => {
          if (i.eventName === eventName) {
            i.handler(
              getPluginContext(plugins, pluginScope, otherPluginName),
              ...args,
            );
          }
        });
      });
    },
  };
}

interface INotAFunction {
  call?: never;
}

function updateState<State extends INotAFunction>(
  prevState: State,
  updater: State | ((prevState: State) => State),
): State {
  return typeof updater === 'function' ? updater(prevState) : updater;
}
