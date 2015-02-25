
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Create = require('../models/create.js');


/* GET creates listing. */
router.get('/', function(req, res, next) {
	Create.find(function (err, create) {
		console.log("creates size :" , create.length );
	    if (err) return next(err);
		res.render('creates/index', {
			creates: create
		});
	});
});


/* GET users listing. */
router.get('/show', function(req, res, next) {
  res.send('respond with a resource show');
});


/* GET users listing. */
router.get('/new', function(req, res, next) {

	// var create = new Create({title: 'Master NodeJS', type: "Denete Type 2" , advertisers: 'Getting there...'});
	// create.save(function(err){
	// if(err)
	// 	console.log(err);
	// else
 	//	console.log(create);

	res.send('');
	
});


/* GET users listing. */
router.put('/edit', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.post('/update', function(req, res, next) {
  res.send('respond with a resource');
});


/* GET users listing. */
router.get('/destroy', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;



