module.exports = angular.module('AppControllers', [require('./Routes.js'), require('./Security.js')])
  .controller('MainController', ['BaseRoute', function(baseRoute) {
    this.greeting = 'Hello, World!';
    this.baseRoute = baseRoute;
  }])
  .controller('BookController', ['book', 'SecurityService', 'BaseRoute', function(book, securityService, baseRoute) {
    this.book = book.data;
    this.canEdit = securityService.canEdit;
    this.baseRoute = baseRoute;
  }])
  .controller('BookListController', ['books', 'SecurityService', 'BaseRoute', function(books, securityService, baseRoute) {
    this.books = books.data;
    this.canEdit = securityService.canEdit;
    this.baseRoute = baseRoute;
  }])
  .controller('BookEditController', ['book', '$http', '$location', 'ServerUrl', 'SecurityService', 'BaseRoute',
      function(book, $http, $location, serverUrl, securityService, baseRoute) {
      var requestOptions = {};
      this.baseRoute = baseRoute;

      if (book) {
        this.book = book.data;
        this.title = 'Edit Book';
        requestOptions.method = 'PATCH';
        requestOptions.url = serverUrl + 'books';
        requestOptions.params = { id: 'eq.' + book.data.id }
      }
      else {
        this.title = 'New Book';
        this.book = {};
        requestOptions.method = 'POST';
        requestOptions.url = serverUrl + 'books';
      }

      requestOptions.data = this.book;

      this.authorSelect = function($item) {
        this.book.authors = $item;
      }

      this.getAuthors = function(partialName) {
        return $http.get(serverUrl + 'authors', { 
            headers: { Range: '0-50' },
            params: { name: 'like.' + partialName + '*', order: 'name' }
          })
          .then(function(response) {
            return response.data;
          });
      }

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
  .controller('AuthorEditController', ['$http', '$location', 'ServerUrl', 'BaseRoute', function($http, $location, serverUrl, baseRoute) {
    this.author = {};
    this.baseRoute = baseRoute;
    this.save = function() {
      $http.post(serverUrl + 'authors', this.author).then(function() {
        $location.url('/book');
      });
    };
  }]).name;
