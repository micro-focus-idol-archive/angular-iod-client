'use strict';
angular.module('iod-client', [])
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true; // Setting to true to allow cookies to pass in order to allow IOD's SSO
  }]);


function ReqBodyData(data) {
    var that = this;
    that.params = {};
    _.map(data, function (value, key) {
        if (value != undefined) {
            that.params[key] = value;
        }
    })
}

ReqBodyData.prototype.append = function (data) {
    var that = this;
    _.map(data, function (value, key) {
        if (value != undefined) {
            that.params[key] = value;
        }
    })
};


/**
 * Returns the Object's parameters, if one of the
 * @returns {{}}
 */
ReqBodyData.prototype.getSerializeParamaters = function(){
    var that = this;

    var serializedParams ={};
    _.map(that.params, function (value,key){
        if(_.isObject(value) && !_.isArray(value)){
            serializedParams[key] = JSON.stringify(value);
        }else {
            serializedParams[key] = value;
        }
    });

    return serializedParams;
};


function ReqQueryParams(data) {
    var that = this;
    that.params = {};
    _.map(data, function (value, key) {
        if (value != undefined) {
            that.params[key] = value;
        }
    })
}

ReqQueryParams.prototype.append = function (data) {
    var that = this;
    _.map(data, function (value, key) {
        if (value != undefined) {
            if (that.params[key] === undefined) {
                that.params[key] = value;
            }
            else {
                if (_.isArray(that.params[key])){
                    that.params[key].push(value)
                }else{
                    that.params[key] = [that.params[key],value]
                }
            }
        }
    })
};

ReqQueryParams.prototype.remove = function (key) {
    var that = this;
    if (that.params[key]) {
        delete that.params[key];
    }
}
'use strict';
/**
 * @ngdoc service
 * @name iod-client.iodConnectorService
 * @description
 * # iodConnectorService
 * Wraps API calls for the HOD's Connector APIs.
 *
 * For more information about connectors see [Connectors](https://dev.havenondemand.com/docs/Connectors.html)
 */
angular
	.module('iod-client')
	.factory('iodConnectorService', IodConnectorService);

IodConnectorService.$inject = ['iodHttpService', '$log'];

/* @ngInject */
function IodConnectorService(iodHttpService, $log) {
	var CONNECTOR_FLAVORS = {
		WEB: 'web_cloud',
		FS: 'filesystem_onsite',
		SHAREPOINT: "remote_sharepoint_onsite",
		DROPBOX: "dropbox_cloud"
	};

	var ACTIONS = {
		ADD_TO_INDEX: "addtotextindex"
	};

	var service = {
		createConnector: createConnector,
		deleteConnector: deleteConnector,
		updateConnector: updateConnector,
		startConnector: startConnector,
		stopConnector: stopConnector,
		connectorStatus: connectorStatus,
		retrieveConfig: retrieveConfig,
		cancelConnectorSchedule: cancelConnectorSchedule,
		connectorHistory: connectorHistory
	};

	return service;

	////////////////

	/**
	 * @ngdoc
	 * @name iod-client.iodConnectorService#createConnector
	 * @methodOf iod-client.iodConnectorService
	 *
	 * @param {string} connectorFlavor The flavor of the connector to create
	 * @param {string} connectorName The name of the connector to create. Maximum length of 100 characters.
	 * @param {string} url For a Web or SharePoint connector, the
	 * @param {string} indexName Index name
	 * @param {json=} config A JSON object defining the connector configuration.
	 * @param {json=} optionalParams JSON object defining additional optional parameters according to the HOD updateConnector v1 API specifications
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 *
	 */
	function createConnector(connectorType, connectorName, url, indexName,advancedConnectorParams, optionalParams) {
		var connectorResUrl = 'createconnector/v1';

		var configObj = advancedConnectorParams !== undefined ? advancedConnectorParams : {};

		switch (connectorType) {
			case CONNECTOR_FLAVORS.WEB:
			case CONNECTOR_FLAVORS.SHAREPOINT:
				configObj.url = url;
				break;
			case CONNECTOR_FLAVORS.FS:
				configObj.directoryPathCSVs = url;
				break
		}

		var config = configObj;
		var dest = {"action": ACTIONS.ADD_TO_INDEX, "index": indexName};

		var params = new ReqBodyData();
		params.append({'connector': connectorName})
		params.append({"config": config});
		params.append({"flavor": connectorType});
		params.append({"destination": dest});
		if (optionalParams) {
			params.append(params.append({"destination": dest}));
		}
		return iodHttpService.doApiPost(connectorResUrl, params);
	}

	/**
	 * @ngdoc
	 * @name iod-client.iodConnectorService#deleteConnector
	 * @methodOf iod-client.iodConnectorService
	 *
	 * @param {string} connectorName The name of the connector to create. Maximum length of 100 characters.
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function deleteConnector(connectorName) {
		$log.debug("deleting connector {0}", [connectorName]);
		var connectorResUrl = 'deleteconnector/v1';
		var reqParams = new ReqQueryParams({connector: connectorName})
		return iodHttpService.doApiGet(connectorResUrl, reqParams);
	}

	/**
	 * @ngdoc
	 * @name iod-client.iodConnectorService#retrieveConfig
	 * @methodOf iod-client.iodConnectorService
	 *
	 * @param {string} connectorName The name of the connector to create. Maximum length of 100 characters.
	 * @param {json=} optionalParams JSON object defining additional optional parameters according to the HOD updateConnector v1 API specifications
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function retrieveConfig(connectorName, optionalParams) {
		$log.debug("retrieveConfig {0}", [connectorName]);

		var params = new ReqQueryParams();
		params.append({"connector": connectorName});
		params.append({"output": "config_attributes"});
		params.append(optionalParams)
		var connectorResUrl = 'retrieveconfig/v1';
		return iodHttpService.doApiGet(connectorResUrl, params);
	}

	/**
	 * @ngdoc
	 * @name iod-client.iodConnectorService#connectorStatus
	 * @methodOf iod-client.iodConnectorService
	 *
	 * @param {string} connectorName The name of the connector to create. Maximum length of 100 characters.
	 * @param {json=} optionalParams JSON object defining additional optional parameters according to the HOD updateConnector v1 API specifications
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function connectorStatus(connectorName,optionalParams) {
		$log.debug("connectorStatus {0}", [connectorName]);

		var connectorResUrl = 'connectorstatus/v1';
		var params = new ReqQueryParams();
		params.append({"connector": connectorName});
		params.append(optionalParams)
		return iodHttpService.doApiGet(connectorResUrl, params);
	}


	/**
	 * @ngdoc
	 * @name iod-client.iodConnectorService#updateConnector
	 * @methodOf iod-client.iodConnectorService
	 * @description Update existing connector configurations
	 *
	 *
	 * @param {string} connectorName The name of the connector
	 * @param {json=} configObj A JSON object defining the connector configuration.
	 * @param {string=} indexName the Index name the connector send data to
	 * @param {json=} optionalParams JSON object defining additional optional parameters according to the HOD updateConnector v1 API specifications
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function updateConnector(connectorName, configObj, indexName, optionalParams) {
		var connectorResUrl = 'updateconnector/v1';
		var bodyParams = new ReqBodyData();
		bodyParams.append({connector:connectorName})
		if (configObj !== null && configObj !== undefined) {
			bodyParams.append({config: configObj});
		}
		if (indexName != undefined) {
			var dest = {action: ACTIONS.ADD_TO_INDEX, "index": indexName};
			bodyParams.append({destination: dest});
		}
		if(optionalParams){
			bodyParams.append(optionalParams)
		}
		return iodHttpService.doApiPost(connectorResUrl, bodyParams);
	}

	/**
	 * @ngdoc
	 * @name iod-client.iodConnectorService#startConnector
	 * @methodOf iod-client.iodConnectorService
	 * @description start existing connector

	 * @param {string} connectorName The name of the connector
	 * @param {json=} optionalParams JSON object defining additional optional parameters according to the HOD updateConnector v1 API specifications
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function startConnector(connectorName, optionalParams) {
		var connectorResUrl = '/startconnector/v1';
		var params = new ReqBodyData();
		params.append({connector:connectorName})
		if (optionalParams) {
			params.append(optionalParams);
		}
		return iodHttpService.doApiPost(connectorResUrl, params);
	}

	/**
	 * @ngdoc
	 * @name iod-client.iodConnectorService#stopConnector
	 * @methodOf iod-client.iodConnectorService
	 * @description stops a connector schedule.
	 * @param {string} connectorName The name of the connector
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function stopConnector(connectorName) {
		var connectorResUrl = '/stopconnector/v1';
		var params = new ReqBodyData();
		params.append({connector:connectorName})
		return iodHttpService.doApiPost(connectorResUrl,params);
	}

	/**
	 * @ngdoc
	 * @name iod-client.iodConnectorService#cancelConnectorSchedule
	 * @methodOf iod-client.iodConnectorService
	 * @description Cancels a connector schedule.
	 * @param {string} connectorName The name of the connector
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function cancelConnectorSchedule(connectorName) {
		var connectorResUrl = 'cancelconnectorschedule/v1';
		var params = new ReqBodyData();
		params.append({connector:connectorName})
		return iodHttpService.doApiPost(connectorResUrl,params);
	}

	/**
	 * @ngdoc
	 * @name iod-client.iodConnectorService#connectorHistory
	 * @methodOf iod-client.iodConnectorService
	 * @description Returns connector status history information.
	 * @param {json=} optionalParams JSON object defining additional optional parameters according to the HOD updateConnector v1 API specifications
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function connectorHistory(optionalParams) {
		var connectorResUrl = 'connectorhistory/v1';
		var params = new ReqQueryParams();
		if(optionalParams){
			params.append(optionalParams)
		}
		return iodHttpService.doApiGet(connectorResUrl,params);
	}

}

angular
    .module('iod-client')
    .factory('iodIndexService', IodIndexService);

IodIndexService.$inject = ['$log', '$q', 'iodHttpService'];

/* @ngInject */
function IodIndexService($log, $q, iodHttpService) {

    $log = $log.getInstance("IodIndexService");

    var INDEX_CONSTANTS = {
        INDEX_FLAVORS: {
            SMALL: "explorer",
            STANDARD: "standard",
            CATEGORIZATION: "categorization"
        },
        INDEX_TYPES: {
            INDEX: "content",
            CONNECTOR: "connector"
        }
    };

    var service = {
        createIndex: createIndex,
        deleteIndex: deleteIndex,
        restoreIndex: restoreIndex,
        addToTextIndex: addToTextIndex,
        deleteFromTextIndex: deleteFromTextIndex,
        indexStatus: indexStatus,
        retrieveIndexesList: retrieveIndexesList,
        retrieveResourcesList: retrieveResourcesList
    };

    return service;

    ////////////////

    function createIndex(indexName, indexFlavor, indexDesc, indexFields, parametricFields, experationTime) {
        var indexResrUrl = 'textindex/' + encodeURIComponent(indexName) + '/v1';

        var data = new ReqBodyData()
        data.append({
            flavor: indexFlavor,
            description: indexDesc,
            //index_fields: JSON.stringify(indexFields),
            index_fields: indexFields,
            //parametric_fields: JSON.stringify(parametricFields),
            parametric_fields: parametricFields,
            expiretime: experationTime
        });

        return iodHttpService.doApiPost(indexResrUrl, data);
    }

    function deleteIndex(indexName) {
        var deferd = $q.defer();
        {
            var indexResrUrl = 'textindex/' + encodeURIComponent(indexName) + '/v1'
            iodHttpService.doApiDelete(indexResrUrl).success(function (data) {
                var confirmationCode = data.confirm;
                $log.debug("confirming deleting text index {0}", [indexName]);
                confirmDeleteTextIndex(indexName, confirmationCode).success(function (response) {
                    $log.debug("Index {0} deleted ", [indexName]);
                    deferd.resolve(response);
                }).error(function (e) {
                    $log.debug("Failed to delete Index {0}", [indexName]);
                    deferd.reject(e);
                })
            }).error(function (e) {
                $log.debug("Failed to receive delete confirmation code for Index {0} ", [indexName]);
                deferd.reject(e);
            })
        }
        return deferd.promise;
    }

    function confirmDeleteTextIndex(indexName, confirmation) {
        var params = new ReqQueryParams();
        params.append({confirm: confirmation});

        var indexResrUrl = 'textindex/' + encodeURIComponent(indexName) + '/v1'
        return iodHttpService.doApiDelete(indexResrUrl, params, null);
    }

    function restoreIndex() {
    }


    function addToTextIndex(indexName, file, requestConfigObj) {
        var deferred = $q.defer();
        {
            try {
                var fd = new FormData();
                fd.append('file', file);

                if (indexName && _.isString(indexName)) {
                    var indexResrUrl = 'textindex/' + encodeURIComponent(indexName) + '/document/v1';
                } else {
                    throw new Error('Expected indexName to be defined and a String');
                }

                var reqConfig = _.extend(requestConfigObj, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });

                iodHttpService.doApiPostWithoutDataValidation(indexResrUrl, fd, null, reqConfig)
                    .success(function (data) {
                        deferred.resolve(data);
                    }).error(function (errorResponse) {
                        deferred.reject(errorResponse);
                    })
            } catch (error) {
                deferred.reject(error);
            }
        }
        return deferred.promise;
    }


    function deleteFromTextIndex() {
    }


    function indexStatus(indexName) {
        var indexResrUrl = 'textindex/' + encodeURIComponent(indexName) + '/status/v1'
        return iodHttpService.doApiGet(indexResrUrl)
    }

    function retrieveIndexesList() {
        var params = new ReqQueryParams();
        params.append({"type": INDEX_CONSTANTS.INDEX_TYPES.INDEX});
        params.append({"flavor": INDEX_CONSTANTS.INDEX_FLAVORS.STANDARD});
        return iodHttpService.doApiGet('resource/v1', params);
    }

    function retrieveResourcesList() {
        return iodHttpService.doApiGet('resource/v1');
    }
}

angular
    .module('iod-client')
    .factory('iodQueryProfileService', IodQueryProfileService);

IodQueryProfileService.$inject = ['$log', 'iodHttpService'];

/* @ngInject */
function IodQueryProfileService($log, iodHttpService) {
    $log = $log.getInstance('IodQueryProfileService');

    var service = {
        createQueryProfile: createQueryProfile,
        deleteQueryProfile: deleteQueryProfile,
        updateQueryProfile: updateQueryProfile,
        retrieveQueryProfile: retrieveQueryProfile

    };

    return service;

    ////////////////

    function createQueryProfile(profileName, queryManipulationIndex, categories) {
        var queryProfileResrUrl = 'queryprofile/' + encodeURIComponent(profileName) + '/v1';

        var config = {
            query_manipulation_index: queryManipulationIndex,
            promotions_enabled: true,
            promotion_categories: categories,
            promotions_identified: true,
            synonyms_enabled: true,
            synonym_categories: categories,
            blacklists_enabled: true,
            blacklist_categories: categories
        };
        var data = new ReqBodyData();
        data.append(config);

        return iodHttpService.doApiPost(queryProfileResrUrl, data);
    }

    function deleteQueryProfile(profileName) {
        var queryProfileResrUrl = 'queryprofile/' + encodeURIComponent(profileName) + '/v1';
        var data = new ReqBodyData();
        return iodHttpService.doApiDelete(queryProfileResrUrl, data);
    }

    function updateQueryProfile(profileName) {
        var queryProfileResrUrl = 'queryprofile/' + encodeURIComponent(profileName) + '/v1';
        var data = new ReqBodyData();
        return iodHttpService.doApiPut(queryProfileResrUrl, data);
    }

    function retrieveQueryProfile(profileName) {
        var queryProfileResrUrl = 'queryprofile/' + encodeURIComponent(profileName) + '/v1';
        return iodHttpService.doApiGet(queryProfileResrUrl);
    }


}

angular
    .module('iod-client')
    .factory('iodSearchService', IodSearchService);

IodSearchService.$inject = ['$log', '$q', 'iodHttpService'];

/* @ngInject */
function IodSearchService($log, $q, iodHttpService) {
    var SEARCH_CONSTANTS = {
        MAX_PAGE_RESULTS: 10,
        ABSOLUTE_MAX_RESULTS: 20
    };

    var service = {
        queryTextIndex: queryTextIndex,
        retrieveIndexFields: retrieveIndexFields,
        findRelatedConcepts: findRelatedConcepts,
        isQueryPhraseValid:isQueryPhraseValid,
        listQueryProfiles: listQueryProfiles,
        getQueryResultsPageSize:getQueryResultsPageSize
    };

    return service;

    ////////////////

    function queryTextIndex(queryText, page, index, sortBy, date) {

        var queryParams = new ReqQueryParams();
        queryParams.append({'text': queryText});
        queryParams.append({'maxPageResults': SEARCH_CONSTANTS.MAX_PAGE_RESULTS});
        queryParams.append({'total_results': true});
        queryParams.append({'summary': 'context'});
        queryParams.append({'highlight': 'terms'});
        queryParams.append({'start_tag': '<span class="highlightedTerm" ">'});
        if (page) {
            var startVal = page * SEARCH_CONSTANTS.MAX_PAGE_RESULTS + 1;
            queryParams.append({'start': startVal});
            queryParams.append({'absolute_max_results': SEARCH_CONSTANTS.ABSOLUTE_MAX_RESULTS + startVal});

        } else {
            queryParams.append({'start': 1});
            queryParams.append({'absolute_max_results': SEARCH_CONSTANTS.ABSOLUTE_MAX_RESULTS});
        }
        if (index) {
            queryParams.append({'index': index});
        }
        if (sortBy) {
            queryParams.append({'sort': sortBy});
        }
        if (date) {
            queryParams.append({'min_date': date});
        }

        return iodHttpService.doApiGet('querytextindex/v1', queryParams)
    }

    function retrieveIndexFields(indexName) {
        var params = new ReqQueryParams();
        params.append({index: indexName});
        params.append({group_fields_by_type: true});
        return iodHttpService.doApiGet("textindex/query/fields/v1", params);
    }

    function findRelatedConcepts(text, index) {
        var params = new ReqQueryParams();
        params.append({text: text});
        if (index) {
            params.append({indexes :index});
        }
        return iodHttpService.doApiGet('findrelatedconcepts/v1', params);
    }

    function isQueryPhraseValid(text, page) {
        if (text.length == 0) {
            return false;
        } else if (page == null) {
            return false;

        }
        return true;
    }

    function listQueryProfiles() {
        return iodHttpService.doApiGet('queryprofile/v1');
    }

    function getQueryResultsPageSize(){
        return SEARCH_CONSTANTS.MAX_PAGE_RESULTS;
    }


}

angular
    .module('iod-client')
    .factory('iodDiscoveryService', IodDiscoveryService);

IodDiscoveryService.$inject = ['$log','iodHttpService'];

/* @ngInject */
function IodDiscoveryService($log,iodHttpService) {


    var service = {
        getConnectorAgentDownloadLinks: getConnectorAgentDownloadLinks
    };

    return service;

    ////////////////

    function getConnectorAgentDownloadLinks(flavors) {
        var params = new ReqQueryParams();
        if (flavors) {
            params.append({flavors: flavors})
        }
        return iodHttpService.doDiscoveryGet('downloadLinks', params);
    }


}

angular
	.module('iod-client')
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

'use strict';
/**
 *
 * @ngdoc service
 * @name iod-client.iodHttpService
 * @description
 * # iodHttpService
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
	.module('iod-client')
	.factory('iodHttpService', IodHttpService);

IodHttpService.$inject = ['$http', '$log', 'iodEnvConfigService'];

/* @ngInject */
function IodHttpService($http, $log, iodEnvConfigService) {
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
	 * @name iod-client.iodHttpService#doInfoGet
	 * @methodOf iod-client.iodHttpService
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
	 * @name iod-client.iodHttpService#doDiscoveryGet
	 * @methodOf iod-client.iodHttpService
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
	 * @name iod-client.iodHttpService#apiGet
	 * @methodOf iod-client.iodHttpService
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
	 * @name iod-client.iodHttpService#apiPost
	 * @methodOf iod-client.iodHttpService
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
	 * @name iod-client.iodHttpService#apiPost
	 * @methodOf iod-client.iodHttpService
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
	 * @name iod-client.iodHttpService#apiPut
	 * @methodOf iod-client.iodHttpService
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
	 * @name iod-client.iodHttpService#apiDelete
	 *@methodOf iod-client.iodHttpService
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

angular
	.module('iod-client')
	.factory('iodInfoService', IodInfoService);

IodInfoService.$inject = ['$log', 'iodHttpService'];

/* @ngInject */
function IodInfoService($log, iodHttpService) {
	$log = $log.getInstance('IodInfoService');

	var service = {
		getProjectQuotas: getProjectQuotas,
		getIndexFlavorsQuota: getIndexFlavorsQuota
	};

	return service;

	////////////////

	function getProjectQuotas() {
		return iodHttpService.doInfoGet('quota/project/');
	}

	function getIndexFlavorsQuota() {
		return iodHttpService.doInfoGet('quota/indexflavors/');
	}


}

angular
    .module('iod-client')
    .factory('iodStatisticsService', IodStatisticsService);

IodStatisticsService.$inject = ['$log','iodHttpService'];

/* @ngInject */
function IodStatisticsService($log,iodHttpService) {
    $log = $log.getInstance('IodStatisticsService');

    var service = {
        getApplicationUsers:getApplicationUsers,
        getIndexDocTypesCount: getIndexDocTypesCount
    };

    return service;

    ////////////////

    function getApplicationUsers(){
        return iodHttpService.doApiGet('application/user/v1');
    }

    function getIndexDocTypesCount(indexName) {
        var queryParams = new ReqQueryParams();
        queryParams.append({indexes: indexName});
        queryParams.append({field_name:"content_type"});
        queryParams.append({document_count: true});

        $log.debug('Calling getIndexDocTypesCount');
        return iodHttpService.doApiGet('textindex/query/parametricvalues/v1', queryParams);
    }
}
