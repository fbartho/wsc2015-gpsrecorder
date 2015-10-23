# wsc2015-gpsrecorder
NodeJS Data Recorder for the GPS locations of the vehicles in the World Solar Challenge 2015

It also provides a "live tracking" self-updating googlemap. 

### Installation:

This project uses nodejs & npm, if you're not familiar with that, you'll need to install them. (On a mac using homebrew run `brew install node; brew install npm`)

	git clone https://github.com/fbartho/wsc2015-gpsrecorder;
	cd wsc2015-gpsrecorder;
	npm update

### Usage

To record data as it is exposed by the API, run the following command:

	node record.js

This will poll on a (configurable) interval, collecting data.

Results can be found in [data/](./data) more [documentation](./data/data-files.md) exists in that folder as well!

Also, to merge data from alternate data directories into your current one, run:

	node merge-data.js -p <path_to_alternate_data_directory>

#### Live-Updating Google Map

After launching record.js (which will poll the WSC API and cache the data for you) open [./html/livemap.html] in your browser to see a live updating google map!

Note: you need to create a google_api.keyfile with the following JSON

	{
		apiKey: "YOUR_API_KEY_HERE"
	}

You can get your own Google Maps API Key from [https://developers.google.com/maps/documentation/javascript/get-api-key](https://developers.google.com/maps/documentation/javascript/get-api-key)

## See Also:

Others have also built utilities for this race, check them out!

- [fenichel/slrcr](https://github.com/fenichel/slrcr)

# Go Fast, Go Smooth, Go Blue!

Created for [umsolar.com](umsolar.com) & the wider Solar Raycing Community!