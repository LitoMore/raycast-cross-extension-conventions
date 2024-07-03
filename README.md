# Raycast Cross-Extension Conventions

Defines the development approach for cross-extension in Raycast

[![raycast-cross-extension-badge]][raycast-cross-extension-link]

## Background

Raycast has tons of extensions so far. But most of them are standalone, it’s hard to use their ability from other extensions.

## Install

```shell
npm i raycast-cross-extension
```

## Usages

### Consumer Usage

Add your target extension handle to the `crossExtensions` list of package.json.
This field allows providers to get to know who is using their extension. See [maintenance](#maintenance).

```json
{
	"crossExtensions": ["target-extensions-author-name/target-extension-name"]
}
```

We recommend always using the `crossLaunchCommand()` API to launch cross-extensions even your extension doesn't use the callback launch feature.

You may need to catch exceptions from `crossLaunchCommand()` if the target command is not installed.
The [`open()`](https://developers.raycast.com/api-reference/utilities#open) redirects to the Store when `crossLaunchCommand()` errored.

#### Example

```typescript
import { LaunchType, open } from "@raycast/api";
import { crossLaunchCommand } from "raycast-cross-extension";

crossLaunchCommand({
	name: "target-command-name",
	type: LaunchType.UserInitiated,
	extensionName: "target-extension-name",
	ownerOrAuthorName: "target-extension-author-name",
	context: {
		foo: "foo",
		bar: "bar",
	},
}).catch(() => {
	open(
		"raycast://extensions/target-extension-author-name/target-extension-name",
	);
});
```

### Provider Usage

Incoming parameters can be received from [`LaunchContext`](https://developers.raycast.com/api-reference/command#launchcontext).

The `callbackLaunchOptions` is used for running the callback `launchCommand()` to the source extension.

Please note passing parameters through [`Arguments`](https://developers.raycast.com/information/lifecycle/arguments) is not recommneded since it supports string only.

But a command with arguments is still useful if you want to reuse your existing arguments-based commands as the cross-extension entrance.
For exmaple, the [Say](https://raycast.com/litomore/say) extension is using the `typeToSay` arguments-based command for receiving cross-extension parameters.

#### Example

```typescript
import { LaunchProps } from "@raycast/api";
import { callbackLaunchCommand, LaunchOptions } from "raycast-cross-extension";

type LaunchContext = {
	foo?: string;
	bar?: string;
	callbackLaunchOptions?: LaunchOptions;
};

export default function Command({
	launchContext = {},
}: LaunchProps<{ launchContext?: LaunchContext }>) {
	const { foo, bar, callbackLaunchOptions } = launchContext;
	// ...
	callbackLaunchCommand(callbackLaunchOptions, {
		result: "hello, world",
	});
}
```

## API

### crossLaunchCommand(options, callbackOptions?)

#### options

Type: `LaunchOptions`

Options for launch the target command.

#### callbackOptions

Type: `Partial<LaunchOptions> | false`

Optional. Options for launch the callback command. It will be used in the callback stage with default values below:

- `name` defaults to `environment.commandName`
- `extensionName` defaults to `environment.extensionName`
- `ownerOrAuthorName` defaults to `environment.ownerOrAuthorName` or the field in `package.json`
- `type` defaults to `LaunchType.UserInitiated`

You can set it to `false` to disable command callback.

### callbackLaunchCommand(options, payload?)

#### options

Type: `LaunchOptions`

Pass in `launchContext.callbackLaunchOptions`. This is used to load options for callback.

#### payload

Type: `LaunchOptions['context']`

Optional. Context data for sending back to consumer command.

## Maintenance

When you make breaking changes, keep an eye out for other projects using your API.

You can search for your extension handle `your-author-name/your-extension-name` from the [raycast/extension](https://github.com/raycast/extensions) to find that extension using your extension.

## Badges

Show the world your extension implemented Cross-Extension.

[![raycast-cross-extension-badge]][raycast-cross-extension-link]

```markdown
[![](https://shields.io/badge/Raycast-Cross--Extension-eee?labelColor=FF6363&logo=raycast&logoColor=fff&style=flat-square)](https://github.com/LitoMore/raycast-cross-extension-conventions)
```

## Who's using Cross-Extension

### Consumers

- [Badges - shields.io](https://raycast.com/litomore/badges) - Concise, consistent, and legible badges
- [United Nations](https://raycast.com/litomore/united-nations) - Peace, dignity and equality on a healthy planet

### Providers

- [Brand Icons - simpleicons.org](https://raycast.com/litomore/simple-icons) - Browse, search, and copy free SVG icons for popular brands
- [Color Picker](https://raycast.com/thomas/color-picker) - A simple system-wide color picker
- [Say - Spoken Content](https://raycast.com/litomore/say) - macOS built-in Spoken Content interface
- [PM2](https://raycast.com/litomore/pm2) - Manage even run your Node.js processes through Raycast

### Utilities

- [raycast-pm2](https://github.com/LitoMore/raycast-pm2) - PM2 utilities for Raycast Extensions

## License

CC0-1.0

[raycast-cross-extension-badge]: https://shields.io/badge/Raycast-Cross--Extension-eee?labelColor=FF6363&logo=raycast&logoColor=fff&style=flat-square
[raycast-cross-extension-link]: https://github.com/LitoMore/raycast-cross-extension-conventions
