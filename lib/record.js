'use strict';

var fs = require("fs");
var path = require("path");
var request = require("request");

var Team = require("./team.js");
var Teamset = require("./teamset.js");

global.API_URL = "http://www.worldsolarchallenge.org/api/positions";
global.FETCH_INTERVAL = 30; // Check for fresh data every x seconds

// This is the global shared state
var state = new Teamset();
state.loadTeams();

function fetchLiveData(state) {
	var reqDate = new Date();
	console.log(""+reqDate,"Fetching data…");
	request({
		url: API_URL,
		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			//console.log(body);
			if (body.length) {
				var anyDirty = false;
				var dirtyCount = 0;
				body.forEach(function(r){
//						console.log("processing",r);
					var thisDirty = state.importRow(r);
					if (thisDirty) {
						dirtyCount++;
					}
				});
				if (dirtyCount > 0) {
					console.log(""+reqDate,"Data updated for",dirtyCount,"teams!");
					state.serialize();
				} else {
					console.log(""+reqDate,"No updates.");
				}
			}
		} else {
			console.error(""+reqDate,"Error loading data!",response.statusCode,error);
		}
		setTimeout(function() {
			fetchLiveData(state);
		}, FETCH_INTERVAL*1000);
	});
}
fetchLiveData(state);
