The following are not yet documented because they are likely to change:

- Plugin id
- Plugin name

Also not yet documented:

- Plugin context
- Plugin scope

## Plugin states

A plugin can be identified with one or more of the following states, which are _not_ mutually exclusive.

#### Registered

A registered plugin has been submitted to the plugin store.

#### Enabled

All _registered_ plugins are optionally flagged as enabled.

#### Active

A plugin is active when it is _registered_, _enabled_ and not _shadowed._ Active plugins are the only ones eligible for becoming _loaded_.

#### Shadowed

A plugin is shadowed when another plugin with the same _name_ has been registered (at a later time than the plugin in question), as long as the shadowing plugin is also _enabled_.

#### Loaded

Any _active_ plugin after plugins are loaded, which is followed by initialization of each plugin.
