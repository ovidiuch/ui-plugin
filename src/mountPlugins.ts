import { find, merge } from 'lodash';
import { getPlugins, setUnmountCallback, unmountPlugins } from './pluginStore';
import {
  IPluginConfigs,
  IPluginContext,
  IPluginMountOpts,
  IPluginStates,
  StateUpdater,
} from './shared';

export function mountPlugins({ config, state }: IPluginMountOpts = {}) {
  // Ensure mounting more than once doesn't duplicate plugin execution
  unmountPlugins();

  const plugins = getPlugins();
  const pluginNames = Object.keys(plugins);

  const defaultConfigs: IPluginConfigs = {};
  pluginNames.forEach(pluginName => {
    defaultConfigs[pluginName] = plugins[pluginName].defaultConfig;
  });

  const initialStates: IPluginStates = {};
  pluginNames.forEach(pluginName => {
    initialStates[pluginName] = plugins[pluginName].initialState;
  });

  // The unmounted flag helps detect plugin execution that leaks after plugins
  // have been unmounted
  let unmounted = false;

  // The merger of the default config with the optional passed-in config makes
  // up the (immutable) config this scope is bound to
  const activeConfig = merge({}, defaultConfigs, config);

  // The merger of the initial state with the optional passed-in state makes
  // up the start value of the (mutable) state this scope is bound to
  let activeState = merge({}, initialStates, state);

  // Collect unmount handlers from this scope
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

  const unmount = () => {
    // Mark scope as unmounted
    unmounted = true;

    // Run all "init" handler return handlers and remove their references
    unmountHandlers.forEach(handler => handler());
    unmountHandlers = [];
  };

  // There can only be one active plugin scope at a time. We bind the unmount
  // callback of this scope globally to call it when re-mounting.
  setUnmountCallback(unmount);

  // TODO: Memoize plugin context per plugin name (bound to this scope)
  function getPluginContext(pluginName: string): IPluginContext<object, any> {
    function getConfig() {
      return activeConfig[pluginName];
    }

    function getConfigOf(otherPluginName: string) {
      return activeConfig[otherPluginName];
    }

    function getState() {
      return activeState[pluginName];
    }

    function getStateOf(otherPluginName: string) {
      return activeState[otherPluginName];
    }

    function setState(change: StateUpdater<any>, cb?: () => void) {
      if (unmounted) {
        throw new Error(`Unmounted plugin ${pluginName} called setState`);
      }

      activeState = {
        ...activeState,
        [pluginName]: updateState(activeState[pluginName], change),
      };

      // Trigger all state change handlers
      pluginNames.forEach(otherPluginName => {
        plugins[otherPluginName].stateHandlers.forEach(handler => {
          handler(getPluginContext(otherPluginName));
        });
      });

      if (typeof cb === 'function') {
        cb();
      }
    }

    function callMethod(methodPath: string, ...args: Array<unknown>): any {
      if (unmounted) {
        throw new Error(
          `Unmounted plugin ${pluginName} called method ${methodPath}`,
        );
      }

      const [otherPluginName, methodName] = methodPath.split('.');

      if (!plugins[otherPluginName]) {
        throw new Error(`Plugin not found ${otherPluginName}`);
      }

      const { methodHandlers } = plugins[otherPluginName];
      const methodHandler = find(
        methodHandlers,
        i => i.methodName === methodName,
      );

      if (!methodHandler) {
        throw new Error(`Method not found ${methodPath}`);
      }

      return methodHandler.handler(getPluginContext(otherPluginName), ...args);
    }

    function emitEvent(eventName: string, ...args: Array<unknown>) {
      if (unmounted) {
        throw new Error(
          `Unmounted plugin ${pluginName} emitted event ${eventName}`,
        );
      }

      pluginNames.forEach(otherPluginName => {
        plugins[otherPluginName].eventHandlers.forEach(eventHandler => {
          const { eventPath, handler } = eventHandler;
          const [curEventPluginName, curEventName] = eventPath.split('.');

          if (curEventPluginName === pluginName && curEventName === eventName) {
            handler(getPluginContext(otherPluginName), ...args);
          }
        });
      });
    }

    return {
      getConfig,
      getConfigOf,
      getState,
      getStateOf,
      setState,
      callMethod,
      emitEvent,
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
