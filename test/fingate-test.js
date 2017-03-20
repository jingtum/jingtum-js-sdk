/**
 * Test FinGate methods
 * 
*/
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const fingate        = require('../lib/FinGate');
const config         = require('../config.json');

fingate.setMode(fingate.DEVELOPEMENT);//切换到测试环境

describe('FinGate test\n', function() {
    it('create a wallet', function () {
        var wallet = fingate.createWallet();
        expect(wallet).to.be.an.instanceOf(Wallet);
        expect(wallet.address).to.not.empty;
        expect(wallet.secret).to.not.empty;
    });

    it('set fingate account', function () {
        var secret = 'sn37nYrQ6KPJvTFmaBYokS3FjXUWd';
        var address = 'jB7rxgh43ncbTX4WeMoeadiGMfmfqY2xLZ';
        fingate.setAccount(secret,address);
        expect(fingate.address).to.equal(address);
        expect(fingate.secret).to.equal(secret);
    });

    it('set activeAmount', function () {
        fingate.setActiveAmount(30);
        expect(fingate.activeAmount).to.equal('30');
    });

    it('set token', function () {
        fingate.setToken('00000006');
        expect(fingate._custom).to.equal('00000006');
    });

    it('set key', function () {
        fingate.setKey('599669081491b660cb5ea9b2c9a183378c10d86d');
        expect(fingate._ekey).to.equal('599669081491b660cb5ea9b2c9a183378c10d86d');
    });

    it('change environment', function () {
        fingate.setMode(fingate.PRODUCTION);
        expect(fingate._url).to.equal(config.fingate);
        fingate.setMode(fingate.DEVELOPEMENT);
        expect(fingate._url).to.equal(config.test_fingate);
    });

    it('send tong', function (done) {
        fingate.issueCustomTum(
            '8200000006000020170019000000000020000001',
            '0.01',
            'jpkLNK2D1y8D8sinoRuk2PXoT1eDQvx56p'
        , function (err,data) {
            expect(err).to.be.null;
            expect(data).to.be.not.empty;
            expect(data.code).to.equal(0);
            done();
        });
        this.timeout(15000);
    });

    it('send tong status', function (done) {
        fingate.queryIssue('PREFIX90301520170118210106000001'
            , function (err,data) {
            expect(err).to.be.null;
            expect(data).to.be.not.empty;
            expect(data.order).to.equal('PREFIX90301520170118210106000001');
            expect(data.status).to.equal(true);
            done();
        });
    });

    it('tong status', function (done) {
        fingate.queryCustomTum(
            '8200000006000020170019000000000020000001'
            , function (err, data) {
            expect(err).to.be.null;
            expect(data).to.be.not.empty;
            expect(data.currency).to.equal('8200000006000020170019000000000020000001');
            done();
        });
    });
});