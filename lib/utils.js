exports.errors = function (errors) {

  // var keys = Object.keys(errors);
  var errs = [];

  // // if there is no validation error, just display a generic error
  // if (!keys) {
  //   return ['Oops! There was an error'];
  // }

  // keys.forEach(function (key) {
  //   console.log("key :" , key);
  //   if (errors[key]) errs.push(errors[key].message)
  // })

  errs.push(errors.message);

  return errs
}