'use strict';
var path = require('path');
var config = require(path.join(global.appRoot, './config'));
var mongo = require('mongoskin');

var db = mongo.db(config.db, {native_parser: true});

db.bind('locations');
// To create index
// db.locations.ensureIndex( { "$**": "text" } )
module.exports = db;
