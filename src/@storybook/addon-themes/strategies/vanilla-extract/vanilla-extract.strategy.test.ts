import { describe, it, expect } from 'vitest';
import { printConfig, readConfig } from '@storybook/csf-tools';
import { resolve } from 'node:path';

import { vanillaExtractStrategy } from './vanilla-extract.strategy';
import { SUPPORTED_BUILDERS, StorybookProjectMeta } from '../../../../utils/strategy.utils';
import mockPackageManager from '../../../../fixtures/package-manager.fixture';

describe('[@storybook/addon-themes] CODEMOD: vanilla-extract configuration', () => {
    describe('PREDICATE: should project be configured for vanilla-extract?', () => {
        it('TRUE: it should return true when vanilla-extract is found in package.json', () => {
            const deps = {
                '@vanilla-extract/css': 'latest',
            };

            const result = vanillaExtractStrategy.predicate(deps);

            expect(result).toBeTruthy();
        });

        it('FALSE: it should return false when vanilla-extract is not found in package.json', () => {
            const deps = {
                bootstrap: 'latest',
            };

            const result = vanillaExtractStrategy.predicate(deps);

            expect(result).toBeFalsy();
        });
    });

    describe('MAIN: how should storybook be configured for vanilla-extract', () => {
        it('REGISTRATION: addon-themes should be added to main', async () => {
            const mainConfig = await readConfig(
                resolve(__dirname, '../../../../fixtures/main.react-webpack5.fixture.ts'),
            );

            const meta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-webpack5',
                builder: SUPPORTED_BUILDERS.WEBPACK,
            } satisfies StorybookProjectMeta;

            vanillaExtractStrategy.main(mainConfig, meta);

            const result = printConfig(mainConfig).code;

            expect(result).toMatchInlineSnapshot(`
              "import type { StorybookConfig } from \\"@storybook/react-webpack5\\";
              const config: StorybookConfig = {
                stories: [\\"../stories/**/*.stories.@(js|jsx|ts|tsx)\\"],
                addons: [\\"@storybook/addon-essentials\\", \\"@storybook/themes\\"],
                framework: {
                  name: \\"@storybook/react-webpack5\\",
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

            const meta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-webpack5',
                builder: SUPPORTED_BUILDERS.WEBPACK,
            } satisfies StorybookProjectMeta;

            vanillaExtractStrategy.main(mainConfig, meta);

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

    describe('PREVIEW: how should storybook be configured for vanilla-extract themes', () => {
        it('CLASSNAME: withThemeByClassName should be added to preview', async () => {
            const previewConfig = await readConfig(resolve(__dirname, '../../../../fixtures/preview.fixture.ts'));

            const meta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-webpack5',
                builder: SUPPORTED_BUILDERS.WEBPACK,
            } satisfies StorybookProjectMeta;

            await vanillaExtractStrategy.preview(previewConfig, meta);

            const result = printConfig(previewConfig).code;

            expect(result).toMatchInlineSnapshot(`
              "import type { Preview } from \\"@storybook/react\\";

              import { withThemeByClassName } from \\"@storybook/addon-themes\\";

              /* TODO: Update imports for Vanilla-extract theme class names  */
              import { lightThemeClass, darkThemeClass } from \\"../src/theme.ts\\";

              const preview: Preview = {
                parameters: {
                  theming: {},
                },

                decorators: [withThemeByClassName({
                    themes: {
                        // nameOfTheme: 'classNameForTheme',
                        light: lightThemeClass,
                        dark: darkThemeClass,
                    },
                    defaultTheme: 'light',
                })]
              };

              export default preview;
              "
            `);
        });
    });
});
