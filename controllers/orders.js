'use strict'

var express = require('express');
var router = express.Router();
var utils = require('../lib/utils');
var enums = require('../enum/enums');

var mongoose = require('mongoose');
// jQuery = require('jquery');
var traceback = require('traceback');
var extend = require('util')._extend;

var path = require('path');

// var trace = stackTrace.get();

var Order = require('../models/order.js');
var Creative_Category = require('../models/creative_category.js');


var message_type =  "";
var message =  "";
var error = "";


/* GET orders listing. */
router.get('/', function(req, res, next) {
	// console.log("enums : " , enums.order_status_enums().enums.length );

	utils.calling(traceback());
	Order.list(res, function (err, orders) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('orders/index', {
				orders: orders
			});
		}
  	});
});


/* GET users listing. */
router.get('/show/:id', function(req, res, next) {
	
	utils.calling(traceback());
	Order.show(req.params.id, function (err, order) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('orders/show', {
				order: order
			});
		}
  	});

});

// new form create - update
router.get('/new', function(req, res, next) {

	utils.calling(traceback());

	var order_status_enums = enums.order_status_enums().enums;

  	Creative_Category.list(res, function (err, creativeCategories) {
	    if (err){
			console.log("ERROR OCCURED : " , err);
		    return res.render('500');
		} else {
			res.render('orders/new', {
			order: Order,
				form_action_page: "/orders/create",
				form_method_type: "post",
				creativeCategories: creativeCategories,
				order_status: order_status_enums
			});
		}
  	});
	
});

/* POST order new */
router.post('/create', function(req, res, next){
	utils.calling(traceback());	

	console.log("Http body : " , req.body);

	var order = new Order(req.body);
	Order.save(req,order, function (err) {

    	if (err) {
			console.log("ERROR OCCURED : " , err);

		 	Creative_Category.list(res, function (err_cat, creativeCategories) {

		 		if (err_cat) return res.render('500');
				return res.render('orders/new', {
					order: order,
					form_action_page: "/orders/create",
					form_method_type: "post",
					errors: utils.errors(err),
					creativeCategories: creativeCategories
				});
			});

    	} else {
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully created order!  / ID = ' + order.id  + " / Title : " + order.title
		    }
			res.redirect('/orders/show/'+order.id);
    	}
  	});

});


/* GET edit by id. */
router.get('/edit/:id', function(req, res, next) {

	utils.calling(traceback());

	Order.findById(req.params.id, function(err, order){
		if (err) {
			return console.log("ERROR OCCURED : " , err);
		}

	  	Creative_Category.list(res, function (err, creativeCategories) {
	  		res.render('orders/edit', {
				order: order,
				form_action_page: "/orders/update/"+order.id,
				form_method_type: "post",
				creativeCategories: creativeCategories
			});

	  	});
		
	});

});


router.post('/update/:id', function(req, res, next) {

	// console.log("order : " , req.order );

	utils.calling(traceback());

	console.log("req params : " ,  req.params);
	console.log("UPDATE PARAMS : " , req.body);

	Order.findById(req.params.id, function (err, order) {
 		if (err) return next(err);
		order = extend(order , req.body);
	    Order.save(req,order, function (err) {

	    	if (!err) {
				req.session.sessionFlash = {
			        type: 'success',
			        message: 'Successfully Update order!  / ID = ' + order.id  + " / Title : " + order.title
			    }
				console.log("Update Successfully :" , order);
		    	return res.redirect('/orders/show/'+order.id);
			}

	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('orders/edit', {
					order: order,
					form_action_page: "/orders/update/"+order.id,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}

    	});
	});

});


router.post('/destroy/:id', function (req, res){

	utils.calling(traceback());

	Order.findById(req.params.id, function (err, order) {
	    order.remove(function (err) {
	    	if (err) {
	    		console.log("ERROR OCCURED  2: " , err);
				res.render('orders/edit', {
					order: order,
					form_method_type: "post",
					errors: utils.errors(err)
				});
			}
			req.session.sessionFlash = {
		        type: 'success',
		        message: 'Successfully destroy order! /  ID = ' + req.params.id  + " / Title : " + order.title
		    }
			res.redirect('/orders');
    	});
	});
});


module.exports = router;



