/**
 * Created by avidan on 12-05-15.
 */
angular
    .module('hod-client')
    .factory('iodDiscoveryService', IodDiscoveryService);

IodDiscoveryService.$inject = ['$log','hodHttpService'];

/* @ngInject */
function IodDiscoveryService($log,hodHttpService) {


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
        return hodHttpService.doDiscoveryGet('downloadLinks', params);
    }


}
