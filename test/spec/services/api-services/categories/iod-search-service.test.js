/**
 * Created by avidan on 07-05-15.
 */
describe('IOD-Search-Service test', function () {

    var scope,
        rootScope,
        $q,
        iodHttpServiceMock,
        serviceUnderTest;

    beforeEach(angular.mock.module("iod-client"));

    beforeEach(module("iod-client", function ($provide) {
        iodHttpServiceMock = jasmine.createSpyObj('iodHttpService', ['']);
        $provide.value('iodHttpService', iodHttpServiceMock);
    }));


    beforeEach(
        inject(function ($rootScope, _$q_, iodSearchService) {
            rootScope = $rootScope;
            scope = rootScope.$new();
            serviceUnderTest = iodSearchService;
            $q = _$q_;
        }));

    beforeEach(function () {
        iodHttpServiceMock.doApiGet = createIODConnectorMockSpyFunction($q, "doApiGet", {});
    })

    var SEARCH_CONSTANT = {
        MAX_PAGE_RESULTS: 10,
        ABSOLUTE_MAX_RESULTS: 20
    }

    describe('validate the service init', function () {

        it('service\'s methods should be defined', function () {
            expect(serviceUnderTest.queryTextIndex).toBeDefined();
            expect(serviceUnderTest.retrieveIndexFields).toBeDefined();
            expect(serviceUnderTest.findRelatedConcepts).toBeDefined();
        });

    });

    describe('validate the service flow', function () {

        it('should call the queryTextIndex and validate simple flow', function () {

            var queryText = 'foo'
            var wantedQueryParams = new ReqQueryParams();
            wantedQueryParams.append(
                {
                    text: queryText,
                    maxPageResults: 10,
                    total_results: true,
                    summary: 'context',
                    highlight: 'terms',
                    start_tag: '<span class="highlightedTerm" ">',
                    start: 1,
                    absolute_max_results: SEARCH_CONSTANT.ABSOLUTE_MAX_RESULTS
                })

            serviceUnderTest.queryTextIndex(queryText);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith('querytextindex/v1', wantedQueryParams)
        });

        it('should call the queryTextIndex with one index and validate flow', function () {

            var queryText = 'foo';
            var indexName = 'koo';
            var wantedQueryParams = new ReqQueryParams();
            wantedQueryParams.append(
                {
                    text: queryText,
                    maxPageResults: 10,
                    total_results: true,
                    summary: 'context',
                    highlight: 'terms',
                    start_tag: '<span class="highlightedTerm" ">',
                    start: 1,
                    absolute_max_results: SEARCH_CONSTANT.ABSOLUTE_MAX_RESULTS,
                    index:indexName
                })

            serviceUnderTest.queryTextIndex(queryText, 0,indexName);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith('querytextindex/v1', wantedQueryParams)
        });

        it('should call the queryTextIndex with index array and validate flow', function () {

            var queryText = 'foo';
            var indexName = ['foo','koo'];
            var wantedQueryParams = new ReqQueryParams();
            wantedQueryParams.append(
                {
                    text: queryText,
                    maxPageResults: 10,
                    total_results: true,
                    summary: 'context',
                    highlight: 'terms',
                    start_tag: '<span class="highlightedTerm" ">',
                    start: 1,
                    absolute_max_results: SEARCH_CONSTANT.ABSOLUTE_MAX_RESULTS,
                    index:indexName
                })

            serviceUnderTest.queryTextIndex(queryText, 0,indexName);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith('querytextindex/v1', wantedQueryParams)
        });

        it('should call the queryTextIndex with all of the arguments and validate flow', function () {

            var queryText = 'foo';
            var indexName = ['foo','koo'];
            var sort = 'aa';
            var date = 'bb';
            var wantedQueryParams = new ReqQueryParams();
            wantedQueryParams.append(
                {
                    text: queryText,
                    maxPageResults: 10,
                    total_results: true,
                    summary: 'context',
                    highlight: 'terms',
                    start_tag: '<span class="highlightedTerm" ">',
                    start: 1,
                    absolute_max_results: SEARCH_CONSTANT.ABSOLUTE_MAX_RESULTS,
                    index:indexName,
                    sort:sort,
                    min_date:date
                })

            serviceUnderTest.queryTextIndex(queryText, 0,indexName, sort,date);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith('querytextindex/v1', wantedQueryParams)
        });

        it('should call the queryTextIndex and with paging validate simple flow', function () {

            var queryText = 'foo';
            var page = 30;

            var startVal = page * SEARCH_CONSTANT.MAX_PAGE_RESULTS +1

            var wantedQueryParams = new ReqQueryParams();
            wantedQueryParams.append(
                {
                    text: queryText,
                    maxPageResults: 10,
                    total_results: true,
                    summary: 'context',
                    highlight: 'terms',
                    start_tag: '<span class="highlightedTerm" ">',
                    start: startVal,
                    absolute_max_results: SEARCH_CONSTANT.ABSOLUTE_MAX_RESULTS + startVal
                })

            serviceUnderTest.queryTextIndex(queryText, page);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith('querytextindex/v1', wantedQueryParams)
        });
    });

});
