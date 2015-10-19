
var fs = require("fs");
var path = require("path");

// Sample GPS Record:
// {
//	 "car_name": "Aurum",
//	 "class_id": 5,
//	 "country": "us",
//	 "dist_adelaide": 1607.37,
//	 "dist_darwin": 1012.305,
//	 "gps_age": "2 mins 50 secs",  // This field is worthless, as it gets refreshed regularly
//	 "gps_when": "2015-10-19 04:12:49",
//	 "id": "24",
//	 "lat": -20.9875,
//	 "lng": 134.20053,
//	 "name": "University of Michigan Solar Car Team",
//	 "number": 2
// },

class Team {
	constructor(number) {
		console.log("New team discovered!",number);
		this.data = {};
		this.number = number;
		this.dirty = false;
		this.name = null;
		this.car_name = null;
		this.country = null;
		this.latest = null; // latest datapoint
	}
	get filePath() {
		return path.join(global.OUTPUT_PATH,"team",this.number+global.DATA_EXTENSION);
	}
	
	static loadTeam(number) {
		var t = new Team(number);
		var p = t.filePath;
		if (!fs.existsSync(p)) {
			return t;
		}
		console.log("Loading team data-file from disk:",p);
		try {
			var incoming = JSON.parse(fs.readFileSync(p));
			incoming.every(function(record){
				t.importRow(record);
			});
			var data = t.sortedDataArray;
			if (data.length > 0) {
				t.latest = data[data.length - 1];
			}
			t.dirty = false;
		} catch(e) {
			console.error("Bad JSON in",p,"couldn't load saved data");
		}
		return t;
	}
	
	importRow(record) {
		var stamp = record.gps_when;
		if (!this.data[stamp]) {
			this.data[stamp] = record;
			this.latest = record;
			this.dirty = true;
		}
		if (!this.name) {
			this.name = record.name;
		}
		if (!this.car_name) {
			this.car_name = record.car_name;
		}
		if (!this.country) {
			this.country = record.country;
		}
		return this.dirty;
	}
	serialize() {
		var wasDirty = this.dirty;
		this.dirty = false;
		if (wasDirty) {
			console.log("Serializing",this.filePath);
			try {
				fs.writeFileSync(this.filePath,JSON.stringify(this.sortedDataArray,null," "));
			} catch(e){console.error("Broken JSON in Team",e);}
		}
		return wasDirty;
	}
	
	get sortedDataArray() {
		// Flattens the data into a sorted array
		var sortedKeys = Object.keys(this.data).sort();
		var results = sortedKeys.map(function(k){
			return this.data[k];
		}.bind(this));
		return results;
	}
}
module.exports = Team;