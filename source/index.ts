import {LaunchType, environment, launchCommand} from '@raycast/api';

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
) =>
	launchCommand({
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
