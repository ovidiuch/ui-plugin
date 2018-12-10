## Current flow for generating Flow types :)

Update the [index.js.flow](index.js.flow) file by hand. Paste in [Try Flow](https://flow.org/try/) to ensure syntax is correct. As an extra precaution step, manually update `node_modules/ui-plugin/dist/index.js.flow` in the [Cosmos](https://github.com/react-cosmos/react-cosmos) monorepo and run Flow there.

Yeah... pretty lame.

I tried automating this process but failed to do so without spending too much time on it and failing to complete what I set out to accomplish in the first place. Tools I tried:

- [dts-bundle-generator](https://github.com/timocov/dts-bundle-generator) Works reasonably well. Had to add some explicit function return types to avoid `import('...')` calls, but it was something I could've worked with.
- [flowgen](https://github.com/joarwilk/flowgen) Doesn't support imports. Even with a single _d.ts_ bundle it couldn't convert the exports dts-bundle-generator generated.
