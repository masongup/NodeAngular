require('jquery');
require('expose?$!expose?jQuery!jquery');
require('angular');
require('angular-route');
require('angular-local-storage');
require('bootstrap-webpack');
require('angular-ui-bootstrap');
angular.module('SiteApp', [require('./Routes.js'), require('./Security.js'), require('./Controllers.js'), 'ui.bootstrap'])
