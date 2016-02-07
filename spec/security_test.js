describe('SecurityServiceTests', function() {

  var localStoredData;
  var testServer = 'http://testurl/';

  beforeEach(function() {
    angular.module('LocalStorageModule', []).provider('localStorageService', function() {
      this.setPrefix = function() { };
      this.$get = function() {
        return {
          set: function(location, value) { localStoredData = value; },
          get: function(location) { return localStoredData; },
          remove: function(location) { localStoredData = null; }
        }
      };
    });
  });

  beforeEach(module('AppSecurity'));

  beforeEach(module(function($provide) {
    $provide.constant('ServerUrl', testServer);
  }));

  var rightUsername = 'user',
      rightPassword = 'pass',
      wrongPassword = 'bar';

  var $httpBackend;
  beforeEach(inject(function(_$httpBackend_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.when('POST', testServer + 'rpc/login')
      .respond(function(method, url, data, headers, params) {
        var returnObj = '';
        var localData = JSON.parse(data);
        if (localData.username === rightUsername && localData.password === rightPassword) {
          returnObj = { 
            token: '.' + btoa(JSON.stringify({ username: rightUsername, role: 'editor' })) + '.'
          }
        }
        return [200, JSON.stringify(returnObj), { }, 'OK'];
      });
  }));

  afterEach(inject(function(SecurityService) {
    SecurityService.logout();
  }));

  beforeEach(inject(function(SecurityService) {
    assertNotLoggedIn(SecurityService);
  }));

  function assertNotLoggedIn(ss) {
    expect(ss.isLoggedIn()).toBeFalsy();
    expect(ss.canEdit()).toBeFalsy();
    expect(ss.getUserName()).toBeFalsy();
    expect(ss.getRole()).toBeFalsy();
  }

  function assertLoggedIn(ss) {
    expect(ss.isLoggedIn()).toBeTruthy();
    expect(ss.canEdit()).toBeTruthy();
    expect(ss.getUserName()).toBe(rightUsername);
    expect(ss.getRole()).toBe('editor');
  }

  it('IsNotLoggedIn', inject(function(SecurityService) {
    assertNotLoggedIn(SecurityService);
  }));

  it('LogsInRight', inject(function(SecurityService) {
    SecurityService.login(rightUsername, rightPassword).then(function() {;
      assertLoggedIn(SecurityService);
    });
    $httpBackend.flush();
  }));

  it('LogsInWrong', inject(function(SecurityService) {
    SecurityService.login(rightUsername, wrongPassword).then(function() {;
      assertNotLoggedIn(SecurityService);
    });
    $httpBackend.flush();
  }));

  it('LogsInAndOut', inject(function(SecurityService) {
    SecurityService.login(rightUsername, rightPassword).then(function() {;
      assertLoggedIn(SecurityService);
      SecurityService.logout().then(function() {
        assertNotLoggedIn(SecurityService);
      });
    });
    $httpBackend.flush();
  }));
});
