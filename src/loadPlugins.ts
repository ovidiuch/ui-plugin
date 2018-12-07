import { find, merge } from 'lodash';
import { exposeLoadedScope, getPlugins, unloadPlugins } from './pluginStore';
import {
  ILoadPluginsOpts,
  IPluginConfigs,
  IPluginContext,
  IPlugins,
  IPluginStates,
  StateUpdater,
} from './shared';

type UnloadHandlers = () => unknown;

interface IPluginScope {
  plugins: IPlugins;
  // The merger of the default config with the optional passed-in config makes
  // up the (immutable) config this scope is bound to
  config: IPluginConfigs;
  // The merger of the initial state with the optional passed-in state makes
  // up the start value of the (mutable) state this scope is bound to
  state: IPluginStates;
  // Collect unload handlers from this scope
  unloadHandlers: UnloadHandlers[];
}

export function loadPlugins(opts: ILoadPluginsOpts = {}) {
  // Ensure calling loadPlugins more than once doesn't duplicate plugin
  // execution
  unloadPlugins();

  let scope: null | IPluginScope = null;

  // There can only be one active plugin scope at a time
  exposeLoadedScope({
    unload,
    reload,
    getPluginContext,
  });

  load();

  function load() {
    scope = createScope(opts);
    const { plugins, unloadHandlers } = scope;

    // Run all "init" handlers
    getEnabledPluginNames(plugins).forEach(pluginName => {
      plugins[pluginName].initHandlers.forEach(handler => {
        const returnCb = handler(getPluginContext(pluginName));

        if (typeof returnCb === 'function') {
          unloadHandlers.push(returnCb);
        }
      });
    });
  }

  function unload() {
    if (scope) {
      // Run all "init" handler return handlers and remove their references
      scope.unloadHandlers.forEach(handler => handler());
      scope.unloadHandlers = [];

      scope = null;
    }
  }

  function reload() {
    unload();
    load();
  }

  // TODO: Memoize plugin context per plugin name (bound to this scope)
  function getPluginContext(pluginName: string): IPluginContext<object, any> {
    function getConfig() {
      if (!scope) {
        throw new Error(`Not loaded plugin ${pluginName} called getConfig`);
      }

      return scope.config[pluginName];
    }

    function getConfigOf(otherPluginName: string) {
      if (!scope) {
        throw new Error(`Not loaded plugin ${pluginName} called getConfigOf`);
      }

      const { plugins, config } = scope;

      if (getEnabledPluginNames(plugins).indexOf(otherPluginName) === -1) {
        throw new Error(
          `Requested config of missing plugin ${otherPluginName}`,
        );
      }

      return config[otherPluginName];
    }

    function getState() {
      if (!scope) {
        throw new Error(`Not loaded plugin ${pluginName} called getState`);
      }

      const { state } = scope;

      return state[pluginName];
    }

    function getStateOf(otherPluginName: string) {
      if (!scope) {
        throw new Error(`Not loaded plugin ${pluginName} called getStateOf`);
      }

      const { plugins, state } = scope;

      if (getEnabledPluginNames(plugins).indexOf(otherPluginName) === -1) {
        throw new Error(`Requested state of missing plugin ${otherPluginName}`);
      }

      return state[otherPluginName];
    }

    function setState(change: StateUpdater<any>, cb?: () => void) {
      if (!scope) {
        throw new Error(`Not loaded plugin ${pluginName} called setState`);
      }

      const { plugins, state } = scope;

      state[pluginName] = updateState(state[pluginName], change);

      // Trigger all state change handlers
      getEnabledPluginNames(plugins).forEach(otherPluginName => {
        plugins[otherPluginName].stateHandlers.forEach(handler => {
          handler(getPluginContext(otherPluginName));
        });
      });

      if (typeof cb === 'function') {
        cb();
      }
    }

    function callMethod(methodPath: string, ...args: Array<unknown>): any {
      if (!scope) {
        throw new Error(
          `Not loaded plugin ${pluginName} called method ${methodPath}`,
        );
      }

      const { plugins } = scope;
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
      if (!scope) {
        throw new Error(
          `Not loaded plugin ${pluginName} emitted event ${eventName}`,
        );
      }

      const { plugins } = scope;
      getEnabledPluginNames(plugins).forEach(otherPluginName => {
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

function createScope(opts: ILoadPluginsOpts): IPluginScope {
  const plugins = getPlugins();

  return {
    plugins,
    config: merge({}, getDefaultConfigs(plugins), opts.config),
    state: merge({}, getInitialStates(plugins), opts.state),
    unloadHandlers: [],
  };
}

function getDefaultConfigs(plugins: IPlugins): IPluginConfigs {
  return getEnabledPluginNames(plugins).reduce(
    (acc, pluginName) => ({
      ...acc,
      [pluginName]: plugins[pluginName].defaultConfig,
    }),
    {},
  );
}

function getInitialStates(plugins: IPlugins): IPluginStates {
  return getEnabledPluginNames(plugins).reduce(
    (acc, pluginName) => ({
      ...acc,
      [pluginName]: plugins[pluginName].initialState,
    }),
    {},
  );
}

function getEnabledPluginNames(plugins: IPlugins): string[] {
  return Object.keys(plugins).filter(pluginName => plugins[pluginName].enabled);
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
