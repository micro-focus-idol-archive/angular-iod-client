/**
 * Created by avidan on 25-05-15.
 */
angular
	.module('hod-client')
	.factory('iodEnvConfigService', IodEnvConfigService);

IodEnvConfigService.$inject = ['$log'];

/* @ngInject */
function IodEnvConfigService( $log) {

	var HOD_CONFIG = {
		PROTOCOL : 'https',
		DOMAIN : 'havenondemand.com',
		PORT : undefined,
		API_DOMAIN_PREFIX : 'api',
		PLATFORM_VERSION : '1'
	};

	var isConfigValid = true;
	var IOD_HOST_URL;
	var IOD_PORTAL_URL;
	var API_KEY;

	try {
		IOD_HOST_URL = [HOD_CONFIG.PROTOCOL, '://' ,HOD_CONFIG.API_DOMAIN_PREFIX,'.', HOD_CONFIG.DOMAIN, ( HOD_CONFIG.PORT? ':' + HOD_CONFIG.PORT: '')].join('');
		IOD_PORTAL_URL = [HOD_CONFIG.PROTOCOL, '://' , HOD_CONFIG.DOMAIN, ( HOD_CONFIG.PORT? ':' + HOD_CONFIG.PORT: '')].join('');
	} catch (e) {
		IOD_HOST_URL = '';
		IOD_PORTAL_URL = '';
		$log.error('Configuration error! one of the IOD configuration attributes is missing');
		isConfigValid = false;
	}


	var service = {
		getIodHost: getIodHost,
		getIodPortal: getIodPortal,
		setApiKey : setApiKey,
		getApiKey:getApiKey,
		isEnvConfigValid: isEnvConfigValid
	};

	return service;

	////////////////

	function getIodHost() {
		return IOD_HOST_URL;
	}

	function getIodPortal() {
		return IOD_PORTAL_URL;
	}

	function setApiKey(_apiKey){
		if(_apiKey && angular.isString(_apiKey)){
			API_KEY = _apiKey;
		}
		return API_KEY
	}

	function getApiKey(){
		return API_KEY
	}

	function isEnvConfigValid() {
		return isConfigValid;
	}

}
