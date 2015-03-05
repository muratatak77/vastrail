var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	console.log("idnexxxxx");

	res.render('index', { expressFlash: req.flash('	'), sessionFlash: res.locals.sessionFlash });
  // res.render('index', { title: 'Express' });
});

module.exports = router;
