/**
 * Created by avidan on 02-06-15.
 */
describe('IOD-Measure-API Service test', function () {
    var scope,
        rootScope,
        $q,
        iodHttpServiceMock,
        $logMock,
        serviceUnderTest;

    var MEASURES_API_SUFFIX = 'eventsmeasurestatistics/v1';
    var MAX_PAGE_RESULTS = 50;
    var MEASURE_NAMES = {
        TOTAL_DOCS: "total_documents",
        INDEX_SIZE: "total_index_size",
        TERM_HIT: "term_hit",
        QUERY_ZERO_HIT: "query_zero_hit_term",
        PROMOTION_HIT: "promotion_hit"
    };
    var FUNC_TYPES = {
        LAST: "last_by_object_name",
        NONE: "none"
    };

     beforeEach(angular.mock.module('iod-client'));


    beforeEach(module("iod-client", function ($provide) {
        iodHttpServiceMock = jasmine.createSpyObj('iodHttpService', ['']);
        iodHttpServiceMock.doApiGet = jasmine.createSpy('doApiGet');

        $logMock = jasmine.createSpyObj('logMock', ['']);
        $logMock.getInstance = jasmine.createSpy('getInstance').and.returnValue({
            debug: function () {
            }, error: function () {
            }
        });
        $provide.value('iodHttpService', iodHttpServiceMock);
        $provide.value('$log', $logMock);
    }));

    beforeEach(inject(function ($rootScope, _$q_, iodMeasureService) {
        rootScope = $rootScope;
        scope = rootScope.$new();
        $q = _$q_;
        serviceUnderTest = iodMeasureService;
    }));

    describe('validate the service init', function () {
        it('service\'s methods should be defined', function () {
            expect(serviceUnderTest).toBeDefined();
            expect(serviceUnderTest.getZeroHitTermsForPeriod).toBeDefined();
            expect(serviceUnderTest.getZeroHitTerms).toBeDefined();
            expect(serviceUnderTest.getTopPromotions).toBeDefined();
            expect(serviceUnderTest.getPopularSearchTerms).toBeDefined();
            expect(serviceUnderTest.getRecentDocCountForIndexGroupByPeriod).toBeDefined();
            expect(serviceUnderTest.getRecentDocCountUntilDatePerIndex).toBeDefined();
            expect(serviceUnderTest.getRecentIndexSizePerIndexGroupByPeriod).toBeDefined();
            expect(serviceUnderTest.getRecentIndexSizePerIndex).toBeDefined();
            expect(serviceUnderTest.getIndexSizeGroupByPeriod).toBeDefined();
        });
    });

    describe('validate the getZeroHitTermsForPeriod method', function (){
        it('should call to the doGet with basic arguments', function (){
            var date = new Date();
            serviceUnderTest.getZeroHitTermsForPeriod(date);
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.QUERY_ZERO_HIT);
            measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
            measureEventsParams.addMinDateParam(date);
            measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
            measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.TIME_ASC);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith(MEASURES_API_SUFFIX , measureEventsParams);
        });

        it('should call to the doGet with groupByPeriod arguments', function (){
            var date = new Date();
            var groupByPeriod = true;
            serviceUnderTest.getZeroHitTermsForPeriod(date,groupByPeriod);
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.QUERY_ZERO_HIT);
            measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
            measureEventsParams.addGroupByPeriodParam(groupByPeriod);
            measureEventsParams.addMinDateParam(date);
            measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
            measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.TIME_ASC);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith(MEASURES_API_SUFFIX , measureEventsParams);
        });

        it('should throw an exception since minDate wasn\'t supplied', function (){
            expect(function (){serviceUnderTest.getZeroHitTermsForPeriod()}).toThrow()
        });
    });

    describe('validate the getZeroHitTerms method', function (){
        it('should call the doGet with basic arguments', function(){
            serviceUnderTest.getZeroHitTerms();
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.QUERY_ZERO_HIT);
            measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
            measureEventsParams.addShouldGroupByStringValueParam(true);
            measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith(MEASURES_API_SUFFIX , measureEventsParams);
        });

        it('should call the doGet with period argument', function(){
            var period ='month';
            serviceUnderTest.getZeroHitTerms(period);
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.QUERY_ZERO_HIT);
            measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
            measureEventsParams.addMinDateParamPeriodAgo(period);
            measureEventsParams.addShouldGroupByStringValueParam(true);
            measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalled();
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[0]).toMatch(MEASURES_API_SUFFIX);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.min_date).toBeDefined();
        });
    });

    describe('validate the getTopPromotions method', function (){
        it('should call the doGet with basic arguments', function(){
            serviceUnderTest.getTopPromotions();
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.PROMOTION_HIT);
            measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
            measureEventsParams.addShouldGroupByObjectNameParam(true);
            measureEventsParams.addShouldGroupByStringValueParam(true);
            measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith(MEASURES_API_SUFFIX , measureEventsParams);
        });

        it('should call the doGet with period argument', function(){
            var period ='month';
            serviceUnderTest.getTopPromotions(period);
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.PROMOTION_HIT);
            measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
            measureEventsParams.addMinDateParamPeriodAgo(period);
            measureEventsParams.addShouldGroupByObjectNameParam(true);
            measureEventsParams.addShouldGroupByStringValueParam(true);
            measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[0]).toMatch(MEASURES_API_SUFFIX);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.min_date).toBeDefined();
        });
    });

    describe('validate the getPopularSearchTerms method', function (){
        it('should call the doGet with basic arguments', function(){
            serviceUnderTest.getPopularSearchTerms();
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.TERM_HIT);
            measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
            measureEventsParams.addShouldGroupByStringValueParam(true);
            measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith(MEASURES_API_SUFFIX , measureEventsParams);
        });

        it('should call the doGet with period argument', function(){
            var period ='month';
            serviceUnderTest.getPopularSearchTerms(period);
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.TERM_HIT);
            measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
            measureEventsParams.addMinDateParamPeriodAgo(period);
            measureEventsParams.addShouldGroupByStringValueParam(true);
            measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[0]).toMatch(MEASURES_API_SUFFIX);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.min_date).toBeDefined();
        });
    });

    describe('validate the getRecentDocCountForIndexGroupByPeriod method', function (){
        it('should call the doGet with basic arguments', function(){
            var startDate = new Date();
            serviceUnderTest.getRecentDocCountForIndexGroupByPeriod(undefined,startDate, undefined);
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.TOTAL_DOCS);
            measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
            measureEventsParams.addMinDateParam(startDate);
            measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith(MEASURES_API_SUFFIX , measureEventsParams);
        });

        it('should call the doGet with indexName argument', function(){
            var indexName = 'foo';
            var startDate = new Date();
            serviceUnderTest.getRecentDocCountForIndexGroupByPeriod(indexName,startDate, undefined);
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.TOTAL_DOCS);
            measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
            measureEventsParams.addMinDateParam(startDate);
            measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
            measureEventsParams.addObjectNameParam(indexName);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith(MEASURES_API_SUFFIX , measureEventsParams);
        });

        it('should call the doGet with groupByPeriod argument', function(){
            var indexName = undefined;
            var startDate = new Date();
            var groupByPeriod = true;
            serviceUnderTest.getRecentDocCountForIndexGroupByPeriod(indexName,startDate, groupByPeriod);
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.TOTAL_DOCS);
            measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
            measureEventsParams.addMinDateParam(startDate);
            measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
            measureEventsParams.addGroupByPeriodParam(groupByPeriod);

            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith(MEASURES_API_SUFFIX , measureEventsParams);
        });

        it('should throw an exception since startDate wasn\'t supplied', function (){
            expect(function (){serviceUnderTest.getRecentDocCountForIndexGroupByPeriod()}).toThrow()
        });
    });

    describe('validate the getRecentIndexSizePerIndexGroupByPeriod method', function () {
        it('should call the doGet with basic arguments', function () {
            var startDate = new Date();
            serviceUnderTest.getRecentIndexSizePerIndexGroupByPeriod(startDate, undefined);
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.INDEX_SIZE);
            measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
            measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalled();
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[0]).toEqual(MEASURES_API_SUFFIX);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.min_date).toBeDefined();
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.measure_name).toEqual(measureEventsParams.params.measure_name);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.function).toEqual(measureEventsParams.params.function);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.max_page_results).toEqual(measureEventsParams.params.max_page_results);
        });
    });

    describe('validate the getRecentIndexSizePerIndex method', function () {
        it('should call the doGet with basic arguments', function () {
            var maxDate = new Date();
            var indexName = undefined;
            serviceUnderTest.getRecentIndexSizePerIndex(indexName,maxDate);
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.INDEX_SIZE);
            measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
            measureEventsParams.addShouldGroupByObjectNameParam(true);
            measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
            measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);

            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalled();
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[0]).toEqual(MEASURES_API_SUFFIX);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.max_date).toBeDefined();
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.measure_name).toEqual(measureEventsParams.params.measure_name);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.function).toEqual(measureEventsParams.params.function);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.max_page_results).toEqual(measureEventsParams.params.max_page_results);
        });

        it('should call the doGet with indexName argument', function () {
            var maxDate = new Date();
            var indexName = 'foo';
            serviceUnderTest.getRecentIndexSizePerIndex(indexName,maxDate);
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.INDEX_SIZE);
            measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
            measureEventsParams.addShouldGroupByObjectNameParam(true);
            measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
            measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);
            measureEventsParams.addObjectNameParam(indexName);

            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalled();
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[0]).toEqual(MEASURES_API_SUFFIX);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.max_date).toBeDefined();
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.measure_name).toEqual(measureEventsParams.params.measure_name);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.function).toEqual(measureEventsParams.params.function);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.max_page_results).toEqual(measureEventsParams.params.max_page_results);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.indexName).toEqual(measureEventsParams.params.indexName);
        });
    });

    describe('validate the getIndexSizeGroupByPeriod method', function () {
        it('should call the doGet with basic arguments', function () {
            var minDate = new Date();
            var indexName = undefined;
            serviceUnderTest.getIndexSizeGroupByPeriod(indexName, minDate);
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.INDEX_SIZE);
            measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
            measureEventsParams.addShouldGroupByObjectNameParam(true);
            measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
            measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);

            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalled();
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[0]).toEqual(MEASURES_API_SUFFIX);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.min_date).toBeDefined();
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.measure_name).toEqual(measureEventsParams.params.measure_name);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.function).toEqual(measureEventsParams.params.function);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.max_page_results).toEqual(measureEventsParams.params.max_page_results);
        });

        it('should call the doGet with indexName arguments', function () {
            var minDate = new Date();
            var indexName = 'foo';
            serviceUnderTest.getIndexSizeGroupByPeriod(indexName, minDate);
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.INDEX_SIZE);
            measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
            measureEventsParams.addShouldGroupByObjectNameParam(true);
            measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
            measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);

            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalled();
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[0]).toEqual(MEASURES_API_SUFFIX);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.min_date).toBeDefined();
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.measure_name).toEqual(measureEventsParams.params.measure_name);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.function).toEqual(measureEventsParams.params.function);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.max_page_results).toEqual(measureEventsParams.params.max_page_results);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.max_page_results).toEqual(measureEventsParams.params.max_page_results);

        });

        it('should call the doGet with groupByPeriod arguments', function () {
            var minDate = new Date();
            var indexName = undefined;
            var groupByPeriod = true;
            serviceUnderTest.getIndexSizeGroupByPeriod(indexName, minDate,groupByPeriod);
            var measureEventsParams = new MeasureQueryParams();
            measureEventsParams.addMeasureNameParam(MEASURE_NAMES.INDEX_SIZE);
            measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
            measureEventsParams.addShouldGroupByObjectNameParam(true);
            measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
            measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);
            measureEventsParams.addGroupByPeriodParam(groupByPeriod);

            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalled();
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[0]).toEqual(MEASURES_API_SUFFIX);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.min_date).toBeDefined();
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.measure_name).toEqual(measureEventsParams.params.measure_name);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.function).toEqual(measureEventsParams.params.function);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.max_page_results).toEqual(measureEventsParams.params.max_page_results);
            expect(iodHttpServiceMock.doApiGet.calls.mostRecent().args[1].params.group_by_period).toEqual(measureEventsParams.params.group_by_period);
        });
    });


});
