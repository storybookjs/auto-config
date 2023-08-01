import { PackageJson } from '@storybook/types';
import { colors } from '@storybook/node-logger';

import { hasDependency } from '../../../../utils/metadata.utils';
import { createNode, addImports } from '../../../../utils/ast.utils';

import { AddonStylingConfigurationStrategy, CONFIGURATION_STRATEGY_KEYS } from '../../types';
import { buildImports, buildAddonConfig } from '../../configure';

const projectHasVanillaExtract = (packageJson: PackageJson) =>
    hasDependency(packageJson, '@vanilla-extract/webpack-plugin');

export const vanillaExtractStrategy: AddonStylingConfigurationStrategy = {
    name: CONFIGURATION_STRATEGY_KEYS.VANILLA_EXTRACT,
    predicate: projectHasVanillaExtract,
    main: async (mainConfig, meta) => {
        // Add imports for required plugins
        const importsNode = createNode(
            buildImports({
                vanillaExtract: true,
            }),
        );
        addImports(mainConfig._ast, importsNode);

        const [addonConfigNode] = createNode(
            buildAddonConfig({
                vanillaExtract: true,
            }),
        );

        mainConfig.appendNodeToArray(['addons'], addonConfigNode);

        return {
            changed: [`Configured ${colors.blue.bold('postcss')} for ${colors.blue.bold('webpack')}`],
            nextSteps: [`🚀 Launch ${colors.pink.bold('storybook')}`],
        };
    },
};
