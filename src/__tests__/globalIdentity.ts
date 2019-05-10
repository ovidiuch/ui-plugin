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

function getLarryEmit() {
  return getPluginContext<Jerry>('jerry').emit;
}

afterEach(resetPlugins);

it('methods share identity between context instances', () => {
  registerPlugins();
  loadPlugins();
  expect(getLarryMethods()).toBe(getLarryMethods());
});

it('methods identity changes after reload', () => {
  registerPlugins();
  loadPlugins();

  const methods = getLarryMethods();
  reloadPlugins();
  expect(methods).not.toBe(getLarryMethods());
});

it('emit shares identity between context instances', () => {
  registerPlugins();
  loadPlugins();
  expect(getLarryEmit()).toBe(getLarryEmit());
});

it('emit identity changes after reload', () => {
  registerPlugins();
  loadPlugins();

  const emit = getLarryEmit();
  reloadPlugins();
  expect(emit).not.toBe(getLarryEmit());
});
