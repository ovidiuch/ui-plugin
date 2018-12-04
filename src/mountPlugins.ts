import { merge } from 'lodash';
import { getPluginStore } from './pluginStore';
import {
  IPluginConfigs,
  IPluginContext,
  IPluginScope,
  IPluginStates,
} from './types';

// This method could also be called "createPluginContext", but is not perfectly
// accurate because each plugin will have its own context
export function mountPlugins({
  config,
  state,
}: { config?: IPluginConfigs; state?: IPluginStates } = {}) {
  // TODO: unmount plugins if mountPlugins is called again

  const { defaultConfigs, initialStates, initHandlers } = getPluginStore();

  const pluginScope: IPluginScope = {
    unmounted: false,
    config: merge({}, defaultConfigs, config),
    state: merge({}, initialStates, state),
  };

  const unmountHandlers: Array<() => unknown> = [];

  // Run all "init" handlers
  Object.keys(initHandlers).forEach(pluginName => {
    initHandlers[pluginName].forEach(handler => {
      const returnCb = handler(getPluginContext(pluginScope, pluginName));

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
  pluginScope: IPluginScope,
  pluginName: string,
): IPluginContext<object, any> {
  return {
    getConfig: () => pluginScope.config[pluginName],
    getConfigOf: otherPluginName => pluginScope.config[otherPluginName],
    getState: () => pluginScope.state[pluginName],
    getStateOf: otherPluginName => pluginScope.state[otherPluginName],
    setState: (change, cb) => {
      const prevState = pluginScope.state[pluginName];

      pluginScope.state[pluginName] =
        typeof change === 'function' ? change(prevState) : change;

      if (typeof cb === 'function') {
        cb();
      }
    },
    callMethod: (methodName, ...args) => {
      // TODO: Call method (requires pluginStore)
    },
    emitEvent: (eventName, ...args) => {
      // TODO: Emit event (requires pluginStore)
    },
  };
}
