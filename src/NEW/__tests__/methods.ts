import { IPluginContext } from '../types';
import { createPlugin, loadPlugins, getPluginContext } from '..';

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

  loadPlugins();
  const { getMethodsOf } = getPluginContext<IJerry>('jerry');
  const { annoy } = getMethodsOf<ILarry>('larry');
  const response: string = annoy('tip too much');

  expect(handleAnnoyance).toBeCalledWith('tip too much');
  expect(response).toBe('get outta here');
});
