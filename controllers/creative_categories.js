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

var CreativeCategory = require('../models/creative_category.js');

var message_type =  "";
var message =  "";
var error = "";


/* GET creative_categories listing. */
router.get('/', function(req, res, next) {
	utils.calling(traceback());
	CreativeCategory.list(res, function (err, creative_categories) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('creative_categories/index', {
				creative_categories: creative_categories
			});
		}
  	});
});


/* GET users listing. */
router.get('/show/:id', function(req, res, next) {
	
	utils.calling(traceback());
	
	CreativeCategory.show(req.params.id, function (err, creative_category) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('creative_categories/show', {
				creative_category: creative_category
			});
		}
  	});

});

// new form create - update
router.get('/new', function(req, res, next) {

	utils.calling(traceback());

	res.render('creative_categories/new', {
	creative_category: CreativeCategory,
		form_action_page: "/creative_categories/create",
		form_method_type: "post"
	});
	
});

/* POST creative_category new */
router.post('/create', function(req, res, next){
	utils.calling(traceback());	

	console.log("Http body : " , req.body);

	var creative_category = new CreativeCategory(req.body);
	CreativeCategory.save(req,creative_category, function (err) {

    	if (err) {
			console.log("ERROR OCCURED : " , err);

			return res.render('creative_categories/new', {
				creative_category: creative_category,
				form_action_page: "/creative_categories/create",
				form_method_type: "post",
				errors: utils.errors(err)
			});

    	} else {
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully created creative_category!  / ID = ' + creative_category.id  + " / Title : " + creative_category.title
		    }
			res.redirect('/creative_categories/show/'+creative_category.id);
    	}
  	});

});


/* GET edit by id. */
router.get('/edit/:id', function(req, res, next) {

	utils.calling(traceback());

	CreativeCategory.findById(req.params.id, function(err, creative_category){
		if (err) {
			return console.log("ERROR OCCURED : " , err);
		}

  		res.render('creative_categories/edit', {
			creative_category: creative_category,
			form_action_page: "/creative_categories/update/"+creative_category.id,
			form_method_type: "post"
		});
		
	});

});


router.post('/update/:id', function(req, res, next) {

	// console.log("creative_category : " , req.creative_category );

	utils.calling(traceback());

	console.log("req params : " ,  req.params);
	console.log("UPDATE PARAMS : " , req.body);

	CreativeCategory.findById(req.params.id, function (err, creative_category) {
 		if (err) return next(err);
		creative_category = extend(creative_category , req.body);
	    CreativeCategory.save(req,creative_category, function (err) {

	    	if (!err) {
				req.session.sessionFlash = {
			        type: 'success',
			        message: 'Successfully Update creative_category!  / ID = ' + creative_category.id  + " / Title : " + creative_category.title
			    }
				console.log("Update Successfully :" , creative_category);
		    	return res.redirect('/creative_categories/show/'+creative_category.id);
			}

	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('creative_categories/edit', {
					creative_category: creative_category,
					form_action_page: "/creative_categories/update/"+creative_category.id,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}

    	});
	});

});


router.post('/destroy/:id', function (req, res){

	utils.calling(traceback());

	CreativeCategory.findById(req.params.id, function (err, creative_category) {
	    creative_category.remove(function (err) {
	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('creative_categories/edit', {
					creative_category: creative_category,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully destroy creative_category! /  ID = ' + req.params.id  + " / Title : " + creative_category.title
		    }
			res.redirect('/creative_categories');
    	});
	});
});


module.exports = router;



