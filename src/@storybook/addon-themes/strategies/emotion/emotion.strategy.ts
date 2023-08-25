import { logger, colors } from '@storybook/node-logger';

import { ChangeSummary } from '../../../../utils/strategy.utils';
import { addImports, createNode } from '../../../../utils/ast.utils';
import { AddonThemesConfigurationStrategy, CONFIGURATION_STRATEGY_KEYS } from '../../types';

const projectHasEmotion = (deps: Record<string, string>) => Boolean(deps['@emotion/react']);

export const emotionStrategy: AddonThemesConfigurationStrategy = {
    name: CONFIGURATION_STRATEGY_KEYS.EMOTION,
    predicate: projectHasEmotion,
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

        const importsNode = createNode(`
    import { Global, css, ThemeProvider } from '@emotion/react';
    import { withThemeFromJSXProvider } from '@storybook/addon-styling-webpack';

    /* TODO: update import for your custom theme configurations */
    import { lightTheme, darkTheme } from '../path/to/themes';
    
    /* TODO: replace with your own global styles, or remove */
    const GlobalStyles = () => (
        <Global
          styles={css\`
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }
          \`}
        />
      );
    `);

        addImports(previewConfig._ast, importsNode);

        const [decoratorNode] = createNode(`// Adds global styles and theme switching support.
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
        summary.changed.push(`Added "${colors.pink.bold('withThemeFromJSXProvider')}" to your decorators`);

        return summary;
    },
};
