/**
 * Created by avidan on 13-05-15.
 */
describe('IOD-HTTP-Factory Test ', function () {

	var scope,
		rootScope,
		$q,
		$httpBackend,
		logMock,
		envConfigMock,
		serviceUnderTest,
		iodEnvConfigServiceMock;

	envConfigMock = {
		"env": "production",
		"iod_config": {
			"protocol": "https",
			"domain": "api.havenondemand.com",
			"host": undefined,
			"port": undefined
		},
		"portal_config": {
			"protocol": "https",
			"domain": "havenondemand.com",
			"host": undefined,
			"port": undefined
		}
	};
	var API_LEVEL = 1;
	var URL_PREFIX = {API: 'api', INFO: 'info', DISCOVERY: 'discovery'}
	var SYNC_PREFIX = {SYNC: 'sync', ASYNC: 'async'}


	beforeEach(angular.mock.module('iod-client'));

	beforeEach(module(function ($provide) {
		logMock = jasmine.createSpyObj('logMock', ['debug', 'error']);
		$provide.value('$log', logMock);
	}));

	beforeEach(function () {
		inject(function ($rootScope, _$q_, _$httpBackend_, iodHttpService) {
			rootScope = $rootScope;
			scope = rootScope.$new();
			$q = _$q_;
			$httpBackend = _$httpBackend_;
			serviceUnderTest = iodHttpService;
		})
	});

	function buildURL() {
		var hostUrl = envConfigMock.iod_config.protocol.concat('://', envConfigMock.iod_config.domain, ( envConfigMock.iod_config.port ? ':' + envConfigMock.iod_config.port : ''));
		var hostUrlPrefix = [hostUrl, API_LEVEL].join('/');

		return hostUrlPrefix;
	}

	function buildApiUrl(isASync) {
		var hostUrlPrefix = buildURL();
		var apiUrlPrefix = [hostUrlPrefix, URL_PREFIX.API, isASync ? SYNC_PREFIX.ASYNC : SYNC_PREFIX.SYNC].join('/')
		return apiUrlPrefix;
	}

	function buildInfoUrl(isASync) {
		var hostUrlPrefix = buildURL();
		var apiUrlPrefix = [hostUrlPrefix, URL_PREFIX.INFO].join('/')
		return apiUrlPrefix;
	}

	function buildDiscoveryUrl(isASync) {
		var hostUrlPrefix = buildURL();
		var apiUrlPrefix = [hostUrlPrefix, URL_PREFIX.DISCOVERY].join('/')
		return apiUrlPrefix;
	}

	function concatQueryParams(params) {
		var concatParams = '?' +
			_.chain(params)
				.pairs()
				.map(function (p) {
					return p.join('=')
				})
				.value().join('&');
		return concatParams;
	}

	describe('Validate the service init', function () {

		it('Should test that all methods are defined', function () {
			expect(serviceUnderTest.doApiGet).toBeDefined();
			expect(serviceUnderTest.doApiPost).toBeDefined();
			expect(serviceUnderTest.doApiPut).toBeDefined();
			expect(serviceUnderTest.doApiDelete).toBeDefined();
			expect(serviceUnderTest.doInfoGet).toBeDefined();
			expect(serviceUnderTest.doDiscoveryGet).toBeDefined();
			expect(serviceUnderTest.doApiPostWithoutDataValidation).toBeDefined();
		});


	});

	/*describe('Validate the plain HTTP methods', function () {
	 afterEach(function () {
	 $httpBackend.verifyNoOutstandingExpectation();
	 $httpBackend.verifyNoOutstandingRequest();
	 });

	 describe('doGet method', function () {
	 it('Should call and validate the XHR request', function () {
	 var apiUrl = 'someUrl'
	 var url = [buildURL(), apiUrl].join('/');
	 $httpBackend.expectGET(url).respond(200);
	 serviceUnderTest.doGet(apiUrl);
	 $httpBackend.flush();
	 });

	 it('Should call with query params', function () {
	 var apiUrl = 'someUrl'
	 var queryParams = {aa: 11, bb: false};
	 var url = [buildURL(), apiUrl].join('/').concat(concatQueryParams(queryParams));
	 $httpBackend.expectGET(url).respond(200);
	 serviceUnderTest.doGet(apiUrl, queryParams);
	 $httpBackend.flush();
	 });

	 it('Should call with query params as ReqQueryParams', function () {
	 var apiUrl = 'someUrl'
	 var queryParams = new ReqQueryParams({aa: 11, bb: false});
	 var url = [buildURL(), apiUrl].join('/').concat(concatQueryParams(queryParams.params));
	 $httpBackend.expectGET(url).respond(200);
	 serviceUnderTest.doGet(apiUrl, queryParams);
	 $httpBackend.flush();
	 });
	 });

	 describe('doPost method', function () {
	 it('Should call and validate the XHR request', function () {
	 var apiUrl = 'someUrl'
	 var url = [buildURL(), apiUrl].join('/');
	 $httpBackend.expectPOST(url).respond(200);
	 serviceUnderTest.doPost(apiUrl);
	 $httpBackend.flush();
	 });

	 it('Should call with query params', function () {
	 var apiUrl = 'someUrl';
	 var queryParams = {aa: 11, bb: false};
	 var url = [buildURL(), apiUrl].join('/').concat(concatQueryParams(queryParams));
	 $httpBackend.expectPOST(url).respond(200);
	 serviceUnderTest.doPost(apiUrl, null, queryParams);
	 $httpBackend.flush();
	 });

	 it('Should call with query params as ReqQueryParams', function () {
	 var apiUrl = 'someUrl';
	 var queryParams = new ReqQueryParams({aa: 11, bb: false});
	 var url = [buildURL(), apiUrl].join('/').concat(concatQueryParams(queryParams.params));
	 $httpBackend.expectPOST(url).respond(200);
	 serviceUnderTest.doPost(apiUrl, null, queryParams);
	 $httpBackend.flush();
	 });

	 it('Should call with query params as ReqQueryParams and body params', function () {
	 var apiUrl = 'someUrl';
	 var queryParams = new ReqQueryParams({aa: 11, bb: true});
	 var bodyParams = new ReqBodyData({aa: 22});
	 //var bodyParams = encodeURIComponent('text');

	 var url = [buildURL(), apiUrl].join('/').concat(concatQueryParams(queryParams.params));
	 $httpBackend.expectPOST(url, $.param(bodyParams.params)).respond(200);
	 serviceUnderTest.doPost(apiUrl, bodyParams, queryParams);
	 $httpBackend.flush();
	 });

	 it('Should call doApiPostWithoutDataValidation', function () {
	 var apiUrl = 'someUrl';
	 var data = {};
	 var urlParams = {};
	 var configObj = {};

	 var url = [buildApiUrl(), apiUrl].join('/');
	 $httpBackend.expectPOST(url, data).respond(200);
	 serviceUnderTest.doApiPostWithoutDataValidation(apiUrl, data, urlParams, configObj);
	 $httpBackend.flush();
	 });

	 });

	 describe('doPut method', function () {
	 it('Should call and validate the XHR request', function () {
	 var apiUrl = 'someUrl'
	 var url = [buildURL(), apiUrl].join('/');
	 $httpBackend.expectPUT(url).respond(200);
	 serviceUnderTest.doPut(apiUrl);
	 $httpBackend.flush();
	 });

	 it('Should call with query params', function () {
	 var apiUrl = 'someUrl';
	 var queryParams = {aa: 11, bb: false};
	 var url = [buildURL(), apiUrl].join('/').concat(concatQueryParams(queryParams));
	 $httpBackend.expectPUT(url).respond(200);
	 serviceUnderTest.doPut(apiUrl, queryParams, null);
	 $httpBackend.flush();
	 });

	 it('Should call with query params as ReqQueryParams', function () {
	 var apiUrl = 'someUrl';
	 var queryParams = new ReqQueryParams({aa: 11, bb: false});
	 var url = [buildURL(), apiUrl].join('/').concat(concatQueryParams(queryParams.params));
	 $httpBackend.expectPUT(url).respond(200);
	 serviceUnderTest.doPut(apiUrl, queryParams, null);
	 $httpBackend.flush();
	 });

	 it('Should call with query params as ReqQueryParams and body params', function () {
	 var apiUrl = 'someUrl';
	 var queryParams = new ReqQueryParams({aa: 11, bb: true});
	 var bodyParams = new ReqBodyData({aa: 22});
	 //var bodyParams = encodeURIComponent('text');

	 var url = [buildURL(), apiUrl].join('/').concat(concatQueryParams(queryParams.params));
	 $httpBackend.expectPUT(url, $.param(bodyParams.params)).respond(200);
	 serviceUnderTest.doPut(apiUrl, queryParams, bodyParams);
	 $httpBackend.flush();
	 });
	 });

	 describe('doDelete method', function () {
	 it('Should call and validate the XHR request', function () {
	 var apiUrl = 'someUrl'
	 var url = [buildURL(), apiUrl].join('/');
	 $httpBackend.expectDELETE(url).respond(200);
	 serviceUnderTest.doDelete(apiUrl);
	 $httpBackend.flush();
	 });

	 it('Should call with query params', function () {
	 var apiUrl = 'someUrl';
	 var queryParams = {aa: 11, bb: false};
	 var url = [buildURL(), apiUrl].join('/').concat(concatQueryParams(queryParams));
	 $httpBackend.expectDELETE(url).respond(200);
	 serviceUnderTest.doDelete(apiUrl, queryParams, null);
	 $httpBackend.flush();
	 });

	 it('Should call with query params as ReqQueryParams', function () {
	 var apiUrl = 'someUrl';
	 var queryParams = new ReqQueryParams({aa: 11, bb: false});
	 var url = [buildURL(), apiUrl].join('/').concat(concatQueryParams(queryParams.params));
	 $httpBackend.expectDELETE(url).respond(200);
	 serviceUnderTest.doDelete(apiUrl, queryParams, null);
	 $httpBackend.flush();
	 });

	 xit('Should call with query params as ReqQueryParams and body params', function () {
	 var apiUrl = 'someUrl';
	 var queryParams = new ReqQueryParams({aa: 11, bb: true});
	 var bodyParams = new ReqBodyData({aa: 22});

	 var url = [buildURL(), apiUrl].join('/').concat(concatQueryParams(queryParams.params));
	 $httpBackend.expectDELETE(url, $.param(bodyParams.params)).respond(200);
	 serviceUnderTest.doDelete(apiUrl, queryParams, bodyParams);
	 $httpBackend.flush();
	 });
	 });

	 });*/

	describe('Validate the API methods', function () {

		afterEach(function () {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		describe('doAPIGet method', function () {
			it('Should call and validate the API request', function () {
				var apiUrl = 'someUrl'
				var url = [buildApiUrl(), apiUrl].join('/');
				$httpBackend.expectGET(url).respond(200);
				serviceUnderTest.doApiGet(apiUrl);
				$httpBackend.flush();
			});

			it('Should call and validate the API ASYNC request', function () {
				var apiUrl = 'someUrl'
				var url = [buildApiUrl(true), apiUrl].join('/');
				$httpBackend.expectGET(url).respond(200);
				serviceUnderTest.doApiGet(apiUrl, null, null, true);
				$httpBackend.flush();
			});

			it('Should call with query params', function () {
				var apiUrl = 'someUrl'
				var queryParams = {aa: 11, bb: false};
				var url = [buildApiUrl(), apiUrl].join('/').concat(concatQueryParams(queryParams));
				$httpBackend.expectGET(url).respond(200);
				serviceUnderTest.doApiGet(apiUrl, queryParams);
				$httpBackend.flush();
			});

			it('Should call with query params as ReqQueryParams', function () {
				var apiUrl = 'someUrl'
				var queryParams = new ReqQueryParams({aa: 11, bb: false});
				var url = [buildApiUrl(), apiUrl].join('/').concat(concatQueryParams(queryParams.params));
				$httpBackend.expectGET(url).respond(200);
				serviceUnderTest.doApiGet(apiUrl, queryParams);
				$httpBackend.flush();
			});
		});

		describe('doAPIPost method', function () {
			it('Should call and validate the API request', function () {
				var apiUrl = 'someUrl'
				var url = [buildApiUrl(), apiUrl].join('/');
				$httpBackend.expectPOST(url).respond(200);
				serviceUnderTest.doApiPost(apiUrl);
				$httpBackend.flush();
			});

			it('Should call and validate the API ASYNC request', function () {
				var apiUrl = 'someUrl'
				var url = [buildApiUrl(true), apiUrl].join('/');
				$httpBackend.expectPOST(url).respond(200);
				serviceUnderTest.doApiPost(apiUrl, null, null, true);
				$httpBackend.flush();
			});

			it('Should call with query params', function () {
				var apiUrl = 'someUrl'
				var queryParams = {aa: 11, bb: false};
				var url = [buildApiUrl(), apiUrl].join('/').concat(concatQueryParams(queryParams));
				$httpBackend.expectPOST(url).respond(200);
				serviceUnderTest.doApiPost(apiUrl, null, queryParams);
				$httpBackend.flush();
			});

			it('Should call with query params and bodyParams ', function () {
				var apiUrl = 'someUrl'
				var queryParams = new ReqQueryParams({aa: 11, bb: false});
				var bodyParams = new ReqBodyData({aa: 22});

				var url = [buildApiUrl(), apiUrl].join('/').concat(concatQueryParams(queryParams.params));
				$httpBackend.expectPOST(url, $.param(bodyParams.params)).respond(200);
				serviceUnderTest.doApiPost(apiUrl, bodyParams, queryParams);
				$httpBackend.flush();
			});
		});
	});

	describe('Validate the Info Info / Discovery methods', function () {
		afterEach(function () {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		describe('doInfoGet method', function () {
			it('Should call and validate the API request', function () {
				var apiUrl = 'someUrl'
				var url = [buildInfoUrl(), apiUrl].join('/');
				$httpBackend.expectGET(url).respond(200);
				serviceUnderTest.doInfoGet(apiUrl);
				$httpBackend.flush();
			});

			it('Should call and validate the API ASYNC request', function () {
				var apiUrl = 'someUrl'
				var url = [buildInfoUrl(true), apiUrl].join('/');
				$httpBackend.expectGET(url).respond(200);
				serviceUnderTest.doInfoGet(apiUrl, null, null, true);
				$httpBackend.flush();
			});

			it('Should call with query params', function () {
				var apiUrl = 'someUrl'
				var queryParams = {aa: 11, bb: false};
				var url = [buildInfoUrl(), apiUrl].join('/').concat(concatQueryParams(queryParams));
				$httpBackend.expectGET(url).respond(200);
				serviceUnderTest.doInfoGet(apiUrl, queryParams);
				$httpBackend.flush();
			});

			it('Should call with query params as ReqQueryParams', function () {
				var apiUrl = 'someUrl'
				var queryParams = new ReqQueryParams({aa: 11, bb: false});
				var url = [buildInfoUrl(), apiUrl].join('/').concat(concatQueryParams(queryParams.params));
				$httpBackend.expectGET(url).respond(200);
				serviceUnderTest.doInfoGet(apiUrl, queryParams);
				$httpBackend.flush();
			});
		})


		describe('doDiscoveryGet method', function () {
			it('Should call and validate the API request', function () {
				var apiUrl = 'someUrl'
				var url = [buildDiscoveryUrl(), apiUrl].join('/');
				$httpBackend.expectGET(url).respond(200);
				serviceUnderTest.doDiscoveryGet(apiUrl);
				$httpBackend.flush();
			});

			it('Should call and validate the API ASYNC request', function () {
				var apiUrl = 'someUrl'
				var url = [buildDiscoveryUrl(true), apiUrl].join('/');
				$httpBackend.expectGET(url).respond(200);
				serviceUnderTest.doDiscoveryGet(apiUrl, null, null, true);
				$httpBackend.flush();
			});

			it('Should call with query params', function () {
				var apiUrl = 'someUrl'
				var queryParams = {aa: 11, bb: false};
				var url = [buildDiscoveryUrl(), apiUrl].join('/').concat(concatQueryParams(queryParams));
				$httpBackend.expectGET(url).respond(200);
				serviceUnderTest.doDiscoveryGet(apiUrl, queryParams);
				$httpBackend.flush();
			});

			it('Should call with query params as ReqQueryParams', function () {
				var apiUrl = 'someUrl'
				var queryParams = new ReqQueryParams({aa: 11, bb: false});
				var url = [buildDiscoveryUrl(), apiUrl].join('/').concat(concatQueryParams(queryParams.params));
				$httpBackend.expectGET(url).respond(200);
				serviceUnderTest.doDiscoveryGet(apiUrl, queryParams);
				$httpBackend.flush();
			});
		})
	})

})
