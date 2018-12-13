import { Application } from 'spectron';
import path from 'path';
import os from 'os';

const platform = os.platform();

let args = [];

let appPath;
if (process.env.SPECTRON_USE_BINARY) {
  if (platform === 'linux') {
    appPath = path.join(__dirname, '..', '..', 'release', 'linux-unpacked', 'appium-desktop');
  } else if (platform === 'darwin') {
    appPath = path.join(__dirname, '..', '..', 'release', 'mac', 'Appium.app', 'Contents', 'MacOS', 'Appium');
  } else if (platform === 'win32') {
    appPath = path.join(__dirname, '..', '..', 'release', 'win-ia32-unpacked', 'Appium.exe');
  }
} else {
  appPath = require('electron');
  args = [path.join(__dirname, '..', '..')];
}

before(async function () {
  this.timeout(process.env.TRAVIS || process.env.APPVEYOR ? 10 * 60 * 1000 : 30 * 1000);
  this.app = new Application({
    path: appPath,
    args,
    env: {
      FORCE_NO_WRONG_FOLDER: true,
    }
  });
  await this.app.start();
});

after(function () {
  if (this.app && this.app.isRunning()) {
    return this.app.stop();
  }
});