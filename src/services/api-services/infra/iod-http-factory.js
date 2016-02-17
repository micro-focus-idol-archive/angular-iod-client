/**
 * Created by avidan on 28-04-15.
 */
angular
	.module('iod-client')
	.factory('iodHttpService', IodHttpService);

IodHttpService.$inject = ['$http', '$log', 'iodEnvConfigService', 'iodSessionToken'];

/* @ngInject */
function IodHttpService($http, $log, iodEnvConfigService) {
	$log = $log.getInstance("IodHttpService");
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


	function doGet(url, urlParams) {
		var concatUrl, queryParams;
		var urlPrefix = buildUrlPrefix();
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

	function doPost(url, data, urlParams) {
		var concatUrl, queryParams, bodyParams;
		var urlPrefix = buildUrlPrefix();
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

	function doPut(url, urlParams, data) {
		var concatUrl, queryParams, bodyParams;
		var urlPrefix = buildUrlPrefix();
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

	function doDelete(url, urlParams, data) {
		var concatUrl, queryParams, bodyParams;

		var urlPrefix = buildUrlPrefix();
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

	function doInfoGet(url, urlParams) {
		var concatUrl = buildInfoPrefix(url);
		var queryParams;
		if (urlParams instanceof ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}
		appendSessionToken(queryParams);

		$log.debug('calling INFO get to ' + concatUrl);
		return doGet(concatUrl, queryParams)
	}

	function doDiscoveryGet(url, urlParams) {
		var concatUrl = buildDiscoveryPrefix(url);
		var queryParams;
		if (urlParams instanceof ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}
		appendSessionToken(queryParams);

		$log.debug('calling DISCOVERY get to ' + concatUrl);
		return doGet(concatUrl, queryParams)
	}


	function apiGet(url, urlParams, headerParams, isAsync) {
		var urlPrefix = buildApiPrefix(url, isAsync);
		var queryParams;
		if (urlParams instanceof ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}
		appendSessionToken(queryParams);

		//concatUrl = urlPrefix + queryParams.toReqStr();
		$log.debug('calling API get to ' + urlPrefix + ', with :' + headerParams);
		return doGet(urlPrefix, queryParams).then(function (response){return response.data});
	}

	function apiPost(url, data, urlParams, isAsync) {
		var queryParams;
		var urlPrefix = buildApiPrefix(url, isAsync);
		//if (urlParams instanceof  ReqQueryParams) {
		if (urlParams instanceof ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}
		appendSessionToken(queryParams);
		$log.debug('calling API POST to ' + urlPrefix);
		return doPost(urlPrefix, data, queryParams).then(function (response){return response.data});
	}

	/**
	 * Submit a HTTP POST request to api.idolondemand, the call is done without any validation on the request body data to allow submitting calls without the factory HTTP configurations.
	 * @param url the URL suffix to attach to the api.idolondemand prefix
	 * @param data - request body data,expecting a JSON object.
	 * @param urlParams - request query params, expecting a ReqQueryParams object or JSON object.
	 * @param reqConfigObj - request additional configurations, please see AnguleJS $http documentation.
	 * @param isAsync - is request should be done in a Async operation.
	 * @returns the $http response promise.
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
		appendSessionToken(queryParams);

		concatUrl = [buildUrlPrefix(), buildApiPrefix(url, isAsync)].join('');

		$log.debug('performing a POST request to ' + concatUrl);

		var reqConfig = _.extend({
			method: 'POST',
			url: concatUrl,
			params: queryParams.params,
			data: data,
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}, reqConfigObj);
		return $http(reqConfig).then(function (response){return response.data});
	}

	function apiPut(url, data, urlParams, isAsync) {
		var queryParams;
		var urlPrefix = buildApiPrefix(url, isAsync);
		if (urlParams instanceof  ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}
		appendSessionToken(queryParams);
		$log.debug('calling API PUT to ' + urlPrefix);
		return doPut(urlPrefix, queryParams, data).then(function (response){return response.data})
	}

	function apiDelete(url, urlParams, data, isAsync) {
		var queryParams;
		var urlPrefix = buildApiPrefix(url, isAsync);
		if (urlParams instanceof  ReqQueryParams) {
			queryParams = urlParams;
		} else {
			queryParams = new ReqQueryParams(urlParams);
		}
		appendSessionToken(queryParams);
		$log.debug('calling API PUT to ' + urlPrefix);
		return doDelete(urlPrefix, queryParams, data).then(function (response){return response.data})
	}

	function appendSessionToken(queryParams) {
		queryParams.append({apiKey: iodEnvConfigService.getApiKey()});
	}

	function buildUrlPrefix() {
		return iodEnvConfigService.getIodHost() + '/' + API_LEVEL + '/';
	}

	function buildApiPrefix(url, isAsync) {
		isAsync = isAsync || false;
		return [URL_PREFIX.API, isAsync ? ASYNC : SYNC, url].join('/');
	}

	function buildInfoPrefix(url) {
		return [URL_PREFIX.INFO, url].join('/');
	}

	function buildDiscoveryPrefix(url) {
		return [URL_PREFIX.DISCOVERY, url].join('/');
	}

}
