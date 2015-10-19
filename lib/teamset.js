var fs = require("fs");
var path = require("path");

var Team = require("./team.js");

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
		return this.team(r.number).importRow(r);
	}
	serialize() {
		this.sortedTeams.forEach(function(t){
			t.serialize();
		});
	}
	get sortedTeams() {
		return Object.keys(this.teams).sort().map(function(num){
			return this.teams[num];
		}.bind(this));
	}
}

module.exports = Teamset;