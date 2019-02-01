import { createPlugin } from '../createPlugin';
import { getPluginContext } from '../getPluginContext';

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

  const sharedContext = {
    config: { terry: { size: 10 } },
    state: {},
    setState: () => undefined,
  };
  const context = getPluginContext<ITerry>('terry', sharedContext);

  const size: number = context.getConfig().size;
  expect(size).toBe(10);
});
