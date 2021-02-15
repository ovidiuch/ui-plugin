import { createPlugin } from '../createPlugin';
import { enablePlugin } from '../enablePlugin';
import { loadPlugins, resetPlugins } from '../loadPlugins';
import { onPluginLoad } from '../pluginStore';

interface Terry {
  name: 'terry';
}

afterEach(resetPlugins);

it('emits plugin load event', () => {
  const handleLoad = jest.fn();
  onPluginLoad(handleLoad);

  createPlugin<Terry>({ name: 'terry' }).register();
  loadPlugins();

  expect(handleLoad).toBeCalledTimes(1);
});

it('emits plugin load when enabling plugin', () => {
  const handleLoad = jest.fn();
  onPluginLoad(handleLoad);

  createPlugin<Terry>({ name: 'terry' }).register();
  loadPlugins();
  enablePlugin('terry', false);
  enablePlugin('terry', true);

  expect(handleLoad).toBeCalledTimes(3);
});
