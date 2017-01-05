/**
 * Created by lipc on 2016/11/21.
 */
const expect                  = require('chai').expect;
const Wallet                  = require('../lib/Wallet');
const TrustlineOperation      = require('../lib/TrustlineOperation');
const tdat                    = require('./Test_data.json');//Test data
const config                  = require('../config.json');

describe('Wallet trustline tests', function() {
    it('change environment', function () {
        var wallet = new Wallet(tdat.DEV.wallet3.secret);
        var trustline = new TrustlineOperation(wallet);
        wallet.setTest(false);
        expect(trustline._server._serverURL).to.equal(config.server);
        wallet.setTest(true);
        expect(trustline._server._serverURL).to.equal(config.test_server);
    });

    it('Add trustlines', function(done) {
        //Add a CNY trust
        var wallet = new Wallet(tdat.DEV.wallet3.secret);
        var trustline = new TrustlineOperation(wallet);
        trustline.setTrustlineAmount({currency:'CNY',value:'100',issuer:'jMhLAPaNFo288PNo5HMC37kg6ULjJg8vPf'});
        trustline.submit(function (err, data) {
            expect(err).to.be.null;
            expect(data).to.not.empty;
            expect(data.success).to.equal(true);
            done();
        });
    });
});
