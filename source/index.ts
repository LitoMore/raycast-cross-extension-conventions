import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {LaunchType, environment, launchCommand} from '@raycast/api';

export type LaunchOptions = Parameters<typeof launchCommand>[0];

export type CallbackLaunchOptions = Partial<LaunchOptions> | false;

type PackageJson = {
	owner?: string;
	author?: string;
	crossExtensions?: string[];
};

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

	const content = await readFile(
		join(environment.assetsPath, '..', 'package.json'),
		'utf8',
	);

	let pack: PackageJson = {};
	try {
		pack = JSON.parse(content) as PackageJson;
	} catch {}

	console.log(pack);

	const ownerOrAuthorName =
		// The `ownerOrAuthorName` was introduced in @raycast/api@1.78.0. We use a fallback to support older versions.
		environment.ownerOrAuthorName ?? (pack?.owner ?? pack?.author)!;

	if ('ownerOrAuthorName' in options) {
		const targetHandle = `${options.ownerOrAuthorName}/${options.extensionName}`;
		if (!pack?.crossExtensions?.includes(targetHandle)) {
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
				name: environment.entryPointName,
				extensionName: environment.extensionName,
				ownerOrAuthorName,
				type: LaunchType.UserInitiated,
				...callbackLaunchOptions,
			},
		},
	});
};
