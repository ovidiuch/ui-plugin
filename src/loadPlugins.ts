import { find } from 'lodash';
import {
  exposeLoadedScope,
  getPlugins,
  getStateChangeHandlers,
  unloadPlugins,
} from './pluginStore';
import {
  ILoadPluginsOpts,
  IPluginConfigs,
  IPluginContext,
  IPlugins,
  IPluginScope,
  IPluginStates,
  StateUpdater,
} from './shared';

export function loadPlugins(opts: ILoadPluginsOpts = {}) {
  // Ensure calling loadPlugins more than once doesn't duplicate plugin
  // execution
  unloadPlugins();

  let loadedScope: null | IPluginScope = null;
  createScope();

  function unload() {
    if (loadedScope) {
      runUnloadHandlers(loadedScope);
      loadedScope = null;
    }
  }

  // The difference between calling "loadPlugins" and "reload" is this:
  // - loadPlugins() requires params (config, state)
  // - reload() reloads plugins using the same params already passed to
  //   loadPlugins, and thus reload() is only available after loadPlugins was
  //   called
  // - reload() preserves previously accumulated state
  function reload() {
    if (!loadedScope) {
      throw new Error('Trying to reload unloaded plugins');
    }

    const prevState = loadedScope.state;
    unload();
    createScope(prevState);
  }

  function createScope(prevState?: IPluginStates) {
    const plugins = { ...getPlugins() };
    const scope = {
      plugins,
      // The merger of the default config with the optional passed-in config makes
      // up the (immutable) config this scope is bound to
      config: createScopeConfig(plugins, opts.config),
      // The merger of the initial state with the optional passed-in state makes
      // up the start value of the (mutable) state this scope is bound to
      // TODO: prevState
      state: createScopeState(plugins, opts.state, prevState),
      unloadHandlers: [],
      unload,
      reload,
      getPluginContext,
    };

    // There can only be one active plugin scope at a time
    loadedScope = scope;
    exposeLoadedScope(scope);

    runInitHandlers(scope);
  }

  // TODO: Memoize plugin context per plugin name (bound to this scope)
  function getPluginContext(pluginName: string): IPluginContext<object, any> {
    function getConfig() {
      if (!loadedScope) {
        throw new Error(`Not loaded plugin ${pluginName} called getConfig`);
      }

      return loadedScope.config[pluginName];
    }

    function getConfigOf(otherPluginName: string) {
      if (!loadedScope) {
        throw new Error(`Not loaded plugin ${pluginName} called getConfigOf`);
      }

      const { plugins, config } = loadedScope;

      if (!plugins[otherPluginName]) {
        throw new Error(
          `Requested config of missing plugin ${otherPluginName}`,
        );
      }

      if (getEnabledPluginNames(plugins).indexOf(otherPluginName) === -1) {
        throw new Error(
          `Requested config of disabled plugin ${otherPluginName}`,
        );
      }

      return config[otherPluginName];
    }

    function getState() {
      if (!loadedScope) {
        throw new Error(`Not loaded plugin ${pluginName} called getState`);
      }

      const { state } = loadedScope;

      return state[pluginName];
    }

    function getStateOf(otherPluginName: string) {
      if (!loadedScope) {
        throw new Error(`Not loaded plugin ${pluginName} called getStateOf`);
      }

      const { plugins, state } = loadedScope;

      if (!plugins[otherPluginName]) {
        throw new Error(`Requested state of missing plugin ${otherPluginName}`);
      }

      if (getEnabledPluginNames(plugins).indexOf(otherPluginName) === -1) {
        throw new Error(
          `Requested state of disabled plugin ${otherPluginName}`,
        );
      }

      return state[otherPluginName];
    }

    function setState(change: StateUpdater<any>, cb?: () => void) {
      if (!loadedScope) {
        throw new Error(`Not loaded plugin ${pluginName} called setState`);
      }

      const { state } = loadedScope;

      state[pluginName] = updateState(state[pluginName], change);

      // Trigger all state change handlers
      getStateChangeHandlers().forEach(handler => {
        handler();
      });

      if (typeof cb === 'function') {
        cb();
      }
    }

    function callMethod(methodPath: string, ...args: Array<unknown>): any {
      if (!loadedScope) {
        throw new Error(
          `Not loaded plugin ${pluginName} called method ${methodPath}`,
        );
      }

      const { plugins } = loadedScope;
      const [otherPluginName, methodName] = methodPath.split('.');

      if (!plugins[otherPluginName]) {
        throw new Error(
          `Called method ${methodName} of missing plugin ${otherPluginName}`,
        );
      }

      if (getEnabledPluginNames(plugins).indexOf(otherPluginName) === -1) {
        throw new Error(
          `Called method ${methodName} of disabled plugin ${otherPluginName}`,
        );
      }

      const { methodHandlers } = plugins[otherPluginName];
      const methodHandler = find(
        methodHandlers,
        i => i.methodName === methodName,
      );

      if (!methodHandler) {
        throw new Error(
          `Called missing method ${methodName} of plugin ${otherPluginName}`,
        );
      }

      return methodHandler.handler(getPluginContext(otherPluginName), ...args);
    }

    function emitEvent(eventName: string, ...args: Array<unknown>) {
      if (!loadedScope) {
        throw new Error(
          `Not loaded plugin ${pluginName} emitted event ${eventName}`,
        );
      }

      const { plugins } = loadedScope;
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

  function runInitHandlers(scope: IPluginScope) {
    const { plugins, unloadHandlers } = scope;

    getEnabledPluginNames(plugins).forEach(pluginName => {
      plugins[pluginName].initHandlers.forEach(handler => {
        const returnCb = handler(getPluginContext(pluginName));

        if (typeof returnCb === 'function') {
          // Collect unload handlers from this scope
          unloadHandlers.push(returnCb);
        }
      });
    });
  }

  function runUnloadHandlers(scope: IPluginScope) {
    scope.unloadHandlers.forEach(handler => handler());
    scope.unloadHandlers = [];
  }
}

function createScopeConfig(
  plugins: IPlugins,
  customConfig: undefined | IPluginConfigs,
): IPluginConfigs {
  return getEnabledPluginNames(plugins).reduce(
    (acc, pluginName) => ({
      ...acc,
      [pluginName]: Object.assign(
        {},
        plugins[pluginName].defaultConfig,
        (customConfig && customConfig[pluginName]) || {},
      ),
    }),
    {},
  );
}

function createScopeState(
  plugins: IPlugins,
  customState: undefined | IPluginStates,
  prevState: undefined | IPluginStates,
): IPluginStates {
  return getEnabledPluginNames(plugins).reduce(
    (acc, pluginName) => ({
      ...acc,
      [pluginName]:
        (prevState && prevState[pluginName]) ||
        (customState && customState[pluginName]) ||
        plugins[pluginName].initialState,
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
