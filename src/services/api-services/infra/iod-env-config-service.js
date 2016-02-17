/**
 * Created by avidan on 25-05-15.
 */
angular
	.module('iod-client')
	.factory('iodEnvConfigService', IodEnvConfigService);

IodEnvConfigService.$inject = ['envConfig', '$log'];

/* @ngInject */
function IodEnvConfigService(envConfig, $log) {
	//$log = $log.getInstance("IodEnvConfigService");
	var isConfigValid = true;
	var IOD_HOST_URL;
	var IOD_PORTAL_URL;
	var API_KEY;

	try {
		IOD_HOST_URL = envConfig.iod_config.protocol + '://' + envConfig.iod_config.domain + ( envConfig.iod_config.port ? ':' + envConfig.iod_config.port : '');
		IOD_PORTAL_URL = envConfig.portal_config.protocol + '://' + envConfig.portal_config.domain + ( envConfig.portal_config.port ? ':' + envConfig.portal_config.port : '');
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
