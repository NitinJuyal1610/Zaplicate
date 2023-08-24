import chalk from 'chalk';
import { Argv } from 'yargs';
const builderOptions: any = {
  'location <directory>': {
    type: 'string',
    describe: chalk.blue('Location of the directory to clean <path>'),
    alias: 'l',
  },
  recursive: {
    type: 'boolean',
    alias: 'r',
    describe: chalk.blue(
      'Perform recursive cleanup (including subdirectories)',
    ),
    default: false,
  },
  'minSize <size>': {
    type: 'string',
    alias: 's',
    describe: chalk.blue('Filter files larger than the specified size'),
    default: '0B',
  },
  'maxSize <size>': {
    type: 'string',
    alias: 'S',
    describe: chalk.blue('Filter files smaller than the specified size'),
    default: '20GB',
  },
  extensions: {
    type: 'array',
    alias: 'e',
    describe: chalk.blue('Filter files by the specified extensions'),
    default: ['*'],
  },
  'from <date>': {
    type: 'string',
    alias: 'f',
    describe: chalk.blue('Filter files modified from the specified date'),
    default: '1970-01-01',
  },
  'to <date>': {
    type: 'string',
    alias: 't',
    describe: chalk.blue('Filter files modified until the specified date'),
    default: '2030-01-01',
  },
  auto: {
    type: 'boolean',
    alias: 'a',
    describe: chalk.blue('Automatically remove files without preview'),
    default: false,
  },
};

export const commandBuilder = (builder: Argv) =>
  builder.options(builderOptions);
