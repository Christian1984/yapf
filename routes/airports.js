let AirportData = require("./utils/airportdata");

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'YAPF - Yet Another Plane Finder' });
  let airportdata = new AirportData();
  res.send(airportdata.dump("EDDK"));
});

module.exports = router;
