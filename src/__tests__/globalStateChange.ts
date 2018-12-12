import { loadPlugins, onStateChange, registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

it('calls state handler', async () => {
  const { init } = registerPlugin({
    name: 'test',
    initialState: { counter: 0 },
  });

  const handler = jest.fn();
  onStateChange(handler);

  await new Promise(done => {
    init(({ setState }) => {
      setState({ counter: 1 });
      expect(handler).toBeCalled();
      done();
    });

    loadPlugins();
  });
});

it('stops calling state handler', async () => {
  const { init } = registerPlugin({
    name: 'test',
    initialState: { counter: 0 },
  });

  const handler = jest.fn();
  const removeHandler = onStateChange(handler);

  await new Promise(done => {
    init(({ setState }) => {
      setState({ counter: 1 });
      expect(handler).toBeCalled();

      removeHandler();

      setState({ counter: 2 });
      expect(handler).toBeCalledTimes(1);
      done();
    });

    loadPlugins();
  });
});
