var mainHtml = require('./main.html');
var bookHtml = require('./book.html');
var bookEditHtml = require('./bookEdit.html');
var bookListHtml = require('./booklist.html');
var authorEditHtml = require('./authorEdit.html');
//All app routes and routing related stuff

module.exports = angular.module('AppRoutes', ['ngRoute'])
  .constant('ServerUrl',  'http://localhost:3000/')
  .config(['$routeProvider', '$locationProvider', 'ServerUrl', function($routeProvider, $locationProvider, serverUrl) {

    $locationProvider.html5Mode(true);

    var bookQuery = ['$http', '$route', function($http, $route) { 
            return $http.get(serverUrl + 'books', {
              headers: { Prefer: 'plurality=singular' },
              params: { id: 'eq.' + $route.current.params.bookNum, select: '*,authors{*}' }
            });
          }];

    $routeProvider
      .when('/', {
        templateUrl: mainHtml,
        controller: 'MainController',
        controllerAs: 'mc'
      })
      .when('/book/:bookNum/edit', {
        templateUrl: bookEditHtml,
        controller: 'BookEditController',
        controllerAs: 'bec',
        resolve: {
          book: bookQuery
        }
      })
      .when('/book/new', {
        templateUrl: bookEditHtml,
        controller: 'BookEditController',
        controllerAs: 'bec',
        resolve: { 
          book: function() { return null; }
        }
      })
      .when('/book/:bookNum', {
        templateUrl: bookHtml,
        controller: 'BookController',
        controllerAs: 'bc',
        resolve: {
          book: bookQuery
        }
      })
      .when('/book', {
        templateUrl: bookListHtml,
        controller: 'BookListController',
        controllerAs: 'blc',
        resolve: {
          books: ['$http', function($http) {
            return $http.get(serverUrl + 'books', {
              headers: { Range: '0-50' },
              params: { select: 'id,title,authors{id,name}', order: 'id' }
            });
          }]
        }
      })
      .when('/author/new', {
        templateUrl: authorEditHtml,
        controller: 'AuthorEditController',
        controllerAs: 'aec'
      });
  }])
  .run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function() {
      $location.url('/');
    });
  }]).name;
