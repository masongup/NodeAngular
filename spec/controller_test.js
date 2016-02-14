describe('ControllerTests', function() {

  var testServer = 'http://testurl/';

  beforeEach(module('LocalStorageModule'));
  beforeEach(module('AppSecurity'));
  beforeEach(module('AppControllers'));

  beforeEach(module(function($provide) {
    $provide.constant('ServerUrl', testServer);
  }));

  beforeEach(module(function($provide) {
    $provide.service('SecurityService', function() {
      this.canEdit = jasmine.createSpy('canEdit').and.returnValue(true);
    });
  }));

  it('BasicBookEditTest', inject(function($controller, $httpBackend, SecurityService) {
    var bookName = 'foo',
        bookDesc = 'stuff',
        authorId = 7,
        bookId = 5,
        locationSpy = jasmine.createSpy('url');
    var bec = $controller('BookEditController', { authors: {}, book: null, $location: { url: locationSpy } });
    bec.book.authors = { id: authorId };
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
});
