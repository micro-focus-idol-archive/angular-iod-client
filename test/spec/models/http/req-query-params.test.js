/**
 * Created by avidan on 11-05-15.
 */

describe('Test the ReqQueryParams Object', function(){

    describe('validate the Object\'s constructor', function (){

        it('Should create a new Object with an empty constructor', function(){
            var reqQuery = new ReqQueryParams();
            expect(reqQuery.params).toEqual({})
            expect(reqQuery.append).toBeDefined();
            expect(reqQuery.remove).toBeDefined();
        });

        it('Should create a new Object with an argument in the constructor', function(){
            var arg = {foo:123}
            var reqQuery = new ReqQueryParams(arg)
            expect(reqQuery.params).toEqual(arg);
        });

        it('Should create a new object with a Boolean argument', function (){
            var arg = {foo:true}
            var reqQuery = new ReqQueryParams(arg)
            expect(reqQuery.params).toEqual(arg);

            var arg2 = {koo:false}
            var reqQuery2 = new ReqQueryParams(arg2)
            expect(reqQuery2.params).toEqual(arg2);
        });

        it('Should create a new object with an array as value', function (){
            var arg = {foo:[1,2,3,4],koo:true,boo:['a','b']}
            var reqQuery = new ReqQueryParams(arg)
            expect(reqQuery.params).toEqual(arg);
        });
    });

    describe('validate the append and delete methods',function (){

        it('Should append a new param', function (){
            var reqQuery = new ReqQueryParams();
            expect(reqQuery.params['foo']).toBeUndefined();
            reqQuery.append({foo:123});
            expect(reqQuery.params['foo']).toEqual(123);
        });

        it('Should append a new param and than delete it', function (){
            var reqQuery = new ReqQueryParams();
            expect(reqQuery.params['foo']).toBeUndefined();
            reqQuery.append({foo:123});
            expect(reqQuery.params['foo']).toEqual(123);
            reqQuery.remove('foo');
            expect(reqQuery.params['foo']).toBeUndefined();
        });

        it('Should append another argument to an existing param', function (){
            var reqQuery = new ReqQueryParams();
            expect(reqQuery.params['foo']).toBeUndefined();
            reqQuery.append({foo:123});
            expect(reqQuery.params['foo']).toEqual(123);
            reqQuery.append({foo:456});
            expect(reqQuery.params['foo']).toEqual([123,456]);
        });

        it('Should append a new param', function (){
            var reqQuery = new ReqQueryParams();
            expect(reqQuery.params['foo']).toBeUndefined();
            reqQuery.append({foo:123});
            expect(reqQuery.params['foo']).toEqual(123);
            reqQuery.append({koo:456});
            expect(reqQuery.params).toEqual({foo:123, koo:456});
        });
    });
});
