import { loadPlugins, registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

it('reloading plugins with previous state', async () => {
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
