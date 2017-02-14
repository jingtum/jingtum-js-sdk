/*
 * Test for get transactionList operations
 * and get transaction by HASH/ID.
*/
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const tdat = require('./Test_data.json');//Test data
const fingate        = require('../lib/FinGate');

fingate.setMode(false);//切换到测试环境


describe('Wallet getTransaction tests\n', function() {

  describe('Testing get Transaction operations\n', function() {

//1st 
    it('Get all TX from an activated account', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
      wallet.getTransactionList(function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.transactions).to.have.length.least(8);
        console.log(data);
        done();
      });
        this.timeout(15000);
    });

//2nd 
    it('With not activated account', function(done) {
      var wallet = new Wallet(tdat.InactiveWallet.secret);
      wallet.getTransactionList(function(err, data) {
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
        this.timeout(5000);
    });

//4th 
    it('Single Transaction with hash', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
        var hash = '1D3A13C10C5A477935F699204BCD9B7BF694EA0420FF9BF62AD3A1B7717519FE';
       wallet.getTransaction(hash, function(err, data) {
       expect(err).to.be.null;
       expect(data).to.not.empty;
       expect(data.transaction.hash).to.equal(hash);
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

