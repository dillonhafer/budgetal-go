const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const bumpVersion = () => {
  // Load file
  const appConfig = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  rl.question(`Enter new version (${appConfig.expo.version}): `, v => {
    let c = JSON.parse(fs.readFileSync('app.json', 'utf8'));
    c.expo.version = v;

    // Write file
    c = JSON.stringify(c, null, 2);
    fs.writeFileSync('app.json', c, 'utf8');
    rl.close();
  });
};

bumpVersion();
