	var coordinates =  [
	['Alewife', 42.395428, -71.142483, 'place-alfcl'],
	['Davis', 42.39674, -71.121815, 'place-davis'],
	['Porter', 42.3884, -71.11914899999999, 'place-portr'],
	['Harvard Square', 42.373362, -71.118956, 'place-harsq'],
	['Central Square', 42.365486, -71.103802, 'place-cntsq'],
	['Kendall/MIT', 42.36249079, -71.08617653, 'place-knncl'],
	['Charles/MGH', 42.361166, -71.070628, 'place-chmnl'],
	['Park Street', 42.35639457,-71.0624242, 'place-pktrm'],
	['Downtown Crossing', 42.355518, -71.060225, 'place-dwnxg'],
	['South Station', 42.352271, -71.05524200000001, 'place-sstat'],
	['Broadway', 42.342622, -71.056967, 'place-brdwy'],
	['Andrew', 42.330154, -71.057655, 'place-andrw'],
	['JFK/UMass', 42.320685, -71.052391, 'place-jfk'],
	['North Quincy', 42.275275, -71.029583, 'place-nqncy'],
	['Wollaston', 42.2665139, -71.0203369, 'place-wlsta'],
	['Quincy Center', 42.251809, -71.005409, 'place-qnctr'],
	['Quincy Adams', 42.233391, -71.007153, 'place-qamnl'],
	['Braintree', 42.2078543, -71.0011385, 'place-brntn'],
	['Salvin Hill', 42.31129, -71.053331, 'place-shmnl'],
	['Fields Corner', 42.300093, -71.061667, 'place-fldcr'],
	['Shawmut', 42.29312583, -71.06573796000001, 'place-smmnl'],
	['Ashmont', 42.284652, -71.06448899999999, 'place-asmnl']
];


function initMap() {

/* Opening map centered on South Station */
	var map = new google.maps.Map(document.getElementById('map'), {
	  center: new google.maps.LatLng(coordinates[9][1], coordinates[9][2]),
	  zoom: 12
	});

	/* Setting T stations icon image to T logo */
	var image = {
		url: '/mbta_T.png',
		scaledSize: new google.maps.Size(35, 35)
	};
	/* Setting current location icon image to Waldo */
	var home = {
		url: '/waldo.png',
		scaledSize: new google.maps.Size(40, 80),
		anchor: new google.maps.Point(10, 80)
	}


	var marker = [];
	var i;

	/*  Differentaiting split in Red line */
	var lineCoordinates = [];
	var lineCoordinatesExt = [];

	/* Split occurs at JFK stations*/
	lineCoordinatesExt[0] = {lat: 42.320685, lng: -71.052391};


	var arrival;

	var infoWindow = new google.maps.InfoWindow({
		content: "Insert parsed data here"
    });


	/* Adding coordinates to map with T logo icons */
	for (i = 0; i < coordinates.length; i++) {
		marker[i] = new google.maps.Marker({
			position: {lat: coordinates[i][1], lng: coordinates[i][2]},
			map: map,
			icon: image
		});


		/* if marker is clicked, infoWindow opens */
		google.maps.event.addListener(marker[i], 'click', function() {

						var arrival = [];
						var direction = [];
						request = new XMLHttpRequest();
						var urlString = "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=" + coordinates[1][3];

						/* Parse JSON data from chicken of the sea resource (thanks Ming!)*/
						request.open("GET", urlString, true);
						request.onreadystatechange = function() {
							if ((request.readyState == 4) && (request.status == 200)) {
								theData = request.responseText;
								times = JSON.parse(theData);
								for (j = 0; j < times.data.length; j++) {
									if (times.data[j].attributes.arrival_time == null) {
										fullTime = times.data[j].attributes.departure_time;
									}
									else {
									fullTime = times.data[j].attributes.arrival_time;
									}
									arrival[j] =  fullTime.slice(11,16);
									if (times.data[j].attributes.direction_id == 0) {
										direction[j] = "Ashmont/Braintree";
									}
									else if (times.data[j].attributes.direction_id == 1) {
										direction[j] = "Alewife";
									} 
									

								}

								 /* infoWindow.setContent(this.arrival); */
							}

						}
						request.send();


			infoWindow.open(map, this);
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
			map: map,
			icon: home
		});
	/* Calculate disatnce to closest station */ 
		Number.prototype.toRad = function() {
	   		return this * Math.PI / 180;
		} 
		
		var lat2 = pos['lat']; 
		var lng2 = pos['lng']; 

		var distances = [];

		var R = 6371;

		for (k = 0; k < coordinates.length; k++) {
			var lat1 = coordinates[k][1];
			var lng1= coordinates[k][2];

			var x1 = lat2 - lat1;
			var dLat = x1.toRad();
			var x2 = lng2 - lng1;
			var dLon = x2.toRad();

			var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
	                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
	                Math.sin(dLon/2) * Math.sin(dLon/2);  
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			var d = R * c;

			distances[k] = d/1.60934;
		}

		function indexOfSmallest(a) {
 		return a.indexOf(Math.min.apply(Math, a));
 		}
 		var index = indexOfSmallest(distances);

	/* Open info window at current location when cliked*/
		var currInfoWindow = new google.maps.InfoWindow({
			content: 'Closest Station: ' + coordinates[index][0] + '<br>Distance: ' + Math.round(distances[index]*100) / 100 + 'mi',
			map: map
			});

		var currToStation = [];
		currToStation[0] = {lat: coordinates[index][1], lng: coordinates[index][2]};
		currToStation[1] = pos;


		var shortestPath = new google.maps.Polyline({
		path: currToStation,
		geodesic: true,
		strokeColor: '#000080',
		strokeOpacity: 0.75,
		strokeWeight: 4
	});

		/* Draw polyline of shortest path from location to nearest station*/
		shortestPath.setMap(map);

		currLoc.addListener('click', function() {
			currInfoWindow.open(map,currLoc);
		});






});

}

 