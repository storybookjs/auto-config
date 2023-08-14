import { colors } from '@storybook/node-logger';
import dedent from 'dedent';

import { ConfigSummary, printError } from '../../utils/output.utils';

const printUnsupportedBuilderError = () => {
    printError(
        'Unsupported builder',
        dedent`"${colors.green.bold('@storybook/addon-styling')}" is for webpack projects only.
        Please remove it from your project to avoid unneeded dependencies.`,
    );
};

export const Errors = {
    unsupportedBuilder: printUnsupportedBuilderError,
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
