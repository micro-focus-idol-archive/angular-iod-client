'use strict';
/**
 * @ngdoc service
 * @name hod-client.hodIndexService
 * @description
 * # hodIndexService
 * Wraps API calls for the HOD's Text Index APIs.
 *
 * For more information about connectors see [Connectors](https://dev.havenondemand.com/docs/HowTo_Index.html)
 */
angular
	.module('hod-client')
	.factory('iodIndexService', HodIndexService);

HodIndexService.$inject = ['$log', '$q', 'hodHttpService'];

/* @ngInject */
function HodIndexService($log, $q, hodHttpService) {

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

	/**
	 * @ngdoc
	 * @name hod-client.hodIndexService#createIndex
	 * @methodOf hod-client.hodIndexService
	 *
	 * @param {string} indexName The name of the index to create.
	 * @param {string} indexFlavor The configuration flavor of the text index. See [Index Flavors](https://dev.havenondemand.com/docs/IndexFlavors.html). Default value: explorer.
	 * @param {string=} indexDesc A brief description of the index.
	 * @param {json=} indexFields Custom fields that you want to define with the Index field type. Index fields contain document content, which receives linguistic processing for keyword and conceptual search. This parameter is relevant only for Standard, Custom Fields, Explorer and Jumbo flavors.
	 * @param {json=} parametricFields Custom fields that you want to define with the Parametric field type. Parametric fields contain values that you want to use for search filtering and exact matches. This parameter is relevant only for Standard, Categorization, Custom Fields, Explorer and Jumbo flavors.
	 * @param {string=} expirationTime Custom fields that you want to define with the Expire Date field type. Expire Date fields contain a date that you want to use to automatically expire the document. Expire This parameter is relevant only for the Custom_Fields flavor.
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function createIndex(indexName, indexFlavor, indexDesc, indexFields, parametricFields, expirationTime) {
		var indexResrUrl = 'createtextindex/v1';

		var data = new ReqQueryParams()
		data.append({
			index:indexName,
			flavor: indexFlavor,
			description: indexDesc,
			//index_fields: JSON.stringify(indexFields),
			index_fields: indexFields,
			//parametric_fields: JSON.stringify(parametricFields),
			parametric_fields: parametricFields,
			expiretime: expirationTime
		});

		return hodHttpService.doApiGet(indexResrUrl, data);
	}


	/**
	 * @ngdoc
	 * @name hod-client.hodIndexService#deleteIndex
	 * @methodOf hod-client.hodIndexService
	 *
	 * @param {string} indexName The name of the index to delete.
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function deleteIndex(indexName) {
		var deferd = $q.defer();
		{
			var indexResrUrl = 'deletetextindex/v1'
			var reqParams = new ReqQueryParams({index: encodeURIComponent(indexName)})
			hodHttpService.doApiGet(indexResrUrl, reqParams).success(function (data) {
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
		params.append({index: encodeURIComponent(indexName)});
		params.append({confirm: confirmation});

		var indexResrUrl = 'deletetextindex/v1'
		return hodHttpService.doApiGet(indexResrUrl, params);
	}

	function restoreIndex() {
	}

	/**
	 * @ngdoc
	 * @name hod-client.hodIndexService#addToTextIndex
	 * @methodOf hod-client.hodIndexService
	 *
	 * @param {string} indexName The name of the index
	 * @param {File} file The file to upload
	 * @param {json=} requestConfigObj additional optional configurations as describe in the API page
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
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

				hodHttpService.doApiPostWithoutDataValidation(indexResrUrl, fd, null, reqConfig)
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


	/**
	 * @ngdoc
	 * @name hod-client.hodIndexService#indexStatus
	 * @methodOf hod-client.hodIndexService
	 *
	 * @param {string} indexName The name of the index
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function indexStatus(indexName) {
		var indexResrUrl = 'indexstatus/v1'
		var reqParams = new ReqQueryParams({index: encodeURIComponent(indexName)})
		return hodHttpService.doApiGet(indexResrUrl,reqParams)
	}

	/**
	 * @ngdoc
	 * @name hod-client.hodIndexService#retrieveIndexesList
	 * @methodOf hod-client.hodIndexService
	 *
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function retrieveIndexesList() {
		var params = new ReqQueryParams();
		params.append({"type": INDEX_CONSTANTS.INDEX_TYPES.INDEX});
		params.append({"flavor": INDEX_CONSTANTS.INDEX_FLAVORS.STANDARD});
		return hodHttpService.doApiGet('listresources/v1', params);
	}

	/**
	 * @ngdoc
	 * @name hod-client.hodIndexService#retrieveResourcesList
	 * @methodOf hod-client.hodIndexService
	 *
	 * @returns {httpPromise} resolve with fetched data, or fails with error description.
	 */
	function retrieveResourcesList() {
		return hodHttpService.doApiGet('listresources/v1');
	}
}
