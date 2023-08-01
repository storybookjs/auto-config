import { colors } from '@storybook/node-logger';
import dedent from 'dedent';
import prompts from 'prompts';

import { printWarning } from './output.utils';

const shouldQuitWithDirtyGit = async (): Promise<boolean> => {
    printWarning(
        '💬 Before we continue',
        dedent`It looks like you have ${colors.red.bold('uncommitted changes')} in your git repository.
      
      We recommend that you commit or stash them before running this command.`,
    );

    const { shouldQuit } = await prompts(
        {
            type: 'confirm',
            name: 'shouldQuit',
            message: 'Do you want to quit?',
            initial: true,
        },
        { onCancel: () => process.exit(0) },
    );

    return shouldQuit;
};

export const commonQuestions = {
    shouldQuitWithDirtyGit,
};
