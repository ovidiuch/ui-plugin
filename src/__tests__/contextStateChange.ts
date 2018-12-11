import retry from '@skidding/async-retry';
import { loadPlugins, registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

it('reacts to own state change', async () => {
  expect.hasAssertions();

  let counter = 0;

  const { init, onState } = registerPlugin({
    name: 'test1',
    initialState: { counter },
  });
  init(({ setState }) => {
    setState({ counter: 5 });
  });
  onState(({ getState }) => {
    counter = getState().counter;
  });

  loadPlugins();
  await retry(() => {
    expect(counter).toBe(5);
  });
});

it('reacts to state change from other plugin', async () => {
  expect.hasAssertions();

  let counter = 0;

  const { init } = registerPlugin({
    name: 'test1',
    initialState: { counter },
  });
  init(({ setState }) => {
    setState({ counter: 5 });
  });

  const { onState } = registerPlugin({ name: 'test2' });
  onState(({ getStateOf }) => {
    counter = getStateOf('test1').counter;
  });

  loadPlugins();
  await retry(() => {
    expect(counter).toBe(5);
  });
});
