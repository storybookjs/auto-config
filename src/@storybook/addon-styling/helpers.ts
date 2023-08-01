import { colors } from '@storybook/node-logger';
import dedent from 'dedent';

import { printError, printSuccess } from '../../utils/output.utils';
import { ChangeSummary } from '../../utils/strategy.utils';
import { ConfigurationStrategies } from './types';

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

export interface ConfigSummary extends ChangeSummary {
    strategy: ConfigurationStrategies;
}

const buildSummary = (summary: ConfigSummary) =>
    `${
        summary.strategy === 'custom'
            ? "I configured Storybook's Webpack as you asked."
            : `"${colors.blue.bold(summary.strategy)}" has been configured and will now work in your stories.`
    }
  
      ${colors.purple.bold('What I did:')}
  ${summary.changed.map((change) => `     - ${change}`).join('\n')}
  
      ${colors.purple.bold('Next steps:')}
  ${summary.nextSteps.map((step) => `     - ${step}`).join('\n')}`;

export const printScriptSummary = (summary: ConfigSummary) => {
    printSuccess(buildSummary(summary));
};
