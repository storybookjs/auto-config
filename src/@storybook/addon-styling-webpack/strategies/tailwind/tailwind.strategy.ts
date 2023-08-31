import { logger, colors } from '@storybook/node-logger';
import prompt from 'prompts';

import { addImports, createNode } from '../../../../utils/ast.utils';

import { AddonStylingConfigurationStrategy, CONFIGURATION_STRATEGY_KEYS } from '../../types';
import { buildAddonConfig, checkForMissingDependencies } from '../../configure';
import { ChangeSummary } from 'src/utils/strategy.utils';
import { printWarning } from 'src/utils/output.utils';
import { askToInstallMissingDependencies } from '../../helpers';

const projectHasTailwind = (deps: Record<string, string>) => Boolean(deps['tailwindcss']) && Boolean(deps['postcss']);

export const tailwindStrategy: AddonStylingConfigurationStrategy = {
    name: CONFIGURATION_STRATEGY_KEYS.TAILWIND,
    predicate: projectHasTailwind,
    main: async (mainConfig, meta) => {
        const summary: ChangeSummary = {
            changed: [],
            nextSteps: [],
        };

        const configMap = {
            postcss: true,
            sass: false,
            less: false,
            vanillaExtract: false,
            cssModules: false,
        };

        const [addonConfigNode] = createNode(buildAddonConfig(configMap));

        mainConfig.appendNodeToArray(['addons'], addonConfigNode.expression);

        summary.changed.push(`Configured ${colors.blue.bold('PostCSS')} for ${colors.blue.bold('Webpack')}`);

        const missingDependencies = await checkForMissingDependencies(meta.packageManager, configMap);

        if (Object.keys(missingDependencies).length > 0) {
            const installDependencies = await askToInstallMissingDependencies(missingDependencies);

            if (installDependencies) {
                await meta.packageManager.addDependencies(
                    { installAsDevDependencies: true },
                    Object.entries(missingDependencies).map(([name, version]) =>
                        version === '' ? name : `${name}@${version}`,
                    ),
                );

                summary.changed.push(`Installed dependencies for configuration`);
            } else {
                summary.nextSteps.push(
                    `Install ${colors.blue.bold(
                        Object.keys(missingDependencies).join(', '),
                    )} to complete the configuration`,
                );
            }
        }

        return summary;
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
