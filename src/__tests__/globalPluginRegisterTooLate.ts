import { loadPlugins, registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

it('throws if plugin is already loaded', async () => {
  const { init, method, on } = registerPlugin({ name: 'test' });
  loadPlugins();

  expect(() => {
    init(() => () => null);
  }).toThrow(`Registered init handler after plugin loaded`);

  expect(() => {
    method('foo', () => null);
  }).toThrow(`Registered method after plugin loaded`);

  expect(() => {
    on('foo.bar', () => null);
  }).toThrow(`Registered event handler after plugin loaded`);
});
