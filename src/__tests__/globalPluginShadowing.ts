import {
  enablePlugin,
  getPluginContext,
  loadPlugins,
  registerPlugin,
  resetPlugins,
} from '..';

afterEach(resetPlugins);

it('loads last plugin for name', async () => {
  const p1 = registerPlugin({ name: 'test', defaultConfig: { attr: 'foo' } });
  const p2 = registerPlugin({ name: 'test', defaultConfig: { attr: 'bar' } });

  loadPlugins();
  expect(getPluginContext('test').getConfig().attr).toBe('bar');

  enablePlugin(p2.pluginId, false);
  expect(getPluginContext('test').getConfig().attr).toBe('foo');

  enablePlugin(p2.pluginId, true);
  expect(getPluginContext('test').getConfig().attr).toBe('bar');

  enablePlugin(p1.pluginId, false);
  enablePlugin(p2.pluginId, false);
  expect(() => {
    getPluginContext('test').getConfig();
  }).toThrow('Requested plugin context for missing plugin test');
});
