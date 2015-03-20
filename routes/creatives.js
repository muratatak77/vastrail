'use strict'

var express = require('express');
var router = express.Router();
var utils = require('../lib/utils')
var mongoose = require('mongoose');
// jQuery = require('jquery');
var traceback = require('traceback');

var path = require('path');

// var trace = stackTrace.get();

var Creative = require('../models/creative.js');
var Category = require('../models/category.js');

var message_type =  "";
var message =  "";
var error = "";


/* GET creatives listing. */
router.get('/', function(req, res, next) {
	utils.calling(traceback());
	render_index(req, res, "", "");
});

/* GET users listing. */
router.get('/show/:id', function(req, res, next) {
	
	utils.calling(traceback());
	
	Creative.findById(req.params.id).populate('user').exec(function(err, creative) { 
		console.log("creative : " , creative);
		if (err) {
			return console.log("ERROR OCCURED : " , err);
		}
		res.render('creatives/show', {
			creative: creative
		});
	});

	// Creative.findById(req.params.id, function(err, creative){
	// 	console.log("creative : " , creative);
	// 	if (err) {
	// 		return console.log("ERROR OCCURED : " , err);
	// 	}
	// 	res.render('creatives/show', {
	// 		creative: creative
	// 	});
	// });

});


router.get('/new', function(req, res, next) {

	utils.calling(traceback());

	// var categories = "";

	// Category.find(function (err, cats) {
 //      if (err){
 //        console.log("ERROR OCCURED : " , err);
 //        return res.render('500');

 //      }else{
 //        console.log("categories >>>>" , cats);

 //        res.render('creatives/new', {
	// 		creative: Creative,
	// 		form_action_page: "/creatives/creative",
	// 		form_method_type: "post",
	// 		categories: cats
	// 	});
 //      }
 //    });
	console.log("Category List 1 :" , Category.list(res));

  	Category.list(res, function (err, categories) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('creatives/new', {
			creative: Creative,
				form_action_page: "/creatives/creative",
				form_method_type: "post",
				categories: categories
			});

		}
  	});
	
});

/* POST creative new */
router.post('/creative', function(req, res, next){
	utils.calling(traceback());	
	console.log("POST : " , req.body);
	console.log("@@@@@@@@@@@@@@@@@   req.body.category.id >>>>>>>>>>> " ,req.body.category );

	var creative = Creative.new(req);
	console.log("creative >> " , creative);

 	creative.save(function (err) {
    	if (err) {

		  	console.log("ERROR OCCURED : " , err);
		 	Category.list(res, function (err_cat, categories) {

		 		if (err_cat) return res.render('500');

				return res.render('creatives/new', {
					creative: creative,
					form_action_page: "/creatives/creative",
					form_method_type: "post",
					errors: utils.errors(err),
					categories: categories
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
		res.render('creatives/edit', {
			creative: creative,
			form_action_page: "/creatives/update/"+creative.id,
			form_method_type: "post"
		});
	});

});



router.post('/update/:id', function(req, res, next) {

	utils.calling(traceback());

	console.log("req.params : " ,  req.params);
	console.log("UPDATE PARAMS : " , req.body);

	Creative.findById(req.params.id, function (err, creative) {
 	
 		if (err) return next(err);

 		creative = Creative.load(creative, req);

	    creative.save(function (err) {

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


	// Creative.findByIdAndUpdate(req.params.id, req.body, function (err, creative) {

	//     if (err) return next(err);
	// 	if (!creative){
	// 		console.log("ERROR OCCURED 1 : " , 'creative is null' );
	// 		return next(err);
	// 	}

	// 	if (!err) {
	// 		req.session.sessionFlash = {
	// 	        type: 'success',
	// 	        message: 'Successfully Update creative!  / ID = ' + creative.id  + " / Title : " + creative.title
	// 	    }
	// 		console.log("Update Successfully :" , creative);
	//     	return res.redirect('/creatives/show/'+creative.id);
	// 	}

	// 	console.log("ERROR OCCURED  : " , err);

	// 	return res.render('creatives/edit', {
	// 		creative: creative,
	// 		form_action_page: "/creatives/update/"+creative.id,
	// 		form_method_type: "post",
	// 		errors: utils.errors(err)
	// 	});


	// });


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


function render_index(req, res, msg_type, msg_val){

	utils.calling(traceback());

	Creative.find({})
	.populate('user')
	.populate('category')
	.exec(function(err, creatives) { 
		// Your callback code where you can access subdomain directly through custPhone.subdomain.name 

		if (err){
	    	console.log("ERROR OCCURED 3 : " , err);
	    	req.session.sessionFlash = {
		        type: 'danger',
		        message: 'Error Ocuured' + utils.errors(err)
		    }
	    }

		res.render('creatives/index', {
			creatives: creatives,
			message_type: msg_type,
			message: message
		});

	})


	// Creative.find(function (err, creatives) {
	// 	console.log("calling index.");
	// 	var message = "";
	//     if (err){
	//     	console.log("ERROR OCCURED 3 : " , err);
	//     }
	//     if (msg_val != "" && msg_type != ""){
	// 		message = msg_val;
	//     }

	// 	res.render('creatives/index', {
	// 		creatives: creatives,
	// 		message_type: msg_type,
	// 		message: message
	// 	});
	// });

}


module.exports = router;



