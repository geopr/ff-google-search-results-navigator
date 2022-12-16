const
  childProcess = require('child_process'),
  fs = require('fs'),
  path = require('path');

bundle();
copyManifestFileToDist();

function bundle() {
  childProcess.execSync('rm -rf dist && rollup --config rollup.config.js');
}

function copyManifestFileToDist() {
  const
    manifestFrom = path.join(__dirname, '../manifest.json'),
    manifestTo = path.join(__dirname, '../dist/manifest.json');

  fs.copyFile(manifestFrom, manifestTo, e => {
    if (e != null) {
      console.error(`failed to copy a ${file} to dist: ${e.message}`);
      process.exit(1);
    }
  });
}

