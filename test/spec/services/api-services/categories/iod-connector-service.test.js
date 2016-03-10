/**
 * Created by avidan on 13-05-15.
 */
describe('IOD-Connector-Service Test', function () {

	var scope,
		rootScope,
		$q,
		hodHttpServiceMock,
		logMock,
		serviceUnderTest;

	beforeEach(angular.mock.module("hod-client"));

	beforeEach(module("hod-client", function ($provide) {
		hodHttpServiceMock = jasmine.createSpyObj('hodHttpService', ['']);
		$provide.value('hodHttpService', hodHttpServiceMock);
		logMock = jasmine.createSpyObj('logMock', ['debug','error']);
		$provide.value('$log', logMock);
	}));

	beforeEach(
		inject(function ($rootScope, _$q_, hodConnectorService) {
			rootScope = $rootScope;
			scope = rootScope.$new();
			serviceUnderTest = hodConnectorService;
			$q = _$q_;
		}));

	beforeEach(function () {
		hodHttpServiceMock.doApiGet = createIODConnectorMockSpyFunction($q, "doApiGet", {});
		hodHttpServiceMock.doApiPost = createIODConnectorMockSpyFunction($q, "doApiPost", {});
	});

	describe('validate the service init', function () {
		it('service\'s methods should be defined', function () {
			expect(serviceUnderTest.createConnector).toBeDefined();
			expect(serviceUnderTest.deleteConnector).toBeDefined();
			expect(serviceUnderTest.updateConnector).toBeDefined();
			expect(serviceUnderTest.startConnector).toBeDefined();
			expect(serviceUnderTest.stopConnector).toBeDefined();
			expect(serviceUnderTest.connectorStatus).toBeDefined();
			expect(serviceUnderTest.retrieveConfig).toBeDefined();
			expect(serviceUnderTest.cancelConnectorSchedule).toBeDefined();
			expect(serviceUnderTest.connectorHistory).toBeDefined();
		});
	});

	var ACTIONS = {
		ADD_TO_INDEX: "addtotextindex"
	};

	var SUPPORTED_CONNECTOR_TYPES = {
		WEB: "web"
	};

	var CONNECTOR_FLAVORS = {
		WEB: 'web_cloud',
		FS: 'filesystem_onsite'
	};


	function buildConnectorUrl(connectorName) {
		return ['connector', connectorName, 'v1'].join('/')
	}

	describe('validate the createConnector method', function () {

		describe('for web connector', function () {
			it('Should call with no expected errors ', function () {
				var connectorType = 'web_cloud';
				var connectorName = 'koo';
				var url = 'http://www.koo.com';
				var indexName = 'foo';
				serviceUnderTest.createConnector(connectorType, connectorName, url, indexName);
				var wantedConfig = new ReqBodyData({
					connector:connectorName,
					flavor: connectorType,
					config: {
						url: url
					},
					destination: {
						action: ACTIONS.ADD_TO_INDEX,
						index: indexName
					}
				});
				expect(hodHttpServiceMock.doApiPost).toHaveBeenCalledWith('createconnector/v1', wantedConfig);
			});
		});

		describe('for FS connector', function () {
			it('Should call with no expected errors ', function () {
				var connectorType = 'filesystem_onsite';
				var connectorName = 'koo';
				var url = 'c:\\aaaa\\bb';
				var indexName = 'foo';
				serviceUnderTest.createConnector(connectorType, connectorName, url, indexName);

				var wantedConfig = new ReqBodyData({
					connector:connectorName,
					flavor: connectorType,
					config: {
						directoryPathCSVs: url
					},
					destination: {
						action: ACTIONS.ADD_TO_INDEX,
						index: indexName
					}
				});
				expect(hodHttpServiceMock.doApiPost).toHaveBeenCalledWith('createconnector/v1', wantedConfig);
			})
		})


	})

	describe('validate the delete connector API', function (){
		it('should call with valid connector name', function (){
			var connectorName = 'foo';
			var wantedReqQueryParams = new ReqQueryParams({
				connector:connectorName
			})
			serviceUnderTest.deleteConnector(connectorName)
			expect(hodHttpServiceMock.doApiGet).toHaveBeenCalledWith('deleteconnector/v1', wantedReqQueryParams)
		})
	})

});
