import { logger, colors } from '@storybook/node-logger';
import boxen from 'boxen';
import dedent from 'dedent';
import { ChangeSummary } from './strategy.utils';
import { JsPackageManager } from '@storybook/cli';

export const printWelcome = (packageName: string) => {
    logger.line(1);
    logger.plain(
        boxen(
            dedent`I'm the configuration helper for "${colors.pink.bold(packageName)}"!
    
            Hold on for a moment while I look at your project and get you all set up...`,
            {
                title: '👋 Hi there',
                titleAlignment: 'left',
                borderColor: 'cyanBright',
                borderStyle: 'double',
                padding: 1,
            },
        ),
    );
    logger.line(1);
};

export const printInfo = (title: string, message: string) => {
    logger.line(1);
    logger.plain(
        boxen(message, {
            title,
            padding: 1,
            borderColor: 'blue',
            borderStyle: 'double',
        }),
    );
    logger.line(1);
};

export const printWarning = (title: string, message: string) => {
    logger.line(1);
    logger.plain(
        boxen(message, {
            title,
            padding: 1,
            borderColor: 'yellow',
            borderStyle: 'double',
        }),
    );
    logger.line(1);
};

export const printError = (title: string, message: string) => {
    logger.line(1);
    logger.plain(
        boxen(message, {
            title: `🚨 ERROR: ${title}`,
            padding: 1,
            borderColor: 'red',
            borderStyle: 'double',
        }),
    );
    logger.line(1);
};

export const printSuccess = (message: string) => {
    logger.line(1);
    logger.plain(
        boxen(message, {
            title: `✨ SUCCESS ✨`,
            padding: 1,
            borderColor: 'green',
            borderStyle: 'double',
        }),
    );
    logger.line(1);
};

export interface ConfigSummary<Strategies extends string = string> extends ChangeSummary {
    strategy: Strategies;
}

export type BuildSummaryFunction = (summary: ConfigSummary) => string;
export const printScriptSummary = (buildSummaryFunction: BuildSummaryFunction) => (summary: ConfigSummary) => {
    printSuccess(buildSummaryFunction(summary));
};

const PACKAGE_MANAGER_TO_RUN_COMMAND: Record<JsPackageManager['type'], string> = {
    npm: 'npm run',
    yarn1: 'yarn',
    yarn2: 'yarn',
    pnpm: 'pnpm run',
};

export const buildPackageManagerCommand = (packageManager: JsPackageManager, command: string) => {
    const type = packageManager.type;

    return `${PACKAGE_MANAGER_TO_RUN_COMMAND[type]} ${command}`;
};
