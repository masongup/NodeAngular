describe('ControllerTests', function() {

  var testServer = 'http://testurl/';

  beforeEach(window.module('LocalStorageModule'));
  beforeEach(window.module('AppSecurity'));
  beforeEach(window.module('AppControllers'));

  beforeEach(window.module(function($provide) {
    $provide.constant('ServerUrl', testServer);
  }));

  beforeEach(window.module(function($provide) {
    $provide.service('SecurityService', function() {
      this.canEdit = jasmine.createSpy('canEdit').and.returnValue(true);
    });
  }));

  it('BookCreateTest', inject(function($controller, $httpBackend, SecurityService) {

    var bookName = 'foo',
        bookDesc = 'stuff',
        authorId = 7,
        bookId = 5,
        locationSpy = jasmine.createSpy('url');

    var bec = $controller('BookEditController', { book: null, $location: { url: locationSpy } });

    bec.authorSelect({ id: authorId });
    bec.book.description = bookDesc;
    bec.book.title = bookName;

    $httpBackend.expect('POST', testServer + 'books', { 
      author_id: authorId, 
      title: bookName,
      description: bookDesc
    }).respond(null, { Location: bookId });

    bec.save();
    $httpBackend.flush();

    expect(locationSpy.calls.count()).toBe(1);
    expect(locationSpy.calls.argsFor(0)[0]).toBe('/book/' + bookId);
    expect(SecurityService.canEdit.calls.count()).toBe(1);
    $httpBackend.verifyNoOutstandingExpectation();

  }));

  it('BookEditTest', inject(function($controller, $httpBackend, SecurityService) {

    var bookNameStart = 'bar',
        bookDescStart = 'raaaaaaa',
        bookId = 8,
        authorIdStart = 4,
        locationSpy = jasmine.createSpy('url');
        bookNameEnd = 'testtest',
        bookDescEnd = 'fabara',
        authorIdEnd = 12;

    var bec = $controller('BookEditController', { authors: {}, $location: { url: locationSpy }, book: { data: {
      title: bookNameStart,
      description: bookDescStart,
      authors: { id: authorIdStart },
      id: bookId
    } } });

    bec.book.authors.id = authorIdEnd;
    bec.book.description = bookDescEnd;
    bec.book.title = bookNameEnd;

    $httpBackend.expect('PATCH', testServer + 'books?id=eq.' + bookId, { 
      author_id: authorIdEnd, 
      title: bookNameEnd,
      description: bookDescEnd,
      id: bookId
    }).respond(null);

    bec.save();
    $httpBackend.flush();

    expect(locationSpy.calls.count()).toBe(1);
    expect(locationSpy.calls.argsFor(0)[0]).toBe('/book/' + bookId);
    expect(SecurityService.canEdit.calls.count()).toBe(1);
    $httpBackend.verifyNoOutstandingExpectation();
  }));

  it('AuthorCreateTest', inject(function($controller, $httpBackend) {

    var locationSpy = jasmine.createSpy('url'),
      authorName = 'Kevin';

    var aec = $controller('AuthorEditController', { $location: { url: locationSpy } });

    aec.author.name = authorName;

    $httpBackend.expect('POST', testServer + 'authors', { 
      name: authorName
    }).respond(null);

    aec.save();

    $httpBackend.flush();

    expect(locationSpy.calls.count()).toBe(1);
    expect(locationSpy.calls.argsFor(0)[0]).toBe('/book');
    $httpBackend.verifyNoOutstandingExpectation();
  }));
});
