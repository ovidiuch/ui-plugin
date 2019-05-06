import {
  resetPlugins,
  createPlugin,
  loadPlugins,
  getPluginContext,
  enablePlugin,
} from '..';
import { reloadPlugins } from '../loadPlugins';

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

it('context has same reference between calls', () => {
  createPlugin<Terry>({ name: 'terry' }).register();
  loadPlugins();

  const context1 = getPluginContext<Terry>('terry');
  const context2 = getPluginContext<Terry>('terry');
  expect(context1).toBe(context2);
});

it('context reference differs after reload', () => {
  createPlugin<Terry>({ name: 'terry' }).register();
  loadPlugins();

  const context1 = getPluginContext<Terry>('terry');
  reloadPlugins();
  const context2 = getPluginContext<Terry>('terry');
  expect(context1).not.toBe(context2);
});
