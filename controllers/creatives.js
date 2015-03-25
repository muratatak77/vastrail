'use strict'

var express = require('express');
var router = express.Router();
var utils = require('../lib/utils')
var mongoose = require('mongoose');
// jQuery = require('jquery');
var traceback = require('traceback');
var extend = require('util')._extend;

var path = require('path');

// var trace = stackTrace.get();

var Creative = require('../models/creative.js');
var Creative_Category = require('../models/creative_category.js');
var Video_Format = require('../models/video_format.js');


var message_type =  "";
var message =  "";
var error = "";


/* GET creatives listing. */
router.get('/', function(req, res, next) {
	utils.calling(traceback());
	Creative.list(res, function (err, creatives) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('creatives/index', {
				creatives: creatives
			});
		}
  	});
});


/* GET users listing. */
router.get('/show/:id', function(req, res, next) {
	
	utils.calling(traceback());
	Creative.show(req.params.id, function (err, creative) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('creatives/show', {
				creative: creative
			});
		}
  	});

});

// new form create - update
router.get('/new', function(req, res, next) {

	utils.calling(traceback());

  	Creative_Category.list(res, function (err, creative_categories) {
  		
  		if (err) return next(err);

  		Video_Format.list(res, function (err, video_formats) {

		    if (err){
				console.log("ERROR OCCURED : " , err);
			    return res.render('500');
			} else {
				res.render('creatives/new', {
					creative: Creative,
					form_action_page: "/creatives/create",
					form_method_type: "post",
					creative_categories: creative_categories,
					video_formats: video_formats
				});
			}

		});


  	});
	
});

/* POST creative new */
router.post('/create', function(req, res, next){
	utils.calling(traceback());	

	console.log("Http body : " , req.body);

	var creative = new Creative(req.body);
	Creative.save(req,creative, function (err) {

    	if (err) {
			console.log("ERROR OCCURED : " , err);

		 	Creative_Category.list(res, function (err_cat, creative_categories) {

		 		if (err_cat) return res.render('500');
				return res.render('creatives/new', {
					creative: creative,
					form_action_page: "/creatives/create",
					form_method_type: "post",
					errors: utils.errors(err),
					creative_categories: creative_categories
				});
			});

    	} else {
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully created creative!  / ID = ' + creative.id  + " / Title : " + creative.title
		    }
			res.redirect('/creatives/show/'+creative.id);
    	}
  	});

});


/* GET edit by id. */
router.get('/edit/:id', function(req, res, next) {

	utils.calling(traceback());

	Creative.findById(req.params.id, function(err, creative){
		if (err) {
			return console.log("ERROR OCCURED : " , err);
		}

	  	Creative_Category.list(res, function (err, creative_categories) {
	  		res.render('creatives/edit', {
				creative: creative,
				form_action_page: "/creatives/update/"+creative.id,
				form_method_type: "post",
				creative_categories: creative_categories
			});

	  	});
		
	});

});


router.post('/update/:id', function(req, res, next) {

	// console.log("creative : " , req.creative );

	utils.calling(traceback());

	console.log("req params : " ,  req.params);
	console.log("UPDATE PARAMS : " , req.body);

	Creative.findById(req.params.id, function (err, creative) {
 		if (err) return next(err);
		creative = extend(creative , req.body);
	    Creative.save(req,creative, function (err) {

	    	if (!err) {
				req.session.sessionFlash = {
			        type: 'success',
			        message: 'Successfully Update creative!  / ID = ' + creative.id  + " / Title : " + creative.title
			    }
				console.log("Update Successfully :" , creative);
		    	return res.redirect('/creatives/show/'+creative.id);
			}

	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('creatives/edit', {
					creative: creative,
					form_action_page: "/creatives/update/"+creative.id,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}

    	});
	});

});


router.post('/destroy/:id', function (req, res){

	utils.calling(traceback());

	Creative.findById(req.params.id, function (err, creative) {
	    creative.remove(function (err) {
	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('creatives/edit', {
					creative: creative,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully destroy creative! /  ID = ' + req.params.id  + " / Title : " + creative.title
		    }
			res.redirect('/creatives');
    	});
	});
});


module.exports = router;



