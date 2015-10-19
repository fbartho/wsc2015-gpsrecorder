// Run this as `node record.js`
require('babel/register');

global.OUTPUT_PATH = "./data/";
global.DATA_EXTENSION = ".data.json";

require('./lib/record.js');  