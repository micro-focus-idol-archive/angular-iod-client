/**
 * @ngdoc overview
 * @name hod-client
 * @description
 * This module is a utility client to wrap [HavenOnDemand APIs](https://dev.havenondemand.com/apis) as an Angular.js client
 *
 * For more additional information about the APIs please see [HOD documentation](https://dev.havenondemand.com/docs)
 */
angular.module('hod-client', [])
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true; // Setting to true to allow cookies to pass in order to allow IOD's SSO
  }]);

