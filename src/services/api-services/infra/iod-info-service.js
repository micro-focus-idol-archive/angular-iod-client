/**
 * Created by avidan on 11-05-15.
 */
angular
	.module('hod-client')
	.factory('iodInfoService', IodInfoService);

IodInfoService.$inject = ['$log', 'hodHttpService'];

/* @ngInject */
function IodInfoService($log, hodHttpService) {
	var service = {
		getProjectQuotas: getProjectQuotas,
		getIndexFlavorsQuota: getIndexFlavorsQuota
	};

	return service;

	////////////////

	function getProjectQuotas() {
		return hodHttpService.doInfoGet('quota/project/');
	}

	function getIndexFlavorsQuota() {
		return hodHttpService.doInfoGet('quota/indexflavors/');
	}


}
