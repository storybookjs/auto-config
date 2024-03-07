import { colors } from '@storybook/node-logger';

import { addImports, createNode } from '../../../../utils/ast.utils';
import { ChangeSummary } from '../../../../utils/strategy.utils';

import { AddonThemesConfigurationStrategy, CONFIGURATION_STRATEGY_KEYS } from '../../types';

const projectHasStyledComponents = (deps: Record<string, string>) => Boolean(deps['styled-components']);

export const styledComponentsStrategy: AddonThemesConfigurationStrategy = {
    name: CONFIGURATION_STRATEGY_KEYS.STYLED_COMPONENTS,
    predicate: projectHasStyledComponents,
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

        const importsNode = createNode(`
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';

/* TODO: update import for your custom theme configurations */
import { lightTheme, darkTheme } from '../path/to/themes';

/* TODO: replace with your own global styles, or remove */
const GlobalStyles = createGlobalStyle\`
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  \`;
`);

        addImports(previewConfig._ast, importsNode);

        const [decoratorNode] = createNode(`
/* Adds global styles and theme switching support. */
withThemeFromJSXProvider({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  defaultTheme: 'light',
  Provider: ThemeProvider,
  GlobalStyles,
  })`);

        previewConfig.appendNodeToArray(['decorators'], decoratorNode.expression);

        return summary;
    },
};
