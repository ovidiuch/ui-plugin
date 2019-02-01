import { IPluginConfigs, IPluginStates, ISharedPluginContext } from '../types';
import { updateState } from './updateState';

interface IOpts {
  config?: IPluginConfigs;
  state?: IPluginStates;
}

export function initPlugins(opts: IOpts = {}) {
  const sharedContext: ISharedPluginContext = {
    config: opts.config || {},
    state: opts.state || {},

    setState: (pluginName, change, cb) => {
      sharedContext.state[pluginName] = updateState(sharedContext.state[pluginName], change);
      if (cb) {
        cb();
      }
    },
  };

  return sharedContext;
}
