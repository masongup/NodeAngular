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

  beforeEach(window.module('AppSecurity'));

  beforeEach(window.module(function($provide) {
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

  it('HandlesAuthHeaderRight', inject(function(SecurityService, $http) {
    SecurityService.login(rightUsername, rightPassword).then(function() {;
      expect($http.defaults.headers.common.Authorization).toBeDefined();
      SecurityService.logout().then(function() {
        expect($http.defaults.headers.common.Authorization).toBeUndefined();
      });
    });
    $httpBackend.flush();
  }));
});

describe('SecurityDirectiveTests', function() {

  beforeEach(window.module('AppSecurity'));

  beforeEach(window.module(function($provide) {
    $provide.service('SecurityService', function() {
      var simPromise = { then: function(callback) { callback(); } }
      this.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(false);
      this.getUserName = jasmine.createSpy('getUserName').and.returnValue(null);
      this.getRole = jasmine.createSpy('getRole').and.returnValue(null);
      this.login = jasmine.createSpy('login').and.returnValue(simPromise);
      this.logout = jasmine.createSpy('logout').and.returnValue(simPromise);
    });
  }));

  beforeEach(inject(function($compile, $rootScope) {
    $compile('<login-page/>')($rootScope);
    $rootScope.$digest();
  }));

  it('PassesInfoOnLogin', inject(function($rootScope, SecurityService) {
    //check directive initial state
    expect($rootScope.lp.isLoggedIn).toBeFalsy();
    expect($rootScope.lp.userName).toBeNull();
    expect($rootScope.lp.role).toBeNull();

    //validate service calls
    expect(SecurityService.login.calls.count()).toBe(0);
    expect(SecurityService.isLoggedIn.calls.count()).toBe(1);
    expect(SecurityService.getUserName.calls.count()).toBe(1);
    expect(SecurityService.getRole.calls.count()).toBe(1);
    expect(SecurityService.logout.calls.count()).toBe(0);

    //setup post-login service state
    SecurityService.isLoggedIn.and.returnValue(true);
    SecurityService.getUserName.and.returnValue('user');
    SecurityService.getRole.and.returnValue('editor');

    //do login
    $rootScope.lp.loginUsername = 'user';
    $rootScope.lp.loginPassword = 'pass';
    $rootScope.lp.login();

    //validate login call to service, and all other calls
    expect(SecurityService.login.calls.count()).toBe(1);
    var args = SecurityService.login.calls.argsFor(0);
    expect(args[0]).toBe('user');
    expect(args[1]).toBe('pass');
    expect(SecurityService.isLoggedIn.calls.count()).toBe(2);
    expect(SecurityService.getUserName.calls.count()).toBe(2);
    expect(SecurityService.getRole.calls.count()).toBe(2);
    expect(SecurityService.logout.calls.count()).toBe(0);

    //validate final directive state
    expect($rootScope.lp.isLoggedIn).toBeTruthy();
    expect($rootScope.lp.userName).toBe('user');
    expect($rootScope.lp.role).toBe('editor');
  }));

  it('LogsOutCleanly', inject(function($rootScope, SecurityService) {
    expect(SecurityService.logout.calls.count()).toBe(0);
    $rootScope.lp.logout();
    expect(SecurityService.logout.calls.count()).toBe(1);
  }));
});
