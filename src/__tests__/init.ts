import { mountPlugins, registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

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

it('calls return callback of init handler on re-mount', () => {
  const { init } = registerPlugin({
    name: 'testPlugin',
  });
  const returnCallback = jest.fn();
  init(() => returnCallback);

  mountPlugins();
  mountPlugins();

  expect(returnCallback).toBeCalledTimes(1);
});
