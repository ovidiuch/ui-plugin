import {
  getPluginContext,
  loadPlugins,
  registerPlugin,
  resetPlugins,
} from '..';

afterEach(resetPlugins);

it('gets plugin context', () => {
  registerPlugin({
    name: 'test',
    initialState: { active: false },
  });

  loadPlugins();

  const { getState } = getPluginContext('test');
  expect(getState()).toEqual({ active: false });
});

it('throws exception if plugins are not loaded', () => {
  registerPlugin({
    name: 'test',
  });

  expect(() => {
    getPluginContext('test');
  }).toThrow('getPluginContext called before loading plugins');
});
