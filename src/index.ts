import { registerPlugin } from './registerPlugin';

// Test usage

const { init, method, on } = registerPlugin({
  name: 'test-plugin',
  defaultConfig: { enabled: false },
  initialState: { name: 'Ron' },
});

init(({ getState }) => {
  // console.log(getState().name);
});

method('doIt', ({ setState }) => {
  setState(() => ({ name: 'Ronnie' }));
});

on('other-plugin.didSomething', ({ getConfig }) => {
  // console.log(getConfig().enabled);
});

// Works
registerPlugin({
  name: 'test-plugin',
});

registerPlugin({
  name: 'test-plugin',
  initialState: false,
});

// Doesn't work
// registerPlugin({
//   name: 'test-plugin',
//   defaultConfig: 3,
// });
