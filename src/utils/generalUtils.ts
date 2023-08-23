export const parseSizeInput = (sizeInput: string) => {
  const units: any = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  };

  const regex = /^(\d+)([BKMGT]{1,2})$/i;
  const matches = sizeInput.match(regex);

  if (!matches) {
    throw new Error('Invalid size format. Example: 10M or 1G');
  }

  const sizeValue = parseInt(matches[1]);
  const unitSymbol = matches[2].toUpperCase();

  if (!units[unitSymbol]) {
    throw new Error('Invalid size unit. Use B, KB, MB, or GB.');
  }

  const sizeInBytes = sizeValue * units[unitSymbol];
  return sizeInBytes;
};
