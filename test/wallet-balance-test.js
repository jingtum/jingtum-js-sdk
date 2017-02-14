/*
 * Test for get balance operations
*/
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');

const tdat = require('./Test_data.json');//Test data
const fingate          = require('../lib/FinGate');




//var fingate = new FinGate();//FinGate::getInstance();

//fingate.setMode(FinGate.DEVLOPMENT);
fingate.setMode(fingate.DEVELOPEMENT);

describe('wallet balance test', function() {

  describe('test get balance', function() {
    it('1.activated account', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);

      wallet.getBalance(function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.balances.length).to.have.least(1);
        done();
      });
    });
    return;
    
    it('2.not activated account', function(done) {
      var wallet = new Wallet();
      wallet.getBalance(function(err, data) {
        expect(err).to.be.null;
        expect(data.success).to.equals('failed');
        done();
      });
    });

    it('3.All balances in the wallet', function(done) {
      // have cny
      var wallet = new Wallet( tdat.DEV.wallet3.secret,tdat.DEV.wallet3.address);
      wallet.getBalance(function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.balances.length).to.have.least(4);
        done();
      });
    });

    it('4.Balances with currency option ', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet1.secret,tdat.DEV.wallet1.address);
      wallet.getBalance('SWT', function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.balances).to.have.lengthOf(1);
        done();
    });
  });


    it('5.Balances with object type option ', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret,tdat.DEV.wallet3.address);
      wallet.getBalance('USD',tdat.DEV.wallet1.address, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.balances).to.have.lengthOf(1);
        done();
      });
    });
});

});

