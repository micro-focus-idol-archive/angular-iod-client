/**
 * Created by avidan on 11-05-15.
 */
describe('Test the MeasureQueryParams Object', function () {

    describe('validate the Object\'s constructor', function () {
        it('Should create a new Object with an empty constructor', function () {
            var reqQuery = new MeasureQueryParams();
            expect(reqQuery.params).toEqual({});
            expect(reqQuery.append).toBeDefined();
            expect(reqQuery.remove).toBeDefined();
        });

        it('should validate the Object extends the StatisticsQueryParams', function () {
            var reqQuery = new MeasureQueryParams();
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

        it('Should validate the addObjectNameParam method that the Object expose', function () {
            var arg = 'foo';
            var reqQuery = new MeasureQueryParams();
            expect(reqQuery.addObjectNameParam).toBeDefined();
            reqQuery.addObjectNameParam(arg);
            expect(reqQuery.params).toEqual({object_name: arg});
        });

        it('Should validate the addMeasureNameParam method that the Object expose', function () {
            var arg = 'foo';
            var reqQuery = new MeasureQueryParams();
            expect(reqQuery.addMeasureNameParam).toBeDefined();
            reqQuery.addMeasureNameParam(arg);
            expect(reqQuery.params).toEqual({measure_name: arg});
        });


        it('Should validate the addFuncParam method that the Object expose', function () {
            var arg = 'foo';
            var reqQuery = new MeasureQueryParams();
            expect(reqQuery.addFuncParam).toBeDefined();
            reqQuery.addFuncParam(arg);
            expect(reqQuery.params).toEqual({function: arg});
        });


        it('Should validate the addShouldGroupByObjectNameParam method that the Object expose', function () {
            var arg = 'foo';
            var reqQuery = new MeasureQueryParams();
            expect(reqQuery.addShouldGroupByObjectNameParam).toBeDefined();
            reqQuery.addShouldGroupByObjectNameParam(arg);
            expect(reqQuery.params).toEqual({group_by_object_name: arg});
        });


        it('Should validate the addShouldGroupByStringValueParam method that the Object expose', function () {
            var arg = 'foo';
            var reqQuery = new MeasureQueryParams();
            expect(reqQuery.addShouldGroupByStringValueParam).toBeDefined();
            reqQuery.addShouldGroupByStringValueParam(arg);
            expect(reqQuery.params).toEqual({group_by_string_value: arg});
        });


        it('Should validate the addMinDateParamPeriodAgo method that the Object expose', function () {
            var arg = 'foo';
            var reqQuery = new MeasureQueryParams();
            expect(reqQuery.addMinDateParamPeriodAgo).toBeDefined();
            reqQuery.addMinDateParamPeriodAgo(arg);
            expect(reqQuery.params.min_date).toBeDefined();
        });

    });

});