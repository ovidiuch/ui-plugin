import { enablePlugin, onPluginChange, resetPlugins } from '..';
import { registerPlugin } from '../registerPlugin';

afterEach(resetPlugins);

it('emits change event on registering', () => {
  const handlePluginChange = jest.fn();
  onPluginChange(handlePluginChange);

  registerPlugin({ name: 'test' });

  expect(handlePluginChange).toBeCalled();
});

it('emits change event with plugin list', () => {
  const handlePluginChange = jest.fn();
  onPluginChange(handlePluginChange);

  registerPlugin({ name: 'test1' });
  registerPlugin({ name: 'test2' });

  expect(handlePluginChange).lastCalledWith({
    test1: expect.objectContaining({ name: 'test1' }),
    test2: expect.objectContaining({ name: 'test2' }),
  });
});

it('emits change event on disabling', () => {
  const handlePluginChange = jest.fn();
  onPluginChange(handlePluginChange);

  registerPlugin({ name: 'test' });
  enablePlugin('test', false);

  expect(handlePluginChange).toBeCalledTimes(2);
  expect(handlePluginChange).lastCalledWith({
    test: expect.objectContaining({ name: 'test', enabled: false }),
  });
});

it('emits change event on re-enabling', () => {
  const handlePluginChange = jest.fn();
  onPluginChange(handlePluginChange);

  registerPlugin({ name: 'test' });
  enablePlugin('test', false);
  enablePlugin('test', true);

  expect(handlePluginChange).toBeCalledTimes(3);
  expect(handlePluginChange).lastCalledWith({
    test: expect.objectContaining({ name: 'test', enabled: true }),
  });
});

it('stops emitting change event', () => {
  const handlePluginChange = jest.fn();
  const removeHandler = onPluginChange(handlePluginChange);
  removeHandler();

  registerPlugin({ name: 'test' });

  expect(handlePluginChange).not.toBeCalled();
});
