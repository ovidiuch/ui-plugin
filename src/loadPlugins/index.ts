import { find } from 'lodash';
import {
  exposeLoadedScope,
  getPlugins,
  getStateChangeHandlers,
  unloadPlugins,
} from '../pluginStore';
import {
  ILoadPluginsOpts,
  IPlugin,
  IPluginConfigs,
  IPluginContext,
  IPluginsByName,
  IPluginScope,
  IPluginStates,
  StateUpdater,
} from '../shared';
import { getNextPluginScopeId } from './pluginScopeId';

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
    const plugins = getLoadablePlugins();
    const scope = {
      id: getNextPluginScopeId(),
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
    if (!loadedScope) {
      throw new Error('Requested plugin context with plugins not loaded');
    }

    if (!loadedScope.plugins[pluginName]) {
      throw new Error(
        `Requested plugin context for missing plugin ${pluginName}`,
      );
    }

    const contextScopeId = loadedScope.id;

    function getConfig() {
      if (!loadedScope || loadedScope.id !== contextScopeId) {
        throw new Error(`Not loaded plugin ${pluginName} called getConfig`);
      }

      return loadedScope.config[pluginName];
    }

    function getConfigOf(otherPluginName: string) {
      if (!loadedScope || loadedScope.id !== contextScopeId) {
        throw new Error(`Not loaded plugin ${pluginName} called getConfigOf`);
      }

      const { plugins, config } = loadedScope;

      if (!existsPluginWithName(otherPluginName)) {
        throw new Error(
          `Requested config of missing plugin ${otherPluginName}`,
        );
      }

      if (Object.keys(plugins).indexOf(otherPluginName) === -1) {
        throw new Error(
          `Requested config of disabled plugin ${otherPluginName}`,
        );
      }

      return config[otherPluginName];
    }

    function getState() {
      if (!loadedScope || loadedScope.id !== contextScopeId) {
        throw new Error(`Not loaded plugin ${pluginName} called getState`);
      }

      const { state } = loadedScope;

      return state[pluginName];
    }

    function getStateOf(otherPluginName: string) {
      if (!loadedScope || loadedScope.id !== contextScopeId) {
        throw new Error(`Not loaded plugin ${pluginName} called getStateOf`);
      }

      const { plugins, state } = loadedScope;

      if (!existsPluginWithName(otherPluginName)) {
        throw new Error(`Requested state of missing plugin ${otherPluginName}`);
      }

      if (Object.keys(plugins).indexOf(otherPluginName) === -1) {
        throw new Error(
          `Requested state of disabled plugin ${otherPluginName}`,
        );
      }

      return state[otherPluginName];
    }

    function setState(change: StateUpdater<any>, cb?: () => void) {
      if (!loadedScope || loadedScope.id !== contextScopeId) {
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
      if (!loadedScope || loadedScope.id !== contextScopeId) {
        throw new Error(
          `Not loaded plugin ${pluginName} called method ${methodPath}`,
        );
      }

      const { plugins } = loadedScope;
      const [otherPluginName, methodName] = methodPath.split('.');

      if (!existsPluginWithName(otherPluginName)) {
        throw new Error(
          `Called method ${methodName} of missing plugin ${otherPluginName}`,
        );
      }

      if (Object.keys(plugins).indexOf(otherPluginName) === -1) {
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
      if (!loadedScope || loadedScope.id !== contextScopeId) {
        throw new Error(
          `Not loaded plugin ${pluginName} emitted event ${eventName}`,
        );
      }

      const { plugins } = loadedScope;
      Object.keys(plugins).forEach(otherPluginName => {
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

    Object.keys(plugins).forEach(pluginName => {
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

function getLoadablePlugins(): IPluginsByName {
  return getListOfAllPlugins().reduce((byName, plugin) => {
    if (!plugin.enabled) {
      return byName;
    }

    return {
      ...byName,
      // Last registered plugins override previous plugins which share their
      // name. This allows user plugins to override core plugins.
      [plugin.name]: plugin,
    };
  }, {});
}

function createScopeConfig(
  plugins: IPluginsByName,
  customConfig: undefined | IPluginConfigs,
): IPluginConfigs {
  return Object.keys(plugins).reduce(
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
  plugins: IPluginsByName,
  customState: undefined | IPluginStates,
  prevState: undefined | IPluginStates,
): IPluginStates {
  return Object.keys(plugins).reduce(
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

function existsPluginWithName(pluginName: string) {
  return getListOfAllPlugins().some(plugin => plugin.name === pluginName);
}

function getListOfAllPlugins(): IPlugin[] {
  const allPlugins = getPlugins();

  return Object.keys(allPlugins).map(
    pluginId =>
      // Even though plugins are mapped by pluginId, which is a number, JS
      // coerces object keys into strings
      allPlugins[Number(pluginId)],
  );
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
