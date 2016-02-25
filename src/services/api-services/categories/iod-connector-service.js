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
	.module('hod-client')
	.factory('iodConnectorService', IodConnectorService);

IodConnectorService.$inject = ['hodHttpService', '$log'];

/* @ngInject */
function IodConnectorService(hodHttpService, $log) {
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
		return hodHttpService.doApiPost(connectorResUrl, params);
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
		return hodHttpService.doApiGet(connectorResUrl, reqParams);
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
		return hodHttpService.doApiGet(connectorResUrl, params);
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
		return hodHttpService.doApiGet(connectorResUrl, params);
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
		return hodHttpService.doApiPost(connectorResUrl, bodyParams);
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
		return hodHttpService.doApiPost(connectorResUrl, params);
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
		return hodHttpService.doApiPost(connectorResUrl,params);
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
		return hodHttpService.doApiPost(connectorResUrl,params);
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
		return hodHttpService.doApiGet(connectorResUrl,params);
	}

}
