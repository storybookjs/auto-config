import { describe, it, expect, vi } from 'vitest';
import { PackageJson } from '@storybook/types';
import { babelPrint, readConfig } from '@storybook/csf-tools';
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

            const result = babelPrint(mainConfig._ast);

            expect(result).toMatchInlineSnapshot(`
              "import type { StorybookConfig } from \\"@storybook/react-webpack5\\";
              const config: StorybookConfig = {
                stories: [\\"../stories/**/*.stories.@(js|jsx|ts|tsx)\\"],
                addons: [\\"@storybook/addon-essentials\\", '@storybook/themes'],
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
});
