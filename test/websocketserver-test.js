/**
 * Created by lipc on 2016/11/22.
 */
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const WS             = require('../lib/WebSocketServer');
const tdat           = require('./Test_data.json');//Test data
const config         = require('../config.json');

var ws = new WS();
var wallet = new Wallet(tdat.DEV.wallet3.secret,tdat.DEV.wallet3.address);
//注：需单独测试每一个it。
describe('websocketserver test', function() {
    it('change environment', function () {
        ws.setTest(false);
        expect(ws._ws.url).to.equal(config.ws);
        ws.setTest(true);
        expect(ws._ws.url).to.equal(config.test_ws);
    });
    it('connect', function (done) {
        ws.connect(function(err,data){
            expect(err).to.be.null;
            expect(data).to.not.empty;
            expect(JSON.parse(data).type).to.equal('connection');
            expect(JSON.parse(data).success).to.equal(true);
            done();
        });
    });

    it('subscribe', function (done) {
        ws.subscribe(wallet, function(err,data){
            expect(err).to.be.null;
            expect(data).to.not.empty;
            expect(JSON.parse(data).type).to.equal('connection');
            expect(JSON.parse(data).success).to.equal(true);
            done();
        });
    });

    it('unsubscribe', function (done) {
        ws.unsubscribe(wallet, function(err,data){
            expect(err).to.be.null;
            expect(data).to.not.empty;
            expect(JSON.parse(data).type).to.equal('connection');
            expect(JSON.parse(data).success).to.equal(true);
            done();
        });
    });

    it('disconnect', function () {
        var ws = new WS();
        ws.disconnect();
        expect(ws._ws).to.be.null;
    });
});