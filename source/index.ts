import {LaunchType, environment, launchCommand} from '@raycast/api';
import {sync as readPackageUpSync} from 'read-pkg-up';

export type LaunchOptions = Parameters<typeof launchCommand>[0];

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
	callbackLaunchOptions?: Partial<LaunchOptions>,
) => {
	if ('ownerOrAuthorName' in options) {
		// eslint-disable-next-line unicorn/prefer-module, @typescript-eslint/no-unsafe-assignment
		const pack = readPackageUpSync({cwd: __dirname}) as any;
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
				type: LaunchType.UserInitiated,
				...callbackLaunchOptions,
			},
		},
	});
};
