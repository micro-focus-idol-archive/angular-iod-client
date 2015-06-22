/**
 * Created by avidan on 01-05-15.
 */
function ReqBodyData(data) {
    var that = this;
    that.params = {};
    _.map(data, function (value, key) {
        if (value != undefined) {
            that.params[key] = value;
        }
    })
}

ReqBodyData.prototype.append = function (data) {
    var that = this;
    _.map(data, function (value, key) {
        if (value != undefined) {
            that.params[key] = value;
        }
    })
};


/**
 * Returns the Object's parameters, if one of the
 * @returns {{}}
 */
ReqBodyData.prototype.getSerializeParamaters = function(){
    var that = this;

    var serializedParams ={};
    _.map(that.params, function (value,key){
        if(_.isObject(value) && !_.isArray(value)){
            serializedParams[key] = JSON.stringify(value);
        }else {
            serializedParams[key] = value;
        }
    });

    return serializedParams;
};

