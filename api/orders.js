'use strict'

var express = require('express');
var router = express.Router();
var utils = require('../lib/utils')
var mongoose = require('mongoose');
// jQuery = require('jquery');
var traceback = require('traceback');

var path = require('path');

// var trace = stackTrace.get();

var Order = require('../models/order.js');
// var Category = require('../models/category.js');

var message_type =  "";
var message =  "";
var error = "";


/* GET orders listing. */
router.get('/', function(req, res, next) {
	utils.calling(traceback());
	render_index(req, res, "", "");
});

/* GET users listing. */
router.get('/show/:id', function(req, res, next) {
	
	utils.calling(traceback());
	
	Order.findById(req.params.id).populate('user').exec(function(err, order) { 
		console.log("order : " , order);
		if (err) {
			return console.log("ERROR OCCURED : " , err);
		}
		res.render('orders/show', {
			order: order
		});
	});

	// Order.findById(req.params.id, function(err, order){
	// 	console.log("order : " , order);
	// 	if (err) {
	// 		return console.log("ERROR OCCURED : " , err);
	// 	}
	// 	res.render('orders/show', {
	// 		order: order
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

 //        res.render('orders/new', {
	// 		order: Order,
	// 		form_action_page: "/orders/order",
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
			res.render('orders/new', {
			order: Order,
				form_action_page: "/orders/order",
				form_method_type: "post",
				categories: categories
			});

		}
  	});
	
});

/* POST order new */
router.post('/order', function(req, res, next){
	utils.calling(traceback());	
	console.log("POST : " , req.body);
	console.log("@@@@@@@@@@@@@@@@@   req.body.category.id >>>>>>>>>>> " ,req.body.category );

	var order = Order.new(req);
	console.log("order >> " , order);

 	order.save(function (err) {
    	if (err) {

		  	console.log("ERROR OCCURED : " , err);
		 	Category.list(res, function (err_cat, categories) {

		 		if (err_cat) return res.render('500');

				return res.render('orders/new', {
					order: order,
					form_action_page: "/orders/order",
					form_method_type: "post",
					errors: utils.errors(err),
					categories: categories
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
		res.render('orders/edit', {
			order: order,
			form_action_page: "/orders/update/"+order.id,
			form_method_type: "post"
		});
	});

});



router.post('/update/:id', function(req, res, next) {

	utils.calling(traceback());

	console.log("req.params : " ,  req.params);
	console.log("UPDATE PARAMS : " , req.body);

	Order.findById(req.params.id, function (err, order) {
 	
 		if (err) return next(err);

 		order = Order.load(order, req);

	    order.save(function (err) {

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


	// Order.findByIdAndUpdate(req.params.id, req.body, function (err, order) {

	//     if (err) return next(err);
	// 	if (!order){
	// 		console.log("ERROR OCCURED 1 : " , 'order is null' );
	// 		return next(err);
	// 	}

	// 	if (!err) {
	// 		req.session.sessionFlash = {
	// 	        type: 'success',
	// 	        message: 'Successfully Update order!  / ID = ' + order.id  + " / Title : " + order.title
	// 	    }
	// 		console.log("Update Successfully :" , order);
	//     	return res.redirect('/orders/show/'+order.id);
	// 	}

	// 	console.log("ERROR OCCURED  : " , err);

	// 	return res.render('orders/edit', {
	// 		order: order,
	// 		form_action_page: "/orders/update/"+order.id,
	// 		form_method_type: "post",
	// 		errors: utils.errors(err)
	// 	});


	// });


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


function render_index(req, res, msg_type, msg_val){

	utils.calling(traceback());

	Order.find({})
	// .populate('user')
	// .populate('category')
	.exec(function(err, orders) { 
		// Your callback code where you can access subdomain directly through custPhone.subdomain.name 

		if (err){
	    	console.log("ERROR OCCURED 3 : " , err);
	    	req.session.sessionFlash = {
		        type: 'danger',
		        message: 'Error Ocuured' + utils.errors(err)
		    }
	    }

		res.render('orders/index', {
			orders: orders,
			message_type: msg_type,
			message: message
		});

	})


	// Order.find(function (err, orders) {
	// 	console.log("calling index.");
	// 	var message = "";
	//     if (err){
	//     	console.log("ERROR OCCURED 3 : " , err);
	//     }
	//     if (msg_val != "" && msg_type != ""){
	// 		message = msg_val;
	//     }

	// 	res.render('orders/index', {
	// 		orders: orders,
	// 		message_type: msg_type,
	// 		message: message
	// 	});
	// });

}


module.exports = router;



