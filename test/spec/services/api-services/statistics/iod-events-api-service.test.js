/**
 * Created by avidan on 02-06-15.
 */
describe('IOD-Events-API Service tests', function () {

    var scope,
        rootScope,
        $q,
        iodHttpServiceMock,
        $logMock,
        serviceUnderTest;

    var EVENTS_API_SUFFIX = 'eventsapistatistics/v1';

     beforeEach(angular.mock.module('iod-client'));


    beforeEach(module("iod-client", function ($provide) {
        iodHttpServiceMock = jasmine.createSpyObj('iodHttpService', ['']);
        iodHttpServiceMock.doApiGet = jasmine.createSpy('doApiGet');

        $logMock = jasmine.createSpyObj('logMock', ['']);
        $logMock.getInstance = jasmine.createSpy('getInstance').and.returnValue({debug:function(){},error:function (){}});
        $provide.value('iodHttpService', iodHttpServiceMock);
        $provide.value('$log', $logMock);
    }));

    beforeEach(inject(function ($rootScope, _$q_, iodEventsService) {
        rootScope = $rootScope;
        scope = rootScope.$new();
        $q = _$q_;
        serviceUnderTest = iodEventsService;
    }));

    describe('validate the service init', function () {
        it('service\'s methods should be defined', function () {
            expect(serviceUnderTest.getSearchUseCount).toBeDefined();
            expect(serviceUnderTest.getActiveUsers).toBeDefined();
        });
    });

    describe('validate the getSearchUseCount method', function(){

        it('should call iod-http without any arguments in the call', function(){
            serviceUnderTest.getSearchUseCount();
            var eventsQueryParams = new EventsQueryParams();
            var paramName = 'querytextindex';
            eventsQueryParams.addApiNameParam(paramName);
            eventsQueryParams.addAggregationFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
            eventsQueryParams.addGroupByPeriodParam();
            eventsQueryParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.TIME_ASC);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith(EVENTS_API_SUFFIX, eventsQueryParams);
        });

        it('should call iod-http with the index name added ', function(){
            var indexName = 'foo';
            serviceUnderTest.getSearchUseCount(undefined, undefined,indexName);
            var eventsQueryParams = new EventsQueryParams();
            var paramName = 'querytextindex';
            eventsQueryParams.addParamNameParam('indexes');
            eventsQueryParams.addParamValueParam(indexName);
            eventsQueryParams.addApiNameParam(paramName);
            eventsQueryParams.addAggregationFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
            eventsQueryParams.addGroupByPeriodParam();
            eventsQueryParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.TIME_ASC);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith(EVENTS_API_SUFFIX, eventsQueryParams);
        });

        it('should call iod-http with groupByPeriod set as true', function(){
            var indexName = 'foo';
            var groupByPeriod = true;
            serviceUnderTest.getSearchUseCount(undefined, groupByPeriod,indexName);
            var eventsQueryParams = new EventsQueryParams();
            var paramName = 'querytextindex';
            eventsQueryParams.addParamNameParam('indexes');
            eventsQueryParams.addGroupByPeriodParam(groupByPeriod);
            eventsQueryParams.addParamValueParam(indexName);
            eventsQueryParams.addApiNameParam(paramName);
            eventsQueryParams.addAggregationFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
            eventsQueryParams.addGroupByPeriodParam();
            eventsQueryParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.TIME_ASC);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith(EVENTS_API_SUFFIX, eventsQueryParams);
        });

        it('should call iod-http with groupByPeriod set as true', function(){
            var indexName = 'foo';
            var groupByPeriod = false;
            serviceUnderTest.getSearchUseCount(undefined, groupByPeriod,indexName);
            var eventsQueryParams = new EventsQueryParams();
            var paramName = 'querytextindex';
            eventsQueryParams.addParamNameParam('indexes');
            eventsQueryParams.addParamValueParam(indexName);
            eventsQueryParams.addApiNameParam(paramName);
            eventsQueryParams.addAggregationFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
            eventsQueryParams.addGroupByPeriodParam(false);
            eventsQueryParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.TIME_ASC);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith(EVENTS_API_SUFFIX, eventsQueryParams);
        });

        it('should call iod-http with minDate Value', function(){
            var indexName = undefined;
            var groupByPeriod = undefined;
            var date = new Date();
            serviceUnderTest.getSearchUseCount(date, groupByPeriod,indexName);
            var eventsQueryParams = new EventsQueryParams();
            var paramName = 'querytextindex';
            eventsQueryParams.addGroupByPeriodParam(groupByPeriod);
            eventsQueryParams.addApiNameParam(paramName);
            eventsQueryParams.addMinDateParam(date);
            eventsQueryParams.addAggregationFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
            eventsQueryParams.addGroupByPeriodParam();
            eventsQueryParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.TIME_ASC);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith(EVENTS_API_SUFFIX, eventsQueryParams);
        });

        it('should call iod-http with minDate Value', function(){
            var indexName = undefined;
            var groupByPeriod = undefined;
            var date ='foo';

            expect(function (){serviceUnderTest.getSearchUseCount(date, groupByPeriod, indexName)}).toThrow();
        })
    });

    describe('validate the getSearchUseCount method', function(){

        it('should call the iod-http' , function(){
            serviceUnderTest.getActiveUsers();
            var eventsQueryParams = new EventsQueryParams();
            eventsQueryParams.addApiNameParam('querytextindex');
            eventsQueryParams.addAggregationFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
            eventsQueryParams.addGroupByUserId(true);
            expect(iodHttpServiceMock.doApiGet).toHaveBeenCalledWith(EVENTS_API_SUFFIX, eventsQueryParams);
        })

    });

});
