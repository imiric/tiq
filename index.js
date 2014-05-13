#!/usr/bin/env node

/**
 * Module dependencies.
 */
var path = require('path'),
    program = require('commander');

var configFile = path.join(process.env.XDG_CONFIG_HOME ||
                    path.join(process.env.HOME, '.config'),
                    'tiq', 'config.json')

function parseArgs() {
  program
    .usage('[options] <tokens> <tags>')
    .version('0.0.1')
    .option('-c, --config <file>',   'Configuration file to use [' + configFile + ']', configFile)
    .option('-s, --separator <sep>', 'Token separator for tags [\',\']', ',')
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

function loadPlugin(name, config) {
  var plugin;
  try {
    plugin = require(name)(config);
  } catch(e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      throw new Error("Plugin '" + name + "' not found");
    } else {
      throw new Error("Unable to load plugin '" + name + "': " + e.toString());
    }
  }
  return plugin;
}

function main() {
  var program = parseArgs(),
      config = readJSON(program.config || configFile);

  if (!config.store) {
    // Use a JSON store by default
    config.store = {
      plugin: "tiq-json",
      config: {},
    };
  }

  var tiq = loadPlugin(config.store.plugin, config.store.config);

  // Additional initialization defined by the plugin
  if (typeof tiq.enter == 'function') {
    tiq.enter();
  }

  // Override some config options
  config.separator = program.separator;

  var args = program.args;
  var tokens = args[0].split(config.separator);

  if (args.length == 1) {
    var printResult = function(tags) {
      process.stdout.write(tags.concat('').join('\n'));
    }
    var result = tiq.describe(tokens, program.namespace);
    if (typeof result.then == 'function') {
      result.then(printResult);
    } else {
      printResult(result);
    }
  } else {
    var tags = args[1].split(program.separator);
    tiq.associate(tokens, tags, program.namespace);
  }

  // Cleanup defined by the plugin
  if (typeof tiq.exit == 'function') {
    tiq.exit();
  }
}

if (require.main === module) {
  main();
}
