angular.module('AppControllers', ['AppSecurity', 'AppRoutes'])
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
  .controller('BookEditController', ['book', '$http', '$location', 'ServerUrl', 'SecurityService',
      function(book, $http, $location, serverUrl, securityService) {
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

      this.authorSelect = function($item) {
        this.book.authors = $item;
      }

      this.getAuthors = function(partialName) {
        return $http.get(serverUrl + 'authors?name=like.*' + partialName + '*&order=name', { headers: { Range: '0-50' } })
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
  .controller('AuthorEditController', ['$http', '$location', 'ServerUrl', function($http, $location, serverUrl) {
    this.author = {};
    this.save = function() {
      $http.post(serverUrl + 'authors', this.author).then(function() {
        $location.url('/book');
      });
    };
  }]);
