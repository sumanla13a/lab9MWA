'use strict';

var path		 = require('path');
var util		 = require('util');
var express		 = require('express');
var router		 = express.Router();
var locations	 = require(path.join(global.appRoot, 'model')).locations;
var request		 = require(path.join(global.appRoot, 'model/request'));
/* GET home page. */

var controllers = {
	getLocationPage: function(req, res) {
		res.render('locations');
	},

	validateLocations: function(req, res, next) {
		// req.checkBody('name', 'Where is the name?').notEmpty();
		// req.checkBody('category', 'Where is the category?').notEmpty();
		req.checkBody('lat', 'Where is the latitude?').notEmpty();
		req.checkBody('lng', 'Where is the longitude?').notEmpty();

		req.getValidationResult().then(function(result) {
			if(!result.isEmpty()) {
				return next(new Error('There have been validation errors: ' + util.inspect(result.array())));
			}
			next();
		});
	},
	getCityName: function(req, res, next) {
		request.getCityName(req.body.lat + ',' + req.body.lng, function(err, res) {
			if(err) {
				return next(err);
			}
			req.body.cityname = res;
			next();
		});
	},

	saveLocations: function(req, res, next) {
		let data = {
			name: 		req.body.cityname,
			category: 	Math.random() > 0.5 ? 'Restaurant' : 'School',
			location: {
				coordinates: 	[parseFloat(req.body.lng),	parseFloat(req.body.lat)],
				type: 			'Point'
			} 
		};
		if(req.body._id) {
			data._id = req.body._id;
		}
		locations.save(data, function(err, resp) {
			if(err) {
				return next(err);
			}
			res.json({
				success: 1,
				data: resp
			});
		});
	},

	deleteLocations: function(req, res, next) {
		let id = req.body.id || req.params.id;
		if(typeof id === 'undefined') {
			return next(new Error('Nothing to delete'));
		}
		locations.removeById(id, function(err, resp) {
			if(err) {
				return next(err);
			}
			return res.json({
				success: 1,
				data: resp
			});
		});
	},
	getById: function(req, res, next) {
		let id = req.params.id || req.query.id;
		if(typeof id === 'undefined') {
			return next(new Error('which one do you want? Pass id may be'));
		}
		locations.getById(id, function(err, resp) {
			if(err) {
				return next(err);
			}
			return res.json({
				success: 1,
				data: resp
			});
		});
	},

	getLocationsNearMum: function(req, res, next) {
		req.checkQuery('lat', 'Where is the name?').notEmpty();
		req.checkQuery('lng', 'Where is the name?').notEmpty();
		req.getValidationResult().then(function(result) {
			if(!result.isEmpty()) {
				return next(new Error('There have been validation errors: ' + util.inspect(result.array())));
			}
			var query = {
				'location.coordinates': {
					'$geoWithin': {
						'$centerSphere':[ [parseFloat(req.query.lng), parseFloat(req.query.lat)], 1000000000 ]
					}

				}
			};
			// can't use text index search with any other indexed searches
			if(req.query.name) {
				// query.name = { '$regex': req.query.name, '$options': 'i' };
				query.$text = { $search : req.query.name};
			}
			/*if(req.query.category) {
				query.category = { '$regex': req.query.category, '$options': 'i' };
			}*/

			locations.find(query, {
				limit: 3
			}, function(err, resp) {
				resp.toArray(function(err, data) {
					if(err) {
						return next(err);
					}

					return res.json({
						success: 1,
						data: data
					});

				});
			});
		});
	}
};

router.get('/', controllers.getLocationPage)
	.post('/', controllers.validateLocations, controllers.getCityName, controllers.saveLocations)
	.put('/', controllers.validateLocations, controllers.getCityName, controllers.saveLocations)
	.delete('/', controllers.deleteLocations);

router.post('/:id/delete', controllers.deleteLocations)
		.get('/:id/get', controllers.getById);

router.get('/near', controllers.getLocationsNearMum);

module.exports = router;
