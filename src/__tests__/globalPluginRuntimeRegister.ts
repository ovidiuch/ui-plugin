import delay from 'delay';
import { loadPlugins, registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

it('reloads plugins with previous state', async () => {
  await new Promise(done => {
    registerPlugin({
      name: 'test1',
      initialState: 0,
    }).init(({ setState }) => {
      setState(5);
      done();
    });

    loadPlugins();
  });

  await new Promise(done => {
    registerPlugin({
      name: 'test2',
    }).init(({ getStateOf }) => {
      expect(getStateOf('test1')).toBe(5);
      done();
    });
  });
});

it('bundles plugin reloading', async () => {
  const { init } = registerPlugin({ name: 'test1' });

  const handleInit = jest.fn();
  init(handleInit);

  loadPlugins();

  // Expect plugins to reload once for both plugin registrations
  registerPlugin({ name: 'test2' });
  registerPlugin({ name: 'test3' });

  await delay(0);
  expect(handleInit).toBeCalledTimes(2);
});

it('does not reload plugins when registering disabled plugin', async () => {
  const { init } = registerPlugin({ name: 'test1' });

  const handleInit = jest.fn();
  init(handleInit);

  loadPlugins();

  registerPlugin({ name: 'test2', enabled: false });

  await delay(0);
  expect(handleInit).toBeCalledTimes(1);
});
