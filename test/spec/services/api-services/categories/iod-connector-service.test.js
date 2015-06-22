/**
 * Created by avidan on 13-05-15.
 */
describe('IOD-Connector-Service Test', function (){

    var scope,
        rootScope,
        $q,
        iodHttpServiceMock,
        logMock,
        serviceUnderTest;

    beforeEach(angular.mock.module("iod-client"));

    beforeEach(module("iod-client", function ($provide) {
        iodHttpServiceMock = jasmine.createSpyObj('iodHttpService', ['']);
        $provide.value('iodHttpService', iodHttpServiceMock);
        logMock = jasmine.createSpyObj('logMock', ['']);
        logMock.getInstance = jasmine.createSpy('getInstance').and.returnValue({debug:function(){},error:function (){}});
        $provide.value('$log', logMock);
    }));


    beforeEach(
        inject(function ($rootScope, _$q_, iodConnectorServiceNew) {
            rootScope = $rootScope;
            scope = rootScope.$new();
            serviceUnderTest = iodConnectorServiceNew;
            $q = _$q_;
        }));

    beforeEach(function () {
        iodHttpServiceMock.doApiGet = createIODConnectorMockSpyFunction($q, "doApiGet", {});
        iodHttpServiceMock.doApiPost = createIODConnectorMockSpyFunction($q, "doApiPost", {});
    });

    describe('validate the service init', function (){
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
            expect(logMock.getInstance).toHaveBeenCalled();
        });
    });

    var ACTIONS= {
        ADD_TO_INDEX: "addtotextindex"
    };

    var SUPPORTED_CONNECTOR_TYPES= {
        WEB: "web"
    };

    var CONNECTOR_FLAVORS = {
        WEB:'web_cloud',
        FS:'filesystem_onsite'
    };


    function buildConnectorUrl(connectorName){
        return ['connector',connectorName,'v1'].join('/')
    }

    describe('validate the createConnector method', function (){

        describe('for web connector', function (){
            it('Should call with no expected errors ', function (){
                var connectorType = 'web_cloud';
                var connectorName = 'koo';
                var url = 'http://www.koo.com';
                var indexName = 'foo';
                serviceUnderTest.createConnector(connectorType, connectorName, url, indexName);

                var wantedConfig = new ReqBodyData({
//                    type:SUPPORTED_CONNECTOR_TYPES.WEB,
                    flavor:connectorType,
                    config:{
                        url:url
                    },
                    destination:{
                        action:ACTIONS.ADD_TO_INDEX,
                        index:indexName
                    }
                });
                expect(iodHttpServiceMock.doApiPost).toHaveBeenCalledWith(buildConnectorUrl(connectorName),wantedConfig);
            });
        });

        describe('for FS connector', function (){
            it('Should call with no expected errors ', function (){
                var connectorType = 'filesystem_onsite';
                var connectorName = 'koo';
                var url = 'c:\\aaaa\\bb';
                var indexName = 'foo';
                serviceUnderTest.createConnector(connectorType, connectorName, url, indexName);

                var wantedConfig = new ReqBodyData({
             //       type:SUPPORTED_CONNECTOR_TYPES.WEB,
                    flavor:connectorType,
                    config:{
                        directoryPathCSVs :url
                    },
                    destination:{
                        action:ACTIONS.ADD_TO_INDEX,
                        index:indexName
                    }
                });
                expect(iodHttpServiceMock.doApiPost).toHaveBeenCalledWith(buildConnectorUrl(connectorName),wantedConfig);
            })
        })



    })

});
