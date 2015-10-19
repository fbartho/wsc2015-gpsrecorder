# wsc2015-gpsrecorder
NodeJS Data Recorder for the GPS locations of the vehicles in the World Solar Challenge 2015

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

# Go Fast, Go Smooth, Go Blue!

Created for [umsolar.com](umsolar.com) & the wider Solar Raycing Community!