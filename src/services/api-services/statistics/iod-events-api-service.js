/**
 * Created by avidan on 11-05-15.
 */
angular
  .module('iod-client')
  .factory('iodEventsService', IodEventsService);

IodEventsService.$inject = ['$log', 'iodHttpService'];

/* @ngInject */
function IodEventsService($log, iodHttpService) {
  $log = $log.getInstance('IodEventsService');

  var EVENTS_API_SUFFIX = 'eventsapistatistics/v1';

  var service = {
    getSearchUseCount: getSearchUseCount,
    getActiveUsers: getActiveUsers
  };

  return service;

  ////////////////

  function getSearchUseCount(minDate, groupByPeriod, indexName) {
    var apiEventsParams = new EventsQueryParams();
    apiEventsParams.addApiNameParam('querytextindex');
    apiEventsParams.addAggregationFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
    apiEventsParams.addGroupByPeriodParam(groupByPeriod);
    if (minDate != undefined)
      apiEventsParams.addMinDateParam(minDate);

    apiEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.TIME_ASC);
    if (indexName !== undefined) {
      apiEventsParams.addParamNameParam('indexes');
      apiEventsParams.addParamValueParam(indexName);
    }
    $log.debug('Calling eventsapistatistics for getSearchUseCount');
    return iodHttpService.doApiGet(EVENTS_API_SUFFIX, apiEventsParams);
  }

  function getActiveUsers() {
    var apiEventsParams = new EventsQueryParams();
    apiEventsParams.addApiNameParam('querytextindex');
    apiEventsParams.addAggregationFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
    apiEventsParams.addGroupByUserId(true);
    return iodHttpService.doApiGet(EVENTS_API_SUFFIX, apiEventsParams);
  }
}
