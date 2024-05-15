# raycast-cross-extensions-conventions

Defines the development approach for cross-extension in Raycast

## Background

Raycast has tons of extensions so far. But most of them are standalone, it’s hard to use their ability from other extensions.

## Expose Extension Ability

### Declare acceptable parameters

Incoming parameters can be passed from [`LaunchContext`](https://developers.raycast.com/api-reference/command#launchcontext).

The `callbackLaunchOptions` is used for running the callback `launchCommand()` to the source extension.

You need to catch exceptions from `launchCommand()` if the target command is not installed. The [`open()`](https://developers.raycast.com/api-reference/utilities#open) redirects to the Store when `launchCommand()` errored.

#### Accept Parameters

```typescript
import { open, launchCommand, LaunchProps } from "@raycast/api";

type LaunchOptions = Parameters<typeof launchCommand>[0];

type LaunchContext = {
  foo?: string;
  bar?: string;
  callbackLaunchOptions?: LaunchOptions;
};

export default function Command({
  launchContext = {},
}: LaunchProps<{ launchContext?: LaunchContext }>) {
  const { foo, bar } = launchContext;
  // ...
  launchCommand({
    ...callbackLaunchOptions,
    context: {
      launchFromExtensionName: "your-extension-name",
      launchFromExtensionAuthor: "your-author-name",
      result: "foo",
    },
  }).catch(() => {
    open(
      "raycast://extensions/target-extension-author-name/target-extension-name"
    );
  });
}
```

#### Source Extension

```typescript
import { launchCommand, LaunchType } from "@raycast/api";

launchCommand({
  name: "target-command-name",
  type: LaunchType.UserInitiated,
  extensionName: "target-extension-name",
  ownerOrAuthorName: "target-extension-author-name",
  context: {
    foo: "foo",
    bar: "bar",
    callbackLaunchOptions: {
      name: "your-command-name",
      type: LaunchType.UserInitiated, // Or `LaunchType.Background`
      extensionName: "your-extension-name",
      ownerOrAuthorName: "your-author-name",
    },
  },
});
```

Please note passing parameters through [`Arguments`](https://developers.raycast.com/information/lifecycle/arguments) is not recommneded since it supports string only.

## Badges

Show the world your extension implemented Cross-Extension.

![raycast-cross-extension-badge]

```markdown
![](https://shields.io/badge/Raycast-Cross--Extension-eee?labelColor=FF6363&logo=raycast&logoColor=fff&style=flat-square)
```

## Who's using Cross-Extension

- [Badges - shields.io](https://raycast.com/litomore/badges) - Concise, consistent, and legible badges
- [Brand Icons - simpleicons.org](https://raycast.com/litomore/simple-icons) - Browse, search, and copy free SVG icons for popular brands
- [Say - Spoken Content](https://raycast.com/litomore/say) - macOS built-in Spoken Content interface

## License

CC0-1.0

[raycast-cross-extension-badge]: https://shields.io/badge/Raycast-Cross--Extension-eee?labelColor=FF6363&logo=raycast&logoColor=fff&style=flat-square
