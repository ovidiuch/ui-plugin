import {
  enablePlugin,
  loadPlugins,
  registerPlugin,
  reloadPlugins,
  resetPlugins,
} from '..';

afterEach(resetPlugins);

it('enables plugin at run-time', () => {
  expect.hasAssertions();

  registerPlugin({
    name: 'test1',
    enabled: false,
    initialState: { counter: 1 },
  });

  const { init } = registerPlugin({ name: 'test2' });
  init(({ getStateOf }) => {
    try {
      expect(getStateOf('test1')).toEqual({ counter: 1 });
    } catch (err) {
      reloadPlugins();
      enablePlugin('test1', true);
    }
  });

  loadPlugins();
});
