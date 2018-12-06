import {
  getPluginContext,
  mountPlugins,
  registerPlugin,
  resetPlugins,
} from '..';

afterEach(resetPlugins);

it('gets plugin context', () => {
  registerPlugin({
    name: 'testPlugin',
    initialState: { active: false },
  });

  mountPlugins();

  const { getState } = getPluginContext('testPlugin');
  expect(getState()).toEqual({ active: false });
});

it('throws exception if plugins are not mounted', () => {
  registerPlugin({
    name: 'testPlugin',
  });

  expect(() => {
    getPluginContext('testPlugin');
  }).toThrow('getPluginContext called before mounting plugins');
});
