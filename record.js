// Run this as `node record.js`
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
	.parse(process.argv);

global.OUTPUT_PATH = program.output_directory || global.OUTPUT_PATH;

require('./lib/record.js');
