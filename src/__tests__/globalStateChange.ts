import retry from '@skidding/async-retry';
import { loadPlugins, onStateChange, registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

it('calls state handler', async () => {
  const handler = jest.fn();
  onStateChange(handler);

  const { init } = registerPlugin({
    name: 'test',
    initialState: { counter: 0 },
  });

  init(({ setState }) => {
    setState({ counter: 1 });
  });

  loadPlugins();

  await retry(() => expect(handler).toBeCalled());
});

it('stops calling state handler', async () => {
  const { init } = registerPlugin({
    name: 'test',
    initialState: { counter: 0 },
  });

  const handler = jest.fn();
  const removeHandler = onStateChange(handler);

  let removeHandlerAndSetState: () => void;
  init(({ setState }) => {
    setState({ counter: 1 });

    removeHandlerAndSetState = () => {
      removeHandler();
      setState({ counter: 2 });
    };
  });

  loadPlugins();

  await retry(() => expect(handler).toBeCalled());
  removeHandlerAndSetState!();
  await retry(() => expect(handler).toBeCalledTimes(1));
});
