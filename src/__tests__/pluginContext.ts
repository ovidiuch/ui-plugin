import {
  getPluginContext,
  loadPlugins,
  registerPlugin,
  resetPlugins,
} from '..';

afterEach(resetPlugins);

it('gets plugin context', () => {
  registerPlugin({
    name: 'testPlugin',
    initialState: { active: false },
  });

  loadPlugins();

  const { getState } = getPluginContext('testPlugin');
  expect(getState()).toEqual({ active: false });
});

it('throws exception if plugins are not loaded', () => {
  registerPlugin({
    name: 'testPlugin',
  });

  expect(() => {
    getPluginContext('testPlugin');
  }).toThrow('getPluginContext called before loading plugins');
});
