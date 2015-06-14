/**
 * Created by avidan on 10-05-15.
 */
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
