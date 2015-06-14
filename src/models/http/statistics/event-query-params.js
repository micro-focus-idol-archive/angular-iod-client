/**
 * Created by avidan on 11-05-15.
 */

/**
 * Define the  MeasureQueryParams constructor
 * @param params
 * @constructor
 */
function EventsQueryParams(params) {
    // calling super constructor
    StatisticsQueryParams.call(this, params);
}

// Create a MeasureQueryParams.prototype object that inherits from StatisticsQueryParams.prototype.
EventsQueryParams.prototype = Object.create(StatisticsQueryParams.prototype);

// Set the "constructor" property to refer to MeasureQueryParams
EventsQueryParams.prototype.constructor = EventsQueryParams;

EventsQueryParams.prototype.addParamNameParam = function (paramName) {
    this.append({param_name: paramName});
};

EventsQueryParams.prototype.addParamValueParam = function (paramValue) {
    this.append({param_value: paramValue});
};

EventsQueryParams.prototype.addAggregationFuncParam = function (aggrFunc) {
    this.append({aggregation_function: aggrFunc});
};

EventsQueryParams.prototype.addShouldGroupByApiValueParam = function (shouldGroupByApiValue) {
    this.append({group_by_param_value: shouldGroupByApiValue});
};
