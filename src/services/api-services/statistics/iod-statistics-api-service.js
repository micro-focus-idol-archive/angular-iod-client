angular
    .module('hod-client')
    .factory('iodStatisticsService', IodStatisticsService);

IodStatisticsService.$inject = ['$log','hodHttpService'];

/* @ngInject */
function IodStatisticsService($log,hodHttpService) {

    var service = {
        getApplicationUsers:getApplicationUsers,
        getIndexDocTypesCount: getIndexDocTypesCount
    };

    return service;

    ////////////////

    function getApplicationUsers(){
        return hodHttpService.doApiGet('application/user/v1');
    }

    function getIndexDocTypesCount(indexName) {
        var queryParams = new ReqQueryParams();
        queryParams.append({indexes: indexName});
        queryParams.append({field_name:"content_type"});
        queryParams.append({document_count: true});

        $log.debug('Calling getIndexDocTypesCount');
        return hodHttpService.doApiGet('textindex/query/parametricvalues/v1', queryParams);
    }
}
