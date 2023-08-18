import { describe, it, expect } from 'vitest';
import { printConfig, readConfig } from '@storybook/csf-tools';
import { resolve } from 'node:path';

import prompts from 'prompts';

import { customStrategy } from './custom.strategy';
import { SUPPORTED_BUILDERS, StorybookProjectMeta } from '../../../../utils/strategy.utils';
import mockPackageManager from '../../../../fixtures/package-manager.fixture';

describe('CODEMOD: fallback configuration', () => {
    describe('MAIN: how should storybook be configured for fallback scenarios', () => {
        it('WEBPACK: addon-styling should be configured with the requested postcss support', async () => {
            const mainConfig = await readConfig(
                resolve(__dirname, '../../../../fixtures/main.react-webpack5.fixture.ts'),
            );
            const meta: StorybookProjectMeta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-webpack5',
                builder: SUPPORTED_BUILDERS.WEBPACK,
            };

            prompts.inject([['postcss']]);

            await customStrategy.main(mainConfig, meta);

            const result = printConfig(mainConfig).code;

            expect(result).toMatchInlineSnapshot(`
              "import type { StorybookConfig } from \\"@storybook/react-webpack5\\";
              const config: StorybookConfig = {
                stories: [\\"../stories/**/*.stories.@(js|jsx|ts|tsx)\\"],
                addons: [\\"@storybook/addon-essentials\\", {
                  name: \\"@storybook/addon-styling-webpack\\",

                  options: {
                    rules: [{
                  test: /\\\\.css$/,
                  sideEffects: true,
                  use: [
                      require.resolve(\\"style-loader\\"),
                      {
                          loader: require.resolve(\\"css-loader\\"),
                          options: {
                              
                              importLoaders: 1,
                          },
                      },{
                loader: require.resolve(\\"postcss-loader\\"),
                options: {
                implementation: require.resolve(\\"postcss\\"),
                },
                },
                  ],
                },],
                  }
                }],
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

        it('WEBPACK: addon-styling should be configured with the requested postcss and sass support', async () => {
            const mainConfig = await readConfig(
                resolve(__dirname, '../../../../fixtures/main.react-webpack5.fixture.ts'),
            );
            const meta: StorybookProjectMeta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-webpack5',
                builder: SUPPORTED_BUILDERS.WEBPACK,
            };

            prompts.inject([['postcss', 'sass']]);
            await customStrategy.main(mainConfig, meta);

            const result = printConfig(mainConfig).code;

            expect(result).toMatchInlineSnapshot(`
              "import type { StorybookConfig } from \\"@storybook/react-webpack5\\";
              const config: StorybookConfig = {
                stories: [\\"../stories/**/*.stories.@(js|jsx|ts|tsx)\\"],
                addons: [\\"@storybook/addon-essentials\\", {
                    name: \\"@storybook/addon-styling-webpack\\",

                    options: {
                      rules: [{
                    test: /\\\\.css$/,
                    sideEffects: true,
                    use: [
                        require.resolve(\\"style-loader\\"),
                        {
                            loader: require.resolve(\\"css-loader\\"),
                            options: {
                                
                                importLoaders: 1,
                            },
                        },{
                  loader: require.resolve(\\"postcss-loader\\"),
                  options: {
                  implementation: require.resolve(\\"postcss\\"),
                  },
                  },
                    ],
                  },{
                    test: /\\\\.s[ac]ss$/,
                    sideEffects: true,
                    use: [
                        require.resolve(\\"style-loader\\"),
                        {
                            loader: require.resolve(\\"css-loader\\"),
                            options: {
                                
                                importLoaders: 3,
                            },
                        },{
                  loader: require.resolve(\\"postcss-loader\\"),
                  options: {
                  implementation: require.resolve(\\"postcss\\"),
                  },
                  },
                        require.resolve(\\"resolve-url-loader\\"),
                        {
                            loader: require.resolve(\\"sass-loader\\"),
                            options: {
                                // Want to add more Sass options? Read more here: https://webpack.js.org/loaders/sass-loader/#options
                                implementation: require.resolve(\\"sass\\"),
                                sourceMap: true,
                                sassOptions: {},
                            },
                        },
                    ],
                  },],
                    }
                }],
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

        it('WEBPACK: addon-styling should be configured with the requested less and vanilla-extract support', async () => {
            const mainConfig = await readConfig(
                resolve(__dirname, '../../../../fixtures/main.react-webpack5.fixture.ts'),
            );
            const meta: StorybookProjectMeta = {
                packageManager: mockPackageManager,
                framework: '@storybook/react-webpack5',
                builder: SUPPORTED_BUILDERS.WEBPACK,
            };

            prompts.inject([['less', 'vanillaExtract']]);
            await customStrategy.main(mainConfig, meta);

            const result = printConfig(mainConfig).code;

            expect(result).toMatchInlineSnapshot(`
              "import type { StorybookConfig } from \\"@storybook/react-webpack5\\";
              import { VanillaExtractPlugin } from \\"@vanilla-extract/webpack-plugin\\";
              import MiniCssExtractPlugin from \\"mini-css-extract-plugin\\";
              const config: StorybookConfig = {
                stories: [\\"../stories/**/*.stories.@(js|jsx|ts|tsx)\\"],
                addons: [\\"@storybook/addon-essentials\\", {
                    name: \\"@storybook/addon-styling-webpack\\",

                    options: {plugins: [new VanillaExtractPlugin(), new MiniCssExtractPlugin()],
                      rules: [{
                    test: /\\\\.css$/,
                    sideEffects: true,
                    use: [
                        require.resolve(\\"style-loader\\"),
                        {
                            loader: require.resolve(\\"css-loader\\"),
                            options: {
                                
                                
                            },
                        },
                    ],exclude: /\\\\.vanilla\\\\.css$/,
                  },{
                  // Targets only CSS files generated by vanilla-extract
                  test: /\\\\.vanilla\\\\.css$/i,
                  sideEffects: true,
                  use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            // Required as image imports should be handled via JS/TS import statements
                            url: false,
                        },
                    },
                  ],
                  },{
                    test: /\\\\.less$/,
                    sideEffects: true,
                    use: [
                        require.resolve(\\"style-loader\\"),
                        {
                            loader: require.resolve(\\"css-loader\\"),
                            options: {
                                
                                importLoaders: 1,
                            },
                        },
                        {
                            loader: require.resolve(\\"less-loader\\"),
                            options: {
                                // Want to add more Less options? Read more here: https://webpack.js.org/loaders/less-loader/#options
                                implementation: require.resolve(\\"less\\"),
                                sourceMap: true,
                                lessOptions: {},
                            },
                        },
                    ],
                  },],
                    }
                }],
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
