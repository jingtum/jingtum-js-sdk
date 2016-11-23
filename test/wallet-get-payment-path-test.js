/*
 * Test for get payment path operations
*/
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const ParamException = require('../lib/Error').ParamException;
const tdat = require('./Test_data.json');//Test data


describe('Tests about payment path\n', function() {
  before(function() {
    //Init the server
  });

  describe('Get path tests\n', function() {
    it('SWT payment path:', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet2.secret);
      wallet.getPathList(tdat.DEV.wallet2.address,
          tdat.SWTAmount1,null, function(err, data) {
        expect(err).to.be.an.instanceOf(ParamException);
        expect(err.msg).to.be.equal('支付SWT不需要路径！');
        expect(data).to.be.undefined;
        done();
      });
    });

    it('SWT payment path with inactive address', function(done) {
      var wallet = new Wallet(tdat.InactiveWallet.secret);
      wallet.getPathList(tdat.DEV.wallet3.address,
          tdat.DEV.CNYAmount1,null, function(err, data) {
        expect(err).to.be.null;
        expect(data.success).to.be.failed;
        done();
      });
    });

    it('Payment path not exist test', function(done) {
      // have cny
      var wallet = new Wallet(tdat.DEV.wallet2.secret);
      wallet.getPathList(tdat.DEV.wallet3.address,
          tdat.DEV.CNYAmount1,null, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.success).to.be.failed;
        expect(data.message).to.be.equal('No paths found. The destination_account does not accept CNY, source may not fund enough.');
        done();
      });
    });

    it('Payment path all', function(done) {

      var wallet = new Wallet(tdat.DEV.wallet_orders.secret);
      wallet.getPathList(tdat.DEV.wallet1.address,
          tdat.DEV.CNYAmount1,null, function(err, data) {
        expect(err).to.be.null;
        expect(data.success).to.be.true;
        expect(data.payments.length).to.be.least(1);
        expect(data.payments[0].paths).to.eql('[[{"currency":"CNY","issuer":"jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT","type":48,"type_hex":"0000000000000030"}]]');
        done();
      });
    });
    it('Payment path with currency type', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet_orders.secret);
      wallet.getPathList(tdat.DEV.wallet1.address,
          tdat.DEV.CNYAmount1,{'issuer':'jMhLAPaNFo288PNo5HMC37kg6ULjJg8vPf','currency':'USD'}, function(err, data) {
        expect(err).to.be.null;
        expect(data.success).to.be.true;
        expect(data.payments.length).to.be.least(1);
        expect(data.payments[0].paths).to.eql('[[{"currency":"CNY","issuer":"jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT","type":48,"type_hex":"0000000000000030"}]]');
        done();
      });
    });
  });
});

