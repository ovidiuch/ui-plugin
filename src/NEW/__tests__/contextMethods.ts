import { createPlugin } from '../createPlugin';
import { getPluginContext } from '../getPluginContext';

interface ILarry {
  name: 'larry';
  state: null;
  methods: {
    annoy(reason: string): string;
  };
  events: {};
}

interface IJerry {
  name: 'jerry';
  state: null;
  methods: {};
  events: {};
}

it('calls method of other plugin', () => {
  const handleAnnoyance = jest.fn();

  createPlugin<ILarry>({
    name: 'larry',
    initialState: null,
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

  createPlugin<IJerry>({
    name: 'jerry',
    initialState: null,
    methods: {},
  }).register();

  const sharedContext = { state: {}, setState: () => undefined };
  const { getMethodsOf } = getPluginContext<IJerry>('jerry', sharedContext);
  const { annoy } = getMethodsOf<ILarry>('larry');
  const response: string = annoy('tip too much');

  expect(handleAnnoyance).toBeCalledWith('tip too much');
  expect(response).toBe('get outta here');
});
