/**
 * Created by lipc on 2016/11/21.
 */
const expect         = require('chai').expect;
const Single          = require('../lib/Single');
const config         = require('../config.json');


describe('Single test\n', function() {

    it('change environment', function () {
        var single = new Single().getInstance();
        single.setMode(true);//正式环境
        expect(single.server).to.equal(config.server);
        expect(single.fingate).to.equal(config.fingate);
        expect(single.ws).to.equal(config.ws);

        single.setMode(false);//测试环境
        expect(single.server).to.equal(config.test_server);
        expect(single.fingate).to.equal(config.test_fingate);
        expect(single.ws).to.equal(config.test_ws);
    });
});