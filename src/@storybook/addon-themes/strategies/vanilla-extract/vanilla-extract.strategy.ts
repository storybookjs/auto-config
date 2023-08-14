import { colors } from '@storybook/node-logger';

import { createNode, addImports } from '../../../../utils/ast.utils';

import { AddonThemesConfigurationStrategy, CONFIGURATION_STRATEGY_KEYS } from '../../types';
import { ChangeSummary } from 'src/utils/strategy.utils';

const projectHasVanillaExtract = (deps: Record<string, string>) => Boolean(deps['@vanilla-extract/css']);

export const vanillaExtractStrategy: AddonThemesConfigurationStrategy = {
    name: CONFIGURATION_STRATEGY_KEYS.VANILLA_EXTRACT,
    predicate: projectHasVanillaExtract,
    main: async (mainConfig, meta) => {
        const summary: ChangeSummary = {
            changed: [],
            nextSteps: [],
        };

        const hasThemesAddon = mainConfig.getFieldValue(['addons']).some((addon: string | { name: string }) => {
            if (typeof addon === 'string') return addon === '@storybook/themes';
            return addon.name === '@storybook/themes';
        });

        if (!hasThemesAddon) {
            mainConfig.appendValueToArray(['addons'], '@storybook/themes');
            summary.changed.push(`Added ${colors.pink.bold('@storybook/themes')} to your addons`);
        }

        return summary;
    },
    preview: async (previewConfig, meta) => {
        const summary: ChangeSummary = {
            changed: [],
            nextSteps: [],
        };

        const globalCssImport = createNode(`
import { withThemeByClassName } from "@storybook/addon-themes";

/* TODO: Update imports for Vanilla-extract theme class names  */
import { lightThemeClass, darkThemeClass } from "../src/theme.ts";`);

        addImports(previewConfig._ast, globalCssImport);

        const [decoratorNode] = createNode(`withThemeByClassName({
    themes: {
        // nameOfTheme: 'classNameForTheme',
        light: lightThemeClass,
        dark: darkThemeClass,
    },
    defaultTheme: 'light',
})`);

        previewConfig.appendNodeToArray(['decorators'], decoratorNode.expression);

        summary.nextSteps.push(
            `Update the import for your Vanilla-extract theme classes in ${colors.blue.bold(previewConfig.fileName)}`,
        );
        summary.changed.push(`Added "${colors.pink.bold('withThemeByClassName')}" to your decorators`);

        return summary;
    },
};
