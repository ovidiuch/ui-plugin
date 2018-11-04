# ui-plugin

API for composable 3rd party UI plugins

## Goal

Enable a system of user interface plugins that meet the following criteria:

- Plugins are authered, compiled and deployed independently, by anyone under any repository.
- Plugins can also be authored locally, sharing modules and compilation with the host project.
- Plugins can be installed at run time. This includes download from an external repository like npm.
- Plugins can be enabled and disabled at run time, including newly installed ones. No restart of the host app required.
- Plugins can manage visual components, app state, or both.
- Plugins can emit events that other plugins can subscribe to.
- Plugins expose public methods that other plugins can call synchronously.
- Each plugin has read-write access to private state that is inaccessible to other plugins. Parts of the state can be exposed via public methods.
- Plugins can define render slots that other plugins can plug into. More plugins can take up the same slot and can choose to compose or override each other.
- Plugin API is type-friendly.
- Plugins can share common libraries (eg. React) by configuring the host app to attach those libraries to the global namespace and configuring the plugin build to map related imports to the global namespace.

## Strategy

Use the global namespace to connect plugins from different script files. Expose declarative APIs for defining and registering plugins that abstracts the global namespace.
