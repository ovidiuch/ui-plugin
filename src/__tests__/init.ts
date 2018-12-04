import { mountPlugins, registerPlugin, resetPluginStore } from '..';

afterEach(resetPluginStore);

it('calls init handler on mount', () => {
  const { init } = registerPlugin({
    name: 'testPlugin',
  });

  const initHandler = jest.fn();
  init(initHandler);

  mountPlugins();

  expect(initHandler).toBeCalled();
});

it('calls return callback of init handler on unmount', () => {
  const { init } = registerPlugin({
    name: 'testPlugin',
  });

  const returnCallback = jest.fn();
  init(() => returnCallback);

  const unmountPlugins = mountPlugins();
  unmountPlugins();

  expect(returnCallback).toBeCalled();
});
