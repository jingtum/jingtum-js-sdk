/*
 * Test for get payment list operations
 * and get payment by HASH/ID.
*/
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const tdat           = require('./test_data.json');//Test data
const fingate        = require('../lib/FinGate');

fingate.setMode(fingate.DEVELOPEMENT);//切换到测试换

describe('wallet get payment list test', function() {

  describe('Testing get payment operations', function() {

//1st 
    it('activated account', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet2.secret);
      wallet.getPaymentList({results_per_page:5,page:1}, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.payments).to.have.length.least(1);
        done();
      });
      this.timeout(15000);
    });

//2nd 
    it('not activated account', function(done) {
      var wallet = new Wallet('sas6eH75R6cRPF2Mz7RoyFdTjrQ6R');
        wallet.getPaymentList({results_per_page:5,page:1}, function(err, data) {
        expect(err).to.be.null;
        expect(data.success).to.equal(true);
        expect(data.payments).to.eql([]);
        done();
      });
    });

//3rd
    it('payment list with client_resource_id', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
        wallet.getPayment(tdat.DEV.wallet3.client_resource_id1, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.client_resource_id).to.equal(tdat.DEV.wallet3.client_resource_id1);
        done();
      });
    });

//4th 
    it('Single payment with hash', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
       wallet.getPayment(tdat.DEV.wallet3.payment_id1, function(err, data) {
       expect(err).to.be.null;
       expect(data).to.not.empty;
       expect(data.hash).to.equal(tdat.DEV.wallet3.payment_id1);
       done();
     });
    });
  });
});

