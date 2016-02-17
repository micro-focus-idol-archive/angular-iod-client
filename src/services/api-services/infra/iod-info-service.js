/**
 * Created by avidan on 11-05-15.
 */
angular
	.module('iod-client')
	.factory('iodInfoService', IodInfoService);

IodInfoService.$inject = ['$log', 'iodHttpService'];

/* @ngInject */
function IodInfoService($log, iodHttpService) {
	$log = $log.getInstance('IodInfoService');

	var service = {
		getProjectQuotas: getProjectQuotas,
		getIndexFlavorsQuota: getIndexFlavorsQuota
	};

	return service;

	////////////////

	function getProjectQuotas() {
		return iodHttpService.doInfoGet('quota/project/');
	}

	function getIndexFlavorsQuota() {
		return iodHttpService.doInfoGet('quota/indexflavors/');
	}


}
