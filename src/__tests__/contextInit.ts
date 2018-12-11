import { loadPlugins, registerPlugin, resetPlugins, unloadPlugins } from '..';

afterEach(resetPlugins);

it('calls init handler on load', () => {
  const { init } = registerPlugin({
    name: 'testPlugin',
  });
  const initHandler = jest.fn();
  init(initHandler);

  loadPlugins();

  expect(initHandler).toBeCalled();
});

it('calls return callback of init handler on unload', () => {
  const { init } = registerPlugin({
    name: 'testPlugin',
  });
  const returnCallback = jest.fn();
  init(() => returnCallback);

  loadPlugins();
  unloadPlugins();

  expect(returnCallback).toBeCalled();
});

it('calls return callback of init handler on reload', () => {
  const { init } = registerPlugin({
    name: 'testPlugin',
  });
  const returnCallback = jest.fn();
  init(() => returnCallback);

  loadPlugins();
  loadPlugins();

  expect(returnCallback).toBeCalledTimes(1);
});
