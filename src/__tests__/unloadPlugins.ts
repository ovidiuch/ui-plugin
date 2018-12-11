import { loadPlugins, registerPlugin, resetPlugins, unloadPlugins } from '..';

afterEach(resetPlugins);

function loadAndUnloadPlugins() {
  loadPlugins();
  unloadPlugins();
}

it('throws exception on getConfig', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'testPlugin' });
  init(({ getConfig }) => {
    setTimeout(() => {
      expect(() => {
        getConfig();
      }).toThrow('Not loaded plugin testPlugin called getConfig');
      done();
    });
  });

  loadAndUnloadPlugins();
});

it('throws exception on getConfigOf', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'testPlugin1' });
  init(({ getConfigOf }) => {
    setTimeout(() => {
      expect(() => {
        getConfigOf('testPlugin2');
      }).toThrow('Not loaded plugin testPlugin1 called getConfigOf');
      done();
    });
  });

  loadAndUnloadPlugins();
});

it('throws exception on getState', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'testPlugin' });
  init(({ getState }) => {
    setTimeout(() => {
      expect(() => {
        getState();
      }).toThrow('Not loaded plugin testPlugin called getState');
      done();
    });
  });

  loadAndUnloadPlugins();
});

it('throws exception on getStateOf', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'testPlugin1' });
  init(({ getStateOf }) => {
    setTimeout(() => {
      expect(() => {
        getStateOf('testPlugin2');
      }).toThrow('Not loaded plugin testPlugin1 called getStateOf');
      done();
    });
  });

  loadAndUnloadPlugins();
});

it('throws exception on setState', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'testPlugin', initialState: 0 });
  init(({ setState }) => {
    setTimeout(() => {
      expect(() => {
        setState(1);
      }).toThrow('Not loaded plugin testPlugin called setState');
      done();
    });
  });

  loadAndUnloadPlugins();
});

it('throws exception on callMethod', done => {
  expect.hasAssertions();

  const { method } = registerPlugin({ name: 'testPlugin1' });
  method('testMethod', () => undefined);

  const { init } = registerPlugin({ name: 'testPlugin2' });
  init(({ callMethod }) => {
    setTimeout(() => {
      expect(() => {
        callMethod('testPlugin1.testMethod');
      }).toThrow(
        'Not loaded plugin testPlugin2 called method testPlugin1.testMethod',
      );
      done();
    });
  });

  loadAndUnloadPlugins();
});

it('throws exception on emitEvent', done => {
  expect.hasAssertions();

  const { init } = registerPlugin({ name: 'testPlugin' });
  init(({ emitEvent }) => {
    setTimeout(() => {
      expect(() => {
        emitEvent('testEvent');
      }).toThrow('Not loaded plugin testPlugin emitted event testEvent');
      done();
    });
  });

  loadAndUnloadPlugins();
});
