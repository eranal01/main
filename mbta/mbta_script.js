	var coordinates =  [
	['alfc', 42.395428, -71.142483],
	['davis', 42.39674, -71.121815],
	['portr', 42.3884, -71.11914899999999],
	['harsq', 42.373362, -71.118956],
	['cntsq', 42.365486, -71.103802],
	['knncl', 42.36249079, -71.08617653],
	['chmnl', 42.361166, -71.070628],
	['pktrm', 42.35639457,-71.0624242],
	['dwnxg', 42.355518, -71.060225],
	['sstat', 42.352271, -71.05524200000001],
	['brdwy', 42.342622, -71.056967],
	['andrw', 42.330154, -71.057655],
	['jfk', 42.320685, -71.052391],
	['nqncy', 42.275275, -71.029583],
	['wlsta', 42.2665139, -71.0203369],
	['qnctr', 42.251809, -71.005409],
	['qamnl', 42.233391, -71.007153],
	['brntn', 42.2078543, -71.0011385],
	['shmnl', 42.31129, -71.053331],
	['fldcr', 42.300093, -71.061667],
	['smmnl', 42.29312583, -71.06573796000001],
	['asmnl', 42.284652, -71.06448899999999]
];


function initMap() {

/* Opening map centered on South Station */
	var map = new google.maps.Map(document.getElementById('map'), {
	  center: new google.maps.LatLng(coordinates[9][1], coordinates[9][2]),
	  zoom: 12
	});

	/* Setting icon image to T logo */
	var image = {
		url: '/mbta_T.png',
		scaledSize: new google.maps.Size(35, 35)
	};


	var marker, i;

	/*  Differentaiting split in Red line */
	var lineCoordinates = [];
	var lineCoordinatesExt = [];

	/* Split occurs at JFK stations*/
	lineCoordinatesExt[0] = {lat: 42.320685, lng: -71.052391};

	/* Adding coordinates to map with T logo icons */
	for (i = 0; i < coordinates.length; i++) {
		marker = new google.maps.Marker({
			position: {lat: coordinates[i][1], lng: coordinates[i][2]},
			map: map,
			icon: image
		});

		/* Adding coordinates to different arrays to draw split in line*/
		if (i < 18) {	
			lineCoordinates [i] = 
				{lat: coordinates[i][1], lng: coordinates[i][2]};
		} else {
			lineCoordinatesExt [i-17] = 
				{lat:coordinates[i][1], lng:coordinates[i][2]};
		}

	};

	/* Draw Alefwife to Brookline*/
	var redLine = new google.maps.Polyline({
		path: lineCoordinates,
		geodesic: true,
		strokeColor: '#ff0000',
		strokeOpacity: 1.0,
		strokeWeight: 3
	});

	/* Draw JFK to Ashmont*/
	var redLineExt = new google.maps.Polyline({
		path: lineCoordinatesExt,
		geodesic: true,
		strokeColor: '#ff0000',
		strokeOpacity: 1.0,
		strokeWeight: 3
	});

	redLine.setMap(map);
	redLineExt.setMap(map);

	/* Find current location of user */
	navigator.geolocation.getCurrentPosition(function(position) {
		var pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
		/* Center map to current location*/
		map.setCenter(pos);
		
		/* Put marker at current location*/
		var currLoc = new google.maps.Marker({
			position: pos,
			map: map
		});
		
		/* Open info window at current location when cliked*/
		var currInfoWindow = new google.maps.InfoWindow({
			content: 'Test',
			map: map
			});

		currLoc.addListener('click', function() {
			currInfoWindow.open(map,currLoc);
		});


	});



}

/* 
	
	var infowindow = new google.maps.InfoWindow();

	google.maps.event.addListener(marker, 'click', function(marker, i) {
			return function() {
				infowindow.setContent(locations[i][0]);
				infowindow.open(map, marker);
			}
		});
*/ 