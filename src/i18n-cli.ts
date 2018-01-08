#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const jsonFormat = require('json-format');
const program = require('commander');
import fetchTranslation from './fetchTranslation';

function kebab2camel(str) {
    return str.replace(/(\-[A-Za-z])/g, function (m) {
        return m.toUpperCase().replace('-', '');
    });
}

const USAGE = [
    'Usage: i18n-backend -u http://api/json_project/test',
    'Download language json file.',
].join('\n');

program
  .version('0.0.0')
  .option('-u, --url [value]', 'example: http://api/json_project/test')
  .option('-d, --dest [value]', 'default: \'./src/locale\'')
  .parse(process.argv);

if (!program.url) {
    program.help();
}

const url = program.url;
const dest = program.dest || './src/locale';

fetchTranslation(url).then((json) => {
    if (!fs.existsSync(path.join(process.cwd(), dest))) {
        fs.mkdirSync(path.join(process.cwd(), dest));
    }
    let indexData = '';
    let exportDefault = 'module.exports = {\n';
    Object.keys(json.data).map((key) => {
        fs.writeFileSync(path.join(process.cwd(), dest, `${key}.json`), jsonFormat(json.data[key]));
        indexData += `const ${kebab2camel(key)} = require('./${key}.json');\n`;
        exportDefault += `    '${key}': ${kebab2camel(key)},\n`;
    });
    exportDefault += '}';

    fs.writeFileSync(path.join(process.cwd(), dest, `index.js`), indexData + exportDefault);
}).catch((error) => {
    console.error(error);
    process.exit(1);
});
