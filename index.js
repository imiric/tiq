#!/usr/bin/env node

/**
 * Module dependencies.
 */
var fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    program = require('commander'),
    tiq = require('./tiq');

var configFile = path.join(process.env.XDG_CONFIG_HOME ||
                    path.join(process.env.HOME, '.config'),
                    'tiq', 'config.json')
var storeFile = path.join(process.env.XDG_DATA_HOME ||
                    path.join(process.env.HOME, '.local', 'share'),
                    'tiq', 'store.json');

function parseArgs() {
  program
    .usage('[options] <tokens> <tags>')
    .version('0.0.1')
    .option('-c, --config <file>',   'Configuration file to use [' + configFile + ']', configFile)
    .option('-s, --separator <sep>', 'Token separator for tags [\',\']', ',')
    .option('-S, --store <file>',    'Store file to use [' + storeFile + ']', storeFile)
    .option('-n, --namespace <ns>',  'Namespace to use')
    .parse(process.argv);

  if (!program.args.length) {
    console.error('Must specify some text and/or tags');
    process.exit(1);
  }

  return program;
}

function readJSON(file) {
  try {
    var data = require(file);
  } catch (err) {
    var data = {};
  }
  return data;
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), {mode: 420});
}

function main() {
  var program = parseArgs(),
      config = readJSON(program.config || configFile),
      storeFile = program.store || config.store,
      store = readJSON(storeFile);

  // Override some config options
  config.separator = program.separator;

  // Make sure the storage directory exists
  mkdirp(path.dirname(storeFile));

  var args = program.args;
  var tokens = args[0].split(program.separator);

  if (args.length == 1) {
    process.stdout.write(
        tiq.describe(tokens, program.namespace, store).concat('').join('\n'));
  } else {
    var tags = args[1].split(program.separator);
    store = tiq.associate(tokens, tags, program.namespace, store);
    writeJSON(storeFile, store);
  }
}

if (require.main === module) {
  main();
}
