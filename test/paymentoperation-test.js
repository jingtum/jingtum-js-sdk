/**
 * Created by lipc on 2016/11/21.
 */
const expect           = require('chai').expect;
const Wallet           = require('../lib/Wallet');
const PaymentOperation = require('../lib/PaymentOperation');
const sr               = require('../lib/Server');
const config           = require('../config.json');

describe('Wallet payment test\n', function() {
    it('change environment', function () {
        var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
        var payment = new PaymentOperation(wallet);
        wallet.setTest(false);
        expect(payment._server._serverURL).to.equal(config.server);
        wallet.setTest(true);
        expect(payment._server._serverURL).to.equal(config.test_server);

    });

    it('1.Submit 0.01 SWT payment with syn option', function(done) {
        var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
        var payment = new PaymentOperation(wallet);
        payment.setValidate(true);
        payment.setDestination('jp53tPyrQLoFriTJhtm8Z9iLUXUDucnwVk');
        payment.setDestAmount({'currency':'SWT','value':'0.01','issue':''});
        var id = new sr().getClientResourceID();
        payment.setClientResourceID(id);
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
        payment.setDestination('jp53tPyrQLoFriTJhtm8Z9iLUXUDucnwVk');
        payment.setDestAmount({'currency':'SWT','value':'0.01','issue':''});
        var id = new sr().getClientResourceID();
        payment.setClientResourceID(id);
        payment.submit(function (err, data) {
            expect(err).to.be.null;
            expect(data).to.not.empty;
            expect(data.success).to.be.true;
            expect(data.client_resource_id).to.be.equal(id);
            done();
        });
    });

});