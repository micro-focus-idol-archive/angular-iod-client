'use strict';
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
/**
 * Define the  MeasureQueryParams constructor
 * @param params
 * @constructor
 */
function EventsQueryParams(params) {
    // calling super constructor
    StatisticsQueryParams.call(this, params);
}

// Create a MeasureQueryParams.prototype object that inherits from StatisticsQueryParams.prototype.
EventsQueryParams.prototype = Object.create(StatisticsQueryParams.prototype);

// Set the "constructor" property to refer to MeasureQueryParams
EventsQueryParams.prototype.constructor = EventsQueryParams;

EventsQueryParams.prototype.addParamNameParam = function (paramName) {
    this.append({param_name: paramName});
};

EventsQueryParams.prototype.addParamValueParam = function (paramValue) {
    this.append({param_value: paramValue});
};

EventsQueryParams.prototype.addAggregationFuncParam = function (aggrFunc) {
    this.append({aggregation_function: aggrFunc});
};

EventsQueryParams.prototype.addShouldGroupByApiValueParam = function (shouldGroupByApiValue) {
    this.append({group_by_param_value: shouldGroupByApiValue});
};

/**
 * Define the  MeasureQueryParams constructor
 * @param params
 * @constructor
 */
function MeasureQueryParams(params) {
    // calling super constructor
    StatisticsQueryParams.call(this, params);
}

// Create a MeasureQueryParams.prototype object that inherits from StatisticsQueryParams.prototype.
MeasureQueryParams.prototype = Object.create(StatisticsQueryParams.prototype);

// Set the "constructor" property to refer to MeasureQueryParams
MeasureQueryParams.prototype.constructor = MeasureQueryParams;

MeasureQueryParams.prototype.addObjectNameParam = function (paramName) {
    this.append({object_name: paramName});
};

MeasureQueryParams.prototype.addMeasureNameParam = function (paramName) {
    this.append({measure_name: paramName});
};

MeasureQueryParams.prototype.addFuncParam = function (aggrFunc) {
    this.append({function: aggrFunc});
};

MeasureQueryParams.prototype.addShouldGroupByObjectNameParam = function (shouldGroupByObjectName) {
    this.append({group_by_object_name: shouldGroupByObjectName});
};

MeasureQueryParams.prototype.addShouldGroupByStringValueParam = function (shouldGroupByStringValue) {
    this.append({group_by_string_value: shouldGroupByStringValue});
};

MeasureQueryParams.prototype.addMinDateParamPeriodAgo = function (period) {
    if (period !== undefined) {
        var minDate = moment().subtract(1, period).toISOString();
        this.append({min_date: minDate});
    }
};


function StatisticsQueryParams(params) {
    // calling super constructor
    ReqQueryParams.call(this, params);
}

// Create a StatisticsQueryParams.prototype object that inherits from ReqQueryParams.prototype.
StatisticsQueryParams.prototype = Object.create(ReqQueryParams.prototype);

// Set the "constructor" property to refer to StatisticsQueryParams
StatisticsQueryParams.prototype.constructor = StatisticsQueryParams;


StatisticsQueryParams.PERIODS = {DAY: 'day', WEEK: 'week', MONTH: 'month'};

StatisticsQueryParams.AGGR_FUNC_TYPES = {
    COUNT: "count(*)",
    SUM: "sum(measure)",
    MAX: "max(measure)",
    MIN: "min(measure)",
    AVG: "avg(measure)"
};

StatisticsQueryParams.SORT_OPTIONS = {
    ASC: "measure_asc",
    DESC: "measure_desc",
    TIME_ASC: "time_granularity_asc",
    TIME_DESC: "time_granularity_desc"
};

StatisticsQueryParams.prototype.addApiNameParam = function (apiName) {
    this.append({api_name: apiName});
};

StatisticsQueryParams.prototype.addGroupByPeriodParam = function (groupByPeriod) {
    this.append({group_by_period: groupByPeriod});
};

StatisticsQueryParams.prototype.addGroupByUserId = function (groupByUser) {
    this.append({group_by_user_id: groupByUser});
};

StatisticsQueryParams.prototype.addShouldGroupByApiNameParam = function (shouldGroupByApiName) {
    this.append({group_by_api_name: shouldGroupByApiName});
};

StatisticsQueryParams.prototype.addMinDateParamPeriodAgo = function (period) {
    if (period !== undefined) {
        var minDate = moment().subtract(1, period).toISOString();
        this.append({min_date: minDate});
    }
};

StatisticsQueryParams.prototype.addMaxDateParam = function (date) {
    if (date !== undefined && (_.isDate(date) || date._isAMomentObject)) {
        var maxDate = date.toISOString();
        this.append({max_date: maxDate});
    }else {
        throw new Error('date argument is invalid');
    }
};

StatisticsQueryParams.prototype.addMinDateParam = function (date) {
    if (date !== undefined && (_.isDate(date) || date._isAMomentObject)) {
        var minDate = date.toISOString();
        this.append({min_date: minDate});
    } else {
        throw new Error('date argument is invalid');
    }
};

StatisticsQueryParams.prototype.addPageNumberParam = function (pageNumber) {
    this.append({page_number: pageNumber});
};

StatisticsQueryParams.prototype.addMaxPageResultsParam = function (maxPageResults) {
    this.append({max_page_results: maxPageResults});
};

StatisticsQueryParams.prototype.addSortByParam = function (sortBy) {
    this.append({sort_by: sortBy});
};

StatisticsQueryParams.prototype.addShouldGroupByUserIdParam = function (shouldGroupByUserId) {
    this.append({group_by_user_id: shouldGroupByUserId});
};

StatisticsQueryParams.prototype.addShouldGroupByApiKey = function (shouldGroupByApiKey) {
    this.append({group_by_api_key: shouldGroupByApiKey});
};
angular
  .module('iod-client')
  .factory('iodConnectorServiceNew', IodConnectorService);

IodConnectorService.$inject = ['iodHttpService', '$log'];

/* @ngInject */
function IodConnectorService(iodHttpService, $log) {
  $log = $log.getInstance('IodConnectorService');

  var CONNECTOR_FLAVORS = {
    WEB: 'web_cloud',
    FS: 'filesystem_onsite',
    SHAREPOINT: "remote_sharepoint_onsite",
    DROPBOX: "dropbox_cloud"
  };

  var ACTIONS = {
    ADD_TO_INDEX: "addtotextindex"
  };

  /* var SUPPORTED_CONNECTOR_TYPES= {
   WEB: "web"
   };
   */
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

  function createConnector(connectorType, connectorName, url, indexName, interval, units, occurrences, advancedConnectorParams, credentialsParams) {
    var connectorResUrl = 'connector/' + encodeURIComponent(connectorName) + '/v1';

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
    params.append({"config": config});
    params.append({"flavor": connectorType});
    params.append({"destination": dest});
    if (interval) {
      var scheduleVal = {"frequency": {"frequency_type": units, "interval": interval}};
      if (occurrences !== undefined && occurrences != "" && occurrences > 0)
        scheduleVal.occurrences = occurrences;
      //var schedule = JSON.stringify(scheduleVal);
      var schedule = scheduleVal;
      params.append({"schedule": schedule});
    }
    if (credentialsParams && credentialsParams.credentials) {
      params.append({'credentials': credentialsParams.credentials});
      params.append({'credentials_license': credentialsParams.credentials_license});
      params.append({'credentials_policy': credentialsParams.credentials_policy});
    }
    return iodHttpService.doApiPost(connectorResUrl, params);
  }

  function deleteConnector(connectorName) {
    $log.debug("deleting connector {0}", [connectorName]);
    var connectorResUrl = 'connector/' + encodeURIComponent(connectorName) + '/v1';
    return iodHttpService.doApiDelete(connectorResUrl);
  }

  function retrieveConfig(connectorName) {
    $log.debug("retrieveConfig {0}", [connectorName]);

    var params = new ReqQueryParams();
    params.append({"output": "config_attributes"});
    var connectorResUrl = 'connector/' + encodeURIComponent(connectorName) + '/config/v1';
    return iodHttpService.doApiGet(connectorResUrl, params);
  }

  function connectorStatus(connectorName) {
    $log.debug("connectorStatus {0}", [connectorName]);
    var connectorResUrl = 'connector/' + encodeURIComponent(connectorName) + '/status/v1';
    return iodHttpService.doApiGet(connectorResUrl);
  }

  function updateConnector(connectorName, configObj, indexName, scheduleObj) {
    var connectorResUrl = 'connector/' + encodeURIComponent(connectorName) + '/v1';

    var bodyParams = new ReqBodyData();
    if (configObj !== null && configObj !== undefined) {
      bodyParams.append({config: configObj});
    }
    if (scheduleObj.enabled) {
      var schedule = {"frequency": {"frequency_type": scheduleObj.units, "interval": scheduleObj.interval}}
      if (scheduleObj.limitOccurrences)
        schedule.occurrences = scheduleObj.occurrences;
      bodyParams.append({schedule: schedule});
    }
    if (indexName != undefined) {
      var dest = {"action": ACTIONS.ADD_TO_INDEX, "index": indexName};
      bodyParams.append({destination: dest});
    }

    return iodHttpService.doApiPut(connectorResUrl, bodyParams);
  }

  function startConnector(connectorName, indexChanged) {
    var connectorResUrl = 'connector/' + encodeURIComponent(connectorName) + '/start/v1';
    var params = new ReqBodyData();
    if (indexChanged) {
      params.append({ignore_previous_state: true});
    }
    return iodHttpService.doApiPost(connectorResUrl, params);
  }

  function stopConnector(connectorName) {
    var connectorResUrl = 'connector/' + encodeURIComponent(connectorName) + '/stop/v1';
    return iodHttpService.doApiPost(connectorResUrl);
  }

  function cancelConnectorSchedule(connectorName) {
    var connectorResUrl = 'connector/' + encodeURIComponent(connectorName) + '/cancelschedule/v1';
    return iodHttpService.doApiPost(connectorResUrl, params);
  }

  function connectorHistory(connectorName) {
    var connectorResUrl = 'connector/' + encodeURIComponent(connectorName) + '/history/v1';
    return iodHttpService.doApiGet(connectorResUrl, params);
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

angular
    .module('iod-client')
    .factory('iodDiscoveryService', IodDiscoveryService);

IodDiscoveryService.$inject = ['$log','iodHttpService'];

/* @ngInject */
function IodDiscoveryService($log,iodHttpService) {

    $log = $log.getInstance('IodDiscoveryService');

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

IodEnvConfigService.$inject = ['envConfig', '$log'];

/* @ngInject */
function IodEnvConfigService(envConfig, $log) {
  $log = $log.getInstance("IodEnvConfigService");
  var isConfigValid = true;
  var IOD_HOST_URL;
  var IOD_PORTAL_URL;


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

  function isEnvConfigValid() {
    return isConfigValid;
  }

}

angular
  .module('iod-client')
  .factory('iodHttpService', IodHttpService);

IodHttpService.$inject = ['$http', '$log', 'iodEnvConfigService', 'iodSessionToken'];

/* @ngInject */
function IodHttpService($http, $log, iodEnvConfigService, iodSessionToken) {
  $log = $log.getInstance("IodHttpService");
  var that = this;
  that.sessionToken = null;

  var API_LEVEL = 2; // IOD API level, updated to level 2 to support SSO communication
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

    doDiscoveryGet: doDiscoveryGet,

    doGet: doGet,
    doPost: doPost,
    doPut: doPut,
    doDelete: doDelete
  };


  return service;

  ////////////////

  function appendSessionToken(queryParams) {
    queryParams.append({token: iodSessionToken.getSessionToken()});
  }

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
    return doGet(urlPrefix, queryParams);
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
    return doPost(urlPrefix, data, queryParams)
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
      data: data
    }, reqConfigObj);
    return $http(reqConfig);
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
    return doPut(urlPrefix, queryParams, data)
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
    return doDelete(urlPrefix, queryParams, data)
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

angular
    .module('iod-client')
    .factory('iodInfoService', IodInfoService);

IodInfoService.$inject = ['$log','iodHttpService'];

/* @ngInject */
function IodInfoService($log,iodHttpService) {
    $log = $log.getInstance('IodInfoService');

    var service = {
        getProjectQuotas : getProjectQuotas,
        getIndexFlavorsQuota : getIndexFlavorsQuota
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

angular
  .module('iod-client')
  .factory('iodEventsService', IodEventsService);

IodEventsService.$inject = ['$log', 'iodHttpService'];

/* @ngInject */
function IodEventsService($log, iodHttpService) {
  $log = $log.getInstance('IodEventsService');

  var EVENTS_API_SUFFIX = 'eventsapistatistics/v1';

  var service = {
    getSearchUseCount: getSearchUseCount,
    getActiveUsers: getActiveUsers
  };

  return service;

  ////////////////

  function getSearchUseCount(minDate, groupByPeriod, indexName) {
    var apiEventsParams = new EventsQueryParams();
    apiEventsParams.addApiNameParam('querytextindex');
    apiEventsParams.addAggregationFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
    apiEventsParams.addGroupByPeriodParam(groupByPeriod);
    if (minDate != undefined)
      apiEventsParams.addMinDateParam(minDate);

    apiEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.TIME_ASC);
    if (indexName !== undefined) {
      apiEventsParams.addParamNameParam('indexes');
      apiEventsParams.addParamValueParam(indexName);
    }
    $log.debug('Calling eventsapistatistics for getSearchUseCount');
    return iodHttpService.doApiGet(EVENTS_API_SUFFIX, apiEventsParams);
  }

  function getActiveUsers() {
    var apiEventsParams = new EventsQueryParams();
    apiEventsParams.addApiNameParam('querytextindex');
    apiEventsParams.addAggregationFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
    apiEventsParams.addGroupByUserId(true);
    return iodHttpService.doApiGet(EVENTS_API_SUFFIX, apiEventsParams);
  }
}

angular
  .module('iod-client')
  .factory('iodMeasureService', IodMeasureService);

IodMeasureService.$inject = ['$log', 'iodHttpService'];

/* @ngInject */
function IodMeasureService($log, iodHttpService) {

  $log = $log.getInstance('IodMeasureService');
  var MEASURES_API_SUFFIX = 'eventsmeasurestatistics/v1';
  var FUNC_TYPES = {
    LAST: "last_by_object_name",
    NONE: "none"
  };

  var MEASURE_NAMES = {
    TOTAL_DOCS: "total_documents",
    INDEX_SIZE: "total_index_size",
    TERM_HIT: "term_hit",
    QUERY_ZERO_HIT: "query_zero_hit_term",
    PROMOTION_HIT: "promotion_hit"
  };

  var MAX_PAGE_RESULTS = 50;

  var service = {
    getZeroHitTermsForPeriod: getZeroHitTermsForPeriod,
    getZeroHitTerms: getZeroHitTerms,
    getTopPromotions: getTopPromotions,
    getPopularSearchTerms: getPopularSearchTerms,
    getRecentDocCountForIndexGroupByPeriod: getRecentDocCountForIndexGroupByPeriod,
    getRecentDocCountUntilDatePerIndex: getRecentDocCountUntilDatePerIndex,
    getRecentIndexSizePerIndexGroupByPeriod: getRecentIndexSizePerIndexGroupByPeriod,
    getRecentIndexSizePerIndex: getRecentIndexSizePerIndex,
    getIndexSizeGroupByPeriod: getIndexSizeGroupByPeriod
  };

  return service;

  ////////////////

  function getZeroHitTermsForPeriod(minDate, groupByPeriod) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.QUERY_ZERO_HIT);
    measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
    measureEventsParams.addGroupByPeriodParam(groupByPeriod);
    measureEventsParams.addMinDateParam(minDate);
    measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
    measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.TIME_ASC);

    $log.debug('Calling getZeroHitTermsForPeriod');
    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getZeroHitTerms(period) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.QUERY_ZERO_HIT);
    measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
    measureEventsParams.addMinDateParamPeriodAgo(period);
    measureEventsParams.addShouldGroupByStringValueParam(true);
    measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);

    $log.debug('Calling getZeroHitTerms');
    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getTopPromotions(period) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.PROMOTION_HIT);
    measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
    measureEventsParams.addMinDateParamPeriodAgo(period);
    measureEventsParams.addShouldGroupByObjectNameParam(true);
    measureEventsParams.addShouldGroupByStringValueParam(true);
    measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);

    $log.debug('Calling getTopPromotions');

    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getPopularSearchTerms(period) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.TERM_HIT);
    measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
    measureEventsParams.addMinDateParamPeriodAgo(period);
    measureEventsParams.addShouldGroupByStringValueParam(true);
    measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);

    $log.debug('Calling getPopularSearchTerms');
    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getRecentDocCountForIndexGroupByPeriod(indexName, startDate, groupByPeriod) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.TOTAL_DOCS);
    measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
    measureEventsParams.addGroupByPeriodParam(groupByPeriod);
    measureEventsParams.addMinDateParam(startDate);
    measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
    if (indexName !== undefined) {
      measureEventsParams.addObjectNameParam(indexName);
    }

    $log.debug('Calling getRecentDocCountForIndexGroupByPeriod');
    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getRecentDocCountUntilDatePerIndex(indexName, maxDate) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.TOTAL_DOCS);
    measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
    measureEventsParams.addShouldGroupByObjectNameParam(true);
    if (maxDate) {
      measureEventsParams.addMaxDateParam(maxDate);
    }
    if (indexName !== undefined) {
      measureEventsParams.addObjectNameParam(indexName);
    }

    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getRecentIndexSizePerIndexGroupByPeriod(startDate, groupByPeriod) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.INDEX_SIZE);
    measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
    measureEventsParams.addGroupByPeriodParam(groupByPeriod);
    if (startDate != undefined)
      measureEventsParams.addMinDateParam(startDate);
    measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);

    $log.debug('Calling getRecentIndexSizePerIndexGroupByPeriod');
    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getRecentIndexSizePerIndex(indexName, maxDate) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.INDEX_SIZE);
    measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
    measureEventsParams.addShouldGroupByObjectNameParam(true);
    if (maxDate !== undefined) {
      measureEventsParams.addMaxDateParam(maxDate);
    }
    if (indexName !== undefined) {
      measureEventsParams.addObjectNameParam(indexName);
    }
    measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
    measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);

    $log.debug('Calling getRecentIndexSizePerIndex');
    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getIndexSizeGroupByPeriod(indexName, minDate, groupByPeriod) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.INDEX_SIZE);
    measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
    measureEventsParams.addGroupByPeriodParam(groupByPeriod);
    measureEventsParams.addMinDateParam(minDate);
    measureEventsParams.addObjectNameParam(indexName);
    measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);

    $log.debug('Calling getIndexSizeGroupByPeriod');
    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
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
