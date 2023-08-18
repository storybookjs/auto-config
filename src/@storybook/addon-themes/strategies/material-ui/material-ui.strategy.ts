import { colors } from '@storybook/node-logger';

import { addImports, createNode } from '../../../../utils/ast.utils';
import { ChangeSummary } from '../../../../utils/strategy.utils';

import { AddonThemesConfigurationStrategy, CONFIGURATION_STRATEGY_KEYS } from '../../types';

const projectHasMaterialUI = (deps: Record<string, string>) =>
    Boolean(deps['@mui/material']) && Boolean(deps['@emotion/react']) && Boolean(deps['@emotion/styled']);

export const materialUIStrategy: AddonThemesConfigurationStrategy = {
    name: CONFIGURATION_STRATEGY_KEYS.MATERIAL_UI,
    predicate: projectHasMaterialUI,
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

        const dependencies = await meta.packageManager.getAllDependencies();
        const hasRoboto = Boolean(dependencies['@fontsource/roboto']);

        const importsNode = hasRoboto
            ? createNode(`
    import { ThemeProvider, CssBaseline } from '@mui/material';
    import { withThemeFromJSXProvider } from '@storybook/addon-themes';

    /* TODO: update import for your custom Material UI themes */
    import { lightTheme, darkTheme } from '../path/to/themes';
    
    import '@fontsource/roboto/300.css';
    import '@fontsource/roboto/400.css';
    import '@fontsource/roboto/500.css';
    import '@fontsource/roboto/700.css';
    `)
            : createNode(`
    import { ThemeProvider, CssBaseline } from '@mui/material';
    import { withThemeFromJSXProvider } from '@storybook/addon-themes';

    /* TODO: update import for your custom Material UI themes */
    import { lightTheme, darkTheme } from '../path/to/themes';`);

        addImports(previewConfig._ast, importsNode);

        const [decoratorNode] = createNode(`// Adds global styles and theme switching support.
withThemeFromJSXProvider({
  GlobalStyles: CssBaseline,
  Provider: ThemeProvider,
  themes: {
    // Provide your custom themes here
    light: lightTheme,
    dark: darkTheme,
  },
  defaultTheme: 'light',
})`);

        previewConfig.appendNodeToArray(['decorators'], decoratorNode.expression);

        return summary;
    },
};
