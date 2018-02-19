const fs = require('fs');
const { execSync } = require('child_process');
const { abort, log } = require('./utils');

const checkCleanGit = () => {
  log('Checking for clean git status');
  try {
    execSync('git diff-index --quiet HEAD --');
    log('Git repo is clean');
  } catch (err) {
    abort('Dirty git repo', err);
  }
};

let newBuildNumber;
const bumpVersion = () => {
  log('Bumping version');
  // Load file
  let app = JSON.parse(fs.readFileSync('app.json', 'utf8'));

  // Compute new version
  newBuildNumber = app.expo.android.versionCode + 1;
  log(`New version: ${newBuildNumber}`);

  // Bump Version
  app.expo.ios.buildNumber = newBuildNumber.toString();
  app.expo.android.versionCode = newBuildNumber;

  // Write file
  app = JSON.stringify(app, null, 2);
  fs.writeFileSync('app.json', app, 'utf8');
};

const commitGitVersion = build => {
  log('Committing new version');
  const add = `git add -A`;
  const commit = `git commit -m 'Bump version to ${build}'`;
  try {
    execSync(add);
    execSync(commit);
  } catch (err) {
    abort('Failed to commit new version');
  }
};
const expoPublish = () => {
  log('Running exp publish');
  try {
    execSync('exp publish');
  } catch (err) {
    abort('Failed to publish');
  }
};

const expoBuildIos = () => {
  log('Running exp build:ios');
  try {
    const buildOutput = execSync('exp build:ios');
    log(buildOutput);
    return true;
  } catch (err) {
    return false;
  }
};

const pushGitRemote = () => {
  log('Push to github');
  try {
    execSync('git push');
  } catch (err) {
    abort('Could not push to remote');
  }
};

const gitDoff = () => {
  log('Reverse version commit');
  try {
    execSync('git reset HEAD^');
  } catch (err) {
    abort('Could not undo commit');
  }
};

checkCleanGit();
bumpVersion();
expoPublish();

if (expoBuildIos()) {
  commitGitVersion(newBuildNumber);
  pushGitRemote();
} else {
  gitDoff();
}
