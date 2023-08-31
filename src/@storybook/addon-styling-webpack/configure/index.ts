import dedent from 'dedent';

import { DEFAULT_CONFIGURATION_MAP, ConfigurationMap, ConfigurationKey } from '../types';

import { generateCssRules } from './css-rules';
import { generateSassRules } from './sass-rules';
import { generateLessRules } from './less-rules';
import { JsPackageManager } from '@storybook/cli';

const setConfigWithDefaults = (configMap: Partial<ConfigurationMap>): ConfigurationMap => ({
    ...DEFAULT_CONFIGURATION_MAP,
    ...configMap,
});

export const buildImports = (configMap: Partial<ConfigurationMap>): string => {
    const { vanillaExtract } = setConfigWithDefaults(configMap);

    return vanillaExtract
        ? dedent`
    import { VanillaExtractPlugin } from "@vanilla-extract/webpack-plugin";
    import MiniCssExtractPlugin from "mini-css-extract-plugin";

    `
        : '';
};

const buildPluginsArray = ({ vanillaExtract }: ConfigurationMap): string =>
    vanillaExtract
        ? dedent`
    plugins: [new VanillaExtractPlugin(), new MiniCssExtractPlugin()],`
        : '';

export const buildAddonConfig = (configMap: Partial<ConfigurationMap>): string => {
    const config = setConfigWithDefaults(configMap);

    return dedent`({
    name: "@storybook/addon-styling-webpack",
    options: {${buildPluginsArray(config)}
      rules: [${generateCssRules(config)}${generateSassRules(config)}${generateLessRules(config)}],
    }
  })`;
};

const BASE_DEPENDENCIES = {
    'style-loader': '',
    'css-loader': '',
};

const REQUIRED_DEPENDENCIES: Record<ConfigurationKey, Record<string, string>> = {
    cssModules: {},
    sass: {
        'sass-loader': '',
        'resolve-url-loader': '',
    },
    less: {
        'less-loader': '',
    },
    postcss: {
        'postcss-loader': '',
        postcss: '',
    },
    vanillaExtract: {
        '@vanilla-extract/webpack-plugin': '',
        'mini-css-extract-plugin': '',
    },
};

export const checkForMissingDependencies = async (
    packageManager: JsPackageManager,
    configMap: Partial<ConfigurationMap>,
    extraDependencies: Record<string, string> = {},
): Promise<Record<string, string>> => {
    const configured = Object.entries(configMap)
        .filter(([key, isUsed]) => isUsed)
        .map(([key]) => key) as ConfigurationKey[];

    const dependenciesToCheck = configured.reduce((deps, key) => ({ ...deps, ...REQUIRED_DEPENDENCIES[key] }), {
        ...BASE_DEPENDENCIES,
        ...extraDependencies,
    });

    const userDependencies = await packageManager.getAllDependencies();

    const missingDependencies = Object.entries(dependenciesToCheck).reduce(
        (missing, [dependency, version]) => {
            if (!userDependencies[dependency]) {
                return { ...missing, [dependency]: version };
            }

            return missing;
        },
        {} as Record<string, string>,
    );

    return missingDependencies;
};
