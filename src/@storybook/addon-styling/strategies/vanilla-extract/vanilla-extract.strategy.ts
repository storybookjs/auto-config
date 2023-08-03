import { colors } from '@storybook/node-logger';

import { createNode, addImports } from '../../../../utils/ast.utils';

import { AddonStylingConfigurationStrategy, CONFIGURATION_STRATEGY_KEYS } from '../../types';
import { buildImports, buildAddonConfig } from '../../configure';
import { StorybookProjectMeta } from 'src/utils/strategy.utils';

const projectHasVanillaExtract = async ({ packageManager }: StorybookProjectMeta) => {
    const deps = await packageManager.getAllDependencies();

    return !!deps['@vanilla-extract/css'];
};

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
