/**
 * Created by avidan on 26-05-15.
 */
describe('', function () {

	var scope,
		rootScope,
		envConfigMock,
		$logMock,
		serviceUnderTest;

	beforeEach(angular.mock.module("hod-client"));

	beforeEach(module(function ($provide) {
		$logMock = jasmine.createSpyObj('logMock', ['']);
		$logMock.getInstance = jasmine.createSpy('getInstance').and.returnValue({
			debug: function () {
			}, error: function () {
			}
		});
		$provide.value('$log', $logMock);
		$provide.value('envConfig', envConfigMock);
	}));


	beforeEach(function () {
		inject(function ($rootScope, hodEnvConfigService) {
			rootScope = $rootScope;
			scope = rootScope.$new();
			serviceUnderTest = hodEnvConfigService;
		})
	});


	describe('Validate the service init', function () {

		beforeEach(function () {
			envConfigMock = {
				"env": "production",
				"iod_config": {
					"protocol": "https",
					"domain": "api.havenondemand.com",
					"host": undefined,
					"port": undefined
				},
				"portal_config": {
					"protocol": "https",
					"domain": "havenondemand.com",
					"host": undefined,
					"port": undefined
				}
			}
		});

		it('all methods should be defined', function () {
			expect(serviceUnderTest.getHodHost).toBeDefined();
			expect(serviceUnderTest.getHodPortal).toBeDefined();
			expect(serviceUnderTest.isEnvConfigValid).toBeDefined();
		});

		it('isEnvConfigValid should return true for a valid JSON', function () {
			var mockApiKey = 'aaaa-1234';
			serviceUnderTest.setApiKey(mockApiKey)
			expect(serviceUnderTest.isEnvConfigValid()).toBeTruthy();
		});

		it('isEnvConfigValid should return false for a valid JSON without a valid APIKEY', function () {
			expect(serviceUnderTest.isEnvConfigValid()).toBeFalsy();
		});

		it('should return a correct IOD host URL', function () {
			var expectedUrl = envConfigMock.iod_config.protocol + '://' + envConfigMock.iod_config.domain + ( envConfigMock.iod_config.port ? ':' + envConfigMock.iod_config.port : '');
			expect(serviceUnderTest.getHodHost()).toEqual(expectedUrl)
		});

		it('should return a correct IOD host URL', function () {
			var expectedUrl = envConfigMock.portal_config.protocol + '://' + envConfigMock.portal_config.domain + ( envConfigMock.portal_config.port ? ':' + envConfigMock.portal_config.port : '');
			expect(serviceUnderTest.getHodPortal()).toEqual(expectedUrl)
		});
	});


});
