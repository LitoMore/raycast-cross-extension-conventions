# Raycast Cross-Extensions Conventions

Defines the development approach for cross-extension in Raycast

![raycast-cross-extension-badge]

## Background

Raycast has tons of extensions so far. But most of them are standalone, it’s hard to use their ability from other extensions.

## Install

```shell
npm i raycast-cross-extension
```

## Expose Extension Ability

Incoming parameters can be passed from [`LaunchContext`](https://developers.raycast.com/api-reference/command#launchcontext).

The `callbackLaunchOptions` is used for running the callback `launchCommand()` to the source extension.

You need to catch exceptions from `launchCommand()` if the target command is not installed. The [`open()`](https://developers.raycast.com/api-reference/utilities#open) redirects to the Store when `launchCommand()` errored.

### Accept Parameters

```typescript
import { open, launchCommand, LaunchProps } from "@raycast/api";
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

### Source Extension

```typescript
import { launchCommand, LaunchType } from "@raycast/api";
import { crossLaunchCommand } from "raycast-cross-extension";

crossLaunchCommand(
	{
		name: "target-command-name",
		type: LaunchType.UserInitiated,
		extensionName: "target-extension-name",
		ownerOrAuthorName: "target-extension-author-name",
		context: {
			foo: "foo",
			bar: "bar",
		},
	},
	{
		ownerOrAuthorName: "your-extension-author-name",
	},
).catch(() => {
	open(
		"raycast://extensions/target-extension-author-name/target-extension-name",
	);
});
```

Please note passing parameters through [`Arguments`](https://developers.raycast.com/information/lifecycle/arguments) is not recommneded since it supports string only.

## Maintenance

When you make breaking changes, keep an eye out for other projects using your API.

## Badges

Show the world your extension implemented Cross-Extension.

![raycast-cross-extension-badge]

```markdown
[![](https://shields.io/badge/Raycast-Cross--Extension-eee?labelColor=FF6363&logo=raycast&logoColor=fff&style=flat-square)](https://github.com/LitoMore/raycast-cross-extension-conventions)
```

## Who's using Cross-Extension

- [Badges - shields.io](https://raycast.com/litomore/badges) - Concise, consistent, and legible badges
- [Brand Icons - simpleicons.org](https://raycast.com/litomore/simple-icons) - Browse, search, and copy free SVG icons for popular brands
<!-- - [Say - Spoken Content](https://raycast.com/litomore/say) - macOS built-in Spoken Content interface
- [Color Picker](https://raycast.com/thomas/color-picker) - A simple system-wide color picker -->

## License

CC0-1.0

[raycast-cross-extension-badge]: https://shields.io/badge/Raycast-Cross--Extension-eee?labelColor=FF6363&logo=raycast&logoColor=fff&style=flat-square
