//Security-related components
angular.module('AppSecurity', ['LocalStorageModule', 'AppRoutes'])
  .config(['localStorageServiceProvider', function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('AngularSite');
  }])
  .service('SecurityService', ['$http', '$q', 'ServerUrl','localStorageService', 
      function($http, $q, serverUrl, localStorageService) {
    var userName, role, isLoggedIn = false, token,
      service = this;

    function processToken(t) {
      var dataPart = t.split('.')[1];
      var data = JSON.parse(atob(dataPart));
      userName = data.username;
      role = data.role;
      if (!userName || !role) {
        this.logout();
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
            localStorageService.set('Token', t);
          }
          else {
            service.logout();
          }
        });
    };

    this.logout = function() {
      var defer = $q.defer();
      isLoggedIn = false;
      role = null;
      userName = null;
      localStorageService.remove('Token');
      defer.resolve();
      return defer.promise;
    };

    var storedToken = localStorageService.get('Token');
    if (storedToken) {
      processToken(storedToken);
    }

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
