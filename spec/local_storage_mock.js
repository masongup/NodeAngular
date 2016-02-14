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
