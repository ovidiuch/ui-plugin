import { PluginContext } from '../types';
import { resetPlugins, createPlugin, loadPlugins, getPluginContext } from '..';

interface Larry {
  name: 'larry';
  methods: {
    annoy(reason: string): string;
  };
}

interface Jerry {
  name: 'jerry';
}

function validateContext({ pluginName }: PluginContext<Larry>) {
  expect(pluginName).toBe('larry');
}

afterEach(resetPlugins);

it('calls method of other plugin', () => {
  createPlugin<Jerry>({ name: 'jerry' }).register();

  const handleAnnoyance = jest.fn();
  createPlugin<Larry>({
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
  const { getMethodsOf } = getPluginContext<Jerry>('jerry');
  const { annoy } = getMethodsOf<Larry>('larry');
  const response: string = annoy('tip too much');

  expect(handleAnnoyance).toBeCalledWith('tip too much');
  expect(response).toBe('get outta here');
});
