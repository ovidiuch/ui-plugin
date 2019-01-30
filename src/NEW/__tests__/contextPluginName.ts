import { createPlugin } from '../createPlugin';
import { getPluginContext } from '../getPluginContext';

interface ITerry {
  name: 'terry';
}

it('returns plugin name', () => {
  createPlugin<ITerry>({ name: 'terry' }).register();

  const sharedContext = { state: {}, setState: () => undefined };
  const context = getPluginContext<ITerry>('terry', sharedContext);
  const pluginName: 'terry' = context.pluginName;
  expect(pluginName).toBe('terry');
});
