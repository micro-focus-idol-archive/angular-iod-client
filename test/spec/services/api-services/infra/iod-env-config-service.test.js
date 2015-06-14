/**
 * Created by avidan on 26-05-15.
 */
describe('', function (){

    var scope,
        rootScope,
        envConfigMock,
        $logMock,
        serviceUnderTest;

    beforeEach(angular.mock.module("iod-client"));

    beforeEach(module(function($provide){
        $logMock = jasmine.createSpyObj('logMock', ['']);
        $logMock.getInstance = jasmine.createSpy('getInstance').and.returnValue({debug:function(){},error:function (){}});
        $provide.value('$log', $logMock);
        $provide.value('envConfig', envConfigMock);
    }));


    beforeEach(function () {
        inject(function ($rootScope,  iodEnvConfigService) {
            rootScope = $rootScope;
            scope = rootScope.$new();
            serviceUnderTest = iodEnvConfigService;
        })
    });

    describe('Validate the service with an invalid JSON as the envConfig', function (){

        beforeEach(function (){
            envConfigMock = {
                "env": "production",
                "iod_config": {
                    "protocol": "http",
                    "domain": "iod-core",
                    "host":null,
                    "port":8080
                }
            }
        });

        it('isEnvConfigValid should return false for an invalid JSON', function (){
            expect(serviceUnderTest.isEnvConfigValid()).toBeFalsy();
        });

        it('should return a correct IOD host URL', function(){
            expect(serviceUnderTest.getIodHost()).toEqual('')
        });

        it('should return a correct IOD host URL', function(){
            expect(serviceUnderTest.getIodPortal()).toEqual('')
        });
    });

    describe('Validate the service init', function () {

        beforeEach(function(){
           envConfigMock = {
               "env": "production",
               "iod_config": {
                   "protocol": "http",
                   "domain": "iod-core",
                   "host":null,
                   "port":8080
               },
               "portal_config":{
                   "protocol": "http",
                   "domain": "iod-core",
                   "host":null,
                   "port":8081
               }
           }
        });

        it('all methods should be defined', function () {
            expect(serviceUnderTest.getIodHost).toBeDefined();
            expect(serviceUnderTest.getIodPortal).toBeDefined();
            expect(serviceUnderTest.isEnvConfigValid).toBeDefined();
        });

        it('isEnvConfigValid should return true for a valid JSON', function (){
            expect(serviceUnderTest.isEnvConfigValid()).toBeTruthy();
        });

        it('should return a correct IOD host URL', function(){
            var expectedUrl = envConfigMock.iod_config.protocol + '://' + envConfigMock.iod_config.domain + ( envConfigMock.iod_config.port ? ':' + envConfigMock.iod_config.port : '');
            expect(serviceUnderTest.getIodHost()).toEqual(expectedUrl)
        });

        it('should return a correct IOD host URL', function(){
            var expectedUrl = envConfigMock.portal_config.protocol + '://' + envConfigMock.portal_config.domain + ( envConfigMock.portal_config.port ? ':' + envConfigMock.portal_config.port : '');
            expect(serviceUnderTest.getIodPortal()).toEqual(expectedUrl)
        });
    });



});
