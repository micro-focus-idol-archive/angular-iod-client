/**
 * Created by avidan on 29-05-15.
 */
describe('Iod-Info-Service', function () {
    var scope,
        rootScope,
        $q,
        $logMock,
        iodHttpServiceMock,
        serviceUnderTest;


    beforeEach(angular.mock.module("iod-client"));

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
        iodHttpServiceMock = jasmine.createSpyObj('iodHttpService', ['doInfoGet']);
        $provide.value('iodHttpService', iodHttpServiceMock);

    }));


    beforeEach(function () {
        inject(function ($rootScope, _$q_, iodInfoService) {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $q = _$q_;
            serviceUnderTest = iodInfoService;
        })
    });

    describe('Validate the service init', function () {
        it('all methods should be defined', function () {
            expect(serviceUnderTest.getProjectQuotas).toBeDefined();
            expect(serviceUnderTest.getIndexFlavorsQuota).toBeDefined();
        });
    });

    describe('Validate the service methods', function (){

        it('should call project\'s quota', function(){
            serviceUnderTest.getProjectQuotas();
            expect(iodHttpServiceMock.doInfoGet).toHaveBeenCalledWith('quota/project/');
        });

        it('should call project\'s index flavors quota', function(){
            serviceUnderTest.getIndexFlavorsQuota();
            expect(iodHttpServiceMock.doInfoGet).toHaveBeenCalledWith('quota/indexflavors/');
        });

    })

});
