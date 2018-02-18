var fs = require('fs');
var path = require('path');
var downloads = `${process.env['HOME']}/Downloads`;
const { abort, log } = require('./utils');

// Get Credentials
var os = require('os');
var content = fs.readFileSync('.credentials', 'utf8');
const [user, passwd] = content.split(os.EOL);
if (user.toString() === '' || passwd.toString() === '') {
  abort('No username/password');
}

// Upload file
fs.readdir(downloads, (err, files) => {
  if (err !== null) {
    abort(err);
  }

  const file = files.find(file => {
    return path.extname(file) === '.ipa';
  });
  if (file === undefined) {
    abort('Could not find IPA');
  }
  const ipa = { file, fullPath: [downloads, file].join('/') };

  const validate = `altool --validate-app -f ${
    ipa.fullPath
  } -u ${user} -p '${passwd}'`;
  const upload = `altool --upload-app -f ${
    ipa.fullPath
  } -u ${user} -p '${passwd}'`;

  log(`Uploading file: ${ipa.file}`);
  const { exec } = require('child_process');
  exec(validate, (err, stdout, stderr) => {
    if (err) {
      abort(err);
      return;
    }
    log(stdout);
    log(stderr);
  });

  exec(upload, (err, stdout, stderr) => {
    if (err) {
      abort(err);
      return;
    }
    log(stdout);
    log(stderr);
  });
});
