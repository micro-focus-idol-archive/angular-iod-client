/**
 * Created by avidan on 11-05-15.
 */
angular
  .module('iod-client')
  .factory('iodMeasureService', IodMeasureService);

IodMeasureService.$inject = ['$log', 'iodHttpService'];

/* @ngInject */
function IodMeasureService($log, iodHttpService) {

  $log = $log.getInstance('IodMeasureService');
  var MEASURES_API_SUFFIX = 'eventsmeasurestatistics/v1';
  var FUNC_TYPES = {
    LAST: "last_by_object_name",
    NONE: "none"
  };

  var MEASURE_NAMES = {
    TOTAL_DOCS: "total_documents",
    INDEX_SIZE: "total_index_size",
    TERM_HIT: "term_hit",
    QUERY_ZERO_HIT: "query_zero_hit_term",
    PROMOTION_HIT: "promotion_hit"
  };

  var MAX_PAGE_RESULTS = 50;

  var service = {
    getZeroHitTermsForPeriod: getZeroHitTermsForPeriod,
    getZeroHitTerms: getZeroHitTerms,
    getTopPromotions: getTopPromotions,
    getPopularSearchTerms: getPopularSearchTerms,
    getRecentDocCountForIndexGroupByPeriod: getRecentDocCountForIndexGroupByPeriod,
    getRecentDocCountUntilDatePerIndex: getRecentDocCountUntilDatePerIndex,
    getRecentIndexSizePerIndexGroupByPeriod: getRecentIndexSizePerIndexGroupByPeriod,
    getRecentIndexSizePerIndex: getRecentIndexSizePerIndex,
    getIndexSizeGroupByPeriod: getIndexSizeGroupByPeriod
  };

  return service;

  ////////////////

  function getZeroHitTermsForPeriod(minDate, groupByPeriod) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.QUERY_ZERO_HIT);
    measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
    measureEventsParams.addGroupByPeriodParam(groupByPeriod);
    measureEventsParams.addMinDateParam(minDate);
    measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
    measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.TIME_ASC);

    $log.debug('Calling getZeroHitTermsForPeriod');
    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getZeroHitTerms(period) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.QUERY_ZERO_HIT);
    measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
    measureEventsParams.addMinDateParamPeriodAgo(period);
    measureEventsParams.addShouldGroupByStringValueParam(true);
    measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);

    $log.debug('Calling getZeroHitTerms');
    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getTopPromotions(period) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.PROMOTION_HIT);
    measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
    measureEventsParams.addMinDateParamPeriodAgo(period);
    measureEventsParams.addShouldGroupByObjectNameParam(true);
    measureEventsParams.addShouldGroupByStringValueParam(true);
    measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);

    $log.debug('Calling getTopPromotions');

    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getPopularSearchTerms(period) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.TERM_HIT);
    measureEventsParams.addFuncParam(StatisticsQueryParams.AGGR_FUNC_TYPES.COUNT);
    measureEventsParams.addMinDateParamPeriodAgo(period);
    measureEventsParams.addShouldGroupByStringValueParam(true);
    measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);

    $log.debug('Calling getPopularSearchTerms');
    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getRecentDocCountForIndexGroupByPeriod(indexName, startDate, groupByPeriod) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.TOTAL_DOCS);
    measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
    measureEventsParams.addGroupByPeriodParam(groupByPeriod);
    measureEventsParams.addMinDateParam(startDate);
    measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
    if (indexName !== undefined) {
      measureEventsParams.addObjectNameParam(indexName);
    }

    $log.debug('Calling getRecentDocCountForIndexGroupByPeriod');
    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getRecentDocCountUntilDatePerIndex(indexName, maxDate) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.TOTAL_DOCS);
    measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
    measureEventsParams.addShouldGroupByObjectNameParam(true);
    if (maxDate) {
      measureEventsParams.addMaxDateParam(maxDate);
    }
    if (indexName !== undefined) {
      measureEventsParams.addObjectNameParam(indexName);
    }

    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getRecentIndexSizePerIndexGroupByPeriod(startDate, groupByPeriod) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.INDEX_SIZE);
    measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
    measureEventsParams.addGroupByPeriodParam(groupByPeriod);
    if (startDate != undefined)
      measureEventsParams.addMinDateParam(startDate);
    measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);

    $log.debug('Calling getRecentIndexSizePerIndexGroupByPeriod');
    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getRecentIndexSizePerIndex(indexName, maxDate) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.INDEX_SIZE);
    measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
    measureEventsParams.addShouldGroupByObjectNameParam(true);
    if (maxDate !== undefined) {
      measureEventsParams.addMaxDateParam(maxDate);
    }
    if (indexName !== undefined) {
      measureEventsParams.addObjectNameParam(indexName);
    }
    measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);
    measureEventsParams.addSortByParam(StatisticsQueryParams.SORT_OPTIONS.DESC);

    $log.debug('Calling getRecentIndexSizePerIndex');
    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }

  function getIndexSizeGroupByPeriod(indexName, minDate, groupByPeriod) {
    var measureEventsParams = new MeasureQueryParams();
    measureEventsParams.addMeasureNameParam(MEASURE_NAMES.INDEX_SIZE);
    measureEventsParams.addFuncParam(FUNC_TYPES.LAST);
    measureEventsParams.addGroupByPeriodParam(groupByPeriod);
    measureEventsParams.addMinDateParam(minDate);
    measureEventsParams.addObjectNameParam(indexName);
    measureEventsParams.addMaxPageResultsParam(MAX_PAGE_RESULTS);

    $log.debug('Calling getIndexSizeGroupByPeriod');
    return iodHttpService.doApiGet(MEASURES_API_SUFFIX, measureEventsParams);
  }


}
