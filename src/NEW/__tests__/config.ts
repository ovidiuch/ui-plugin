import { createPlugin } from '../createPlugin';
import { getPluginContext } from '../getPluginContext';
import { initPlugins } from '../initPlugins';

interface ITerry {
  name: 'terry';
  config: { size: number };
}

function createTestPlugin() {
  createPlugin<ITerry>({
    name: 'terry',
    defaultConfig: { size: 5 },
  }).register();
}

it('gets config', () => {
  createTestPlugin();

  const sharedContext = initPlugins({
    config: { terry: { size: 10 } },
  });
  const { getConfig } = getPluginContext<ITerry>('terry', sharedContext);

  const size: number = getConfig().size;
  expect(size).toBe(10);
});
