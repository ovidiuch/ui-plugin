import { loadPlugins, registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

it('gets default config from context', () => {
  expect.hasAssertions();

  const { init } = registerPlugin({
    name: 'test',
    defaultConfig: { tabSize: 2 },
  });
  init(({ getConfig }) => {
    expect(getConfig().tabSize).toBe(2);
  });

  loadPlugins();
});

it('gets custom config from context', () => {
  expect.hasAssertions();

  const { init } = registerPlugin({
    name: 'test',
    defaultConfig: { tabSize: 2 },
  });
  init(({ getConfig }) => {
    expect(getConfig().tabSize).toBe(4);
  });

  loadPlugins({
    config: {
      test: { tabSize: 4 },
    },
  });
});

it('gets config of other plugin from context', () => {
  expect.hasAssertions();

  registerPlugin({
    name: 'test1',
    defaultConfig: { tabSize: 2 },
  });

  const { init } = registerPlugin({ name: 'test2' });
  init(({ getConfigOf }) => {
    expect(getConfigOf('test1').tabSize).toBe(2);
  });

  loadPlugins();
});

it('throws exception on missing plugin', () => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'test2' });
  init(({ getConfigOf }) => {
    expect(() => {
      getConfigOf('test1');
    }).toThrow('Requested config of missing plugin test1');
  });

  loadPlugins();
});

it('throws exception on disabled plugin', () => {
  expect.hasAssertions();

  registerPlugin({
    name: 'test1',
    enabled: false,
  });

  const { init } = registerPlugin({ name: 'test2' });
  init(({ getConfigOf }) => {
    expect(() => {
      getConfigOf('test1');
    }).toThrow('Requested config of disabled plugin test1');
  });

  loadPlugins();
});
