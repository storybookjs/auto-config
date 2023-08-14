import { colors } from '@storybook/node-logger';
import { ConfigSummary } from 'src/utils/output.utils';

export const buildSummary = (summary: ConfigSummary) =>
    `${
        summary.strategy === 'custom'
            ? 'I configured theming as you asked!'
            : `"${colors.blue.bold(summary.strategy)}" themes have been configured and will now work in your stories!`
    }
  
${colors.purple.bold('What I did:')}
${summary.changed.map((change) => `  - ${change}`).join('\n')}
  
${colors.purple.bold('Next steps:')}
${summary.nextSteps.map((step) => `  - ${step}`).join('\n')}`;
