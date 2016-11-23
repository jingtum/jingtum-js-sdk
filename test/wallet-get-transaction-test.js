/*
 * Test for get transactionList operations
 * and get transaction by HASH/ID.
*/
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const tdat = require('./Test_data.json');//Test data


describe('Wallet getTransaction tests\n', function() {

  describe('Testing get Transaction operations\n', function() {

//1st 
    it('Get all TX from an activated account', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
      wallet.getTransactionList(null, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.transactions).to.have.length.least(8);
        done();
      });
    });

//2nd 
    it('With not activated account', function(done) {
      var wallet = new Wallet(tdat.InactiveWallet.secret);
      wallet.getTransactionList(null, function(err, data) {
        expect(err).to.be.null;
        expect(data.success).to.equal(true);
        expect(data.transactions).to.eql([]);
        done();
      });
    });

//3rd
    it('Transaction list with options', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
      var opt ={};
      opt.source_account = tdat.DEV.options.source_account;
      opt.results_per_page = tdat.DEV.options.results_per_page;
      wallet.getTransactionList(opt, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.transactions).to.have.length.least(2);
        done();
      });
    });

//4th 
    it('Single Transaction with hash', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
       wallet.getTransaction(tdat.DEV.wallet3.payment_id1, function(err, data) {
       expect(err).to.be.null;
       expect(data).to.not.empty;
       expect(data.transaction.hash).to.equal(tdat.DEV.wallet3.payment_id1);
       done();
     });
    });

//5th 
    it('Single Transaction with client resource ID', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
       wallet.getTransaction(tdat.DEV.wallet3.client_resource_id1, function(err, data) {
       expect(err).to.be.null;
       expect(data).to.not.empty;
       expect(data.transaction.client_resource_id).to.equal(tdat.DEV.wallet3.client_resource_id1);
       done();
     });
    });
  });
});

