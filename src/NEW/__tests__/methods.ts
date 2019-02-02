import { IPluginContext } from '../types';
import { createPlugin } from '../createPlugin';
import { getPluginContext } from '../getPluginContext';
import { loadPlugins } from '../loadPlugins';

interface ILarry {
  name: 'larry';
  methods: {
    annoy(reason: string): string;
  };
}

interface IJerry {
  name: 'jerry';
}

function validateContext({ pluginName }: IPluginContext<ILarry>) {
  expect(pluginName).toBe('larry');
}

it('calls method of other plugin', () => {
  createPlugin<IJerry>({ name: 'jerry' }).register();

  const handleAnnoyance = jest.fn();
  createPlugin<ILarry>({
    name: 'larry',
    methods: {
      annoy: (context, reason: string) => {
        validateContext(context);
        handleAnnoyance(reason);
        return 'get outta here';
      },
    },
  }).register();

  const sharedContext = loadPlugins();
  const { getMethodsOf } = getPluginContext<IJerry>('jerry', sharedContext);
  const { annoy } = getMethodsOf<ILarry>('larry');
  const response: string = annoy('tip too much');

  expect(handleAnnoyance).toBeCalledWith('tip too much');
  expect(response).toBe('get outta here');
});
