/**
 * Created by avidan on 29-05-15.
 */
describe('Iod-Info-Service', function () {
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
        hodHttpServiceMock = jasmine.createSpyObj('hodHttpService', ['doInfoGet']);
        $provide.value('hodHttpService', hodHttpServiceMock);

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
            expect(hodHttpServiceMock.doInfoGet).toHaveBeenCalledWith('quota/project/');
        });

        it('should call project\'s index flavors quota', function(){
            serviceUnderTest.getIndexFlavorsQuota();
            expect(hodHttpServiceMock.doInfoGet).toHaveBeenCalledWith('quota/indexflavors/');
        });

    })

});
