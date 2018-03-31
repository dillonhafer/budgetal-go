var fs = require('fs');
const { execSync } = require('child_process');
const { task, info, abort } = require('./utils');

// Get Credentials
var os = require('os');
var content = fs.readFileSync('.credentials', 'utf8');
const [user, passwd] = content.split(os.EOL);
if (user.toString() === '' || passwd.toString() === '') {
  abort('No username/password');
}

// Prepare for file download
const fileName = 'tmp/tmp-ipa-name.ipa';
let downloadUrl = '';

const createTmpDir = () => {
  task(`Preparing for file download`);
  execSync('mkdir -p tmp');
};

// Get expo download Url
const getDownloadUrl = () => {
  task(`Getting download url`);
  downloadUrl = execSync('exp url:ipa');
};

// Download from expo
const download = () => {
  if (downloadUrl === '') {
    abort('downloadUrl not found');
  }

  task(`Downloading file from`);
  info(`${downloadUrl}`);
  info(`to ${fileName}`);
  execSync(`wget -q -O ${fileName} ${downloadUrl}`);
};

// Validate with iTunes
const validate = () => {
  task(`Validating with iTunes`);
  const validate = `altool --validate-app -f ${fileName} -u ${user} -p '${passwd}'`;
  execSync(validate);
};

// Upload to iTunes
const uploadTask = () => {
  const upload = `altool --upload-app -f ${fileName} -u ${user} -p '${passwd}'`;
  task(`Uploading to iTunes`);
  execSync(upload);
  info('Done.');
};

module.exports = {
  createTmpDir,
  getDownloadUrl,
  download,
  validate,
  uploadTask,
};
