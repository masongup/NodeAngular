angular.module('SiteApp', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
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
            return $http.get('/api/book/' + $route.current.params.bookNum);
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
            return $http.get('/api/book/' + $route.current.params.bookNum);
          }]
        }
      })
      .when('/book', {
        templateUrl: 'booklist.html',
        controller: 'BookListController',
        controllerAs: 'blc',
        resolve: {
          books: ['$http', function($http) {
            return $http.get('/api/book');
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
  .controller('BookEditController', ['book', '$http', '$location', function(book, $http, $location) {
      if (book) {
        this.book = book.data;
        this.title = 'Edit Book';
      }
      else {
        this.title = 'New Book';
        this.book = {};
      }
      this.save = function() {
        $http.post('/api/book', this.book)
          .success(function(data) {
            if (data.id) {
              $location.url('/book/' + data.id);
            }
          })
          .error(function() {
          });
      };
  }]);
