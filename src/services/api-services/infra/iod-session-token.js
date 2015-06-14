/**
 * Created by avidan on 27-05-15.
 */
angular
    .module('iod-client')
    .factory('iodSessionToken', IodSessionToken);

IodSessionToken.$inject = ['$log'];

/* @ngInject */
function IodSessionToken($log) {
    $log = $log.getInstance("IodSessionToken");

    var self = this;
    self.sessionToken = null;
    self.sessionTokenConcated = null;
    self.userToken = null;

    self.userData = null;
    self.applicationKey = null;
    self.applicationName = null;
    self.applicationDomain = null;

    this.setApplicationDomain = function(applicationDomain) {
        self.applicationDomain = angular.copy(applicationDomain);
    };


    var service = {
        setSessionToken: setSessionToken,
        getSessionToken: getSessionToken,
        getSessionTokenObj: getSessionTokenObj,
        setUsersData:setUsersData,
        getUsersData:getUsersData,
        setUserToken: setUserToken,
        getUserToken: getUserToken,
        setApplicationKey: setApplicationKey,
        getApplicationKey: getApplicationKey,
        setApplicationName: setApplicationName,
        getApplicationName: getApplicationName,
        getApplicationDomain: getApplicationDomain
    };

    return service;

    ////////////////

    function setSessionToken(sesToken) {
        self.sessionToken = angular.copy(sesToken);
        self.sessionTokenConcated = concatToken(self.sessionToken);
    }

    function getSessionToken() {
        return self.sessionTokenConcated;
    }

    function getSessionTokenObj() {
        return self.sessionToken;
    }

    function concatToken(token) {
        return [token.type, token.id, token.secret].join(':')
    }

    function setUsersData(userData) {
        var applicationDomain;
        try {
            self.userData = angular.copy(userData.users[0]);
            applicationDomain = userData.users[0].user_store.split(":")[0];
        } catch (e) {
            applicationDomain = 'IOD-TEST-DOMAIN';
        }
        self.setApplicationDomain(applicationDomain);
    }

    function getUsersData() {
        return self.userData;
    }

    function setUserToken(userToken){
        self.userToken = angular.copy(userToken);
    }

    function getUserToken(){
        return self.userToken;
    }

    function setApplicationKey(key) {
        self.applicationKey = angular.copy(key);
    }

    function getApplicationKey() {
        return self.applicationKey;
    }

    function setApplicationName(applicationName) {
        self.applicationName = angular.copy(applicationName);
    }

    function getApplicationName() {
        return self.applicationName;
    }

    function getApplicationDomain() {
        return self.applicationDomain;
    }
}
