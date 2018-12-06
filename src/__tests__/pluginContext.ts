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
    initialState: { enabled: false },
  });

  mountPlugins();

  const { getState } = getPluginContext('testPlugin');
  expect(getState()).toEqual({ enabled: false });
});

it('throws exception if plugins are not mounted', () => {
  registerPlugin({
    name: 'testPlugin',
  });

  expect(() => {
    getPluginContext('testPlugin');
  }).toThrow('getPluginContext called before mounting plugins');
});
