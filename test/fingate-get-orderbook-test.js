/*
 * Test FinGate3 get order book method
*/
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const tdat           = require('./test_data.json');//Test data
const fingate        = require('../lib/FinGate');

fingate.setMode(fingate.DEVELOPEMENT);//切换到测试换

describe('wallet order book test', function() {

  describe('test get order book', function() {
    it('SWT vs USD', function(done) {
      fingate.setAccount(tdat.DEV.wallet3.secret);
      var pair = 'SWT/USD:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS';
      fingate.getOrderBook(pair, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.success).to.equal(true);
        console.log(data);
        done();
      });
      this.timeout(50000);
    });
return;
    it('USD vs CNY with inactived account', function(done) {
      fingate.setAccount(tdat.InactiveWallet.secret);
      var pair = 'USD:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS/CNY:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS';
      fingate.getOrderBook(pair, function(err, data) {
        expect(err).to.be.null;
        expect(data.success).to.equal(true);
        expect(data.bids).to.have.length.least(1);
        done();
      });
    });
    it('CNY vs USD ', function(done) {
      // have cny
      fingate.setAccount(tdat.DEV.wallet3.secret);
      var pair = 'CNY:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS/USD:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS';
      fingate.getOrderBook(pair, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.asks).to.have.length.least(1);
        done();
      });
    });
    it('USD vs SWT ', function(done) {
      // have cny
      fingate.setAccount(tdat.DEV.wallet3.secret);
      var pair = 'USD:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS/SWT';
      fingate.getOrderBook(pair, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.asks).to.have.length.least(1);
        done();
      });
    });
  });
});

