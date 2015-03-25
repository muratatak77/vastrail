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

var AdSpace = require('../models/ad_space.js');

var message_type =  "";
var message =  "";
var error = "";


/* GET ad_spaces listing. */
router.get('/', function(req, res, next) {
	utils.calling(traceback());
	AdSpace.list(res, function (err, ad_spaces) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('ad_spaces/index', {
				ad_spaces: ad_spaces
			});
		}
  	});
});


/* GET users listing. */
router.get('/show/:id', function(req, res, next) {
	
	utils.calling(traceback());
	
	AdSpace.show(req.params.id, function (err, ad_space) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('ad_spaces/show', {
				ad_space: ad_space
			});
		}
  	});

});

// new form create - update
router.get('/new', function(req, res, next) {

	utils.calling(traceback());

	res.render('ad_spaces/new', {
	ad_space: AdSpace,
		form_action_page: "/ad_spaces/create",
		form_method_type: "post"
	});
	
});

/* POST ad_space new */
router.post('/create', function(req, res, next){
	utils.calling(traceback());	

	console.log("Http body : " , req.body);

	var ad_space = new AdSpace(req.body);
	AdSpace.save(req,ad_space, function (err) {

    	if (err) {
			console.log("ERROR OCCURED : " , err);

			return res.render('ad_spaces/new', {
				ad_space: ad_space,
				form_action_page: "/ad_spaces/create",
				form_method_type: "post",
				errors: utils.errors(err)
			});

    	} else {
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully created ad_space!  / ID = ' + ad_space.id  + " / Title : " + ad_space.title
		    }
			res.redirect('/ad_spaces/show/'+ad_space.id);
    	}
  	});

});


/* GET edit by id. */
router.get('/edit/:id', function(req, res, next) {

	utils.calling(traceback());

	AdSpace.findById(req.params.id, function(err, ad_space){
		if (err) {
			return console.log("ERROR OCCURED : " , err);
		}

  		res.render('ad_spaces/edit', {
			ad_space: ad_space,
			form_action_page: "/ad_spaces/update/"+ad_space.id,
			form_method_type: "post"
		});
		
	});

});


router.post('/update/:id', function(req, res, next) {

	// console.log("ad_space : " , req.ad_space );

	utils.calling(traceback());

	console.log("req params : " ,  req.params);
	console.log("UPDATE PARAMS : " , req.body);

	AdSpace.findById(req.params.id, function (err, ad_space) {
 		if (err) return next(err);
		ad_space = extend(ad_space , req.body);
	    AdSpace.save(req,ad_space, function (err) {

	    	if (!err) {
				req.session.sessionFlash = {
			        type: 'success',
			        message: 'Successfully Update ad_space!  / ID = ' + ad_space.id  + " / Title : " + ad_space.title
			    }
				console.log("Update Successfully :" , ad_space);
		    	return res.redirect('/ad_spaces/show/'+ad_space.id);
			}

	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('ad_spaces/edit', {
					ad_space: ad_space,
					form_action_page: "/ad_spaces/update/"+ad_space.id,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}

    	});
	});

});


router.post('/destroy/:id', function (req, res){

	utils.calling(traceback());

	AdSpace.findById(req.params.id, function (err, ad_space) {
	    ad_space.remove(function (err) {
	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('ad_spaces/edit', {
					ad_space: ad_space,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully destroy ad_space! /  ID = ' + req.params.id  + " / Title : " + ad_space.title
		    }
			res.redirect('/ad_spaces');
    	});
	});
});


module.exports = router;



