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
