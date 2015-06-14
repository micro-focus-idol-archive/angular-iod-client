/**
 * Created by avidan on 11-05-15.
 */

/**
 * Define the  MeasureQueryParams constructor
 * @param params
 * @constructor
 */
function MeasureQueryParams(params) {
    // calling super constructor
    StatisticsQueryParams.call(this, params);
}

// Create a MeasureQueryParams.prototype object that inherits from StatisticsQueryParams.prototype.
MeasureQueryParams.prototype = Object.create(StatisticsQueryParams.prototype);

// Set the "constructor" property to refer to MeasureQueryParams
MeasureQueryParams.prototype.constructor = MeasureQueryParams;

MeasureQueryParams.prototype.addObjectNameParam = function (paramName) {
    this.append({object_name: paramName});
};

MeasureQueryParams.prototype.addMeasureNameParam = function (paramName) {
    this.append({measure_name: paramName});
};

MeasureQueryParams.prototype.addFuncParam = function (aggrFunc) {
    this.append({function: aggrFunc});
};

MeasureQueryParams.prototype.addShouldGroupByObjectNameParam = function (shouldGroupByObjectName) {
    this.append({group_by_object_name: shouldGroupByObjectName});
};

MeasureQueryParams.prototype.addShouldGroupByStringValueParam = function (shouldGroupByStringValue) {
    this.append({group_by_string_value: shouldGroupByStringValue});
};

MeasureQueryParams.prototype.addMinDateParamPeriodAgo = function (period) {
    if (period !== undefined) {
        var minDate = moment().subtract(1, period).toISOString();
        this.append({min_date: minDate});
    }
};

