import { PackageJson } from '@storybook/types';
import { colors } from '@storybook/node-logger';

import { hasDependency } from '../../../../utils/metadata.utils';
import { createNode } from '../../../../utils/ast.utils';

import { AddonStylingConfigurationStrategy, CONFIGURATION_STRATEGY_KEYS } from '../../types';
import { buildAddonConfig } from '../../configure';

const projectHasTailwind = (packageJson: PackageJson) =>
    hasDependency(packageJson, 'tailwindcss') && hasDependency(packageJson, 'postcss');

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
            changed: [`Configured ${colors.blue.bold('postcss')} for ${colors.blue.bold('webpack')}`],
            nextSteps: [`🚀 Launch ${colors.pink.bold('storybook')}`],
        };
    },
};
