import { describe, it, expect, vi } from 'vitest';
import { PackageJson } from '@storybook/types';
import { printConfig, readConfig } from '@storybook/csf-tools';
import prompt from 'prompts';
import { resolve } from 'node:path';

import { tailwindStrategy } from './tailwind.strategy';
import { SUPPORTED_BUILDERS, StorybookProjectMeta } from '../../../../utils/strategy.utils';
import mockPackageManager from '../../../../fixtures/package-manager.fixture';

describe('[@storybook/addon-themes] CODEMOD: tailwind configuration', () => {
    describe('PREDICATE: should project be configured for tailwind?', () => {
        it('TRUE: it should return true when tailwind is found in package.json', () => {
            const deps = {
                tailwindcss: 'latest',
                postcss: ' latest',
            };

            const result = tailwindStrategy.predicate(deps);

            expect(result).toBeTruthy();
        });
        it('FALSE: it should return false when tailwind is not found in package.json', () => {
            const packageJson: PackageJson = {
                dependencies: { bootstrap: 'latest' },
                devDependencies: {},
            };

            const result = tailwindStrategy.predicate(packageJson);

            expect(result).toBeFalsy();
        });
    });

    describe('MAIN: how should storybook be configured for tailwind', () => {
        it('REGISTER: addon-themes should be added to the addons array', async () => {
            const mainConfig = await readConfig(
                resolve(__dirname, '../../../../fixtures/main.react-webpack5.fixture.ts'),
            );
            const meta: StorybookProjectMeta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-webpack5',
                builder: SUPPORTED_BUILDERS.WEBPACK,
            };

            tailwindStrategy.main(mainConfig, meta);

            const result = printConfig(mainConfig).code;

            expect(result).toMatchInlineSnapshot(`
              "import type { StorybookConfig } from \\"@storybook/react-webpack5\\";
              const config: StorybookConfig = {
                stories: [\\"../stories/**/*.stories.@(js|jsx|ts|tsx)\\"],
                addons: [\\"@storybook/addon-essentials\\", \\"@storybook/addon-themes\\"],
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

        it('NO DUPLICATION: addon-themes should not be added twice to the addons array', async () => {
            const mainConfig = await readConfig(resolve(__dirname, '../../../../fixtures/main.with-themes.fixture.ts'));
            const meta: StorybookProjectMeta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-webpack5',
                builder: SUPPORTED_BUILDERS.WEBPACK,
            };

            tailwindStrategy.main(mainConfig, meta);

            const result = printConfig(mainConfig).code;

            expect(result).toMatchInlineSnapshot(`
              "import type { StorybookConfig } from '@storybook/react-webpack5';
              const config: StorybookConfig = {
                  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
                  addons: ['@storybook/addon-essentials', '@storybook/addon-themes'],
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

    describe("PREVIEW: how should storybook's preview be configured for themes", () => {
        it('CLASSNAME: withThemeByClassName should be configured when the user selects className', async () => {
            const previewConfig = await readConfig(resolve(__dirname, '../../../../fixtures/preview.fixture.ts'));
            const meta: StorybookProjectMeta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-webpack5',
                builder: SUPPORTED_BUILDERS.WEBPACK,
            };

            prompt.inject(['withThemeByClassName']);

            await tailwindStrategy.preview(previewConfig, meta);

            const result = printConfig(previewConfig).code;

            expect(result).toMatchInlineSnapshot(`
              "import type { Preview } from \\"@storybook/react\\";

              import { withThemeByClassName } from \\"@storybook/addon-themes\\";

              const preview: Preview = {
                parameters: {
                  theming: {},
                },

                decorators: [withThemeByClassName({
                    themes: {
                        // nameOfTheme: 'classNameForTheme',
                        light: '',
                        dark: 'dark',
                    },
                    defaultTheme: 'light',
                })]
              };

              export default preview;
              "
            `);
        });

        it('DATA ATTRIBUTE: withThemeByDataAttribute should be configured when the user selects data-attribute', async () => {
            const previewConfig = await readConfig(resolve(__dirname, '../../../../fixtures/preview.fixture.ts'));
            const meta: StorybookProjectMeta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-webpack5',
                builder: SUPPORTED_BUILDERS.WEBPACK,
            };

            prompt.inject(['withThemeByDataAttribute']);
            await tailwindStrategy.preview(previewConfig, meta);

            const result = printConfig(previewConfig).code;

            expect(result).toMatchInlineSnapshot(`
              "import type { Preview } from \\"@storybook/react\\";

              import { withThemeByDataAttribute } from \\"@storybook/addon-themes\\";

              const preview: Preview = {
                parameters: {
                  theming: {},
                },

                decorators: [withThemeByDataAttribute({
                    themes: {
                        // nameOfTheme: 'dataAttributeForTheme',
                        light: '',
                        dark: 'dark',
                    },
                    defaultTheme: 'light',
                    dataAttribute: 'data-theme',
                })]
              };

              export default preview;
              "
            `);
        });
    });
});
