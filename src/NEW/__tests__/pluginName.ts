import { createPlugin } from '../createPlugin';
import { getPluginContext } from '../getPluginContext';
import { loadPlugins } from '../loadPlugins';

interface ITerry {
  name: 'terry';
}

it('returns plugin name', () => {
  createPlugin<ITerry>({ name: 'terry' }).register();

  const sharedContext = loadPlugins();
  const context = getPluginContext<ITerry>('terry', sharedContext);
  const pluginName: 'terry' = context.pluginName;
  expect(pluginName).toBe('terry');
});
