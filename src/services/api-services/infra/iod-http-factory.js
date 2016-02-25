'use strict';
/**
 *
 * @ngdoc service
 * @name hod-client.hodHttpService
 * @description
 * # hodHttpService
 * Wraps $http to create API calls to HOD
 *
 *
 * ## API-KEY
 * All API requests should be appended with the tenant API-KEY, it should be set using the iod-env-config-service.setApiKey method prior to any API call
 *
 * ## Synchronous and Asynchronous API
 * You can call Haven OnDemand API functions to run either synchronously or asynchronously.
 * In the Synchronous API, Haven OnDemand processes the call immediately, and returns a single response, containing your results.
 * In the Asynchronous API, Haven OnDemand receives the call, and returns a job ID, which allows you to track the status of the call. When the call is complete, the status message also returns the response and results.
 * The synchronous API is ideal for API requests where you expect quick results. You can use this for small requests. However, you cannot check the status of a synchronous job, and if the connection is lost you must resubmit the request to get the results.
 *
 * ## Response codes
 * [Warning-Codes](https://dev.havenondemand.com/docs/WarningCodes.html)
 * [Error-Codes](https://dev.havenondemand.com/docs/ErrorCodes.html)
 *
 * For more information please see https://dev.havenondemand.com/docs/AsynchronousAPI.htm
 */
angular
	.module('hod-client')
	.factory('hodHttpService', HodHttpService);

HodHttpService.$inject = ['$http', '$log', 'iodEnvConfigService'];

/* @ngInject */
function HodHttpService($http, $log, iodEnvConfigService) {
	var that = this;
	that.sessionToken = null;

	var API_LEVEL = 1;
	var URL_PREFIX = {API: 'api', INFO: 'info', DISCOVERY: 'discovery'};
	var SYNC = 'sync';
	var ASYNC = 'async';


	var service = {
		doApiGet: apiGet,
		doApiPost: apiPost,
		doApiPostWithoutDataValidation: doApiPostWithoutDataValidation,
		doApiPut: apiPut,
		doApiDelete: apiDelete,
		doInfoGet: doInfoGet,
		doDiscoveryGet: doDiscoveryGet
	};


	return service;

	////////////////

	/**
	 * @ngdoc
	 * @name hod-client.hodHttpService#doInfoGet
	 * @methodOf hod-client.hodHttpService
	 * @description Do a HTTP GET call to the specified URL with an INFO prefix to the call
	 *
	 * @param {string} url Relative url to the wanted API
	 * @param {json=} urlParams A JSON object with the wanted URL query params
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function doInfoGet(url, urlParams) {
		var concatUrl = _buildInfoPrefix(url);
		var queryParams;
		if (urlParams instanceof ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}
		_appendSessionToken(queryParams);

		$log.debug('calling INFO get to ' + concatUrl);
		return _doGet(concatUrl, queryParams)
	}

	/**
	 * @ngdoc
	 * @name hod-client.hodHttpService#doDiscoveryGet
	 * @methodOf hod-client.hodHttpService
	 * @description Do a HTTP GET call to the specified URL with a DISCOVERY prefix to the call
	 *
	 * @param {string} url Relative url to the wanted API
	 * @param {json=} urlParams A JSON object with the wanted URL query params
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function doDiscoveryGet(url, urlParams) {
		var concatUrl = _buildDiscoveryPrefix(url);
		var queryParams;
		if (urlParams instanceof ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}
		_appendSessionToken(queryParams);

		$log.debug('calling DISCOVERY get to ' + concatUrl);
		return _doGet(concatUrl, queryParams)
	}

	/**
	 * @ngdoc
	 * @name hod-client.hodHttpService#apiGet
	 * @methodOf hod-client.hodHttpService
	 * @description Do a HTTP GET call to the specified URL with an API prefix to the call
	 *
	 * @param {string} url Relative url to the wanted API
	 * @param {json=} urlParams A JSON object with the wanted URL query params
	 * @param {json=} headerParams Additional header to be attached to the call
	 * @param {boolean=} isAsync Will this call be an SYNC or ASYNC call. default value is false
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function apiGet(url, urlParams, headerParams, isAsync) {
		var urlPrefix = _buildApiPrefix(url, isAsync);
		var queryParams;
		if (urlParams instanceof ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}
		_appendSessionToken(queryParams);

		//concatUrl = urlPrefix + queryParams.toReqStr();
		$log.debug('calling API get to ' + urlPrefix + ', with :' + headerParams);
		return _doGet(urlPrefix, queryParams).then(function (response) {
			return response.data
		});
	}

	/**
	 * @ngdoc
	 * @name hod-client.hodHttpService#apiPost
	 * @methodOf hod-client.hodHttpService
	 * @description Do a HTTP POST request to the specified URL with an API prefix to the call
	 *
	 * @param {string} url Relative url to the wanted API
	 * @param {json} data A JSON object to be applied to the request body as a form
	 * @param {json=} urlParams A JSON object with the wanted URL query params
	 * @param {boolean=} isAsync Will this call be an SYNC or ASYNC call. default value is false
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function apiPost(url, data, urlParams, isAsync) {
		var queryParams;
		var urlPrefix = _buildApiPrefix(url, isAsync);
		//if (urlParams instanceof  ReqQueryParams) {
		if (urlParams instanceof ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}
		_appendSessionToken(queryParams);
		$log.debug('calling API POST to ' + urlPrefix);
		return _doPost(urlPrefix, data, queryParams).then(function (response) {
			return response.data
		});
	}

	/**
	 * @ngdoc
	 * @name hod-client.hodHttpService#apiPost
	 * @methodOf hod-client.hodHttpService
	 * @description Submit a HTTP POST request to to the specified URL with an API prefix, the request is done without any validation on the request body data to allow submitting calls without the  $httpProvider default configurations.
	 *
	 * @param {string} url the URL suffix to attach to the api.idolondemand prefix
	 * @param {json} data - request body data,expecting a JSON object.
	 * @param {json} urlParams - request query params, expecting a ReqQueryParams object or JSON object.
	 * @param {json} reqConfigObj - request additional configurations, please see AnguleJS $http documentation.
	 * @param {boolean=} isAsync - is request should be done in a Async operation. default value is false.
	 * @returns {httpPromise} the $http response promise.
	 */
	function doApiPostWithoutDataValidation(url, data, urlParams, reqConfigObj, isAsync) {
		var queryParams, concatUrl;
		data = data || {};
		reqConfigObj = reqConfigObj || {};

		if (urlParams instanceof ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}
		_appendSessionToken(queryParams);

		concatUrl = [_buildUrlPrefix(), _buildApiPrefix(url, isAsync)].join('');

		$log.debug('performing a POST request to ' + concatUrl);

		var reqConfig = _.extend({
			method: 'POST',
			url: concatUrl,
			params: queryParams.params,
			data: data,
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}, reqConfigObj);
		return $http(reqConfig).then(function (response) {
			return response.data
		});
	}

	/**
	 * @ngdoc
	 * @name hod-client.hodHttpService#apiPut
	 * @methodOf hod-client.hodHttpService
	 * @description Do a HTTP PUT request to the specified URL with an API prefix to the call
	 *
	 * @param {string} url Relative url to the wanted API
	 * @param {json} data A JSON object to be applied to the request body as a form
	 * @param {json=} urlParams A JSON object with the wanted URL query params
	 * @param {boolean=} isAsync Will this call be an SYNC or ASYNC call. default value is false
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function apiPut(url, data, urlParams, isAsync) {
		var queryParams;
		var urlPrefix = _buildApiPrefix(url, isAsync);
		if (urlParams instanceof  ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}
		_appendSessionToken(queryParams);
		$log.debug('calling API PUT to ' + urlPrefix);
		return _doPut(urlPrefix, queryParams, data).then(function (response) {
			return response.data
		})
	}

	/**
	 * @ngdoc
	 * @name hod-client.hodHttpService#apiDelete
	 *@methodOf hod-client.hodHttpService
	 * @description Do a HTTP DELETE request to the specified URL with an API prefix to the call
	 *
	 * @param {string} url Relative url to the wanted API
	 * @param {json} data A JSON object to be applied to the request body as a form
	 * @param {json=} urlParams A JSON object with the wanted URL query params
	 * @param {boolean=} isAsync Will this call be an SYNC or ASYNC call. default value is false
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function apiDelete(url, urlParams, data, isAsync) {
		var queryParams;
		var urlPrefix = _buildApiPrefix(url, isAsync);
		if (urlParams instanceof  ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}
		_appendSessionToken(queryParams);
		$log.debug('calling API PUT to ' + urlPrefix);
		return _doDelete(urlPrefix, queryParams, data).then(function (response) {
			return response.data
		})
	}

	function _doGet(url, urlParams) {
		var concatUrl, queryParams;
		var urlPrefix = _buildUrlPrefix();
		concatUrl = urlPrefix + url;

		if (urlParams instanceof ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}

		$log.debug('performing a GET request to ' + concatUrl);
		return $http({
			method: 'GET',
			url: concatUrl,
			params: queryParams.params
		});
	}

	function _doPost(url, data, urlParams) {
		var concatUrl, queryParams, bodyParams;
		var urlPrefix = _buildUrlPrefix();
		concatUrl = urlPrefix + url;

		if (urlParams instanceof ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}

		if (data instanceof  ReqBodyData) {
			bodyParams = data;
		} else {
			bodyParams = new ReqBodyData(data);
		}

		$log.debug('performing a POST request to ' + concatUrl);
		return $http({
			method: 'POST',
			url: concatUrl,
			params: queryParams.params,
			data: $.param(bodyParams.getSerializeParamaters()),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		});
	}

	function _doPut(url, urlParams, data) {
		var concatUrl, queryParams, bodyParams;
		var urlPrefix = _buildUrlPrefix();
		concatUrl = urlPrefix + url;

		if (urlParams instanceof ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}

		if (data instanceof  ReqBodyData) {
			bodyParams = data;
		} else {
			bodyParams = new ReqBodyData(data);
		}

		$log.debug('preforming a PUT request to ' + concatUrl);
		return $http({
			method: 'PUT',
			url: concatUrl,
			params: queryParams.params,
			data: $.param(bodyParams.getSerializeParamaters()),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).then(function (d) {
			return d.data
		});
	}

	function _doDelete(url, urlParams, data) {
		var concatUrl, queryParams, bodyParams;

		var urlPrefix = _buildUrlPrefix();
		concatUrl = urlPrefix + url;

		if (urlParams instanceof ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}

		if (data instanceof  ReqBodyData) {
			bodyParams = data;
		} else {
			bodyParams = new ReqBodyData(data);
		}

		$log.debug('preforming a DELETE request to ' + concatUrl);
		return $http({
			method: 'DELETE',
			url: concatUrl,
			params: queryParams.params,
			data: $.param(bodyParams.getSerializeParamaters()),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		});
	}

	function _appendSessionToken(queryParams) {
		queryParams.append({apiKey: iodEnvConfigService.getApiKey()});
	}

	function _buildUrlPrefix() {
		return iodEnvConfigService.getIodHost() + '/' + API_LEVEL + '/';
	}

	function _buildApiPrefix(url, isAsync) {
		isAsync = isAsync || false;
		return [URL_PREFIX.API, isAsync ? ASYNC : SYNC, url].join('/');
	}

	function _buildInfoPrefix(url) {
		return [URL_PREFIX.INFO, url].join('/');
	}

	function _buildDiscoveryPrefix(url) {
		return [URL_PREFIX.DISCOVERY, url].join('/');
	}

}
