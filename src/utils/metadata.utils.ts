import type { ConfigFile } from '@storybook/csf-tools';
import type { JsPackageManager } from '@storybook/cli';

import { SUPPORTED_BUILDERS, StorybookProjectMeta, SupportedBuilders } from './strategy.utils';

const getFramework = (mainConfig: ConfigFile): string => {
    const frameworkValue = mainConfig.getFieldValue(['framework']);

    return typeof frameworkValue === 'string' ? frameworkValue : frameworkValue?.name;
};

const determineBuilder = (mainConfig: ConfigFile): SupportedBuilders => {
    const framework = getFramework(mainConfig);

    return framework.includes('vite') || framework.includes('sveltekit')
        ? SUPPORTED_BUILDERS.VITE
        : SUPPORTED_BUILDERS.WEBPACK;
};

export const buildStorybookProjectMeta = async (
    mainConfig: ConfigFile,
    packageManager: JsPackageManager,
): Promise<StorybookProjectMeta> => ({
    packageManager: packageManager,
    builder: determineBuilder(mainConfig),
    framework: getFramework(mainConfig),
});

const isAngular = ({ framework }: StorybookProjectMeta): boolean => framework.includes('angular');
const isNextJs = ({ framework }: StorybookProjectMeta): boolean => framework.includes('nextjs');

export const Framework = {
    is: {
        angular: isAngular,
        nextJs: isNextJs,
    },
    isNot: {
        angular: (meta: StorybookProjectMeta) => !isAngular(meta),
        nextJs: (meta: StorybookProjectMeta) => !isNextJs(meta),
    },
};

const isWebpack = ({ builder }: StorybookProjectMeta): boolean => builder === SUPPORTED_BUILDERS.WEBPACK;
const isVite = ({ builder }: StorybookProjectMeta): boolean => builder === SUPPORTED_BUILDERS.VITE;

export const Builder = {
    is: {
        webpack: isWebpack,
        vite: isVite,
    },
    isNot: {
        webpack: (meta: StorybookProjectMeta) => !isWebpack(meta),
        vite: (meta: StorybookProjectMeta) => !isVite(meta),
    },
};
