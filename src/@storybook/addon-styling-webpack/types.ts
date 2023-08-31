import { ToolConfigurationStrategy } from 'src/utils/strategy.utils';

export const CONFIGURATION_STRATEGY_KEYS = {
    TAILWIND: 'tailwind',
    VANILLA_EXTRACT: 'vanilla-extract',
    CUSTOM: 'custom',
} as const;

export type ConfigurationStrategies = (typeof CONFIGURATION_STRATEGY_KEYS)[keyof typeof CONFIGURATION_STRATEGY_KEYS];

export type AddonStylingConfigurationStrategy = ToolConfigurationStrategy<ConfigurationStrategies>;

export const DEFAULT_CONFIGURATION_MAP = {
    cssModules: false,
    postcss: false,
    sass: false,
    less: false,
    vanillaExtract: false,
} as const;

export type ConfigurationKey = keyof typeof DEFAULT_CONFIGURATION_MAP;

export type ConfigurationMap = Record<ConfigurationKey, boolean>;

export const CONFIGURATION_KEY_TO_NAME: Record<ConfigurationKey, string> = {
    cssModules: 'CSS Modules',
    postcss: 'postcss',
    sass: 'sass',
    less: 'less',
    vanillaExtract: 'vanilla-extract',
};
