#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const fetchTranslation = require('./fetchTranslation');

var USAGE = [
    'Usage: i18n-backend -u http://api/json_project/test',
    'Download language json file.',
].join('\n');

var args = process.argv;

if (args.length < 4 || args[2] !== '-u') {
    console.error(USAGE);
    process.exit(1);
}

fetchTranslation(args[3]).then((json) => {

})


