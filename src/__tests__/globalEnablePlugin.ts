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
    name: 'testPlugin1',
    enabled: false,
    initialState: { counter: 1 },
  });

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ getStateOf }) => {
    try {
      expect(getStateOf('testPlugin1')).toEqual({ counter: 1 });
    } catch (err) {
      enablePlugin('testPlugin1', true);
      reloadPlugins();
    }
  });

  loadPlugins();
});
