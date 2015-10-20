function getScript(src) {
	var s = document.createElement('script');

	s.src = src;
	s.async = false;
	document.body.appendChild(s);
}

// wow...
var polyline = "vcakAe`r}W_xCcs@~XuoKvtD_lN`qGycFrrGghGrbJyG|fYwpC~rMc}ErtNid@tsg@l~Dv|Nr^rhHe}AltFyrIxaJ}xFrrWssUvxNcqQboDkdHhrDuuIhzFepXnySq"+
	"|ObaLuwQ|tNqaA`s\\}|TrkP}eFjgXaxLndKovHtnM{oKzmIytLnwCyyLwd@m{DvuEyaMxdKegJ`|L{x[jnLc__@~pPc`XdqUu_ZxvMs{BvsNpx@naf@upIrvy@yqPjxU{|QteKcl"+
	"KzhQmvChxOcjEv_QnfC~zVgdBpzSvoEpi_@tcBnzZ`}Cd|UmnJ`f\\qaBfg{@{fE|mYpu@feVl]xu\\}jP~|J{yK|la@}gKjrc@guHhuZuy@hmWkbDd{WidOn|ZoxGjbt@cn\\tnX"+
	"crOzrDap@jyI__C`jV{`E~yl@k`Crg`@smDr}MnrCzeRj}Bb{t@{lFzdr@gk@z_z@shInsQ~~Il__@isBtk`Ah{M|pUvaGb_YvlZrlYfcNxrKrvQt_ItzKjhEwg@xlLpl@|hHvrJ|c"+
	"`@f|^n~a@diRx_DgyAni^duCxdj@pgNxak@{vLbs]w|Tbiz@_uo@v`_AspSlqSnX`cFukA|sMlH|cL`gGztr@v{q@jkTnfPlmOd|HjtIqzBruDd_EjyNrcPrwQ|mQfab@t{IpryAkp"+
	"B|iQyq@f`SleBbqIimBhpQek@tlDhl@xaQqpBnw\\a{JbmN`}CpySdzK`xa@vW|hUxX|dNelEhtb@k~Dxf[ygHffZamEdqIegHrxNon@viRc_MdnVavMpjXslRpfg@_w^~s_@o|\\b"+
	"eP_}Kxka@ekNjfRmdAdbOg_Dxyt@ojIhtMwwB|}Mi_KzzN}wPvsOyfWjoZ}sYdwU_gLlnRukc@|cNgfKhoM_xChfl@gcJvfWwhMhtIaqGftPxsA~uXml@z~PotFp}XotD|hPoq@xlE"+
	"{zFxcLilFv`\\sxLxqQq[t}N}_Epo\\kpV|sRe|O~tDmvOdmMo~K|aVoyUx{Mexd@vdK{iv@`rDijb@boAqtNmbBqdYhmAczLjgUgcTjhZa`e@hs]gyIvmE}pJlyQeaOfl[gzNhdPk"+
	"gJjvKjUxzF{c@pkO{tN`fYcqNldR_pV`aJmeOph[_zUfyRolC`_g@keEv{JgwE~cN{tHbpOqHloLacMt`GynDjaLkl@l|Qn{A~`K{hFhbSmpDns_@nmBp_R`lFnfGjy@tuFcjEvsIa"+
	"lB~dJniAboPl{GvpJelItnn@}p`@frJu~Jt{[{cUv_XslGrxPlrAdaD_aB";

var map, infoWindow, pins;

var followTeam = null;
var positions = {};
var classLatestData = {};

function initMap() {
	getScript('./markerwithlabel.js');
	
	var mapOptions = {
		zoom: 8,
		center: new google.maps.LatLng(-25.1, 133.0),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		scaleControl: true
	};
	
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	
	// Load the route!
	var decodedPath = google.maps.geometry.encoding.decodePath(polyline);
	new google.maps.Polyline({
		path: decodedPath,
		map: map,
		strokeColor: "#2A44EB",
		strokeOpacity: 1.0,
		strokeWeight: 2,
	});
	
	// Start liveloading the data!
	setInterval(fetchAndUpdatePositions,20 * 1000);
	fetchAndUpdatePositions();
	window.onMarkerWithLabelLoad = fetchAndUpdatePositions;
}
function fetchAndUpdatePositions() {
	console.log("Fetching positions!");
	["challenger","adventure","cruiser"].forEach(function(c){
		console.log("Processing",c);
		$.getJSON("../data/class/"+c+".latest.data.json?cache_bust="+Math.random(), function(data) {
			console.log(["Refreshed class positions for",c,"class."].join(" "));
			classLatestData[c] = data;
			refreshPinsIfChanged(c,data);
			refreshFollow(c);
		});
	});
}
function getLatest(number){
	return positions[number] || {};
}
function refreshPinsIfChanged(c,data) {
	// console.log("Moving",c,"pins!");
	data.forEach(function(r){
		var num = r.number;
		var latest = getLatest(num);
		// console.log(latest);
		if (latest.gps_when != r.gps_when) {
			// Did update!
			console.log(["Moving pin for",r.number,r.car_name].join(" "));
			if (latest.marker){
				latest.marker.setMap(null);
			}
			if (window.MarkerWithLabel) {
				latest = positions[num] = r;
				createPinFor(r);
			} else {
				setTimeout(function(){
					refreshPinsIfChanged(c,data);
				},100)
			}
		}
	});
}

var classNameForNumber = {
	5: "challenger",
	6: "adventure",
	7: "cruiser",
};
var classIdForName = {
	"challenger":5,
	"adventure":6,
	"cruiser":7
};
function createPinFor(record) {
	var iTable = {
		challenger: "purple",
		adventure: "blue",
		cruiser: "green"
	};
	function imageForClassName(c) {
		return {
			url: "images/"+iTable[c]+"-marker.png",
			labelOrigin:new google.maps.Point(0,0)
		}
			
	}
//	record.marker = new google.maps.Marker({
//		position: new google.maps.LatLng(record.lat, record.lng),
//		map: map,
//		icon: imageForClassName(classNameForNumber[record.class_id]),
//		label:""+record.number,
//		labelClass: "labels", // the CSS class for the label
//		labelStyle: {opacity: 0.75}
//	});
	record.marker = new window.MarkerWithLabel({
		position: new google.maps.LatLng(record.lat, record.lng),
		draggable: false,
		raiseOnDrag: false,
		map: map,
		icon: imageForClassName(classNameForNumber[record.class_id]),
		labelContent: ""+record.number,
		labelAnchor: new google.maps.Point(30, 26),
		labelClass: "labels", // the CSS class for the label
		labelStyle: {opacity: 0.60}
	});
		
	record.marker.set('pin-id', record.number);
		
	google.maps.event.addListener(record.marker, 'click', pinClick);
}

function pinClick(which) {
	pinPopup(this.get('pin-id'));
}
function pinPopup(number) {
	var r = positions[number];
	alert([followToggle(r),number,r.name,r.car_name,"dist_adelaide:",r.dist_adelaide].join(" "))
}
function followToggle(r){
	if (!followTeam || followTeam.number != r.number) {
		followTeam = r;
		return "Now following:";
	}
	followTeam = null;
	return "No longer following:";
}

function refreshFollow(class_name) {
	// if (followTeam && followTeam.class_id == classIdForName[class_name]) {
	if (followTeam) {
		followTeam = getLatest(followTeam.number);
		
		var pos = new google.maps.LatLng(followTeam.lat,followTeam.lng);
		console.log("Panning the map!",pos.lat(),pos.lng());
		
		map.panTo(pos);
		setTimeout(function(){
			map.setCenter(pos);
		},1000);
	}
}

function loadMapWithKey() {
	console.log("fetching api key");
	$.getJSON("../google_api.keyfile", function(data) {
		if (!data.apiKey) {
			alert("You need to include a google_api.keyfile (JSON with a key called 'apiKey', where the key is registered with google!). Talk to Frederic for help.");
		}
		
		getScript('http://maps.googleapis.com/maps/api/js?key='+data.apiKey+'&libraries=geometry&callback=initMap');
		console.log("Loading the map!");
	}).fail(function() {
		console.log("Couldn't find the google_api.keyfile");
		alert("You need to include a google_api.keyfile (JSON with a key called 'apiKey', where the key is registered with google!)");
	});
}
$(document).ready(loadMapWithKey)
