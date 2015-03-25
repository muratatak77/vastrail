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

var Company = require('../models/company.js');

var message_type =  "";
var message =  "";
var error = "";


/* GET companies listing. */
router.get('/', function(req, res, next) {
	utils.calling(traceback());
	Company.list(res, function (err, companies) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('companies/index', {
				companies: companies
			});
		}
  	});
});


/* GET users listing. */
router.get('/show/:id', function(req, res, next) {
	
	utils.calling(traceback());
	
	Company.show(req.params.id, function (err, company) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('companies/show', {
				company: company
			});
		}
  	});

});

// new form create - update
router.get('/new', function(req, res, next) {

	utils.calling(traceback());

	res.render('companies/new', {
	company: Company,
		form_action_page: "/companies/create",
		form_method_type: "post"
	});
	
});

/* POST company new */
router.post('/create', function(req, res, next){
	utils.calling(traceback());	

	console.log("Http body : " , req.body);

	var company = new Company(req.body);
	Company.save(req,company, function (err) {

    	if (err) {
			console.log("ERROR OCCURED : " , err);

			return res.render('companies/new', {
				company: company,
				form_action_page: "/companies/create",
				form_method_type: "post",
				errors: utils.errors(err)
			});

    	} else {
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully created company!  / ID = ' + company.id  + " / Title : " + company.title
		    }
			res.redirect('/companies/show/'+company.id);
    	}
  	});

});


/* GET edit by id. */
router.get('/edit/:id', function(req, res, next) {

	utils.calling(traceback());

	Company.findById(req.params.id, function(err, company){
		if (err) {
			return console.log("ERROR OCCURED : " , err);
		}

  		res.render('companies/edit', {
			company: company,
			form_action_page: "/companies/update/"+company.id,
			form_method_type: "post"
		});
		
	});

});


router.post('/update/:id', function(req, res, next) {

	// console.log("company : " , req.company );

	utils.calling(traceback());

	console.log("req params : " ,  req.params);
	console.log("UPDATE PARAMS : " , req.body);

	Company.findById(req.params.id, function (err, company) {
 		if (err) return next(err);
		company = extend(company , req.body);
	    Company.save(req,company, function (err) {

	    	if (!err) {
				req.session.sessionFlash = {
			        type: 'success',
			        message: 'Successfully Update company!  / ID = ' + company.id  + " / Title : " + company.title
			    }
				console.log("Update Successfully :" , company);
		    	return res.redirect('/companies/show/'+company.id);
			}

	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('companies/edit', {
					company: company,
					form_action_page: "/companies/update/"+company.id,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}

    	});
	});

});


router.post('/destroy/:id', function (req, res){

	utils.calling(traceback());

	Company.findById(req.params.id, function (err, company) {
	    company.remove(function (err) {
	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('companies/edit', {
					company: company,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully destroy company! /  ID = ' + req.params.id  + " / Title : " + company.title
		    }
			res.redirect('/companies');
    	});
	});
});


module.exports = router;



