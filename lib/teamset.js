var fs = require("fs");
var path = require("path");
var csvstringify = require("csv-stringify");

var Team = require("./team.js");

global.CSV_FIELDS = [
	"position",
	"number",
	"name",
	"class_id",
	"country",
	"lat",
	"lng",
	"gps_when",
	"dist_darwin",
	"dist_adelaide",
	"class_id",
	"id"
];

var classIdToName = {
	5: "challenger",
	6: "cruiser",
	7: "adventure"
};
var copy = function(o){
	var r = {};
	for (var k in o){
		r[k] = o[k];
	}
	return r;
}

class Teamset {
	// Teams keyed by number
	constructor() {
		this.teams = {};
	}
	
	loadTeams() {
		console.log("Loading stored data…");
		var files = fs.readdirSync(global.OUTPUT_PATH);
		files = files.filter(function(p){
			return p.endsWith(global.DATA_EXTENSION);
		});
		files.forEach(function(p){
			this.team(path.basename(p,global.DATA_EXTENSION));
		}.bind(this));
		console.log("\t",files.length,"teams loaded!");
	}
	
	team(team_number) {
		team_number = ""+team_number;
		var t = this.teams[team_number];
		if (!t) {
			t = this.teams[team_number] = Team.loadTeam(team_number);
		}
		return t;
	}
	importRow(r) {
		delete r.gps_age; // This is ui gibberish.
		
		return this.team(r.number).importRow(r);
	}
	serialize() {
		var teams = this.sortedTeams;
		var classLatest = {};
		teams.forEach(function(t){
			t.serialize();
			// Collect latest datapoint of each team by class.
			if (t.class_id) {
				var ct = classLatest[t.class_id];
				if (!ct) {
					ct = classLatest[t.class_id] = [];
				}
				ct.push(t.latest);
			}
		});
		for (var cid in classLatest) {
			
			var ct = classLatest[cid];
			// Sort so we know position within a class
			ct.sort(function(a,b){
				return a.dist_adelaide - b.dist_adelaide;
			});
			for (var i = 0; i < ct.length; i++) {
				ct[i] = copy(ct[i]);
				ct[i].position = i+1;
			}
			
			// Decide our file paths
			var cName = classIdToName[cid] || "unknown";
			var fpjson = path.join(global.OUTPUT_PATH,"class",cName+".latest"+global.DATA_EXTENSION);
			var fpcsv = path.join(global.OUTPUT_PATH,"class",cName+".latest.csv");
			
			fs.writeFileSync(fpjson,JSON.stringify(ct,null," "));
			
			var toWrite = [global.CSV_FIELDS];
			ct.forEach(function(r){
				var arr = [];
				for (var i = 0; i < global.CSV_FIELDS.length; i++) {
					var k = global.CSV_FIELDS[i];
					arr.push(r[k]);
				}
				toWrite.push(arr);
			});
			
			// Write out the CSV
			var tmp = function(fp) {
				// This is a closure to capture the iterated file names properly.
				csvstringify(toWrite,function(err,data){
					fs.writeFileSync(fp,data);
				});
			};
			tmp(fpcsv);
		}
	}
	get sortedTeams() {
		return Object.keys(this.teams).sort().map(function(num){
			return this.teams[num];
		}.bind(this));
	}
}

module.exports = Teamset;