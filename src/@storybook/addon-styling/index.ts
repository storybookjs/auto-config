import { PackageJson } from '@storybook/types';
import { writeConfig } from '@storybook/csf-tools';

import { printWelcome } from '../../utils/output.utils';
import { isGitClean } from '../../utils/git.utils';
import { commonQuestions } from '../../utils/prompts.utils';
import { getPackageJson } from '../../utils/package-json.utils';
import { getMainConfig, getPreviewConfig } from '../../utils/configs.utils';
import { Builder, buildStorybookProjectMeta } from '../../utils/metadata.utils';

import { selectAddonStylingStrategy } from './strategies';
import { ConfigSummary, Errors, printScriptSummary } from './helpers';

const automigrate = async () => {
    printWelcome('@storybook/addon-styling');

    const isGitDirty = (await isGitClean()) === false;

    if (isGitDirty) {
        const shouldQuit = await commonQuestions.shouldQuitWithDirtyGit();
        if (shouldQuit) return;
    }

    // Step 1: load package.json and Storybook config files
    const packageJson: PackageJson = getPackageJson();
    const mainConfig = await getMainConfig();
    const previewConfig = await getPreviewConfig();

    // Step 3: Build project meta
    const projectMeta = buildStorybookProjectMeta(mainConfig, packageJson);

    if (Builder.isNot.webpack(projectMeta)) {
        Errors.unsupportedBuilder();
        return;
    }

    // Step 4: Determine configuration strategy
    const strategy = selectAddonStylingStrategy(projectMeta);

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

    // Step 7: End of script
    printScriptSummary(summary);
};

export default automigrate;
