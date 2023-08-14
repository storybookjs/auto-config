import { describe, it, expect } from 'vitest';
import { babelPrint, readConfig } from '@storybook/csf-tools';
import { resolve } from 'node:path';

import { vanillaExtractStrategy } from './vanilla-extract.strategy';
import { SUPPORTED_BUILDERS, StorybookProjectMeta } from '../../../../utils/strategy.utils';
import mockPackageManager from '../../../../fixtures/package-manager.fixture';

describe('CODEMOD: vanilla-extract configuration', () => {
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
        it('WEBPACK: addon-themes should be added to main', async () => {
            const mainConfig = await readConfig(
                resolve(__dirname, '../../../../fixtures/main.react-webpack5.fixture.ts'),
            );

            const meta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-webpack5',
                builder: SUPPORTED_BUILDERS.WEBPACK,
            } satisfies StorybookProjectMeta;

            vanillaExtractStrategy.main(mainConfig, meta);

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
    });
});
