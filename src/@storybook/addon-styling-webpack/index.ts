import { writeConfig } from '@storybook/csf-tools';
import { JsPackageManagerFactory } from '@storybook/cli';
import { colors } from '@storybook/node-logger';
import dedent from 'dedent';

import {
    printInfo,
    printWelcome,
    ConfigSummary,
    buildPackageManagerCommand,
    printScriptSummary,
} from '../../utils/output.utils';
import { isGitClean } from '../../utils/git.utils';
import { commonQuestions } from '../../utils/prompts.utils';
import { getMainConfig, getPreviewConfig } from '../../utils/configs.utils';
import { Builder, buildStorybookProjectMeta } from '../../utils/metadata.utils';

import { selectAddonStylingStrategy } from './strategies';
import { Errors, buildSummary } from './helpers';

export interface Options {}

const autoConfigure = async ({}: Options = {}) => {
    printWelcome('@storybook/addon-styling-webpack');

    try {
        const isGitDirty = (await isGitClean()) === false;

        if (isGitDirty) {
            const shouldQuit = await commonQuestions.shouldQuitWithDirtyGit();
            if (shouldQuit) return;
        }
    } catch (e) {
        const shouldQuit = await commonQuestions.shouldQuitWithoutGit();
        if (shouldQuit) return;
    }

    // Step 1: load Storybook config files
    const packageManager = JsPackageManagerFactory.getPackageManager();
    const mainConfig = await getMainConfig();
    const previewConfig = await getPreviewConfig();

    // Step 3: Build project meta
    const projectMeta = buildStorybookProjectMeta(mainConfig, packageManager);

    if (Builder.isNot.webpack(projectMeta)) {
        Errors.unsupportedBuilder();
        return;
    }

    // Step 4: Determine configuration strategy
    const strategy = await selectAddonStylingStrategy(projectMeta);

    if (strategy.name !== 'custom') {
        printInfo(
            `🔎 I found something to configure`,
            dedent`Configuring your Storybook for "${colors.blue.bold(strategy.name)}".
        
            Hold on for a second while I make some changes...`,
        );
    }

    const summary: ConfigSummary = {
        strategy: strategy.name,
        changed: [],
        nextSteps: [],
    };

    // Step 5: Make any required updates to .storybook/main.ts
    if (strategy?.main) {
        const { changed, nextSteps } = await strategy?.main(mainConfig, projectMeta);
        await writeConfig(mainConfig);

        summary.changed.push(...changed);
        summary.nextSteps.push(...nextSteps);
    }

    // Step 6: Make any required updates to .storybook/preview.ts
    if (strategy?.preview) {
        // Make updates to preview
        const { changed, nextSteps } = await strategy?.preview(previewConfig, projectMeta);
        await writeConfig(previewConfig);

        summary.changed.push(...changed);
        summary.nextSteps.push(...nextSteps);
    }

    const sbCommand = buildPackageManagerCommand(packageManager, 'storybook');
    summary.nextSteps.push(`🚀 Run: ${colors.green.bold(sbCommand)}`);

    // Step 7: End of script
    printScriptSummary(buildSummary)(summary);
};

export default autoConfigure;
