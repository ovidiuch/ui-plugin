import { enablePlugin, mountPlugins, registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

it(`can't access config of disabled plugin`, () => {
  expect.hasAssertions();

  registerPlugin({
    name: 'testPlugin1',
    enabled: false,
    defaultConfig: { tabSize: 2 },
  });

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ getConfigOf }) => {
    expect(() => {
      getConfigOf('testPlugin1');
    }).toThrow('Requested config of missing plugin testPlugin1');
  });

  mountPlugins();
});

it(`can't access state of disabled plugin`, () => {
  expect.hasAssertions();

  registerPlugin({
    name: 'testPlugin1',
    enabled: false,
    initialState: { counter: 1 },
  });

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ getStateOf }) => {
    expect(() => {
      getStateOf('testPlugin1');
    }).toThrow('Requested state of missing plugin testPlugin1');
  });

  mountPlugins();
});

it('can access state of plugin enabled at run time', () => {
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
    }
  });

  mountPlugins();
});
