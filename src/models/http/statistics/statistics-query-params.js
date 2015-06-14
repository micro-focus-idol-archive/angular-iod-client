/**
 * Created by avidan on 11-05-15.
 */

function StatisticsQueryParams(params) {
    // calling super constructor
    ReqQueryParams.call(this, params);
}

// Create a StatisticsQueryParams.prototype object that inherits from ReqQueryParams.prototype.
StatisticsQueryParams.prototype = Object.create(ReqQueryParams.prototype);

// Set the "constructor" property to refer to StatisticsQueryParams
StatisticsQueryParams.prototype.constructor = StatisticsQueryParams;


StatisticsQueryParams.PERIODS = {DAY: 'day', WEEK: 'week', MONTH: 'month'};

StatisticsQueryParams.AGGR_FUNC_TYPES = {
    COUNT: "count(*)",
    SUM: "sum(measure)",
    MAX: "max(measure)",
    MIN: "min(measure)",
    AVG: "avg(measure)"
};

StatisticsQueryParams.SORT_OPTIONS = {
    ASC: "measure_asc",
    DESC: "measure_desc",
    TIME_ASC: "time_granularity_asc",
    TIME_DESC: "time_granularity_desc"
};

StatisticsQueryParams.prototype.addApiNameParam = function (apiName) {
    this.append({api_name: apiName});
};

StatisticsQueryParams.prototype.addGroupByPeriodParam = function (groupByPeriod) {
    this.append({group_by_period: groupByPeriod});
};

StatisticsQueryParams.prototype.addGroupByUserId = function (groupByUser) {
    this.append({group_by_user_id: groupByUser});
};

StatisticsQueryParams.prototype.addShouldGroupByApiNameParam = function (shouldGroupByApiName) {
    this.append({group_by_api_name: shouldGroupByApiName});
};

StatisticsQueryParams.prototype.addMinDateParamPeriodAgo = function (period) {
    if (period !== undefined) {
        var minDate = moment().subtract(1, period).toISOString();
        this.append({min_date: minDate});
    }
};

StatisticsQueryParams.prototype.addMaxDateParam = function (date) {
    if (date !== undefined && (_.isDate(date) || date._isAMomentObject)) {
        var maxDate = date.toISOString();
        this.append({max_date: maxDate});
    }else {
        throw new Error('date argument is invalid');
    }
};

StatisticsQueryParams.prototype.addMinDateParam = function (date) {
    if (date !== undefined && (_.isDate(date) || date._isAMomentObject)) {
        var minDate = date.toISOString();
        this.append({min_date: minDate});
    } else {
        throw new Error('date argument is invalid');
    }
};

StatisticsQueryParams.prototype.addPageNumberParam = function (pageNumber) {
    this.append({page_number: pageNumber});
};

StatisticsQueryParams.prototype.addMaxPageResultsParam = function (maxPageResults) {
    this.append({max_page_results: maxPageResults});
};

StatisticsQueryParams.prototype.addSortByParam = function (sortBy) {
    this.append({sort_by: sortBy});
};

StatisticsQueryParams.prototype.addShouldGroupByUserIdParam = function (shouldGroupByUserId) {
    this.append({group_by_user_id: shouldGroupByUserId});
};

StatisticsQueryParams.prototype.addShouldGroupByApiKey = function (shouldGroupByApiKey) {
    this.append({group_by_api_key: shouldGroupByApiKey});
};