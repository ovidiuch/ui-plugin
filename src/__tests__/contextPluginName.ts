import { createPlugin } from '../createPlugin';
import { getPluginContext, loadPlugins, resetPlugins } from '../loadPlugins';

interface Terry {
  name: 'terry';
}

afterEach(resetPlugins);

it('returns plugin name', () => {
  createPlugin<Terry>({ name: 'terry' }).register();

  loadPlugins();
  const context = getPluginContext<Terry>('terry');
  const pluginName: 'terry' = context.pluginName;
  expect(pluginName).toBe('terry');
});
