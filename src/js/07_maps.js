// Global reference to the Google map
var G_MAP;

//
// The variable MONGERS is in the file "mongers.js". This file is autogerenated.
//


// Loads the maps and adds the Bratislava mongers to the map
function load_map () {
	if (! GBrowserIsCompatible()) {return;}
	
	G_MAP = new GMap2(document.getElementById("googlemap"));
	G_MAP.setCenter(new GLatLng(48.66194, 19.33594), 6);
	G_MAP.addControl(new GLargeMapControl());
	G_MAP.addControl(new GMapTypeControl());

	for (var field in MONGERS) {
		var monger = MONGERS[field];
		map_add_monger(monger);
	}
}


// Adds a monger to the main map
function map_add_monger (monger) {
	if (! G_MAP) {return;}
	if (! monger) {return;}

	var marker = new GMarker(monger.location);
	G_MAP.addOverlay(marker);
	
	GEvent.addListener(marker, "click", function() {
		map_show_monger(monger);
	});

	// Make the map marker behave like a toggle
	GEvent.addListener(marker, "infowindowopen", function() {
		monger.is_shown = true;
	});
	GEvent.addListener(marker, "infowindowclose", function() {
		monger.is_shown = false;
	});

	monger.marker = marker;
}


// Displays the info of a marker on the main map
function map_show_monger (monger) {
	if (! G_MAP) {return;}

	if (monger.is_shown) {
		monger.marker.closeInfoWindow();
	}
	else {
		// The HTML text inside the map's bubble		
		var myHtml = "";
		myHtml += "<img src='" + monger.picture + "' class = 'monger-picture'>";
		myHtml += "<b><a href='javascript:map_show_monger_info(\"" + monger.id + "\")'>" + monger.name + "</a></b><br>";
		myHtml += "Nick: " + monger.nick + "<br>";
		if (monger.cpan) {
			myHtml += "CPAN: " + "<a href='http://search.cpan.org/%7E/" + monger.cpan + "'>" + monger.cpan + "</a>";
		}

		monger.marker.openInfoWindowHtml(myHtml);
	}
}


// Displays the info of the monger with the given ID. The info div is displayed
// as the first monger.
function map_show_monger_info (id) {
	$('#' + id).remove().prependTo("#mongersTable");
}


// Displays the info the given monger on the map
function map_show_monger_by_name (name) {
	var monger = MONGERS[name];
	map_show_monger(monger);
}

if (typeof(GLatLng) != 'undefined') {

$(document).ready(function(){
	var googlemapDiv = $('#googlemap');
	if (googlemapDiv) {
		load_map();
		googlemapDiv.unload(GUnload);
	}
});

}
