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

var Advertiser = require('../models/advertiser.js');

var message_type =  "";
var message =  "";
var error = "";


/* GET advertisers listing. */
router.get('/', function(req, res, next) {
	utils.calling(traceback());
	Advertiser.list(res, function (err, advertisers) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('advertisers/index', {
				advertisers: advertisers
			});
		}
  	});
});


/* GET users listing. */
router.get('/show/:id', function(req, res, next) {
	
	utils.calling(traceback());
	
	Advertiser.show(req.params.id, function (err, advertiser) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('advertisers/show', {
				advertiser: advertiser
			});
		}
  	});

});

// new form create - update
router.get('/new', function(req, res, next) {

	utils.calling(traceback());

	res.render('advertisers/new', {
	advertiser: Advertiser,
		form_action_page: "/advertisers/create",
		form_method_type: "post"
	});
	
});

/* POST advertiser new */
router.post('/create', function(req, res, next){
	utils.calling(traceback());	

	console.log("Http body : " , req.body);

	var advertiser = new Advertiser(req.body);
	Advertiser.save(req,advertiser, function (err) {

    	if (err) {
			console.log("ERROR OCCURED : " , err);

			return res.render('advertisers/new', {
				advertiser: advertiser,
				form_action_page: "/advertisers/create",
				form_method_type: "post",
				errors: utils.errors(err)
			});

    	} else {
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully created advertiser!  / ID = ' + advertiser.id  + " / Title : " + advertiser.title
		    }
			res.redirect('/advertisers/show/'+advertiser.id);
    	}
  	});

});


/* GET edit by id. */
router.get('/edit/:id', function(req, res, next) {

	utils.calling(traceback());

	Advertiser.findById(req.params.id, function(err, advertiser){
		if (err) {
			return console.log("ERROR OCCURED : " , err);
		}

  		res.render('advertisers/edit', {
			advertiser: advertiser,
			form_action_page: "/advertisers/update/"+advertiser.id,
			form_method_type: "post"
		});
		
	});

});


router.post('/update/:id', function(req, res, next) {

	// console.log("advertiser : " , req.advertiser );

	utils.calling(traceback());

	console.log("req params : " ,  req.params);
	console.log("UPDATE PARAMS : " , req.body);

	Advertiser.findById(req.params.id, function (err, advertiser) {
 		if (err) return next(err);
		advertiser = extend(advertiser , req.body);
	    Advertiser.save(req,advertiser, function (err) {

	    	if (!err) {
				req.session.sessionFlash = {
			        type: 'success',
			        message: 'Successfully Update advertiser!  / ID = ' + advertiser.id  + " / Title : " + advertiser.title
			    }
				console.log("Update Successfully :" , advertiser);
		    	return res.redirect('/advertisers/show/'+advertiser.id);
			}

	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('advertisers/edit', {
					advertiser: advertiser,
					form_action_page: "/advertisers/update/"+advertiser.id,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}

    	});
	});

});


router.post('/destroy/:id', function (req, res){

	utils.calling(traceback());

	Advertiser.findById(req.params.id, function (err, advertiser) {
	    advertiser.remove(function (err) {
	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('advertisers/edit', {
					advertiser: advertiser,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully destroy advertiser! /  ID = ' + req.params.id  + " / Title : " + advertiser.title
		    }
			res.redirect('/advertisers');
    	});
	});
});


module.exports = router;



