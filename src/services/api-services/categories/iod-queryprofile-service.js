/**
 * Created by avidan on 11-05-15.
 */
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
