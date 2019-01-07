import { registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

it('throws if plugin is already registered', async () => {
  registerPlugin({ name: 'test' });

  expect(() => {
    registerPlugin({ name: 'test' });
  }).toThrow('Plugin already registered: test');
});
