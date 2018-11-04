// @flow

export type PluginApi<S> = {
  // Own (private) state
  state: S,
  // Set own (private) state
  setState: S => mixed,
  // Call public method of other plugin
  callPlugin: (methodName: string) => mixed,
  // Emit event that other plugins can listen to
  emitEvent: (eventName: string, eventParams: {}) => void
};

type InitialStateGetter<S> = () => S;

type Listener<S> = (PluginApi<S>, ...userParams: any) => mixed;

type Subscription<S> = (PluginApi<S>) => () => mixed;

type Method<S> = (PluginApi<S>, ...userParams: any) => any;

// NOTE: React-specific
type Plug<S> = React$ComponentType<{
  pluginApi: PluginApi<S>,
  children: React$Node,
  slotProps: {}
}>;

type InitialStateBlock<S> = {
  type: "initialState",
  fn: InitialStateGetter<S>
};

type ListenerBlock<S> = {
  type: "listener",
  eventName: string,
  fn: Listener<S>
};

type SubscriptionBlock<S> = {
  type: "subscription",
  fn: Subscription<S>
};

type MethodBlock<S> = {
  type: "method",
  name: string,
  fn: Method<S>
};

// NOTE: React-specific
type PlugBlock<S> = {
  type: "plug",
  slotName: string,
  render: Plug<S>
};

type Block<S> =
  | InitialStateBlock<S>
  | ListenerBlock<S>
  | SubscriptionBlock<S>
  | MethodBlock<S>
  | PlugBlock<S>;

export type InitialState<S> = (InitialStateGetter<S>) => InitialStateBlock<S>;

export type CreateListener<S> = (
  eventName: string,
  fn: Listener<S>
) => ListenerBlock<S>;

export type CreateSubscription<S> = (
  eventName: string,
  fn: Subscription<S>
) => SubscriptionBlock<S>;

export type CreateMethod<S> = (name: string, fn: Method<S>) => MethodBlock<S>;

// NOTE: React-specific
export type CreatePlug<S> = (slotName: string, render: Plug<S>) => PlugBlock<S>;

type Blocks<S> = {
  initialState: InitialState<S>,
  listeners: Array<ListenerBlock<S>>,
  subscriptions: Array<SubscriptionBlock<S>>,
  methods: Array<MethodBlock<S>>,
  // NOTE: React-specific
  plugs: Array<PlugBlock<S>>
};

export type RegisterPlugin<S> = (name: string, blocks: Blocks<S>) => void;
