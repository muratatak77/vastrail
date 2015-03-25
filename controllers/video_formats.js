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

var VideoFormat = require('../models/video_format.js');

var message_type =  "";
var message =  "";
var error = "";


/* GET video_formats listing. */
router.get('/', function(req, res, next) {
	utils.calling(traceback());
	VideoFormat.list(res, function (err, video_formats) {

	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('video_formats/index', {
				video_formats: video_formats
			});
		}
  	});
});


/* GET users listing. */
router.get('/show/:id', function(req, res, next) {
	
	utils.calling(traceback());
	
	VideoFormat.show(req.params.id, function (err, video_format) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('video_formats/show', {
				video_format: video_format
			});
		}
  	});

});

// new form create - update
router.get('/new', function(req, res, next) {

	utils.calling(traceback());

	res.render('video_formats/new', {
		video_format: VideoFormat,
		form_action_page: "/video_formats/create",
		form_method_type: "post"
	});
	
});

/* POST video_format new */
router.post('/create', function(req, res, next){
	utils.calling(traceback());	

	console.log("Http body : " , req.body);

	var video_format = new VideoFormat(req.body);
	VideoFormat.save(req,video_format, function (err) {

    	if (err) {
			console.log("ERROR OCCURED : " , err);

			return res.render('video_formats/new', {
				video_format: video_format,
				form_action_page: "/video_formats/create",
				form_method_type: "post",
				errors: utils.errors(err)
			});

    	} else {
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully created video_format!  / ID = ' + video_format.id  + " / Title : " + video_format.title
		    }
			res.redirect('/video_formats/show/'+video_format.id);
    	}
  	});

});


/* GET edit by id. */
router.get('/edit/:id', function(req, res, next) {

	utils.calling(traceback());

	VideoFormat.findById(req.params.id, function(err, video_format){
		if (err) {
			return console.log("ERROR OCCURED : " , err);
		}

  		res.render('video_formats/edit', {
			video_format: video_format,
			form_action_page: "/video_formats/update/"+video_format.id,
			form_method_type: "post"
		});
		
	});

});


router.post('/update/:id', function(req, res, next) {

	// console.log("video_format : " , req.video_format );

	utils.calling(traceback());

	console.log("req params : " ,  req.params);
	console.log("UPDATE PARAMS : " , req.body);

	VideoFormat.findById(req.params.id, function (err, video_format) {
 		if (err) return next(err);
		video_format = extend(video_format , req.body);
	    VideoFormat.save(req,video_format, function (err) {

	    	if (!err) {
				req.session.sessionFlash = {
			        type: 'success',
			        message: 'Successfully Update video_format!  / ID = ' + video_format.id  + " / Title : " + video_format.title
			    }
				console.log("Update Successfully :" , video_format);
		    	return res.redirect('/video_formats/show/'+video_format.id);
			}

	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('video_formats/edit', {
					video_format: video_format,
					form_action_page: "/video_formats/update/"+video_format.id,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}

    	});
	});

});


router.post('/destroy/:id', function (req, res){

	utils.calling(traceback());

	VideoFormat.findById(req.params.id, function (err, video_format) {
	    video_format.remove(function (err) {
	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('video_formats/edit', {
					video_format: video_format,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully destroy video_format! /  ID = ' + req.params.id  + " / Title : " + video_format.title
		    }
			res.redirect('/video_formats');
    	});
	});
});


module.exports = router;



