import { createPlugin } from '../createPlugin';
import {
  getPluginContext,
  loadPlugins,
  reloadPlugins,
  resetPlugins,
} from '../loadPlugins';

interface Larry {
  name: 'larry';
  methods: {
    annoy(reason: string): string;
  };
}

interface Jerry {
  name: 'jerry';
  events: {
    idea(): void;
  };
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

function getJerryEmit() {
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
  expect(getJerryEmit()).toBe(getJerryEmit());
});

it('emit identity changes after reload', () => {
  registerPlugins();
  loadPlugins();

  const emit = getJerryEmit();
  reloadPlugins();
  expect(emit).not.toBe(getJerryEmit());
});
