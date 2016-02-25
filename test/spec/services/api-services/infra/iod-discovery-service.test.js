/**
 * Created by avidan on 29-05-15.
 */
describe('Iod-Discovery-Service', function () {
    var scope,
        rootScope,
        $q,
        $logMock,
        hodHttpServiceMock,
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

    }));

    beforeEach(module(function ($provide) {
        hodHttpServiceMock = jasmine.createSpyObj('hodHttpService', ['doDiscoveryGet']);
        $provide.value('hodHttpService', hodHttpServiceMock);

    }));


    beforeEach(function () {
        inject(function ($rootScope, _$q_, iodDiscoveryService) {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $q = _$q_;
            serviceUnderTest = iodDiscoveryService;
        })
    });

    describe('Validate the service init', function () {
        it('all methods should be defined', function () {
            expect(serviceUnderTest.getConnectorAgentDownloadLinks).toBeDefined();
        });
    });

    describe('Validate the service methods', function (){

        it('should call getConnectorAgentDownloadLinks', function(){
            serviceUnderTest.getConnectorAgentDownloadLinks();
            var params = new ReqQueryParams();
            expect(hodHttpServiceMock.doDiscoveryGet).toHaveBeenCalledWith('downloadLinks',params);
        });

        it('should call getConnectorAgentDownloadLinks with a flavor', function(){
            var flavor ='a'
            serviceUnderTest.getConnectorAgentDownloadLinks(flavor);
            var params = new ReqQueryParams();
            params.append({flavors:flavor});
            expect(hodHttpServiceMock.doDiscoveryGet).toHaveBeenCalledWith('downloadLinks',params);
        });

    })

});
