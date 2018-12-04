import { find, merge } from 'lodash';
import { getPluginStore } from './pluginStore';
import { IPluginContext, StateUpdater } from './shared';

interface IPluginConfigs {
  [pluginName: string]: object;
}

interface IPluginStates {
  [pluginName: string]: any;
}

export function mountPlugins({
  config,
  state,
}: { config?: IPluginConfigs; state?: IPluginStates } = {}) {
  // TODO: Unmount plugins if mountPlugins is called again?

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

  // TODO: Explain
  // let unmounted = false;

  // TODO: Explain
  const activeConfig = merge({}, defaultConfigs, config);

  // TODO: Explain
  let activeState = merge({}, initialStates, state);

  // TODO: Explain
  let unmountHandlers: Array<() => unknown> = [];

  // Run all "init" handlers
  pluginNames.forEach(pluginName => {
    plugins[pluginName].initHandlers.forEach(handler => {
      const returnCb = handler(getPluginContext(pluginName));

      if (typeof returnCb === 'function') {
        unmountHandlers = [...unmountHandlers, returnCb];
      }
    });
  });

  const unmountPlugins = () => {
    // Mark scope as unmounted
    // unmounted = true;

    // Run all "init" handler return handlers
    unmountHandlers.forEach(handler => handler());
  };

  return unmountPlugins;

  // TODO: Memoize per pluginName
  function getPluginContext(pluginName: string): IPluginContext<object, any> {
    function getConfig() {
      return activeConfig[pluginName];
    }

    function getConfigOf(otherPluginName: string) {
      return activeConfig[otherPluginName];
    }

    // TODO: Move plugin context function outside return object literal
    return {
      getConfig,
      getConfigOf,
      getState: () => activeState[pluginName],
      getStateOf: otherPluginName => activeState[otherPluginName],
      setState: (change, cb) => {
        activeState = {
          ...activeState,
          [pluginName]: updateState(activeState[pluginName], change),
        };

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
          throw new Error(`Method not found: ${methodPath}`);
        }

        return methodHandler.handler(
          getPluginContext(otherPluginName),
          ...args,
        );
      },
      emitEvent: (eventName, ...args) => {
        pluginNames.forEach(otherPluginName => {
          plugins[otherPluginName].eventHandlers.forEach(eventHandler => {
            const { eventPath, handler } = eventHandler;
            const [curEventPluginName, curEventName] = eventPath.split('.');

            if (
              curEventPluginName === pluginName &&
              curEventName === eventName
            ) {
              handler(getPluginContext(otherPluginName), ...args);
            }
          });
        });
      },
    };
  }
}

interface INotAFunction {
  call?: never;
}

function updateState<State extends INotAFunction>(
  prevState: State,
  updater: StateUpdater<State>,
): State {
  return typeof updater === 'function' ? updater(prevState) : updater;
}
