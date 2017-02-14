/*
 * Test for get trustline operations
*/
const expect                  = require('chai').expect;
const Wallet                  = require('../lib/Wallet');
const TrustlineOperation      = require('../lib/TrustlineOperation');
const tdat                    = require('./Test_data.json');//Test data
const fingate                 = require('../lib/FinGate');

fingate.setMode(false);//切换到测试环境


describe('Wallet trustline tests', function() {

  describe('Start testing trustlines functions', function() {
    it('1. Get all trustlines with one activated account', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
      wallet.getTrustLineList(null, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.trustlines).to.have.length.least(1);
        done();
      });
    });
    it('2. With not-activated account', function(done) {
      var wallet = new Wallet();
      wallet.getTrustLineList(null, function(err, data) {
        expect(err).to.be.null;
        expect(data.success).to.equal('failed');
        done();
      });
    });

    it('3. Get trustlines with currency options', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
      wallet.getTrustLineList({'currency':'USD'}, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.trustlines).to.have.length.least(1);
        done();
      });
    });
    it('4. Get trustlines with issuer options', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
      wallet.getTrustLineList({'issuer':'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT'}, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.trustlines).to.have.length.least(1);
        done();
      });
    });

    it('5. Get trustlines with currency and issuer options', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
      wallet.getTrustLineList({'currency':'USD','issuer':'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT'}, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.trustlines[0].limit).to.equal('100');
        done();
      });
    });
  });
});

