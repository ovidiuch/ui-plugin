import { resetPlugins, createPlugin, loadPlugins, getPluginContext, enablePlugin } from '..';

interface Terry {
  name: 'terry';
}

afterEach(resetPlugins);

it('throws when plugin is disabled', () => {
  createPlugin<Terry>({ name: 'terry' }).register();
  loadPlugins();

  enablePlugin('terry', false);
  expect(() => getPluginContext<Terry>('terry')).toThrow(`Plugin "terry" is disabled`);

  enablePlugin('terry', true);
  expect(() => getPluginContext<Terry>('terry')).not.toThrow();
});
