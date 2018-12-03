import { mountPlugins, registerPlugin, unregisterPlugins } from '..';

afterEach(unregisterPlugins);

it('gets default config from context', () => {
  expect.assertions(1);

  const { init } = registerPlugin({
    name: 'test-plugin',
    defaultConfig: { enabled: false },
  });

  init(({ getConfig }) => {
    expect(getConfig().enabled).toBe(false);
  });

  mountPlugins();
});

it('gets custom config from context', () => {
  expect.assertions(1);

  const { init } = registerPlugin({
    name: 'test-plugin',
    defaultConfig: { enabled: false },
  });

  init(({ getConfig }) => {
    expect(getConfig().enabled).toBe(true);
  });

  mountPlugins({
    config: {
      'test-plugin': { enabled: true },
    },
  });
});

it('gets config of other plugin from context', () => {
  expect.assertions(1);

  registerPlugin({
    name: 'test-plugin',
    defaultConfig: { enabled: false },
  });
  const { init } = registerPlugin({ name: 'test-plugin2' });

  init(({ getConfigOf }) => {
    expect(getConfigOf('test-plugin').enabled).toBe(false);
  });

  mountPlugins();
});
