import type { ConfigFile } from '@storybook/csf-tools';
import type { JsPackageManager } from '@storybook/cli';

export const SUPPORTED_BUILDERS = {
    VITE: 'vite',
    WEBPACK: 'webpack',
} as const;

export type SupportedBuilders = (typeof SUPPORTED_BUILDERS)[keyof typeof SUPPORTED_BUILDERS];

export interface StorybookProjectMeta {
    packageManager: JsPackageManager;
    builder: SupportedBuilders;
    framework: string;
}

export interface ChangeSummary {
    changed: string[];
    nextSteps: string[];
}

export interface ToolConfigurationStrategy<StrategyNames extends string> {
    /**
     * The name of the tool for configuration
     */
    name: StrategyNames;
    /**
     * Predicate function to check if the project meets the requirements of this strategy
     * @param packageJson The project's package.json
     * @returns {boolean} whether the project has the tool
     */
    predicate: (deps: Record<string, string>) => Boolean;
    /**
     * Transform function for a `.storybook/main.ts` file
     * @param mainConfig Babel AST for the main.ts file
     * @param meta The project's meta information including the builder, framework, and dependencies
     */
    main?: (mainConfig: ConfigFile, meta: StorybookProjectMeta) => Promise<ChangeSummary>;
    /**
     * Transform function for a `.storybook/preview.ts` file
     * @param previewConfig Babel AST for the preview.ts file
     * @param meta The project's meta information including the builder, framework, and dependencies
     */
    preview?: (previewConfig: ConfigFile, meta: StorybookProjectMeta) => Promise<ChangeSummary>;
}
