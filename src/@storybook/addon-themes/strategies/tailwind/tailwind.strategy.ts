import { colors } from '@storybook/node-logger';
import prompt from 'prompts';

import { addImports, createNode } from '../../../../utils/ast.utils';

import { AddonThemesConfigurationStrategy, CONFIGURATION_STRATEGY_KEYS } from '../../types';
import { ChangeSummary } from 'src/utils/strategy.utils';

const projectHasTailwind = (deps: Record<string, string>) => Boolean(deps['tailwindcss']) && Boolean(deps['postcss']);

export const tailwindStrategy: AddonThemesConfigurationStrategy = {
    name: CONFIGURATION_STRATEGY_KEYS.TAILWIND,
    predicate: projectHasTailwind,
    main: async (mainConfig, meta) => {
        const summary: ChangeSummary = {
            changed: [],
            nextSteps: [],
        };

        const hasThemesAddon = mainConfig.getFieldValue(['addons']).some((addon: string | { name: string }) => {
            if (typeof addon === 'string') return addon === '@storybook/addon-themes';
            return addon.name === '@storybook/addon-themes';
        });

        if (!hasThemesAddon) {
            mainConfig.appendValueToArray(['addons'], '@storybook/addon-themes');
            summary.changed.push(`Added ${colors.pink.bold('@storybook/addon-themes')} to your addons`);
        }

        return summary;
    },
    preview: async (previewConfig, meta) => {
        const summary: ChangeSummary = {
            changed: [],
            nextSteps: [],
        };

        const { themeStrategy } = await prompt(
            {
                type: 'select',
                name: 'themeStrategy',
                message: 'How do you toggle themes?',
                choices: [
                    { title: 'CSS class', value: 'withThemeByClassName' },
                    { title: 'Data attribute', value: 'withThemeByDataAttribute' },
                ],
            },
            { onCancel: () => process.exit(1) },
        );

        const globalCssImport = createNode(`import { ${themeStrategy} } from "@storybook/addon-themes";`);

        addImports(previewConfig._ast, globalCssImport);

        const [decoratorNode] =
            themeStrategy === 'withThemeByClassName'
                ? createNode(`withThemeByClassName({
    themes: {
        // nameOfTheme: 'classNameForTheme',
        light: '',
        dark: 'dark',
    },
    defaultTheme: 'light',
})`)
                : createNode(`withThemeByDataAttribute({
    themes: {
        // nameOfTheme: 'dataAttributeForTheme',
        light: '',
        dark: 'dark',
    },
    defaultTheme: 'light',
    dataAttribute: 'data-theme',
})`);

        previewConfig.appendNodeToArray(['decorators'], decoratorNode.expression);
        summary.changed.push(`Added "${colors.pink.bold(themeStrategy)}" to your decorators`);

        return summary;
    },
};
