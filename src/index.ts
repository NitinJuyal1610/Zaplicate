#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { parseSizeInput } from './utils/generalUtils';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { commandBuilder } from './metadata/builder';
import { dateIsValid } from './utils/generalUtils';
import { main } from './cleanup';

const TITLE = chalk.bold.cyan('CleanMate');
const MAIN_CMD = chalk.bold.magenta('cleanMate');

enum Command {
  CLEAN = 'clean',
}

yargs(hideBin(process.argv))
  .usage(TITLE)
  .scriptName(MAIN_CMD)
  .command({
    command: `${Command.CLEAN} [options]`,
    describe: chalk.green(
      '🧹 Start the cleanup process for the specified directory',
    ),
    aliases: chalk.yellow('c'),
    builder: commandBuilder,
    handler: async (args) => {
      // Validate directory existence
      const directoryPath = args['l'] || process.cwd();
      if (!existsSync(directoryPath)) {
        console.error(
          chalk.red(`Error: Directory '${directoryPath}' does not exist.`),
        );
        process.exit(1);
      }

      // Validate size format and values
      const minSize = parseSizeInput(args['s']);
      const maxSize = parseSizeInput(args['S']);
      if (minSize === null || maxSize === null || minSize > maxSize) {
        console.error(chalk.red('Error: Invalid size options.'));
        process.exit(1);
      }

      //validate date
      if (!dateIsValid(args['f']) || !dateIsValid(args['t'])) {
        console.error(chalk.red('Error: Invalid date options.'));
        process.exit(1);
      }

      const filterOptions = {
        recursive: args.recursive,
        minSize: minSize,
        maxSize: maxSize,
        fromDate: new Date(args['f']),
        toDate: new Date(args['t']),
        extensions: args.extensions,
        dirPath: directoryPath,
        auto: args['a'],
      };

      await main(filterOptions);
    },
  })
  .showHelpOnFail(true)
  .help()
  .wrap(null)
  .strict().argv;

// Display general usage information if no command is provided
if (process.argv.length <= 2) {
  yargs.showHelp();
}
