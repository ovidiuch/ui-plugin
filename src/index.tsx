import * as React from 'react';
import { IPlugConfig } from './PlugConfig';
import { IPluginConfig } from './PluginConfig';

export { IPluginContext } from './PluginContext';

// NOTE: Typing this seems very complicated. Consider:
// 1. Building this project without types
// 2. Building this project with types but not publish any types
// 3. Publishing types but not typing this repo
// Choose what is more important.
// MOST IMPORTANT: Don't design the API around the limitations of the type system.
// TODO: Document API to see how it looks

export function registerPlugin<State>(pluginConfig: IPluginConfig<State>) {
  // TODO: Register plugin

  return {
    registerPlug: <PlugProps extends any>(
      plugConfig: IPlugConfig<State, PlugProps>,
    ): void => {
      // TODO: Register plug
    },
  };
}

// Test usage

const { registerPlug } = registerPlugin({
  name: 'test-plugin',
  getInitialState: () => ({ name: 'Ron' }),
});

registerPlug({
  slotName: 'testSlot',
  type: WelcomeMessage,
  getProps: ({ pluginContext, slotProps }) => {
    const { name } = pluginContext.getState();
    // slotProps has to be manually annotated with a type
    const { greeting } = slotProps as { greeting: string };

    return {
      greeting,
      name,
    };
  },
});

interface IWelcomeMessageProps {
  greeting: string;
  name: string;
}

function WelcomeMessage({ greeting, name }: IWelcomeMessageProps) {
  return (
    <p>
      {greeting} ${name}!
    </p>
  );
}
