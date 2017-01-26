'use strict';
var http = require('http');

module.exports = {
	getCityName: function(latlng, callback) {
		http.get({
			hostname: 'maps.googleapis.com',
			path: '/maps/api/geocode/json?latlng=' + latlng,
			agent: false
		}, (response) => {
			var str = '';
			response.on('data', function (chunk) {
				str += chunk;
			});

			response.on('end', function () {
				var responseObject = JSON.parse(str);
				if(responseObject.results[0]) {
					var add= responseObject.results[0].formatted_address ;
                    var  value=add.split(',');
                    console.log('returning');
                    callback(null, value[value.length-3]);
				}
			});
		});
	}
};
