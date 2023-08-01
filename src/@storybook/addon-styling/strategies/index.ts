import { AddonStylingConfigurationStrategy } from '../types';
import { StorybookProjectMeta } from '../../../utils/strategy.utils';

import { tailwindStrategy } from './tailwind/tailwind.strategy';
import { vanillaExtractStrategy } from './vanilla-extract/vanilla-extract.strategy';
import { customStrategy } from './custom/custom.strategy';

const AUTO_CONFIG_STRATEGIES: AddonStylingConfigurationStrategy[] = [tailwindStrategy, vanillaExtractStrategy];

export const selectAddonStylingStrategy = (packageJson: StorybookProjectMeta) =>
    AUTO_CONFIG_STRATEGIES.find(({ predicate }) => predicate(packageJson)) ?? customStrategy;
