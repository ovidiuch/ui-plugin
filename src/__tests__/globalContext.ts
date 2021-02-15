import { createPlugin } from '../createPlugin';
import { enablePlugin } from '../enablePlugin';
import { getPluginContext, loadPlugins, resetPlugins } from '../loadPlugins';

interface Terry {
  name: 'terry';
}

afterEach(resetPlugins);

it('throws when plugin is disabled', () => {
  createPlugin<Terry>({ name: 'terry' }).register();
  loadPlugins();

  enablePlugin('terry', false);
  expect(() => getPluginContext<Terry>('terry')).toThrow(
    `Plugin is disabled: terry`,
  );

  enablePlugin('terry', true);
  expect(() => getPluginContext<Terry>('terry')).not.toThrow();
});
