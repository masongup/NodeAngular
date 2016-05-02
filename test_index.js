require('./public/AppCore.js');
require('angular-mocks');
require('./spec/local_storage_mock.js');
var testsContext = require.context("./spec", true, /_test\.js$/);
testsContext.keys().forEach(testsContext);
