
exports.errors = function (err) {

  // console.log("err message errors" , err.errors);

  var errs = [];

  if (err.message.indexOf("Validation") > -1){
    
    var keys = Object.keys(err.errors);
    // if there is no validation error, just display a generic error
    if (!keys) {
      return ['Oops! There was an error'];
    }

    keys.forEach(function (key) {
        // console.log("key :" , key);
        // console.log("err[key].message :" , err.errors[key].message);
        if (err.errors[key]) errs.push(err.errors[key].message)
      })
  } else{
    errs.push(err.message);
  }

  console.log("result errs array :" , errs);

  return errs
}