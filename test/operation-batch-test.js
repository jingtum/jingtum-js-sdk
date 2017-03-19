/**
 * Created by zpli on 2017/03/21.
 */
const expect           = require('chai').expect;
const Wallet           = require('../lib/Wallet');
const PaymentOperation = require('../lib/PaymentOperation');
const sr               = require('../lib/Server');
const fingate          = require('../lib/FinGate');
const config           = require('../config.json');

describe('Wallet payment test\n', function() {
    it('change environment', function () {
        fingate.setMode(fingate.PRODUCTION);
        var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
        var payment = new PaymentOperation(wallet);
        expect(payment._server._serverURL).to.equal(config.server);

        fingate.setMode(fingate.DEVELOPEMENT);
        var payment2 = new PaymentOperation(wallet);
        expect(payment2._server._serverURL).to.equal(config.test_server);

    });

    it('1.Submit 0.01 SWT payment with syn option', function(done) {
        var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
        var payment = new PaymentOperation(wallet);
        payment.setValidate(true);
        payment.setDestAddress('jp53tPyrQLoFriTJhtm8Z9iLUXUDucnwVk');
        payment.setAmount({'currency':'SWT','value':'0.01','issue':''});
        var id = new sr().getClientResourceID();
        payment.setClientId(id);
        payment.submit(function (err, data) {
            expect(err).to.be.null;
            expect(data).to.not.empty;
            expect(data.success).to.be.true;
            expect(data.client_resource_id).to.be.equal(id);
            done();
        });
        this.timeout(10000);
    });


    it('2.Submit 0.01 SWT payment with asyn option', function(done) {
        var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
        var payment = new PaymentOperation(wallet);
        payment.setValidate(false);
        payment.setDestAddress('jp53tPyrQLoFriTJhtm8Z9iLUXUDucnwVk');
        payment.setAmount({'currency':'SWT','value':'0.01','issue':''});
        var id = new sr().getClientResourceID();
        payment.setClientId(id);
        payment.submit(function (err, data) {
            expect(err).to.be.null;
            expect(data).to.not.empty;
            expect(data.success).to.be.true;
            expect(data.client_resource_id).to.be.equal(id);
            done();
        });
    });

});