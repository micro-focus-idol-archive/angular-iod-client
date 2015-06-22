/**
 * Created by avidan on 01-05-15.
 */
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
