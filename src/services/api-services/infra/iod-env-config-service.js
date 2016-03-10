'use strict';
/**
 *
 * @ngdoc service
 * @name hod-client.hodEnvConfigService
 * @description
 * # hodEnvConfigService
 * Sets HOD environment configurations such as the HOD host and the user APIKEY. This Service should be calls on the application load and set the APIKEY to allow API calls to be made.
 *
 *
 * ## API-KEY
 * The APIKEY can be retrieved under the user configurations section at [HOD account management](https://www.havenondemand.com/account/api-keys.html)
 *
 */
angular
	.module('hod-client')
	.factory('hodEnvConfigService', HodEnvConfigService);

HodEnvConfigService.$inject = ['$log'];

/* @ngInject */
function HodEnvConfigService( $log) {

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
		getHodHost: getHodHost,
		getHodPortal: getHodPortal,
		setApiKey : setApiKey,
		getApiKey:getApiKey,
		isEnvConfigValid: isEnvConfigValid
	};

	return service;

	////////////////

	/**
	 * @ngdoc
	 * @name hod-client.hodEnvConfigService#getHodHost
	 * @methodOf hod-client.hodEnvConfigService
	 * @description Return the HOD APIs subdomain URL
	 *
	 * @returns {string} HOD APIs URL. Default value is set to 'https://api.havenondemand.com'
	 */
	function getHodHost() {
		return IOD_HOST_URL;
	}

	/**
	 * @ngdoc
	 * @name hod-client.hodEnvConfigService#getHodPortal
	 * @methodOf hod-client.hodEnvConfigService
	 * @description Return the HOD URL
	 *
	 * @returns {string} HOD URL. Default value is set to 'https://havenondemand.com'
	 */
	function getHodPortal() {
		return IOD_PORTAL_URL;
	}

	/**
	 * @ngdoc
	 * @name hod-client.hodEnvConfigService#setApiKey
	 * @methodOf hod-client.hodEnvConfigService
	 * @description Set the APIKEY to use for HOD APIs calls
	 *
	 * @param {string} APIKEY to use in calls
	 * @returns {string} The new APIKEY
	 */
	function setApiKey(_apiKey){
		if(_apiKey && angular.isString(_apiKey)){
			API_KEY = _apiKey;
		}
		return API_KEY
	}

	/**
	 * @ngdoc
	 * @name hod-client.hodEnvConfigService#getApiKey
	 * @methodOf hod-client.hodEnvConfigService
	 * @description Get the APIKEY to use for HOD APIs calls
	 *
	 * @returns {string} The APIKEY
	 */
	function getApiKey(){
		return API_KEY
	}

	/**
	 * @ngdoc
	 * @name hod-client.hodEnvConfigService#isEnvConfigValid
	 * @methodOf hod-client.hodEnvConfigService
	 * @description
	 *
	 * @returns {boolean} true if all configurations are valid
	 */
	function isEnvConfigValid() {
		isConfigValid = isConfigValid && _.isDefined(getApiKey())
		return isConfigValid;
	}

}
