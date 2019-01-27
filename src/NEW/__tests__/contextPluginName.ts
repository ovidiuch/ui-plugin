import { createPlugin } from '../createPlugin';
import { getPluginContext } from '../getPluginContext';

interface ITerry {
  name: 'terry';
  methods: {};
  events: {};
}

it('returns plugin name', () => {
  createPlugin<ITerry>({
    name: 'terry',
    methods: {},
  }).register();

  const context = getPluginContext<ITerry>('terry');
  const pluginName: 'terry' = context.pluginName;
  expect(pluginName).toBe('terry');
});
