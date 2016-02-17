/**
 * Created by avidan on 08-06-15.
 */
angular.module('iod-client', [])
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true; // Setting to true to allow cookies to pass in order to allow IOD's SSO
  }]);

