/**
 * Created by avidan on 30-04-15.
 */
angular
  .module('iod-client')
  .factory('iodAuthService', IodAuthService);

IodAuthService.$inject = ['$log', '$q', 'iodHttpService', 'iodSessionToken'];

/* @ngInject */
function IodAuthService($log, $q, iodHttpService, iodSessionToken) {
  $log = $log.getInstance("IodAuthService");
  var that = this;
  that.ssoTokenDeffered = $q.defer();

  ////////////////

  /**
   * Authenticate the session with IOD SSO
   * @returns a promise for the authentication process, if successful should return the combined token for both application and user.
   */
  function auth() {

    var deferred = $q.defer();
    {
      that.getUser().then(
        function (userData) {
          that.authApplication(userData).success(function (data) {
            that.authCombined(data.token).then(function (data) {
              iodSessionToken.setSessionToken(data.token);
              that.removeTokenFromUrl();
              that.ssoTokenDeffered.resolve();
              that.getUserToken();
              deferred.resolve();
            }, function (e) {
              that.ssoTokenDeffered.reject('Failed to retrieve the combined token ');
              deferred.reject(e);
            });
          }).error(function (e) {
            that.ssoTokenDeffered.reject('Failed to retrieve the unbound token ');
            deferred.reject(e);
          })
        },
        function (e) {
          $log.debug('Failed to get users');
          deferred.reject(e);
        }
      )

    }
    return deferred.promise;
  }

  function getConcatSenToken() {
    return that.concatToken(that.sessionToken);
  }

  function getSSOInitPromise() {
    return that.ssoTokenDeffered.promise;
  }

  function setApplicationName(applicationName) {
    iodSessionToken.setApplicationName(applicationName);
  }

  function setApplicationKey(appKey) {
    iodSessionToken.setApplicationKey(appKey);
  }

  ////////////////

  this.concatToken = function (token) {
    return [token.type, token.id, token.secret].join(':')
  }

  /**
   * Requests an application token according to the application credentials, at the moment the credentials are hardcoded in the method. eventually, they should be received from the referrer portal e.g. IOD
   * @returns a promise with the http response for the the application token
   */
  this.authApplication = function (userData) {
    var apiKey = iodSessionToken.getApplicationKey();
    var applicationName = iodSessionToken.getApplicationName();
    var applicationDomain = iodSessionToken.getApplicationDomain();

    var reqParams = {'apiKey': apiKey};
    var reqData = {name: applicationName, domain: applicationDomain, token: 'simple'};
    return iodHttpService.doPost('authenticate/application/unbound', reqData, reqParams);
  }


  /**
   * Authenticate both the application token and the user token by using the IOD user authentication cookie, if one of the token is missing or invalid the API will return an error about an invalid token.
   * @param token - the application token, as received from the unbound application authentication API
   * @returns a promise with the response for the http combined request. the combined session token containing both the application and user token
   */
  this.authCombined = function (token) {
    var deferred = $q.defer();
    {
      var concatToken = that.concatToken(token);
      var reqParams = {app_token: concatToken};
      var applicationName = iodSessionToken.getApplicationName();
      var applicationDomain = iodSessionToken.getApplicationDomain();
      var reqData = {token_type: 'simple', application: applicationName, domain: applicationDomain};
      iodHttpService.doPost('authenticate/combined', reqData, reqParams).success(function (data) {
        deferred.resolve(data);
      }).error(function (e) {
        $log.error('failed to get combined token ' + e);
        deferred.reject(e);
      })
    }
    return deferred.promise;
  };

  this.getUser = function () {
    var deferred = $q.defer();
    {
      iodHttpService.doGet('user').success(function (data) {
        iodSessionToken.setUsersData(data);
        deferred.resolve(data);
      }).error(function (e) {
        deferred.reject(e);
      })
    }
    return deferred.promise;
  };

  this.getUserToken = function () {
    var deferred = $q.defer();
    {
      iodHttpService.doPost('authenticate/user/unbound').success(function (userToken) {
        try {
          iodSessionToken.setUserToken(userToken.token);
          deferred.resolve(userToken);
        } catch (e) {
          deferred.reject(e);
        }
      }).error(function (e) {
        deferred.reject(e);
      })
    }
    return deferred.promise;
  };

  /**
   * Removing all query params from the current URL and redirecting again to the same URL without the arguments.
   * it should be called after the SSO redirection to remove the concat user unbound token
   */
  this.removeTokenFromUrl = function () {
    if (window.location.search !== '') {
      window.location.search = '';
    }
  }


  ////////////////

  var service = {
    authenticate: auth,
    getSSOInitPromise: getSSOInitPromise,
    setApplicationName: setApplicationName,
    setApplicationKey: setApplicationKey
  };

  return service;

}
