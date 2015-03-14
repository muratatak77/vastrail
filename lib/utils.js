
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


exports.calling = function (stack) {
    console.log('Calling Name : ' + stack[0].name + ' /  Path : ' + stack[0].path + ' /  from file  :' + stack[0].file + ' / line  : ' + stack[0].line)
}