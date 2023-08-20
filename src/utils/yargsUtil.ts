import yargs from 'yargs/yargs';

//yargs related functions
const { location } = yargs(process.argv.slice(2))
  .options({
    location: {
      type: 'string',
      demandOption: true,
      description: 'Cleanup Directory Path',
      alias: 'l',
    },
  })
  .parseSync();

// console.log(location);

export default { dirPath: location };
