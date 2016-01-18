angular.module('SiteApp', ['ngRoute'])
  .constant('ServerUrl',  'http://localhost:3000/')
  .config(['$routeProvider', '$locationProvider', 'ServerUrl', function($routeProvider, $locationProvider, serverUrl) {
    $locationProvider.html5Mode(true);
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
          book: ['$http', '$route', function($http, $route) { 
            return $http.get(serverUrl + 'books?id=eq.' + $route.current.params.bookNum, {
              headers: { Prefer: 'plurality=singular' }
            });
          }]
        }
      })
      .when('/book/new', {
        templateUrl: 'bookEdit.html',
        controller: 'BookEditController',
        controllerAs: 'bec',
        resolve: { book: function() { return null; } }
        }
      )
      .when('/book/:bookNum', {
        templateUrl: 'book.html',
        controller: 'BookController',
        controllerAs: 'bc',
        resolve: {
          book: ['$http', '$route', function($http, $route) { 
            return $http.get(serverUrl + 'books?id=eq.' + $route.current.params.bookNum, {
              headers: { Prefer: 'plurality=singular' }
            });
          }]
        }
      })
      .when('/book', {
        templateUrl: 'booklist.html',
        controller: 'BookListController',
        controllerAs: 'blc',
        resolve: {
          books: ['$http', function($http) {
            return $http.get(serverUrl + 'books');
          }]
        }
      });
  }])
  .run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function() {
      $location.url('/');
    });
  }])
  .controller('MainController', [function() {
    this.greeting = 'Hello, World!';
  }])
  .controller('BookController', ['book', function(book) {
    this.book = book.data;
  }])
  .controller('BookListController', ['books', function(books) {
    this.books = books.data;
  }])
  .controller('BookEditController', ['book', '$http', '$location', 'ServerUrl', function(book, $http, $location, serverUrl) {
      var requestOptions = {};
      if (book) {
        this.book = book.data;
        this.title = 'Edit Book';
        requestOptions.method = 'PATCH';
        requestOptions.url = serverUrl + 'books?id=eq.' + book.data.id;
      }
      else {
        this.title = 'New Book';
        this.book = {};
        requestOptions.method = 'POST';
        requestOptions.url = serverUrl + 'books';
      }
      requestOptions.data = this.book;
      this.save = function() {
        $http(requestOptions).then(function(data) {
          var header = data.headers('Location');
          if (header)
            $location.url('/book/' + /\d+$/.exec(header)[0]);
          });
      };
  }]);
