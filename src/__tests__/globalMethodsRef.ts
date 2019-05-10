import { resetPlugins, createPlugin, loadPlugins, getPluginContext } from '..';
import { reloadPlugins } from '../loadPlugins';

interface Larry {
  name: 'larry';
  methods: {
    annoy(reason: string): string;
  };
}

interface Jerry {
  name: 'jerry';
}

function registerPlugins() {
  createPlugin<Jerry>({ name: 'jerry' }).register();
  createPlugin<Larry>({
    name: 'larry',
    methods: {
      annoy: () => 'get outta here',
    },
  }).register();
}

function getLarryMethods() {
  return getPluginContext<Jerry>('jerry').getMethodsOf('larry');
}

afterEach(resetPlugins);

it('methods have same reference between calls', () => {
  registerPlugins();
  loadPlugins();
  expect(getLarryMethods()).toBe(getLarryMethods());
});

it('methods reference change after reload', () => {
  registerPlugins();
  loadPlugins();

  const methods = getLarryMethods();
  reloadPlugins();
  expect(methods).not.toBe(getLarryMethods());
});
