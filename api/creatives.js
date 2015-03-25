'use strict'

var express = require('express');
var router = express.Router();
var utils = require('../lib/utils')
var mongoose = require('mongoose');
// jQuery = require('jquery');
var traceback = require('traceback');

var path = require('path');
var extend = require('util')._extend;

var Creative = require('../models/creative.js');

var message_type =  "";
var message =  "";
var error = "";


/* GET all creatives listing. */
router.get('/', function(req, res, next) {
	
	utils.calling(traceback());
	Creative.list(res, function (err, creatives) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
			return res.render('500');
		} else {
			return res.send(creatives);
		}
  	});

});

/* GET creative by id. */
router.get('/show/:id', function(req, res, next) {
	
	utils.calling(traceback());
	Creative.show(req.params.id, function (err, creative) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
			return res.render('500');
		} else {
			return res.send(creative);
		}
  	});

});

/* POST creative create */
router.post('/create', function(req, res, next){
	
	utils.calling(traceback());	

	console.log("post req body :" , req.body);

	var creative = new Creative(req.body);

	Creative.save(req,creative, function (err) {
 		if (err){
			console.log("ERROR OCCURED : " , err);
			// return res.render('500');
			return next(err);

		} else {
			return res.send(creative);
		}
  	});

});


router.put('/update/:id', function(req, res, next) {

	utils.calling(traceback());

	console.log("req params : " ,  req.params);
	console.log("UPDATE PARAMS : " , req.body);

	Creative.findById(req.params.id, function (err, creative) {
 		if (err) return next(err);
		creative = extend(creative , req.body);
	    Creative.save(req,creative, function (err) {
	    	if (err) {
				console.log("ERROR OCCURED : " , err);
				return res.render('500');
			} else {
				return res.send(creative);
			}
    	});
	});

});


router.delete('/destroy/:id', function (req, res){
	utils.calling(traceback());
	Creative.findById(req.params.id, function (err, creative) {
		if (err) return next(err);
		if (creative == null){
			return res.json('{Object nod found}');
		}
	    creative.remove(function (err) {
	    	if (err) {
	    		console.log("ERROR OCCURED : " , err);
				return res.render('500');
			}else{
				return res.send("Destroy success");
			}
    	});
	});
});


module.exports = router;



