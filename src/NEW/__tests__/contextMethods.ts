import { createPlugin } from '../createPlugin';
import { getPluginContext } from '../getPluginContext';

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
  const handleAnnoyance = jest.fn();

  createPlugin<ILarry>({
    name: 'larry',
    methods: {
      annoy: (context, reason: string) => {
        // Ensure correct context is passed into method handler
        const ctxPluginName: 'larry' = context.pluginName;
        expect(ctxPluginName).toBe('larry');

        handleAnnoyance(reason);
        return 'get outta here';
      },
    },
  }).register();

  createPlugin<IJerry>({ name: 'jerry' }).register();

  const sharedContext = { state: {}, setState: () => undefined };
  const { getMethodsOf } = getPluginContext<IJerry>('jerry', sharedContext);
  const { annoy } = getMethodsOf<ILarry>('larry');
  const response: string = annoy('tip too much');

  expect(handleAnnoyance).toBeCalledWith('tip too much');
  expect(response).toBe('get outta here');
});
