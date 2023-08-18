import { colors } from '@storybook/node-logger';
import dedent from 'dedent';

import { ConfigSummary, printError } from '../../utils/output.utils';
import { StorybookProjectMeta } from 'src/utils/strategy.utils';

const printUnsupportedBuilderError = () => {
    printError(
        'Unsupported builder',
        dedent`"${colors.green.bold('@storybook/addon-styling')}" is for webpack projects only.

        Please remove it from your project to avoid unneeded dependencies.`,
    );
};

const printUnsupportedFrameworkError = ({ framework }: StorybookProjectMeta) => {
    printError(
        'Unsupported framework',
        dedent`"${colors.green.bold(
            '@storybook/addon-styling',
        )}" should not be used for your Storybook. ${colors.blue.bold(
            framework,
        )} requires a very specific configuration to match the app environment and altering it is likely to cause problems.

        Please remove it from your project to avoid unneeded dependencies.`,
    );
};

export const Errors = {
    unsupportedBuilder: printUnsupportedBuilderError,
    unsupportedFramework: printUnsupportedFrameworkError,
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
