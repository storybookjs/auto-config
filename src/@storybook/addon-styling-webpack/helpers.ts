import { logger, colors } from '@storybook/node-logger';
import dedent from 'dedent';
import prompt from 'prompts';

import { ConfigSummary, printError, printWarning } from '../../utils/output.utils';

const printUnsupportedBuilderError = () => {
    printError(
        'Unsupported builder',
        dedent`"${colors.green.bold('@storybook/addon-styling-webpack')}" is for webpack projects only.
        Please remove it from your project to avoid unneeded dependencies.`,
    );
};

export const Errors = {
    unsupportedBuilder: printUnsupportedBuilderError,
};

export const askToInstallMissingDependencies = async (
    missingDependencies: Record<string, string>,
): Promise<boolean> => {
    printWarning(
        '💬 Missing dependencies',
        `I noticed that you're missing some dependencies for this configuration.

Would you like me to install the following dependencies for you?

${Object.keys(missingDependencies)
    .map((dep) => `  - ${colors.blue(dep)}`)
    .join('\n')}`,
    );

    const { installDependencies } = await prompt(
        {
            type: 'confirm',
            name: 'installDependencies',
            message: 'Install missing dependencies?',
            initial: true,
        },
        { onCancel: () => process.exit(0) },
    );
    logger.line(1);

    return installDependencies;
};

export const buildSummary = (summary: ConfigSummary) =>
    `${
        summary.strategy === 'custom'
            ? "I configured Storybook's Webpack as you asked!"
            : `"${colors.blue.bold(summary.strategy)}" has been configured and will now work in your stories!`
    }
  
${colors.purple.bold('What I did:')}
${summary.changed.map((change) => `  - ${change}`).join('\n')}
  
${colors.purple.bold('Next steps:')}
${summary.nextSteps.map((step) => `  - ${step}`).join('\n')}`;
