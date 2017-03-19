/**
 * Created by lipc on 2016/11/22.
 */
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const WS             = require('../lib/WebSocketServer');
const tdat           = require('./test_data.json');//Test data
const config         = require('../config.json');
const fingate        = require('../lib/FinGate');

fingate.setMode(fingate.DEVELOPEMENT);//切换到测试换


var wallet = new Wallet(tdat.DEV.wallet3.secret);
//注：需单独测试每一个it。
describe('websocketserver test', function() {

    it('change environment', function () {
        fingate.setMode(fingate.PRODUCTION);//切换到正式
        var ws1 = new WS();
        expect(ws1._ws.url).to.equal(config.ws);

        fingate.setMode(fingate.DEVELOPEMENT);//切换到测试
        var ws2 = new WS();
        expect(ws2._ws.url).to.equal(config.test_ws);
    });

    it('connect', function (done) {
        var ws = new WS();
        ws.connect(function(err,data){
            console.log(data);
            expect(err).to.be.null;
            expect(data).to.not.empty;
            expect(data.type).to.equal('connection');
            expect(data.success).to.equal(true);
            done();
        });
    });

    it('subscribe', function (done) {
        var ws = new WS();
        ws.connect();
        ws.subscribe(wallet, function(err,data){
            console.log(data);
            expect(err).to.be.null;
            expect(data).to.not.empty;
            expect(data.type).to.equal('subscribe');
            expect(data.success).to.equal(true);
            done();
        });
    });

    it('unsubscribe', function (done) {
        var ws = new WS();
        ws.connect();
        ws.unsubscribe(wallet, function(err,data){
            expect(err).to.be.null;
            expect(data).to.not.empty;
            expect(data.type).to.equal('unsubscribe');
            expect(data.success).to.equal(true);
            done();
        });
    });

    it('disconnect', function () {
        var ws = new WS();
        ws.disconnect();
        expect(ws._ws).to.be.null;
    });
});