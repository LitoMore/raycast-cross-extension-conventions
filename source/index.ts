import {LaunchType, environment, launchCommand} from '@raycast/api';
import {sync as readPackageUpSync} from 'read-pkg-up';

export type LaunchOptions = Parameters<typeof launchCommand>[0];

export type CallbackLaunchOptions = Partial<LaunchOptions> | false;

export const callbackLaunchCommand = async (
	options: LaunchOptions,
	result?: LaunchOptions['context'],
) =>
	launchCommand({
		...options,
		context: {
			...options.context,
			...result,
		},
	});

export const crossLaunchCommand = async (
	options: LaunchOptions,
	callbackLaunchOptions?: CallbackLaunchOptions,
) => {
	if (callbackLaunchOptions === false) {
		return launchCommand(options);
	}

	// eslint-disable-next-line unicorn/prefer-module, @typescript-eslint/no-unsafe-assignment
	const pack = readPackageUpSync({cwd: __dirname, normalize: false}) as any;
	const ownerOrAuthorName =
		// The `ownerOrAuthorName` was introduced in @raycast/api@1.78.0. We use a fallback to support older versions.
		environment.ownerOrAuthorName ??
		((pack?.packageJson?.owner ?? pack?.packageJson?.author) as string);

	if ('ownerOrAuthorName' in options) {
		const targetHandle = `${options.ownerOrAuthorName}/${options.extensionName}`;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		if (!pack?.packageJson?.crossExtensions?.includes(targetHandle)) {
			const message = `Target extension '${targetHandle}' should be listed in 'crossExtensions' of package.json.`;
			console.error(message);
			return;
		}
	}

	return launchCommand({
		...options,
		context: {
			...options.context,
			callbackLaunchOptions: {
				name: environment.commandName,
				extensionName: environment.extensionName,
				ownerOrAuthorName,
				type: LaunchType.UserInitiated,
				...callbackLaunchOptions,
			},
		},
	});
};
