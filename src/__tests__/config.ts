import { mountPlugins, registerPlugin, unregisterPlugins } from '..';

afterEach(unregisterPlugins);

it('gets default config from context', () => {
  expect.hasAssertions();

  const { init } = registerPlugin({
    name: 'testPlugin',
    defaultConfig: { enabled: false },
  });

  init(({ getConfig }) => {
    expect(getConfig().enabled).toBe(false);
  });

  mountPlugins();
});

it('gets custom config from context', () => {
  expect.hasAssertions();

  const { init } = registerPlugin({
    name: 'testPlugin',
    defaultConfig: { enabled: false },
  });

  init(({ getConfig }) => {
    expect(getConfig().enabled).toBe(true);
  });

  mountPlugins({
    config: {
      testPlugin: { enabled: true },
    },
  });
});

it('gets config of other plugin from context', () => {
  expect.hasAssertions();

  registerPlugin({
    name: 'testPlugin1',
    defaultConfig: { enabled: false },
  });
  const { init } = registerPlugin({ name: 'testPlugin2' });

  init(({ getConfigOf }) => {
    expect(getConfigOf('testPlugin1').enabled).toBe(false);
  });

  mountPlugins();
});
