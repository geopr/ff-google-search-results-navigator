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
    manifest = 'manifest.json',
    sourcePath = path.join(__dirname, `../${manifest}`),
    distPath = path.join(__dirname, `../dist/${manifest}`);

  fs.copyFile(sourcePath, distPath, e => {
    if (e != null) {
      console.error(`failed to copy ${manifest} to dist: ${e.message}`);
      process.exit(1);
    }
  });
}

