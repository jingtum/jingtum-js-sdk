/*
 * Test for get order book operations
*/
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const tdat = require('./Test_data.json');//Test data

describe('wallet order book test', function() {

  describe('test get order book', function() {
    it('SWT vs USD', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
      wallet.getOrderBook(tdat.DEV.tum_pair1, tdat.DEV.tum_pair2, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.success).to.equal(true);
        done();
      });
    });
    it('USD vs CNY with inactived account', function(done) {
      var wallet = new Wallet(tdat.InactiveWallet.secret);
      wallet.getOrderBook(tdat.DEV.tum_pair3, tdat.DEV.tum_pair2, function(err, data) {
        expect(err).to.be.null;
        expect(data.success).to.equal(true);
        expect(data.bids).to.have.length.least(1);
        done();
      });
    });
    it('CNY vs USD ', function(done) {
      // have cny
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
      wallet.getOrderBook(tdat.DEV.tum_pair2,tdat.DEV.tum_pair3, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.asks).to.have.length.least(1);
        done();
      });
    });
  });
});

