/*
 * Test for get order list operations
*/
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const tdat = require('./Test_data.json');//Test data


describe('Test order list\n', function() {
  describe('test get order list', function() {
    it('activated account', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet2.secret);

      wallet.getOrders(null, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.success).to.equal(true);
        expect(data.orders).to.have.length.least(1);
        done();
      });
    });
    it('not activated account', function(done) {
      var wallet = new Wallet(tdat.InactiveWallet.secret);
      wallet.getOrders(null, function(err, data) {
        expect(err).to.be.null;
        expect(data.success).to.equal('failed');
        expect(data.message).to.equal('Account not found.');
        done();
      });
    });
    it('Count order list num', function(done) {
      // have cny
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
      wallet.getOrders(null, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        console.log("Return orders", data.orders.length);
        expect(data.orders).to.have.length.least(1);
        done();
      });
    });
  });


});

