import { resetPlugins, createPlugin, loadPlugins, getPluginContext } from '..';

interface ITerry {
  name: 'terry';
  config: { size: number };
}

afterEach(resetPlugins);

function createTestPlugin() {
  createPlugin<ITerry>({
    name: 'terry',
    defaultConfig: { size: 5 },
  }).register();
}

function typeCheckConfig(config: ITerry['config']) {
  return config.size;
}

it('gets default config', () => {
  createTestPlugin();
  loadPlugins();

  const { getConfig } = getPluginContext<ITerry>('terry');
  expect(typeCheckConfig(getConfig())).toBe(5);
});

it('gets injected config', () => {
  createTestPlugin();
  loadPlugins({ config: { terry: { size: 10 } } });

  const { getConfig } = getPluginContext<ITerry>('terry');
  expect(typeCheckConfig(getConfig())).toBe(10);
});
