//All app routes and routing related stuff
angular.module('AppRoutes', ['ngRoute'])
  .constant('ServerUrl',  'http://localhost:3000/')
  .config(['$routeProvider', '$locationProvider', 'ServerUrl', function($routeProvider, $locationProvider, serverUrl) {

    $locationProvider.html5Mode(true);

    var bookQuery = ['$http', '$route', function($http, $route) { 
            return $http.get(serverUrl + 'books?id=eq.' + $route.current.params.bookNum + '&select=*,authors{*}', {
              headers: { Prefer: 'plurality=singular' }
            });
          }];

    var authorsQuery = ['$http', function($http) {
      return $http.get(serverUrl + 'authors', { headers: { Range: '0-50' } });
    }];

    $routeProvider
      .when('/', {
        templateUrl: 'main.html',
        controller: 'MainController',
        controllerAs: 'mc'
      })
      .when('/book/:bookNum/edit', {
        templateUrl: 'bookEdit.html',
        controller: 'BookEditController',
        controllerAs: 'bec',
        resolve: {
          book: bookQuery,
          authors: authorsQuery
        }
      })
      .when('/book/new', {
        templateUrl: 'bookEdit.html',
        controller: 'BookEditController',
        controllerAs: 'bec',
        resolve: { 
          book: function() { return null; } ,
          authors: authorsQuery
        }
      })
      .when('/book/:bookNum', {
        templateUrl: 'book.html',
        controller: 'BookController',
        controllerAs: 'bc',
        resolve: {
          book: bookQuery
        }
      })
      .when('/book', {
        templateUrl: 'booklist.html',
        controller: 'BookListController',
        controllerAs: 'blc',
        resolve: {
          books: ['$http', function($http) {
            return $http.get(serverUrl + 'books?select=id,title,authors{id,name}&order=id', {
              headers: { Range: '0-50' }
            });
          }]
        }
      })
      .when('/author/new', {
        templateUrl: 'authorEdit.html',
        controller: 'AuthorEditController',
        controllerAs: 'aec'
      });
  }])
  .run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function() {
      $location.url('/');
    });
  }])
