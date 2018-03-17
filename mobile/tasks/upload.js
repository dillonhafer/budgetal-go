var fs = require('fs');
const { exec } = require('child_process');
const { abort, log } = require('./utils');

// Get Credentials
var os = require('os');
var content = fs.readFileSync('.credentials', 'utf8');
const [user, passwd] = content.split(os.EOL);
if (user.toString() === '' || passwd.toString() === '') {
  abort('No username/password');
}

// Prepare for file download
const fileName = 'tmp/tmp-ipa-name.ipa';
const createTmpDir = next => {
  log(`Preparing for file download`);
  exec('mkdir -p tmp', err => {
    if (err) {
      abort(err);
      return;
    }

    next();
  });
};

// Get expo download Url
const getDownloadUrl = next => {
  log(`Getting download url`);
  exec('exp url:ipa', (err, stdout) => {
    if (err) {
      abort(err);
      return;
    }
    const downloadUrl = stdout.trim();
    next(downloadUrl);
  });
};

// Download from expo
const download = (downloadUrl, next) => {
  log(`Downloading file from`);
  log(`${downloadUrl}`);
  log(`to ${fileName}`);
  exec(`wget -q -O ${fileName} ${downloadUrl}`, err => {
    if (err) {
      abort(err);
      return;
    }
    next();
  });
};

// Validate with iTunes
const validate = next => {
  log(`Validating with iTunes`);
  const validate = `altool --validate-app -f ${fileName} -u ${user} -p '${passwd}'`;
  exec(validate, (err, stdout, stderr) => {
    if (err) {
      abort(err);
      return;
    }
    log(stdout);
    log(stderr);
    next();
  });
};

// Upload to iTunes
const uploadTask = () => {
  const upload = `altool --upload-app -f ${fileName} -u ${user} -p '${passwd}'`;
  log(`Uploading to iTunes`);
  exec(upload, (err, stdout, stderr) => {
    if (err) {
      abort(err);
      return;
    }
    log(stdout);
    log(stderr);
    log('Done.');
  });
};

// Main
createTmpDir(() => {
  getDownloadUrl(url => {
    download(url, () => {
      validate(() => {
        uploadTask();
      });
    });
  });
});
