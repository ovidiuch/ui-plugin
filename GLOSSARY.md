Not yet documented:

- Unique plugin name
- Plugin context

## Plugin loaded states

> Not to be confused with a plugin's user state

A plugin can be identified with one or more of the following states, which are _not_ mutually exclusive.

#### Registered

A registered plugin has been submitted to the plugin store.

#### Enabled

All _registered_ plugins are optionally flagged as enabled.

#### Active

A plugin is active when it is both _registered_ and _enabled_. Active plugins are the only ones eligible for becoming _loaded_.

#### Loaded

Any _active_ plugin after plugins are loaded, which is followed by initialization of each plugin.
