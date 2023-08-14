import { ToolConfigurationStrategy } from 'src/utils/strategy.utils';

export const CONFIGURATION_STRATEGY_KEYS = {
    TAILWIND: 'tailwind',
    MATERIAL_UI: 'material-ui',
    STYLED_COMPONENTS: 'styled-components',
    EMOTION: 'emotion',
    VANILLA_EXTRACT: 'vanilla-extract',
    CUSTOM: 'custom',
} as const;

export type ConfigurationStrategies = (typeof CONFIGURATION_STRATEGY_KEYS)[keyof typeof CONFIGURATION_STRATEGY_KEYS];

export type AddonThemesConfigurationStrategy = ToolConfigurationStrategy<ConfigurationStrategies>;

export const CONFIGURATION_KEY_TO_NAME: Record<ConfigurationStrategies, string> = {
    [CONFIGURATION_STRATEGY_KEYS.TAILWIND]: 'Tailwind',
    [CONFIGURATION_STRATEGY_KEYS.MATERIAL_UI]: 'Material UI',
    [CONFIGURATION_STRATEGY_KEYS.STYLED_COMPONENTS]: 'Styled-components',
    [CONFIGURATION_STRATEGY_KEYS.EMOTION]: 'Emotion',
    [CONFIGURATION_STRATEGY_KEYS.VANILLA_EXTRACT]: 'Vanilla-extract',
    [CONFIGURATION_STRATEGY_KEYS.CUSTOM]: 'custom',
};
