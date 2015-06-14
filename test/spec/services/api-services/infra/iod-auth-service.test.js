describe('IOD-Auth-Service service', function () {

  var scope,
    rootScope,
    $q,
    $httpBackendMock,
    iodHttpServiceMock,
    searchRoutingServiceMock,
    $stateMock,
    $logMock,
    serviceUnderTest;


  beforeEach(angular.mock.module("iod-client"));


  beforeEach(module(function ($provide) {
    iodHttpServiceMock = jasmine.createSpyObj('iodHttpService', ['setSessionToken', 'doPost']);
    searchRoutingServiceMock = jasmine.createSpyObj('searchRoutingService', ['']);
    $stateMock = jasmine.createSpyObj('$state', ['go']);
    $logMock = jasmine.createSpyObj('logMock', ['']);
    $logMock.getInstance = jasmine.createSpy('getInstance').and.returnValue({
      debug: function () {
      }, error: function () {
      }
    });

    $provide.value('iodHttpService', iodHttpServiceMock);
    $provide.value('searchRoutingService', searchRoutingServiceMock);
    $provide.value('$state', $stateMock);
    $provide.value('$log', $logMock);

  }));

  beforeEach(function () {
    inject(function ($rootScope, _$q_, iodAuthService) {
      rootScope = $rootScope;
      scope = rootScope.$new();
      $q = _$q_;
      serviceUnderTest = iodAuthService;
    })
  })


  beforeEach(function () {
    inject(function ($httpBackend) {
      $httpBackendMock = $httpBackend;
    })
  })

  describe('Validate the service init', function () {
    it('all methods should be defined', function () {
      expect(serviceUnderTest.authenticate).toBeDefined();
      expect(serviceUnderTest.getSSOInitPromise).toBeDefined();
    });
  });

  describe('validate the service workflow', function () {

    beforeEach(function () {
      iodHttpServiceMock.doGet = createIODConnectorMockSpyFunction($q, "doGet", {});
      iodHttpServiceMock.doPost = createIODConnectorMockSpyFunction($q, "doPost", {});
    });

    it('should call authenticate and test for all of the http calls', function () {
      var applicationToken = {token: {type: 'a', id: 123, secret: 'foo'}};
      iodHttpServiceMock.doPost = createIODConnectorMockSpyFunction($q, "doPost", applicationToken);
      var applicationName = 'Haven_Search_OnDemand';
      var apiKey = 'Heartsease';
      serviceUnderTest.setApplicationName(applicationName);
      serviceUnderTest.setApplicationKey(apiKey);
      var authenticationPromise = serviceUnderTest.authenticate();
      var successClbk = jasmine.createSpy('success');

      var errorClbk = jasmine.createSpy('error');
      authenticationPromise.then(successClbk, errorClbk);
      scope.$apply();
        var applicationAuthQueryParams = {'apiKey': apiKey}
      var applicationAuthBodyParams = {name: applicationName, domain: 'IOD-TEST-DOMAIN', token: 'simple'}; // should be changed to dynamic one

      expect(iodHttpServiceMock.doGet.calls.argsFor(0)).toEqual(['user']);
      expect(iodHttpServiceMock.doPost.calls.argsFor(0)).toEqual(['authenticate/application/unbound', applicationAuthBodyParams, applicationAuthQueryParams]);

      var seconedToken = {app_token: applicationToken.token.type + ':' + applicationToken.token.id + ':' + applicationToken.token.secret}
      expect(iodHttpServiceMock.doPost.calls.argsFor(1)).toEqual(['authenticate/combined', {
        token_type: 'simple',
        application: applicationName,
        domain: 'IOD-TEST-DOMAIN'
      }, seconedToken]);
      expect(iodHttpServiceMock.doPost.calls.argsFor(2)).toEqual(['authenticate/user/unbound']);
      expect($stateMock.go).not.toHaveBeenCalled();
      expect(successClbk).toHaveBeenCalled();
      expect(errorClbk).not.toHaveBeenCalled();
    });
  });

  describe('validate error handling', function () {

    beforeEach(function () {

    });

    it('should reject the promise when getUsers fails', function () {
      iodHttpServiceMock.doGet = createIODConnectorMockSpyFunctionThatFails($q, "doGet", {});
      var applicationName = 'Haven_Search_OnDemand';
      var apiKey = 'Heartsease';
      serviceUnderTest.setApplicationName(applicationName);
      serviceUnderTest.setApplicationKey(apiKey);
      var authenticationPromise = serviceUnderTest.authenticate();
      var successClbk = jasmine.createSpy('success');
      var errorClbk = jasmine.createSpy('error');
      authenticationPromise.then(successClbk, errorClbk);

      scope.$apply();

      expect(iodHttpServiceMock.doGet.calls.argsFor(0)).toEqual(['user']);
      expect(successClbk).not.toHaveBeenCalled();
      expect(errorClbk).toHaveBeenCalled();
    });

    it('should reject the promise without calling other authentication calls', function () {
      iodHttpServiceMock.doGet = createIODConnectorMockSpyFunction($q, "doGet", {});
      iodHttpServiceMock.doPost = createIODConnectorMockSpyFunctionThatFails($q, "doPost", {});
      var applicationName = 'Haven_Search_OnDemand';
      var apiKey = 'Heartsease';
      serviceUnderTest.setApplicationName(applicationName);
      serviceUnderTest.setApplicationKey(apiKey);
      var authenticationPromise = serviceUnderTest.authenticate();
      var successClbk = jasmine.createSpy('success');
      var errorClbk = jasmine.createSpy('error');
      authenticationPromise.then(successClbk, errorClbk);

      scope.$apply();
      var applicationAuthQueryParams = {'apiKey': apiKey};
      var applicationAuthBodyParams = {name: applicationName, domain: 'IOD-TEST-DOMAIN', token: 'simple'}; // should be changed to dynamic one

      expect(iodHttpServiceMock.doGet.calls.argsFor(0)).toEqual(['user']);
      expect(iodHttpServiceMock.doPost.calls.argsFor(0)).toEqual(['authenticate/application/unbound', applicationAuthBodyParams, applicationAuthQueryParams]);
      expect(successClbk).not.toHaveBeenCalled();
      expect(errorClbk).toHaveBeenCalled();
    });

    describe('', function () {

      beforeEach(function () {
        iodHttpServiceMock.doGet = createIODConnectorMockSpyFunction($q, "doGet", {}); // mock the getUser
        iodHttpServiceMock.doPost = jasmine.createSpy('doPost').and.callFake(function (url) {
          var deferred = $q.defer();


          switch (url) {
            case 'authenticate/application/unbound':
              var applicationToken = {token: {type: 'a', id: 'b', secret: 'c'}}

              deferred.resolve(applicationToken);
              break;
            case 'authenticate/combined':
              deferred.reject();
              break;
            default :
              deferred.reject();
              break;
          }

          var promise = deferred.promise;
          promise.success = function (fn) {
            promise.then(fn);
            return promise;
          }
          promise.error = function (fn) {
            promise.then(null, fn);
            return promise;
          }
          return promise;
        })
      });

      it('should reject the promise when the combined authentication fails', function () {
        var applicationName = 'Haven_Search_OnDemand';
        var apiKey = 'Heartsease';
        serviceUnderTest.setApplicationName(applicationName);
        serviceUnderTest.setApplicationKey(apiKey);
        var authenticationPromise = serviceUnderTest.authenticate();
        var successClbk = jasmine.createSpy('success');
        var errorClbk = jasmine.createSpy('error');
        authenticationPromise.then(successClbk, errorClbk);

        scope.$apply();
        var applicationAuthQueryParams = {'apiKey':apiKey}
        var applicationAuthBodyParams = {name: applicationName, domain: 'IOD-TEST-DOMAIN', token: 'simple'}; // should be changed to dynamic one

        expect(iodHttpServiceMock.doGet.calls.argsFor(0)).toEqual(['user']);
        expect(iodHttpServiceMock.doPost.calls.argsFor(0)).toEqual(['authenticate/application/unbound', applicationAuthBodyParams, applicationAuthQueryParams]);
        expect(successClbk).not.toHaveBeenCalled();
        expect(errorClbk).toHaveBeenCalled();
      });

    })


  })
});
