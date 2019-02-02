import { createPlugin, loadPlugins, getPluginContext, enablePlugin } from '..';

interface ITerry {
  name: 'terry';
}

it('throws when plugin is disabled', () => {
  createPlugin<ITerry>({ name: 'terry' }).register();
  loadPlugins();

  enablePlugin('terry', false);
  expect(() => getPluginContext<ITerry>('terry')).toThrow(`Plugin "terry" is disabled`);

  enablePlugin('terry', true);
  expect(() => getPluginContext<ITerry>('terry')).not.toThrow();
});
