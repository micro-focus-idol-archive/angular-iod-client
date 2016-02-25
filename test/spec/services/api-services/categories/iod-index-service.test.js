/**
 * Created by avidan on 10-05-15.
 */
describe('IOD-Index-Service test', function () {

    var scope,
        rootScope,
        $q,
        hodHttpServiceMock,
        $logMock,
        serviceUnderTest;

    beforeEach(angular.mock.module("hod-client"));

    beforeEach(module("hod-client", function ($provide) {
        hodHttpServiceMock = jasmine.createSpyObj('hodHttpService', ['']);
        $logMock = jasmine.createSpyObj('$logMock', ['getInstance', 'debug'])
        $provide.value('hodHttpService', hodHttpServiceMock);
        $provide.value('$log', $logMock);
    }));


    beforeEach(
        inject(function ($rootScope, _$q_, iodIndexService) {
            rootScope = $rootScope;
            scope = rootScope.$new();
            serviceUnderTest = iodIndexService;
            $q = _$q_;
        }));

    beforeEach(function () {
        hodHttpServiceMock.doApiGet = createIODConnectorMockSpyFunction($q, "doApiGet", {});
        hodHttpServiceMock.doApiPost = createIODConnectorMockSpyFunction($q, "doApiGet", {});
    });

    var INDEX_CONSTANTS = {
        INDEX_FLAVORS: {
            SMALL: "explorer",
            STANDARD: "standard",
            CATEGORIZATION: "categorization"
        },
        INDEX_TYPES: {
            INDEX: "content",
            CONNECTOR: "connector"
        }
    };

    describe('validate the service init', function () {
        it('service\'s methods should be defined', function () {
            expect(serviceUnderTest.createIndex).toBeDefined();
            expect(serviceUnderTest.deleteIndex).toBeDefined();
            expect(serviceUnderTest.restoreIndex).toBeDefined();
            expect(serviceUnderTest.addToTextIndex).toBeDefined();
            expect(serviceUnderTest.deleteFromTextIndex).toBeDefined();
            expect(serviceUnderTest.indexStatus).toBeDefined();
            expect(serviceUnderTest.retrieveIndexesList).toBeDefined();
            expect(serviceUnderTest.retrieveResourcesList).toBeDefined();
            expect($logMock.getInstance).toHaveBeenCalled();
        });
    });

    describe('validate the service methods', function () {

        describe('validate the createIndex method', function () {

            it('should call the HTTP GET with empty params', function () {
                var indexName = 'foo'
                serviceUnderTest.createIndex(indexName);
                var wantedData = new ReqBodyData()
                expect(hodHttpServiceMock.doApiPost).toHaveBeenCalledWith('textindex/foo/v1', wantedData)
            });


            it('should call the HTTP GET with arguments', function () {
                var indexName = 'foo';
                var indexFlavor = 'explorer';
                var indexDesc = 'bla bla';
                var indexFields = ['foo,koo'];
                var parametricFields = ['foo,koo'];
                var experationTime = 'date';


                serviceUnderTest.createIndex(indexName, indexFlavor, indexDesc, indexFields, parametricFields, experationTime);
                var wantedData = new ReqBodyData()
                wantedData.append({
                    flavor: indexFlavor,
                    description: indexDesc,
                    index_fields: indexFields,
                    parametric_fields: parametricFields,
                    expiretime: experationTime
                })
                expect(hodHttpServiceMock.doApiPost).toHaveBeenCalledWith('textindex/foo/v1', wantedData)
            });
        });

        describe('validate the index status call', function () {

            it('should call the index status with the name concated', function () {
                var indexName = 'foo';
                serviceUnderTest.indexStatus(indexName);
                expect(hodHttpServiceMock.doApiGet).toHaveBeenCalledWith('textindex/' + indexName + '/status/v1')
            })
        });

        describe('validate the retrieve indexes list call', function () {

            it('should call the retrieveIndexesList', function () {
                serviceUnderTest.retrieveIndexesList();
                var wantedData = new ReqQueryParams({
                    type: INDEX_CONSTANTS.INDEX_TYPES.INDEX,
                    flavor: INDEX_CONSTANTS.INDEX_FLAVORS.STANDARD
                })

                expect(hodHttpServiceMock.doApiGet).toHaveBeenCalledWith('resource/v1', wantedData)
            })
        });

        describe('validate the retrieve resources call', function () {

            it('should call the retrieveResourcesList', function () {
                serviceUnderTest.retrieveResourcesList();

                expect(hodHttpServiceMock.doApiGet).toHaveBeenCalledWith('resource/v1')
            })
        });

        describe('validate the addToTextIndex call', function () {

            describe('when http call returns success', function () {


                beforeEach(function () {
                    hodHttpServiceMock.doApiPostWithoutDataValidation = createIODConnectorMockSpyFunction($q, 'doApiPostWithoutDataValidation', {})
                });

                it('should call the iod-http-service doApiPostWithoutDataValidation method', function () {
                    var indexName = 'someIndex';
                    var file = 'someFile';
                    var requestConfigObj = {};
                    var onSuccess = jasmine.createSpy('success');
                    var onError = jasmine.createSpy('error');

                    serviceUnderTest.addToTextIndex(indexName, file, requestConfigObj).then(onSuccess, onError);

                    var postUrlSuffix = ['textindex/', encodeURIComponent(indexName), '/document/v1'].join('');
                    var fd = new FormData();
                    fd.append('file', file);

                    var reqConfig = _.extend(requestConfigObj, {
                        transformRequest2: angular.identity,
                        headers: {'Content-Type': undefined}
                    });

                    expect(hodHttpServiceMock.doApiPostWithoutDataValidation).toHaveBeenCalledWith(postUrlSuffix, fd, null, reqConfig);
                    scope.$apply();
                    expect(onSuccess).toHaveBeenCalled();
                    expect(onError).not.toHaveBeenCalled();
                });

                it('should return a rejected promise when passing null as the indexName', function () {
                    var indexName = undefined;
                    var file = 'someFile';
                    var reqConfig = {};
                    var onSuccess = jasmine.createSpy('success');
                    var onError = jasmine.createSpy('error');

                    serviceUnderTest.addToTextIndex(indexName, file, reqConfig).then(onSuccess, onError);

                    var fd = new FormData();
                    fd.append('file', file);

                    expect(hodHttpServiceMock.doApiPostWithoutDataValidation).not.toHaveBeenCalled();
                    scope.$apply();
                    expect(onSuccess).not.toHaveBeenCalled();
                    expect(onError).toHaveBeenCalled();
                });

            });

            describe('when http call returns error', function () {

                beforeEach(function () {
                    hodHttpServiceMock.doApiPostWithoutDataValidation = createIODConnectorMockSpyFunctionThatFails($q, 'doApiPostWithoutDataValidation', {})
                });

                it('should call the iod-http-service doApiPostWithoutDataValidation method', function () {
                    var indexName = 'someIndex';
                    var file = 'someFile';
                    var reqConfig = {};
                    var onSuccess = jasmine.createSpy('success');
                    var onError = jasmine.createSpy('error');

                    serviceUnderTest.addToTextIndex(indexName, file, reqConfig).then(onSuccess, onError);

                    var postUrlSuffix = ['textindex/', encodeURIComponent(indexName), '/document/v1'].join('');
                    var fd = new FormData();
                    fd.append('file', file);

                    expect(hodHttpServiceMock.doApiPostWithoutDataValidation).toHaveBeenCalledWith(postUrlSuffix, fd, null, reqConfig);
                    scope.$apply();
                    expect(onSuccess).not.toHaveBeenCalled();
                    expect(onError).toHaveBeenCalled();
                });
            });
        })

    });
});
