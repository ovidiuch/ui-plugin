import { mountPlugins, registerPlugin, unregisterPlugins } from '..';

afterEach(unregisterPlugins);

it('calls init handler on mount', () => {
  const { init } = registerPlugin({
    name: 'test-plugin',
  });

  const initHandler = jest.fn();
  init(initHandler);

  mountPlugins();

  expect(initHandler).toBeCalled();
});

it('calls return callback of init handler on unmount', () => {
  const { init } = registerPlugin({
    name: 'test-plugin',
  });

  const returnCallback = jest.fn();
  init(() => returnCallback);

  const unmountPlugins = mountPlugins();
  unmountPlugins();

  expect(returnCallback).toBeCalled();
});
