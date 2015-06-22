function createMockDeferredHttpResult($q, dataToReturn, failRequest) {
  var deferred = $q.defer();
  if (failRequest === undefined || failRequest === false) {
    deferred.resolve(dataToReturn);
  }
  else {
    deferred.reject(dataToReturn);
  }

  var promise = deferred.promise;
  promise.success = function (fn) {
    promise.then(fn);
    return promise;
  };
  promise.error = function (fn) {
    promise.then(null, fn);
    return promise;
  };
  return promise;
}

function createIODConnectorMockSpyFunction($q, spyName, mockResult) {
  var spyFunction = jasmine.createSpy(spyName);
  spyFunction.and.returnValue(createMockDeferredHttpResult($q, mockResult));
  return spyFunction;
}

function createIODConnectorMockSpyFunctionThatFails($q, spyName, mockResult) {
  var spyFunction = jasmine.createSpy(spyName);
  spyFunction.and.returnValue(createMockDeferredHttpResult($q, mockResult, true));
  return spyFunction;
}
