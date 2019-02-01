import { createPlugin } from '../createPlugin';
import { getPluginContext } from '../getPluginContext';
import { initPlugins } from '../initPlugins';

interface ILarry {
  name: 'larry';
  methods: {
    annoy(reason: string): string;
  };
}

interface IJerry {
  name: 'jerry';
}

it('calls method of other plugin', () => {
  createPlugin<IJerry>({ name: 'jerry' }).register();

  const handleAnnoyance = jest.fn();
  createPlugin<ILarry>({
    name: 'larry',
    methods: {
      annoy: (context, reason: string) => {
        // Ensure correct context is passed into method handler
        const pluginName: 'larry' = context.pluginName;
        expect(pluginName).toBe('larry');

        handleAnnoyance(reason);
        return 'get outta here';
      },
    },
  }).register();

  const sharedContext = initPlugins();
  const { getMethodsOf } = getPluginContext<IJerry>('jerry', sharedContext);
  const { annoy } = getMethodsOf<ILarry>('larry');
  const response: string = annoy('tip too much');

  expect(handleAnnoyance).toBeCalledWith('tip too much');
  expect(response).toBe('get outta here');
});
