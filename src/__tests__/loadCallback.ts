import { loadPlugins, registerPlugin, reloadPlugins, resetPlugins } from '..';

afterEach(resetPlugins);

it('calls callback after loading plugins', async () => {
  registerPlugin({ name: 'testPlugin' });

  const handleLoad = jest.fn();
  loadPlugins({}, handleLoad);

  expect(handleLoad).toBeCalled();
});

it('calls callback after reloading plugins', async () => {
  registerPlugin({ name: 'testPlugin' });

  const handleLoad = jest.fn();
  loadPlugins({}, handleLoad);
  reloadPlugins();

  expect(handleLoad).toBeCalledTimes(2);
});
