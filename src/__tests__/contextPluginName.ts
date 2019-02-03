import { resetPlugins, createPlugin, loadPlugins, getPluginContext } from '..';

interface ITerry {
  name: 'terry';
}

afterEach(resetPlugins);

it('returns plugin name', () => {
  createPlugin<ITerry>({ name: 'terry' }).register();

  loadPlugins();
  const context = getPluginContext<ITerry>('terry');
  const pluginName: 'terry' = context.pluginName;
  expect(pluginName).toBe('terry');
});
