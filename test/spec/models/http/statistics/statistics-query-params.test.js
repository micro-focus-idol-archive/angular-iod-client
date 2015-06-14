/**
 * Created by avidan on 11-05-15.
 */
describe('Test the MeasureQueryParams Object', function (){

    describe('validate the Object\'s constructor', function (){
        it('Should create a new Object with an empty constructor', function(){
            var reqQuery = new StatisticsQueryParams();
            expect(reqQuery.params).toEqual({});
            expect(reqQuery.append).toBeDefined();
            expect(reqQuery.remove).toBeDefined();
        });
    });

    describe('validate the Object\'s methods', function (){

        it('Should validate the addApiNameParam method that the Object expose', function (){
            var arg = 'foo';
            var reqQuery = new StatisticsQueryParams();
            expect(reqQuery.addApiNameParam).toBeDefined();
            reqQuery.addApiNameParam(arg);
            expect(reqQuery.params).toEqual({api_name:arg});
        });

        it('Should validate the addGroupByPeriodParam method that the Object expose', function (){
            var arg = 'foo';
            var reqQuery = new StatisticsQueryParams();
            expect(reqQuery.addGroupByPeriodParam).toBeDefined();
            reqQuery.addGroupByPeriodParam(arg);
            expect(reqQuery.params).toEqual({group_by_period:arg});
        });

        it('Should validate the addShouldGroupByApiNameParam method that the Object expose', function (){
            var arg = 'foo';
            var reqQuery = new StatisticsQueryParams();
            expect(reqQuery.addShouldGroupByApiNameParam).toBeDefined();
            reqQuery.addShouldGroupByApiNameParam(arg);
            expect(reqQuery.params).toEqual({group_by_api_name:arg});
        });

        it('Should validate the addMinDateParamPeriodAgo method that the Object expose', function (){
            var arg = StatisticsQueryParams.PERIODS.WEEK;
            var reqQuery = new StatisticsQueryParams();
            expect(reqQuery.addMinDateParamPeriodAgo).toBeDefined();
            expect(reqQuery.params.min_date).toBeUndefined();
            reqQuery.addMinDateParamPeriodAgo(arg);
            expect(reqQuery.params.min_date).toBeDefined();
        });

        it('Should validate the addMaxDateParam method that the Object expose', function (){
            var arg = new Date();
            var reqQuery = new StatisticsQueryParams();
            expect(reqQuery.addMaxDateParam).toBeDefined();
            reqQuery.addMaxDateParam(arg);
            expect(reqQuery.params.max_date).toBeDefined();
        });

        it('Should validate the addMaxDateParam method that the Object expose and catch the exception ', function (){
            var arg = 123;
            var reqQuery = new StatisticsQueryParams();
            expect(reqQuery.addMaxDateParam).toBeDefined();
            expect(function (){reqQuery.addMaxDateParam(arg)}).toThrow(new Error('date argument is invalid'));
        });

        it('Should validate the addMinDateParam method that the Object expose', function (){
            var arg = new Date();
            var reqQuery = new StatisticsQueryParams();
            expect(reqQuery.addMinDateParam).toBeDefined();
            reqQuery.addMinDateParam(arg);
            expect(reqQuery.params.min_date).toBeDefined();
        });

        it('Should validate the addMinDateParam method that the Object expose and catch the exception ', function (){
            var arg = 123;
            var reqQuery = new StatisticsQueryParams();
            expect(reqQuery.addMinDateParam).toBeDefined();
            expect(function (){reqQuery.addMinDateParam(arg)}).toThrow(new Error('date argument is invalid'));
        });

        it('Should validate the addPageNumberParam method that the Object expose', function (){
            var arg = 123;
            var reqQuery = new StatisticsQueryParams();
            expect(reqQuery.params.page_number).toBeUndefined();
            reqQuery.addPageNumberParam(arg);
            expect(reqQuery.addPageNumberParam).toBeDefined();
            expect(reqQuery.params).toEqual({page_number:arg});
        });

        it('Should validate the addMaxPageResultsParam method that the Object expose', function (){
            var arg = 123;
            var reqQuery = new StatisticsQueryParams();
            expect(reqQuery.params.max_page_results).toBeUndefined();
            reqQuery.addMaxPageResultsParam(arg);
            expect(reqQuery.addMaxPageResultsParam).toBeDefined();
            expect(reqQuery.params).toEqual({max_page_results:arg});
        });

        it('Should validate the addSortByParam method that the Object expose', function (){
            var arg = 123;
            var reqQuery = new StatisticsQueryParams();
            expect(reqQuery.params.sort_by).toBeUndefined();
            reqQuery.addSortByParam(arg);
            expect(reqQuery.addSortByParam).toBeDefined();
            expect(reqQuery.params).toEqual({sort_by:arg});
        });

        it('Should validate the addShouldGroupByUserIdParam method that the Object expose', function (){
            var arg = 123;
            var reqQuery = new StatisticsQueryParams();
            expect(reqQuery.params.group_by_user_id).toBeUndefined();
            expect(reqQuery.addShouldGroupByUserIdParam).toBeDefined();
            reqQuery.addShouldGroupByUserIdParam(arg);
            expect(reqQuery.params).toEqual({group_by_user_id:arg});
        });

        it('Should validate the addShouldGroupByApiKey method that the Object expose', function (){
            var arg = 123;
            var reqQuery = new StatisticsQueryParams();
            expect(reqQuery.params.group_by_api_key).toBeUndefined();
            expect(reqQuery.addShouldGroupByApiKey).toBeDefined();
            reqQuery.addShouldGroupByApiKey(arg);
            expect(reqQuery.params).toEqual({group_by_api_key:arg});
        });

    });

});