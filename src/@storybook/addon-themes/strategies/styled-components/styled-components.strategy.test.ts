import { describe, it, expect } from 'vitest';
import { printConfig, readConfig } from '@storybook/csf-tools';
import { resolve } from 'node:path';

import { styledComponentsStrategy } from './styled-components.strategy';
import { SUPPORTED_BUILDERS, StorybookProjectMeta } from '../../../../utils/strategy.utils';
import mockPackageManager from '../../../../fixtures/package-manager.fixture';

describe('[@storybook/addon-themes] CODEMOD: Styled Components configuration', () => {
    describe('PREDICATE: should project be configured for Styled Components?', () => {
        it('TRUE: it should return true when Styled Components is found in package.json', () => {
            const deps = {
                'styled-components': 'latest',
            };

            const result = styledComponentsStrategy.predicate(deps);

            expect(result).toBeTruthy();
        });

        it('FALSE: it should return false when Styled Components is not found in package.json', () => {
            const deps = {
                bootstrap: 'latest',
            };

            const result = styledComponentsStrategy.predicate(deps);

            expect(result).toBeFalsy();
        });
    });

    describe('MAIN: how should storybook be configured for Styled Components', () => {
        it('REGISTER: addon-themes should be registered in the addons array', async () => {
            const mainConfig = await readConfig(resolve(__dirname, '../../../../fixtures/main.react-vite.fixture.ts'));

            const meta: StorybookProjectMeta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-vite',
                builder: SUPPORTED_BUILDERS.VITE,
            };

            styledComponentsStrategy.main(mainConfig, meta);

            const result = printConfig(mainConfig).code;

            expect(result).toMatchInlineSnapshot(`
              "import type { StorybookConfig } from \\"@storybook/react-vite\\";
              const config: StorybookConfig = {
                stories: [\\"../stories/**/*.stories.@(js|jsx|ts|tsx)\\"],
                addons: [\\"@storybook/addon-essentials\\", \\"@storybook/themes\\"],
                framework: {
                  name: \\"@storybook/react-vite\\",
                  options: {},
                },
                docs: {
                  autodocs: true,
                },
              };
              export default config;
              "
            `);
        });

        it('NO DUPLICATION: addon-themes should not be added more than once', async () => {
            const mainConfig = await readConfig(resolve(__dirname, '../../../../fixtures/main.with-themes.fixture.ts'));

            const meta: StorybookProjectMeta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-vite',
                builder: SUPPORTED_BUILDERS.VITE,
            };

            styledComponentsStrategy.main(mainConfig, meta);

            const result = printConfig(mainConfig).code;

            expect(result).toMatchInlineSnapshot(`
              "import type { StorybookConfig } from '@storybook/react-webpack5';
              const config: StorybookConfig = {
                  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
                  addons: ['@storybook/addon-essentials', '@storybook/themes'],
                  framework: {
                      name: '@storybook/react-webpack5',
                      options: {},
                  },
                  docs: {
                      autodocs: true,
                  },
              };
              export default config;
              "
            `);
        });
    });

    describe('PREVIEW: how should storybook preview be configured for Styled Components', () => {
        it('CONFIGURE: Preview.ts should be updated with the imports and theme decorator', async () => {
            const previewConfig = await readConfig(resolve(__dirname, '../../../../fixtures/preview.fixture.ts'));
            const meta: StorybookProjectMeta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-vite',
                builder: SUPPORTED_BUILDERS.VITE,
            };

            styledComponentsStrategy.preview(previewConfig, meta);

            const result = printConfig(previewConfig).code;

            expect(result).toMatchInlineSnapshot(`
              "import type { Preview } from \\"@storybook/react\\";

              import { createGlobalStyle, ThemeProvider } from 'styled-components';
              import { withThemeFromJSXProvider } from '@storybook/addon-themes';

              /* TODO: update import for your custom theme configurations */
              import { lightTheme, darkTheme } from '../path/to/themes';

              /* TODO: replace with your own global styles, or remove */
              const GlobalStyles = createGlobalStyle\`
                body {
                  font-family: \\"Helvetica Neue\\", Helvetica, Arial, sans-serif;
                }
                \`;

              const preview: Preview = {
                parameters: {
                  theming: {},
                },

                decorators: [withThemeFromJSXProvider({
                  themes: {
                    light: lightTheme,
                    dark: darkTheme,
                  },
                  defaultTheme: 'light',
                  Provider: ThemeProvider,
                  GlobalStyles,
                  })]
              };

              export default preview;
              "
            `);
        });
    });
});
