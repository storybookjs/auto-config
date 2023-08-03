import { colors } from '@storybook/node-logger';
import prompt from 'prompts';

import { addImports, createNode } from '../../../../utils/ast.utils';

import { AddonStylingConfigurationStrategy, CONFIGURATION_STRATEGY_KEYS } from '../../types';
import { buildAddonConfig } from '../../configure';
import { StorybookProjectMeta } from 'src/utils/strategy.utils';

const projectHasTailwind = async ({ packageManager }: StorybookProjectMeta) => {
    const deps = await packageManager.getAllDependencies();

    return !!deps['tailwindcss'] && !!deps['postcss'];
};

export const tailwindStrategy: AddonStylingConfigurationStrategy = {
    name: CONFIGURATION_STRATEGY_KEYS.TAILWIND,
    predicate: projectHasTailwind,
    main: async (mainConfig, meta) => {
        const [addonConfigNode] = createNode(
            buildAddonConfig({
                postcss: true,
            }),
        );

        mainConfig.appendNodeToArray(['addons'], addonConfigNode.expression);

        return {
            changed: [`Configured ${colors.blue.bold('PostCSS')} for ${colors.blue.bold('Webpack')}`],
            nextSteps: [],
        };
    },
    preview: async (previewConfig, meta) => {
        const { importPath } = await prompt(
            {
                type: 'text',
                name: 'importPath',
                message: 'Where is your global CSS file? (relative to the .storybook folder)',
                initial: '../src/tailwind.css',
            },
            { onCancel: () => process.exit(1) },
        );

        const globalCssImport = createNode(`import '${importPath}';`);

        addImports(previewConfig._ast, globalCssImport);

        return {
            changed: [`Imported your global CSS into ${colors.blue.bold(previewConfig.fileName)}`],
            nextSteps: [],
        };
    },
};
