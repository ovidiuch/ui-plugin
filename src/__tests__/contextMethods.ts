import { createPlugin } from '../createPlugin';
import { enablePlugin } from '../enablePlugin';
import { getPluginContext, loadPlugins, resetPlugins } from '../loadPlugins';
import { PluginContext } from '../types/PluginContext';

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

it('fails to call method of disabled plugin', () => {
  createPlugin<Jerry>({ name: 'jerry' }).register();
  createPlugin<Larry>({
    name: 'larry',
    methods: {
      annoy: (context, reason: string) => 'get outta here',
    },
  }).register();

  loadPlugins();
  enablePlugin('larry', false);

  const { getMethodsOf } = getPluginContext<Jerry>('jerry');
  expect(() => {
    getMethodsOf<Larry>('larry');
  }).toThrow('Plugin is disabled: larry');
});
