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

  // The unmounted flag helps detect plugin execution that leaks after plugins
  // have been unmounted
  let unmounted = false;

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
    unmounted = true;

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
