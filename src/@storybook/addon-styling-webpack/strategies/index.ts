import { AddonStylingConfigurationStrategy } from '../types';
import { StorybookProjectMeta } from '../../../utils/strategy.utils';

import { tailwindStrategy } from './tailwind/tailwind.strategy';
import { vanillaExtractStrategy } from './vanilla-extract/vanilla-extract.strategy';
import { customStrategy } from './custom/custom.strategy';

const AUTO_CONFIG_STRATEGIES: AddonStylingConfigurationStrategy[] = [tailwindStrategy, vanillaExtractStrategy];

export const selectAddonStylingStrategy = async ({ packageManager }: StorybookProjectMeta) => {
    const deps = await packageManager.getAllDependencies();

    return AUTO_CONFIG_STRATEGIES.find(({ predicate }) => predicate(deps)) ?? customStrategy;
};
