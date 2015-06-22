/**
 * Created by avidan on 11-05-15.
 */
describe('Test the EventsQueryParams Object', function () {

    describe('validate the Object\'s constructor', function () {
        it('Should create a new Object with an empty constructor', function () {
            var reqQuery = new EventsQueryParams();
            expect(reqQuery.params).toEqual({});
            expect(reqQuery.append).toBeDefined();
            expect(reqQuery.remove).toBeDefined();
        });

        it('should validate the Object extends the StatisticsQueryParams', function () {
            var reqQuery = new EventsQueryParams();
            expect(reqQuery.addApiNameParam).toBeDefined();
            expect(reqQuery.addGroupByPeriodParam).toBeDefined();
            expect(reqQuery.addShouldGroupByApiNameParam).toBeDefined();
            expect(reqQuery.addMinDateParamPeriodAgo).toBeDefined();
            expect(reqQuery.addMaxDateParam).toBeDefined();
            expect(reqQuery.addMinDateParam).toBeDefined();
            expect(reqQuery.addPageNumberParam).toBeDefined();
            expect(reqQuery.addMaxPageResultsParam).toBeDefined();
            expect(reqQuery.addSortByParam).toBeDefined();
            expect(reqQuery.addShouldGroupByUserIdParam).toBeDefined();
            expect(reqQuery.addShouldGroupByApiKey).toBeDefined();
        })
    });

    describe('validate the Object\'s methods', function () {

        it('Should validate the addParamNameParam method that the Object expose', function () {
            var arg = 'foo';
            var reqQuery = new EventsQueryParams();
            expect(reqQuery.addParamNameParam).toBeDefined();
            reqQuery.addParamNameParam(arg);
            expect(reqQuery.params).toEqual({param_name: arg});
        });

        it('Should validate the addParamValueParam method that the Object expose', function () {
            var arg = 'foo';
            var reqQuery = new EventsQueryParams();
            expect(reqQuery.addParamValueParam).toBeDefined();
            reqQuery.addParamValueParam(arg);
            expect(reqQuery.params).toEqual({param_value: arg});
        });

        it('Should validate the addAggregationFuncParam method that the Object expose', function () {
            var arg = 'foo';
            var reqQuery = new EventsQueryParams();
            expect(reqQuery.addAggregationFuncParam).toBeDefined();
            reqQuery.addAggregationFuncParam(arg);
            expect(reqQuery.params).toEqual({aggregation_function: arg});
        });

        it('Should validate the addShouldGroupByApiValueParam method that the Object expose', function () {
            var arg = 'foo';
            var reqQuery = new EventsQueryParams();
            expect(reqQuery.addShouldGroupByApiValueParam).toBeDefined();
            reqQuery.addShouldGroupByApiValueParam(arg);
            expect(reqQuery.params).toEqual({group_by_param_value: arg});
        });
    });
});
