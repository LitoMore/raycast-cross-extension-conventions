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
For example, the [Say](https://raycast.com/litomore/say?via=litomore) extension is using the `typeToSay` arguments-based command for receiving cross-extension parameters.

#### Example

```typescript
import { LaunchProps } from "@raycast/api";
import { LaunchOptions, callbackLaunchCommand } from "raycast-cross-extension";

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

You can search for your extension handle `your-author-name/your-extension-name` from the [`raycast/extensions`](https://github.com/search?q=repo%3Araycast%2Fextensions+language%3AJSON+crossExtensions&type=code) to find that extension using your extension.

## Badges

Show the world your extension implemented Cross-Extension.

[![raycast-cross-extension-badge]][raycast-cross-extension-link]

```markdown
[![](https://shields.io/badge/Raycast-Cross--Extension-eee?labelColor=FF6363&logo=raycast&logoColor=fff&style=flat-square)](https://github.com/LitoMore/raycast-cross-extension-conventions)
```

## Who's using Cross-Extension

### Consumers

- [Badges - shields.io](https://raycast.com/litomore/badges?via=litomore) - Concise, consistent, and legible badges
- [Cursor Directory](https://raycast.com/escwxyz/cursor-directory?via=litomore) - Your cursor.directory in Raycast
- [Iconify](https://raycast.com/destiner/iconify?via=litomore) - Search icons via Iconify
- [Pomodoro](https://raycast.com/asubbotin/pomodoro?via=litomore) - Pomodoro extension with menu-bar timer
- [Steam](https://raycast.com/KevinBatdorf/steam?via=litomore) - Search and view any Steam games
- [United Nations](https://raycast.com/litomore/united-nations?via=litomore) - Peace, dignity and equality on a healthy planet
- [Word Count](https://raycast.com/itsmingjie/word-count?via=litomore) - Count characters, words, sentences, and paragraphs in text

### Providers

- [Brand Icons - simpleicons.org](https://raycast.com/litomore/simple-icons?via=litomore) - Browse, search, and copy free SVG icons for popular brands
- [Color Picker](https://raycast.com/thomas/color-picker?via=litomore) - A simple system-wide color picker
- [Cursor](https://raycast.com/degouville/cursor-recent-projects?via=litomore) - Control Cursor, Cursor & Codium directly from Raycast
- [Do Not Disturb](https://raycast.com/yakitrak/do-not-disturb?via=litomore) - Disable notifications on your Apple devices
- [Language Detector](https://raycast.com/litomore/language-detector?via=litomore) - Detect languages through Raycast AI or third-party language detectors
- [PM2](https://raycast.com/litomore/pm2?via=litomore) - Manage even run your Node.js processes through Raycast
- [ProtonDB](https://raycast.com/litomore/protondb?via=litomore) - Game information for Proton, Linux, Steam Deck, and SteamOS
- [Raycast Port](https://raycast.com/litomore/raycast-port?via=litomore) - Allows you to use Raycast features out of Raycast
- [Raycast Notification](https://raycast.com/maxnyby/raycast-notification?via=litomore) - Makes it easy to display notifications via a quicklink
- [ScreenOCR](https://raycast.com/huzef44/screenocr?via=litomore) - Extract text from screen captures locally via OCR
- [Say - Text to Speech](https://raycast.com/litomore/say?via=litomore) - macOS built-in TTS interface
- [SteamGridDB](https://raycast.com/litomore/steamgriddb?via=litomore) - Browse SteamGridDB images in Raycast

### Utilities

- [raycast-backend-api](https://github.com/LitoMore/raycast-backend-api) - Accessing the Raycast backend API delightfully
- [raycast-hid](https://github.com/LitoMore/raycast-hid) - Access USB HID devices from Raycast
- [raycast-language-detector](https://github.com/LitoMore/raycast-language-detector) - Detect languages through Raycast AI or third-party detectors
- [raycast-notifier](https://github.com/LitoMore/raycast-notifier) - Send cross platform native notifications using Raycast
- [raycast-pm2](https://github.com/LitoMore/raycast-pm2) - PM2 utilities for Raycast Extensions

## License

CC0-1.0

[raycast-cross-extension-badge]: https://shields.io/badge/Raycast-Cross--Extension-eee?labelColor=FF6363&logo=raycast&logoColor=fff&style=flat-square
[raycast-cross-extension-link]: https://github.com/LitoMore/raycast-cross-extension-conventions
