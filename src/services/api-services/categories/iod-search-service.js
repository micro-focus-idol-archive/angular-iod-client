/**
 * Created by avidan on 07-05-15.
 */
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
