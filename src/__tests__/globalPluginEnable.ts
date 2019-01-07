import { enablePlugin, loadPlugins, registerPlugin, resetPlugins } from '..';

afterEach(resetPlugins);

it('enables plugin at run-time', async () => {
  expect.assertions(2);

  registerPlugin({
    name: 'test1',
    enabled: false,
    initialState: 1,
  });

  await new Promise(done => {
    registerPlugin({ name: 'test2' }).init(({ getStateOf }) => {
      try {
        expect(getStateOf('test1')).toEqual(1);
        done();
      } catch (err) {
        expect(err).toEqual(
          new Error('Requested state of disabled plugin test1'),
        );
        enablePlugin('test1', true);
      }
    });

    loadPlugins();
  });
});
