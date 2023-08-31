import { colors } from '@storybook/node-logger';

import { createNode, addImports } from '../../../../utils/ast.utils';

import { AddonStylingConfigurationStrategy, CONFIGURATION_STRATEGY_KEYS } from '../../types';
import { buildImports, buildAddonConfig, checkForMissingDependencies } from '../../configure';
import { ChangeSummary } from 'src/utils/strategy.utils';
import { askToInstallMissingDependencies } from '../../helpers';

const projectHasVanillaExtract = (deps: Record<string, string>) => Boolean(deps['@vanilla-extract/css']);

export const vanillaExtractStrategy: AddonStylingConfigurationStrategy = {
    name: CONFIGURATION_STRATEGY_KEYS.VANILLA_EXTRACT,
    predicate: projectHasVanillaExtract,
    main: async (mainConfig, meta) => {
        const summary: ChangeSummary = {
            changed: [],
            nextSteps: [],
        };

        const configMap = {
            postcss: false,
            sass: false,
            less: false,
            vanillaExtract: true,
            cssModules: false,
        };

        // Add imports for required plugins
        const importsNode = createNode(buildImports(configMap));
        addImports(mainConfig._ast, importsNode);

        const [addonConfigNode] = createNode(buildAddonConfig(configMap));

        mainConfig.appendNodeToArray(['addons'], addonConfigNode);
        summary.changed.push(`Configured ${colors.blue.bold('Vanilla-extract')} for ${colors.pink.bold('Storybook')}`);

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
};
