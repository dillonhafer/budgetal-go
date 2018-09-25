const fs = require('fs');
const { execSync, exec } = require('child_process');
const { task, info, abort } = require('./utils');
const Upload = require('./upload');

const checkCleanGit = () => {
  task('Checking for clean git status');
  try {
    execSync('git diff-index --quiet HEAD --');
    info('Git repo is clean');
  } catch (err) {
    abort('Dirty git repo', err);
  }
};

let newBuildNumber;
const bumpVersion = () => {
  task('Bumping version');
  // Load file
  let app = JSON.parse(fs.readFileSync('app.json', 'utf8'));

  // Compute new version
  newBuildNumber = app.expo.android.versionCode + 1;
  info(`New version: ${newBuildNumber}`);

  // Bump Version
  app.expo.ios.buildNumber = newBuildNumber.toString();
  app.expo.android.versionCode = newBuildNumber;

  // Write file
  app = JSON.stringify(app, null, 2);
  fs.writeFileSync('app.json', app, 'utf8');
};

const commitGitVersion = build => {
  task('Committing new version');
  const add = `git add -A`;
  const commit = `git commit -m 'Bump version to ${build}'`;
  try {
    execSync(add);
    execSync(commit);
  } catch (err) {
    abort('Failed to commit new version');
  }
};

const expoBuild = (platform, runAsync = false) => {
  task(`Running exp build:${platform}`);
  try {
    const execFunction = runAsync ? exec : execSync;
    const buildOutput = execFunction(
      `expo-cli build:${platform} --release-channel production`,
    ).toString();
    const url = buildOutput.match(/(https:\/\/expo\.io\/build.*)/)[0];
    info(`Open status URL: ${url}`);
    return true;
  } catch (err) {
    return false;
  }
};

const pushGitRemote = () => {
  task('Push to github');
  try {
    execSync('git push');
  } catch (err) {
    abort('Could not push to remote');
  }
};

checkCleanGit();
bumpVersion();

if (expoBuild('ios')) {
  commitGitVersion(newBuildNumber);
  pushGitRemote();

  // Build android in background
  expoBuild('android', true);

  // Download IPA/Upload to iTunes
  Upload.createTmpDir();
  Upload.getDownloadUrl();
  Upload.download();
  Upload.validate();
  Upload.uploadTask();
}
