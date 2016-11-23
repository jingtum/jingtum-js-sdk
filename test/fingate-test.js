/**
 * Created by lipc on 2016/11/21.
 */
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const fingate        = require('../lib/FinGate');
const config         = require('../config.json');
describe('FinGate test\n', function() {
    it('create a wallet', function () {
        var wallet = fingate.createWallet();
        expect(wallet).to.be.an.instanceOf(Wallet);
        expect(wallet.address).to.not.empty;
        expect(wallet.secret).to.not.empty;
        expect(wallet._activated).to.be.equal(false);
    });

    it('set fingate account', function () {
        var secret = 'sn37nYrQ6KPJvTFmaBYokS3FjXUWd';
        var address = 'jB7rxgh43ncbTX4WeMoeadiGMfmfqY2xLZ';
        fingate.setAccount(secret,address);
        expect(fingate.address).to.equal(address);
        expect(fingate.secret).to.equal(secret);
    });

    it('set config', function () {
        fingate.setConfig('token','sign_key string');
        expect(fingate.token).to.equal('token');
        expect(fingate.sign_key).to.equal('sign_key string');
    });

    it('change environment', function () {
        fingate.setTest(false);
        expect(fingate._url).to.equal(config.fingate);
        fingate.setTest(true);
        expect(fingate._url).to.equal(config.test_fingate);
    });

    it('send tong', function (done) {
        fingate.issueCustomTum({
            'custom':'00000008',
            'order':'019',//测试是需要修改order值，序号加一。
            'currency':'8200000008000020160010000000000020000001',
            'amount':'0.01',
            'account':'jMoqSwXyaTSWtGvkYLGyVLd6ppHcDi6UcL',
            'key':'5361ef7e7e36c155dcc77354913d1a4dd458f37b'
        }, function (err,data) {
            expect(err).to.be.null;
            expect(data).to.be.not.empty;
            expect(data.currency).to.equal('8200000008000020160010000000000020000001');
            expect(data.order).to.equal('019');//测试是需要修改order值，序号加一。
            done();
        });
        this.timeout(15000);
    });

    it('send tong status', function (done) {
        fingate.queryIssue({
            'custom':'00000008',
            'order':'004',
            'key':'5361ef7e7e36c155dcc77354913d1a4dd458f37b',
            'url':'http://tfingate.jingtum.com/v1/business/node'
        }, function (err,data) {
            expect(err).to.be.null;
            expect(data).to.be.not.empty;
            expect(data.order).to.equal('004');
            expect(data.status).to.equal(true);
            done();
        });
    });

    it('tong status', function (done) {
        fingate.queryCustomTum({
            'custom':'00000008',
            'currency':'8200000008000020160010000000000020000001',
            'date':'1479183410',
            'key':'5361ef7e7e36c155dcc77354913d1a4dd458f37b',
            'url':'http://tfingate.jingtum.com/v1/business/node'
        }, function (err, data) {
            expect(err).to.be.null;
            expect(data).to.be.not.empty;
            expect(data.currency).to.equal('8200000008000020160010000000000020000001');
            done();
        });
    });
});