import { program } from 'commander';
import { readPackageUpSync } from 'read-pkg-up';
import leven from 'leven';
import { logger, colors } from '@storybook/node-logger';

import configureAddonStyling from './@storybook/addon-styling';
import { PackageJson } from '@storybook/types';

const pkg = readPackageUpSync({ cwd: __dirname }).packageJson as PackageJson;

const codeMods: Record<string, Function> = {
    styling: configureAddonStyling,
};

const command = (name: string) => program.name('@storybook/auto-config').command(name);

command('styling')
    .description(
        `Configures styles for your ${colors.blue.bold('webpack')} Storybook using "${colors.pink.bold(
            '@storybook/addon-styling',
        )}"`,
    )
    .action(() => {
        configureAddonStyling().catch(() => process.exit(1));
    });

command('themes')
    .description(
        `Configures style providers and themes for your Storybook using "${colors.pink.bold(
            '@storybook/addon-themes',
        )}"`,
    )
    .action(() => {
        logger.plain('🚧 This feature is not yet implemented.');
    });

program.on('command:*', ([invalidCmd]) => {
    logger.line(1);
    logger.plain(`🚨 ERROR: Invalid command "${colors.red.bold(invalidCmd)}".`);
    const availableCommands = program.commands.map((cmd) => cmd.name());
    const suggestion = availableCommands.find((cmd) => leven(cmd, invalidCmd) < 3);
    logger.line(1);
    suggestion ? logger.plain(`🤔 Did you mean ${colors.green.bold(suggestion)}?`) : program.outputHelp();
    process.exit(1);
});

program.usage('<command> [options]').version(pkg.version).parse(process.argv);
