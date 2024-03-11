import { writeConfig } from '@storybook/csf-tools';
import { JsPackageManagerFactory } from '@storybook/cli';
import { colors } from '@storybook/node-logger';
import dedent from 'dedent';

import {
    printWelcome,
    ConfigSummary,
    buildPackageManagerCommand,
    printScriptSummary,
    printWarning,
} from '../../utils/output.utils';
import { getMainConfig, getPreviewConfig } from '../../utils/configs.utils';
import { Builder, buildStorybookProjectMeta } from '../../utils/metadata.utils';

import { selectAddonThemesStrategy } from './strategies';
import { buildSummary } from './helpers';

export interface Options {}

const autoConfigure = async ({}: Options = {}) => {
    printWelcome('@storybook/addon-themes');

    // Step 1: load Storybook config files
    const packageManager = JsPackageManagerFactory.getPackageManager();
    const mainConfig = await getMainConfig();
    const previewConfig = await getPreviewConfig();

    // Step 3: Build project meta
    const projectMeta = buildStorybookProjectMeta(mainConfig, packageManager);

    // Step 4: Determine configuration strategy
    const strategy = await selectAddonThemesStrategy(projectMeta);

    if (!strategy) {
        printWarning(
            `❌ No theming tool recognized`,
            dedent`To learn how to manually configure themes for your stories, visit our documentation.
            
            ${colors.blue('https://github.com/storybookjs/storybook/blob/main/code/addons/themes/docs/api.md')}`,
        );

        process.exit(0);
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
    summary.nextSteps.push(`💡 Switch between themes using the switcher in the Toolbar`);

    // Step 7: End of script
    printScriptSummary(buildSummary)(summary);
};

export default autoConfigure;
