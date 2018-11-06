import * as React from 'react';
import { IPlugConfig } from './PlugConfig';
import { IPluginConfig } from './PluginConfig';

export { IPluginContext } from './PluginContext';

export function registerPlugin<PluginState>(
  pluginConfig: IPluginConfig<PluginState>,
) {
  // TODO: Register plugin

  return {
    registerPlug: <PlugProps extends any>(
      plugConfig: IPlugConfig<PluginState, PlugProps>,
    ): void => {
      // TODO: Register plug
    },
  };
}

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
