import { createPlugin, loadPlugins, getPluginContext } from '..';

interface ITerry {
  name: 'terry';
  config: { size: number };
}

it('gets config', () => {
  createPlugin<ITerry>({
    name: 'terry',
    defaultConfig: { size: 5 },
  }).register();

  loadPlugins({ config: { terry: { size: 10 } } });
  const { getConfig } = getPluginContext<ITerry>('terry');

  const size: number = getConfig().size;
  expect(size).toBe(10);
});
