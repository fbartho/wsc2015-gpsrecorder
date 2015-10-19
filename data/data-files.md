Notes about the GPS Logs collected:
===================================

- Each file is named after each team's unique team number.
- Each team's data is uniqued by the GPS timestamp.
- The data is raw, it'll be up to you to sort and process it.

### File Types:

All the output files are presented in the `data` folder by default
- team/#.data.json = raw storage for each team's json data
	Note: The data in each row is simply the raw JSON data from the http://www.worldsolarchallenge.org/api/positions api end point.
- class/CLASS_NAME.latest.data.json = the last datapoint for every car in a given class
- class/CLASS_NAME.latest.csv = the last datapoint for every car in a given class (as CSV)
- Maybe-TODO \#.data.csv = CSV formatted output for a given team
- TODO: combined.csv = CSV with all the data from all the teams

### Sample Data Record

	{
		"car_name": "Aurum",
		"class_id": 5,
		"country": "us",
		"dist_adelaide": 1607.37,
		"dist_darwin": 1012.305,
		"gps_age": "2 mins 50 secs",
		"gps_when": "2015-10-19 04:12:49",
		"id": "24",
		"lat": -20.9875,
		"lng": 134.20053,
		"name": "University of Michigan Solar Car Team",
		"number": 2
	},

###