/**
 * Created by avidan on 01-05-15.
 */
function ReqQueryParams(data) {
    var that = this;
    that.params = {};
    _.map(data, function (value, key) {
        if (value != undefined) {
            that.params[key] = value;
        }
    })
}

ReqQueryParams.prototype.append = function (data) {
    var that = this;
    _.map(data, function (value, key) {
        if (value != undefined) {
            if (that.params[key] === undefined) {
                that.params[key] = value;
            }
            else {
                if (_.isArray(that.params[key])){
                    that.params[key].push(value)
                }else{
                    that.params[key] = [that.params[key],value]
                }
            }
        }
    })
};

ReqQueryParams.prototype.remove = function (key) {
    var that = this;
    if (that.params[key]) {
        delete that.params[key];
    }
}