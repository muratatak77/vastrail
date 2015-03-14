
/*!
 * Module dependencies.
 */

var fs = require('fs');
var env = {};
var envFile = __dirname + '/env.json';


// Read env.json file, if it exists, load the id's and secrets from that
// Note that this is only in the development env
// it is not safe to store id's in files

if (fs.existsSync(envFile)) {
  env = fs.readFileSync(envFile, 'utf-8');
  env = JSON.parse(env);
  Object.keys(env).forEach(function (key) {
    process.env[key] = env[key];
  });
}

/**
 * Expose
 */

// module.exports = {
//   db: 'mongodb://localhost/noobjs_dev',
// };


module.exports = {
  'db' : 'mongodb://localhost:27017/vast' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
  // 'db' : 'mongodb://vastrail:vastrail123@ds031661.mongolab.com:31661/vastrail'
};

