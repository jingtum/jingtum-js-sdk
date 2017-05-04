/*
 * Test for get relation methods
*/
const expect                  = require('chai').expect;
const Wallet                  = require('../lib/Wallet');
const tdat                    = require('./test_data.json');//Test data
const fingate                 = require('../lib/FinGate');

fingate.setMode(fingate.DEVELOPEMENT);//切换到测试换


describe('Wallet relation tests', function() {

  describe('Start testing relation functions', function() {

    it('1. Get relation with type', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet2.secret);
      wallet.getRelationList({type:'authorize'}, function(err, data) {
console.log(data);
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.relations).to.have.length.least(1);
        done();
      });
    });
    it('2. Get relations with type and counterparty', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet2.secret);
console.log(tdat.DEV.wallet3.address);
      //wallet.getRelationList({type:'authorize',counterparty:tdat.DEV.wallet3.address}, function(err, data) {
      wallet.getRelationList({type:'authorize',counterparty:'j44rkkVKxnqhm9cP7kQqpj27YGYTFAEFRh'}, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.relations).to.have.length.least(1);
        done();
      });
    });

  });
});

