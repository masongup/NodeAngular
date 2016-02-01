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
  .service('SecurityService', ['$http', '$q', 'ServerUrl', function($http, $q, serverUrl) {
    var userName, role, isLoggedIn = false, token;

    function processToken(t) {
      var dataPart = t.split('.')[1];
      var data = JSON.parse(atob(dataPart));
      userName = data.username;
      role = data.role;
      if (!userName || !role) {
        return;
      }
      token = t;
      isLoggedIn = true;
      $http.defaults.headers.common.Authorization = 'Bearer ' + token;
    }

    this.isLoggedIn = function() {
      return isLoggedIn;
    };
    this.canEdit = function() {
      return role === 'editor';
    };
    this.getUserName = function() {
      return userName;
    };
    this.getRole = function() {
      return role;
    };

    this.login = function(username, password) {
      return $http.post(serverUrl + 'rpc/login', { username: username, password: password })
        .then(function(data) {
          var t = data.data.token;
          if (t) {
            processToken(t);
          }
        });
    };

    this.logout = function() {
      var defer = $q.defer();
      isLoggedIn = false;
      role = null;
      userName = null;
      defer.resolve();
      return defer.promise;
    };

  }])
  .directive('loginPage', ['SecurityService', function(securityService) {
    return {
      restrict: 'E',
      templateUrl: 'login.html',
      controllerAs: 'lp',
      controller: [function() {
        var lp = this;

        function init() {
          lp.isLoggedIn = securityService.isLoggedIn();
          lp.userName = securityService.getUserName();
          lp.role = securityService.getRole();
        }
        init();

        lp.login = function() {
          securityService.login(lp.loginUsername, lp.loginPassword)
            .then(function() { init() });
        }

        lp.logout = function() {
          securityService.logout()
            .then(function() { init() });
        };
      }]
    };
  }])
  .controller('MainController', [function() {
    this.greeting = 'Hello, World!';
  }])
  .controller('BookController', ['book', 'SecurityService', function(book, securityService) {
    this.book = book.data;
    this.canEdit = securityService.canEdit;
  }])
  .controller('BookListController', ['books', 'SecurityService', function(books, securityService) {
    this.books = books.data;
    this.canEdit = securityService.canEdit;
  }])
  .controller('BookEditController', ['book', 'authors', '$http', '$location', 'ServerUrl', 'SecurityService',
      function(book, authors, $http, $location, serverUrl, securityService) {
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
        if (!securityService.canEdit()) {
          return;
        }

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
  }])
  .controller('AuthorEditController', ['$http', '$location', 'ServerUrl', function($http, $location, serverUrl) {
    this.author = {};
    this.save = function() {
      $http.post(serverUrl + 'authors', this.author).then(function() {
        $location.url('/book');
      });
    };
  }]);
