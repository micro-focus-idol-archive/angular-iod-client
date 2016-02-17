/**
 * Created by avidan on 12-05-15.
 */
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
