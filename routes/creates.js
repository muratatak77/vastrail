
var express = require('express');
var router = express.Router();
var utils = require('../lib/utils')

var mongoose = require('mongoose');
var Create = require('../models/create.js');

var error = "";

/* GET creates listing. */
router.get('/', function(req, res, next) {
	render_index(req, res, "", "");
});


/* GET users listing. */
router.get('/show', function(req, res, next) {
  res.send('respond with a resource show');
});

/* GET users listing. */
router.get('/new', function(req, res, next) {

	res.render('creates/new', {
		create: Create,
		form_action_page: "/creates/create",
		form_method_type: "post"
	});
	
});


/* POST create new */
router.post('/create', function(req, res, next){
	console.log("POST: ");
	console.log(req.body);

	var create = new Create({
		title: req.body.title,
		type: req.body.type,
		advertisers: req.body.advertisers,
		video_clickthrough_url: req.body.video_clickthrough_url,
		skip: req.body.skip
	});

 	create.save(function (err) {

    	if (err) {
		  	console.log("ERROR OCCURED : " , err);
			res.render('creates/new', {
				create: create,
				form_action_page: "/creates/create",
				form_method_type: "post",
				errors: utils.errors(err.errors || err)
			});
    	}

  	});

	render_index(req, res, "success", "Successfully created create!" );

});


/* GET edit by id. */
router.get('/edit/:id', function(req, res, next) {

	Create.findById(req.params.id, function(err, create){
		if (err) {
			return console.log("ERROR OCCURED : " , err);
		}

		res.render('creates/edit', {
			create: create,
			form_action_page: "/creates/update/"+create.id,
			form_method_type: "post"
		});
	});
});


/* GET users listing. */
router.post('/update/:id', function(req, res, next) {
	Create.findById(req.params.id, function(err, create){
		if (err){
			console.log("ERROR OCCURED 1 : " , err);
			res.render('creates/edit', {
				create: create,
				form_action_page: "/creates/update/"+create.id,
				form_method_type: "post",
				errors: utils.errors(err.errors || err)
			});
		}
		create.title = req.body.title;
	    create.type = req.body.type;
	    create.advertisers = req.body.advertisers;
		create.video_clickthrough_url = req.body.video_clickthrough_url;
		create.skip = req.body.skip;
		create.save(function(err){
			if (!err) {
		      req.flash('success', 'Successfully updated article!');
		      return res.redirect('/creates/');
			}
			console.log("ERROR OCCURED  2: " , err);
			res.render('creates/edit', {
				create: create,
				form_action_page: "/creates/update/"+create.id,
				form_method_type: "post",
				errors: utils.errors(err.errors || err)
			});
		});
	});
});


router.post('/destroy/:id', function (req, res){
	Create.findById(req.params.id, function (err, create) {
	    create.remove(function (err) {
	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('creates/edit', {
					create: create,
					form_method_type: "post",
					errors: utils.errors(err.errors || err)
				});
			}
			render_index(req, res, "success", "Successfully removed article!" );
    	});
	});
});


function render_index(req, res, msg_type, msg_val){
	Create.find(function (err, creates) {
		console.log("calling index.");
		var message = "";
	    if (err){
	    	console.log("ERROR OCCURED 3 : " , err);
	    }
	    if (msg_val != "" && msg_type != ""){
			message = msg_val;
	    }
		res.render('creates/index', {
			creates: creates,
			message_type: msg_type,
			message: message
		});
	});

}


module.exports = router;



