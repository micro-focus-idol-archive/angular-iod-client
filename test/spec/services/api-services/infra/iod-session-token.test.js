/**
 * Created by avidan on 29-05-15.
 */
describe('Iod-Session-Token Service', function () {
    var scope,
        rootScope,
        $q,
        $logMock,
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


    beforeEach(function () {
        inject(function ($rootScope, _$q_, iodSessionToken) {
            rootScope = $rootScope;
            scope = rootScope.$new();
            $q = _$q_;
            serviceUnderTest = iodSessionToken;
        })
    });

    describe('Validate the service init', function () {
        it('all methods should be defined', function () {
            expect(serviceUnderTest.setSessionToken).toBeDefined();
            expect(serviceUnderTest.getSessionToken).toBeDefined();
            expect(serviceUnderTest.getSessionTokenObj).toBeDefined();
            expect(serviceUnderTest.setUsersData).toBeDefined();
            expect(serviceUnderTest.getUsersData).toBeDefined();
            expect(serviceUnderTest.setUserToken).toBeDefined();
            expect(serviceUnderTest.getUserToken).toBeDefined();
            expect(serviceUnderTest.setApplicationKey).toBeDefined();
            expect(serviceUnderTest.getApplicationKey).toBeDefined();
            expect(serviceUnderTest.getApplicationName).toBeDefined();
            expect(serviceUnderTest.setApplicationName).toBeDefined();
            expect(serviceUnderTest.getApplicationDomain).toBeDefined();
        });
    });

    describe('validate the service getters & setters ', function () {

        it('should test the session token', function () {
            expect(serviceUnderTest.getSessionToken()).toBeNull();
            expect(serviceUnderTest.getSessionTokenObj()).toBeNull();
            var sessionToken = {type: 'a', id: 'b', secret: 'c'}
            serviceUnderTest.setSessionToken(sessionToken);
            expect(serviceUnderTest.getSessionToken()).toEqual('a:b:c');
            expect(serviceUnderTest.getSessionTokenObj()).toEqual(sessionToken);
        });

        it('should test the session token b', function () {
            expect(serviceUnderTest.getSessionToken()).toBeNull();
            expect(serviceUnderTest.getSessionTokenObj()).toBeNull();
            var sessionToken = {type: 'a', secret: 'c'}
            serviceUnderTest.setSessionToken(sessionToken);
            expect(serviceUnderTest.getSessionToken()).toEqual('a::c');
            expect(serviceUnderTest.getSessionTokenObj()).toEqual(sessionToken);
        });

        it('should set the user data', function () {
            expect(serviceUnderTest.getUsersData()).toBeNull();
            var users = {
                users: [
                    {
                        user_name: "2de3fc50-6b30-47f1-9503-8b71c7e11aae",
                        user_store: "193bcce0-b559-4209-93bc-5dd6ff1eee34:DEFAULT_USER_STORE"
                    },
                    {
                        user_name: "19cff76e-e77e-4302-8305-5d9111a013d1",
                        user_store: "4bce473a-5a15-4925-948e-35e5749a19fa:DEFAULT_USER_STORE"
                    },
                    {
                        user_name: "07f91609-4d7f-493a-80a6-67d1a9901de0",
                        user_store: "4cba00e2-ea1a-444f-ab77-105706a85049:DEFAULT_USER_STORE"
                    }
                ]
            }
            serviceUnderTest.setUsersData(users);
            expect(serviceUnderTest.getUsersData()).toEqual({
                user_name: "2de3fc50-6b30-47f1-9503-8b71c7e11aae",
                user_store: "193bcce0-b559-4209-93bc-5dd6ff1eee34:DEFAULT_USER_STORE"
            });

            expect (serviceUnderTest.getApplicationDomain()).toEqual('193bcce0-b559-4209-93bc-5dd6ff1eee34');
        });

        it('should set the application key', function () {
            expect(serviceUnderTest.getUserToken()).toBeNull();
            serviceUnderTest.setUserToken('foo');
            expect(serviceUnderTest.getUserToken()).toEqual('foo');
        });

        it('should set the application key', function () {
            expect(serviceUnderTest.getApplicationKey()).toBeNull();
            serviceUnderTest.setApplicationKey('foo');
            expect(serviceUnderTest.getApplicationKey()).toEqual('foo');
        });

        it('should set the application name', function () {
            expect(serviceUnderTest.getApplicationName()).toBeNull();
            serviceUnderTest.setApplicationName('foo');
            expect(serviceUnderTest.getApplicationName()).toEqual('foo');
        });

        it('should get the application domain as null', function () {
            expect(serviceUnderTest.getApplicationDomain()).toBeNull();
        })
    })


});
