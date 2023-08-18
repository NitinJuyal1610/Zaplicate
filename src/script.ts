import fs from 'fs/promises';
import path from 'path';
import chokidar from 'chokidar';

(async () => {
  try {
    const sourcePath = path.join(__dirname, '../', 'sourceFiles');
    const watcher = chokidar.watch(sourcePath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
    });
  } catch (err) {
    console.log(err);
  }
})();
