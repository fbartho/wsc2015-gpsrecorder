#!/usr/bin/env node
'use strict';

// Run this as `node merge-data.js -p <list of directory paths to merge in>` or `merge-data.js<list of directory paths to merge in>`
// pass it paths!
require('babel/register');

global.OUTPUT_PATH = "./data/";
global.DATA_EXTENSION = ".data.json";

var program = require('commander');

function listParse(val) {
  return val.split(',');
}

program
	.version('0.0.1')
	.option('-o, --output_directory <output_directory>', 'Data Directory Path')
	.option('-p, --paths <paths>', 'Merge directory locations, comma separated',listParse)
	.parse(process.argv);

global.OUTPUT_PATH = program.output_directory || global.OUTPUT_PATH;
global.MERGE_DIRECTORIES = program.paths || [];

require('./lib/merger.js');
