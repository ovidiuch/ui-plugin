import { loadPlugins, registerPlugin, resetPlugins, unloadPlugins } from '..';

afterEach(resetPlugins);

function loadAndUnloadPlugins() {
  loadPlugins();
  unloadPlugins();
}

it('throws exception on getConfig', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'test' });
  init(({ getConfig }) => {
    setTimeout(() => {
      expect(() => {
        getConfig();
      }).toThrow('Not loaded plugin test called getConfig');
      done();
    });
  });

  loadAndUnloadPlugins();
});

it('throws exception on getConfigOf', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'test1' });
  init(({ getConfigOf }) => {
    setTimeout(() => {
      expect(() => {
        getConfigOf('test2');
      }).toThrow('Not loaded plugin test1 called getConfigOf');
      done();
    });
  });

  loadAndUnloadPlugins();
});

it('throws exception on getState', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'test' });
  init(({ getState }) => {
    setTimeout(() => {
      expect(() => {
        getState();
      }).toThrow('Not loaded plugin test called getState');
      done();
    });
  });

  loadAndUnloadPlugins();
});

it('throws exception on getStateOf', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'test1' });
  init(({ getStateOf }) => {
    setTimeout(() => {
      expect(() => {
        getStateOf('test2');
      }).toThrow('Not loaded plugin test1 called getStateOf');
      done();
    });
  });

  loadAndUnloadPlugins();
});

it('throws exception on setState', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'test', initialState: 0 });
  init(({ setState }) => {
    setTimeout(() => {
      expect(() => {
        setState(1);
      }).toThrow('Not loaded plugin test called setState');
      done();
    });
  });

  loadAndUnloadPlugins();
});

it('throws exception on callMethod', done => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'test1' });
  method('testMethod', () => undefined);

  const { init } = registerPlugin({ name: 'test2' });
  init(({ callMethod }) => {
    setTimeout(() => {
      expect(() => {
        callMethod('test1.testMethod');
      }).toThrow('Not loaded plugin test2 called method test1.testMethod');
      done();
    });
  });

  loadAndUnloadPlugins();
});

it('throws exception on emitEvent', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'test' });
  init(({ emitEvent }) => {
    setTimeout(() => {
      expect(() => {
        emitEvent('testEvent');
      }).toThrow('Not loaded plugin test emitted event testEvent');
      done();
    });
  });

  loadAndUnloadPlugins();
});
