/**
 * Created by avidan on 08-06-15.
 */
angular.module('iod-client', [])
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true; // Setting to true to allow cookies to pass in order to allow IOD's SSO
  }]);

angular.module('envConfig', []).provider("envConfig", function () {
  this.$get = function () {
    var envConfig = {};
    var q = jQuery.ajax({
      type: 'GET',
      url: '/config.json',
      cache: false,
      async: false,
      contentType: 'application/json',
      dataType: 'json'
    });
    if (q.status === 200) {
      angular.extend(envConfig, angular.fromJson(q.responseText));
    }
    return envConfig;
  };
});
