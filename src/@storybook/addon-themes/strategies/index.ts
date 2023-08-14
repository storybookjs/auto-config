import { AddonThemesConfigurationStrategy } from '../types';
import { StorybookProjectMeta } from '../../../utils/strategy.utils';

import { tailwindStrategy } from './tailwind/tailwind.strategy';
import { vanillaExtractStrategy } from './vanilla-extract/vanilla-extract.strategy';
import { materialUIStrategy } from './material-ui/material-ui.strategy';
import { styledComponentsStrategy } from './styled-components/styled-components.strategy';
import { emotionStrategy } from './emotion/emotion.strategy';

const AUTO_CONFIG_STRATEGIES: AddonThemesConfigurationStrategy[] = [
    tailwindStrategy,
    materialUIStrategy,
    styledComponentsStrategy,
    emotionStrategy,
    vanillaExtractStrategy,
];

export const selectAddonThemesStrategy = async ({ packageManager }: StorybookProjectMeta) => {
    const deps = await packageManager.getAllDependencies();

    return AUTO_CONFIG_STRATEGIES.find(({ predicate }) => predicate(deps));
};
