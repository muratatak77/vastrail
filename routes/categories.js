'use strict'

var express = require('express');
var router = express.Router();
var utils = require('../lib/utils')
var mongoose = require('mongoose');
// jQuery = require('jquery');
var traceback = require('traceback');

var path = require('path');

// var trace = stackTrace.get();

var Category = require('../models/category.js');
var message_type =  "";
var message =  "";
var error = "";


/* GET categories listing. */
router.get('/', function(req, res, next) {

	utils.calling(traceback());

	render_index(req, res, "", "");
});

/* GET users listing. */
router.get('/show/:id', function(req, res, next) {
	
	utils.calling(traceback());
	
	// Category.findById(req.params.id).populate('user').exec(function(err, category) { 
	// 	console.log("category : " , category);
	// 	if (err) {
	// 		return console.log("ERROR OCCURED : " , err);
	// 	}
	// 	res.render('categories/show', {
	// 		category: category
	// 	});
	// });

	Category.findById(req.params.id, function(err, category){
		console.log("category : " , category);
		if (err) {
			return console.log("ERROR OCCURED : " , err);
		}
		res.render('categories/show', {
			category: category
		});
	});

});


router.get('/new', function(req, res, next) {
	res.render('categories/new', {
		category: Category,
		form_action_page: "/categories/create",
		form_method_type: "post"
	});
	
});

/* POST category new */
router.post('/create', function(req, res, next){

	console.log("POST : ");
	console.log(req.body);

	var category = Category.new(req);
	console.log("category >> " , category);

 	category.save(function (err) {
    	if (err) {

		  	console.log("ERROR OCCURED : " , err);
		  	
			return res.render('categories/new', {
				category: category,
				form_action_page: "/categories/create",
				form_method_type: "post",
				errors: utils.errors(err)
			});

    	} else {
    		
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully created category!  / ID = ' + category.id  + " / Title : " + category.title
		    }
			res.redirect('/categories/show/'+category.id);
    	}
  	});

});


/* GET edit by id. */
router.get('/edit/:id', function(req, res, next) {

	Category.findById(req.params.id, function(err, category){
		if (err) {
			return console.log("ERROR OCCURED : " , err);
		}
		res.render('categories/edit', {
			category: category,
			form_action_page: "/categories/update/"+category.id,
			form_method_type: "post"
		});
	});

});



router.post('/update/:id', function(req, res, next) {

	console.log("req.params : " ,  req.params);
	console.log("UPDATE PARAMS : " , req.body);

	Category.findById(req.params.id, function (err, category) {
 	
 		if (err) return next(err);

 		category = Category.load(category, req);

	    category.save(function (err) {

	    	if (!err) {
				req.session.sessionFlash = {
			        type: 'success',
			        message: 'Successfully Update category!  / ID = ' + category.id  + " / Title : " + category.title
			    }
				console.log("Update Successfully :" , category);
		    	return res.redirect('/categories/show/'+category.id);
			}


	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('categories/edit', {
					category: category,
					form_action_page: "/categories/update/"+category.id,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}

    	});
	});


	// Category.findByIdAndUpdate(req.params.id, req.body, function (err, category) {

	//     if (err) return next(err);
	// 	if (!category){
	// 		console.log("ERROR OCCURED 1 : " , 'category is null' );
	// 		return next(err);
	// 	}

	// 	if (!err) {
	// 		req.session.sessionFlash = {
	// 	        type: 'success',
	// 	        message: 'Successfully Update category!  / ID = ' + category.id  + " / Title : " + category.title
	// 	    }
	// 		console.log("Update Successfully :" , category);
	//     	return res.redirect('/categories/show/'+category.id);
	// 	}

	// 	console.log("ERROR OCCURED  : " , err);

	// 	return res.render('categories/edit', {
	// 		category: category,
	// 		form_action_page: "/categories/update/"+category.id,
	// 		form_method_type: "post",
	// 		errors: utils.errors(err)
	// 	});


	// });


});


router.post('/destroy/:id', function (req, res){
	Category.findById(req.params.id, function (err, category) {
	    category.remove(function (err) {
	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('categories/edit', {
					category: category,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully destroy category! /  ID = ' + req.params.id  + " / Title : " + category.title
		    }
			res.redirect('/categories');
    	});
	});
});

function render_index(req, res, msg_type, msg_val){

	// Category.find({}).populate('user').exec(function(err, categories) { 
	// 	// Your callback code where you can access subdomain directly through custPhone.subdomain.name 

	// 	if (err){
	//     	console.log("ERROR OCCURED 3 : " , err);
	//     	req.session.sessionFlash = {
	// 	        type: 'danger',
	// 	        message: 'Error Ocuured' + utils.errors(err)
	// 	    }
	//     }

	// 	res.render('categories/index', {
	// 		categories: categories,
	// 		message_type: msg_type,
	// 		message: message
	// 	});

	// })

	Category.find(function (err, categories) {
		console.log("calling index.");
		var message = "";
	    if (err){
	    	console.log("ERROR OCCURED 3 : " , err);
	    }
	    if (msg_val != "" && msg_type != ""){
			message = msg_val;
	    }

		res.render('categories/index', {
			categories: categories,
			message_type: msg_type,
			message: message
		});
	});

}


module.exports = router;



