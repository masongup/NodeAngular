angular.module('SiteApp', ['ngRoute'])
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
  .controller('BookEditController', ['book', 'authors', '$http', '$location', 'ServerUrl',
      function(book, authors, $http, $location, serverUrl) {
      var requestOptions = {};
      this.authors = authors.data;
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
        var bookId = this.book.id;
        this.book.author_id = this.book.authors.id;
        delete this.book.authors;
        $http(requestOptions).then(function(data) {
          var header = data.headers('Location');
          if (header) {
            $location.url('/book/' + /\d+$/.exec(header)[0]);
          }
          else {
            $location.url('/book/' + bookId);
          }
        });
      };
  }]);
