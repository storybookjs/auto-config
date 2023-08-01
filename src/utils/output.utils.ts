import { logger, colors } from '@storybook/node-logger';
import boxen from 'boxen';
import dedent from 'dedent';

export const printWelcome = (packageName: string) => {
    logger.line(1);
    logger.plain(
        boxen(
            dedent`I'm the configuration helper for "${colors.pink.bold(packageName)}"!
    
            Hold on for a moment while I look at your project and get you all set up.`,
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
