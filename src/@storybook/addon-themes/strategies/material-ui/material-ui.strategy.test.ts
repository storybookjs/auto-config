import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { babelPrint, readConfig } from '@storybook/csf-tools';
import { resolve } from 'node:path';

import { materialUIStrategy } from './material-ui.strategy';
import { StorybookProjectMeta, SUPPORTED_BUILDERS } from '../../../../utils/strategy.utils';
import mockPackageManager from '../../../../fixtures/package-manager.fixture';

describe('[@storybook/addon-themes] CODEMOD: Material UI configuration', () => {
    describe('PREDICATE: should project be configured for Material UI?', () => {
        it('TRUE: it should return true when Material UI is found in package.json', () => {
            const deps = {
                '@mui/material': 'latest',
                '@emotion/react': 'latest',
                '@emotion/styled': 'latest',
            };

            const result = materialUIStrategy.predicate(deps);

            expect(result).toBeTruthy();
        });

        it('FALSE: it should return false when Material UI is not found in package.json', () => {
            const deps = {
                bootstrap: 'latest',
            };

            const result = materialUIStrategy.predicate(deps);

            expect(result).toBeFalsy();
        });
    });

    describe('MAIN: how should storybook be configured for Material UI', () => {
        it('REGISTER: addon-themes should be registered in the addons array without options', async () => {
            const mainConfig = await readConfig(resolve(__dirname, '../../../../fixtures/main.react-vite.fixture.ts'));

            const meta: StorybookProjectMeta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-vite',
                builder: SUPPORTED_BUILDERS.VITE,
            };

            materialUIStrategy.main(mainConfig, meta);

            const result = babelPrint(mainConfig._ast);

            expect(result).toMatchInlineSnapshot(`
          "import type { StorybookConfig } from \\"@storybook/react-vite\\";
          const config: StorybookConfig = {
            stories: [\\"../stories/**/*.stories.@(js|jsx|ts|tsx)\\"],
            addons: [\\"@storybook/addon-essentials\\", '@storybook/themes'],
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

        it('NO DUPLICATION: addon-themes should not be registered in the addons array more than once', async () => {
            const mainConfig = await readConfig(resolve(__dirname, '../../../../fixtures/main.with-themes.fixture.ts'));

            const meta: StorybookProjectMeta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-vite',
                builder: SUPPORTED_BUILDERS.VITE,
            };

            materialUIStrategy.main(mainConfig, meta);

            const result = babelPrint(mainConfig._ast);

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

    describe('PREVIEW: how should storybook preview be configured for Material UI', () => {
        beforeEach(() => {
            vi.restoreAllMocks();
        });

        it('NO FONT: Preview.ts should be updated with the imports, theme decorator, and a todo for importing fonts', async () => {
            const previewConfig = await readConfig(resolve(__dirname, '../../../../fixtures/preview.fixture.ts'));
            const meta: StorybookProjectMeta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-vite',
                builder: SUPPORTED_BUILDERS.VITE,
            };

            await materialUIStrategy.preview(previewConfig, meta);

            const result = babelPrint(previewConfig._ast);

            expect(result).toMatchInlineSnapshot(`
              "import type { Preview } from \\"@storybook/react\\";

              import { ThemeProvider, CssBaseline } from '@mui/material';
              import { withThemeFromJSXProvider } from '@storybook/addon-themes';

              /* TODO: update import for your custom Material UI themes */
              import { lightTheme, darkTheme } from '../path/to/themes';

              const preview: Preview = {
                parameters: {
                  theming: {},
                },

                decorators: [withThemeFromJSXProvider({
                  GlobalStyles: CssBaseline,
                  Provider: ThemeProvider,
                  themes: {
                    // Provide your custom themes here
                    light: lightTheme,
                    dark: darkTheme,
                  },
                  defaultTheme: 'light',
                })],
              };

              export default preview;
              "
            `);
        });

        it('FONT: Preview.ts should be updated with the imports, theme decorator, and roboto fonts', async () => {
            mockPackageManager.getAllDependencies = vi.fn().mockResolvedValue({
                '@fontsource/roboto': 'latest',
            });

            const previewConfig = await readConfig(resolve(__dirname, '../../../../fixtures/preview.fixture.ts'));

            const meta: StorybookProjectMeta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-vite',
                builder: SUPPORTED_BUILDERS.VITE,
            };

            await materialUIStrategy.preview(previewConfig, meta);

            const result = babelPrint(previewConfig._ast);

            expect(result).toMatchInlineSnapshot(`
              "import type { Preview } from \\"@storybook/react\\";

              import { ThemeProvider, CssBaseline } from '@mui/material';
              import { withThemeFromJSXProvider } from '@storybook/addon-themes';

              /* TODO: update import for your custom Material UI themes */
              import { lightTheme, darkTheme } from '../path/to/themes';

              import '@fontsource/roboto/300.css';
              import '@fontsource/roboto/400.css';
              import '@fontsource/roboto/500.css';
              import '@fontsource/roboto/700.css';

              const preview: Preview = {
                parameters: {
                  theming: {},
                },

                decorators: [withThemeFromJSXProvider({
                  GlobalStyles: CssBaseline,
                  Provider: ThemeProvider,
                  themes: {
                    // Provide your custom themes here
                    light: lightTheme,
                    dark: darkTheme,
                  },
                  defaultTheme: 'light',
                })],
              };

              export default preview;
              "
            `);
        });
    });
});
