'use strict';

var fs = require("fs");
var path = require("path");
var request = require("request");

var Team = require("./team.js");
var Teamset = require("./teamset.js");

// This is the global shared state
var state = new Teamset();
state.loadTeams();
global.MERGE_DIRECTORIES.forEach(function(dPath){
	var stats = fs.lstatSync(dPath);
	
	if (!stats.isDirectory()) {
		console.error("Expected a directory, but got",dPath);
		return;
	}
	
	state.loadTeamsFromPath(dPath);
});
state.serialize();

console.log("Done merging team data from",global.MERGE_DIRECTORIES,"into",global.OUTPUT_PATH);