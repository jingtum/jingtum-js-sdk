/*
 * Test for get relations operations
*/
const expect                  = require('chai').expect;
const Wallet                  = require('../lib/Wallet');
const tdat                    = require('./Test_data.json');//Test data
const fingate                 = require('../lib/FinGate');

fingate.setMode(fingate.DEVELOPEMENT);//切换到测试换


describe('Wallet relations tests', function() {

  describe('Start testing relations functions', function() {

    it('1. Get relations with type', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet2.secret);
      wallet.getRelations({type:'authorize'}, function(err, data) {
        //console.log(data);
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.relations).to.have.length.least(1);
        done();
      });
    });
    it('2. Get relations with type and counterparty', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet2.secret);
      console.log("counterparty: "+tdat.DEV.wallet3.address);
        wallet.getRelations({type:'authorize',counterparty:'j44rkkVKxnqhm9cP7kQqpj27YGYTFAEFRh'}, function(err, data) {
        //console.log(data);
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.relations).to.have.length.least(1);
        done();
      });
    });
    it('3. Get relations with type but incorrect counterparty, return an empty array', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet2.secret);
      
      wallet.getRelations({type:'authorize',counterparty:tdat.DEV.wallet3.address}, function(err, data) {
        //console.log(data);
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.relations).to.empty;
        done();
      });
    });
  });
});

