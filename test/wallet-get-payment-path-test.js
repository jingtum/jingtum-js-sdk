/*
 * Test for get payment path operations
*/
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const ParamException = require('../lib/Error').ParamException;
const tdat = require('./Test_data.json');//Test data
var sha1             = require('sha1');


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
          tdat.DEV.USDAmount1,null, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.success).to.be.failed;
        expect(data.message).to.be.equal('No paths found. The destination_account does not accept USD, source may not fund enough.');
        done();
      });
    });

    it('Payment path all', function(done) {

      var wallet = new Wallet(tdat.DEV.wallet_orders.secret);
      wallet.getPathList(tdat.DEV.wallet1.address,
          tdat.DEV.CNYAmount1,null, function(err, data) {
        expect(err).to.be.null;
        expect(data.length).to.be.least(1);
        expect(data[0].key).to.eql('7d6370e3dc63fa2c9351b51c7069ba08799d888a');
        expect(data[0].choice).to.eql({ value: '1', currency: 'SWT', issuer: '' });
        done();
      });
    });
    it('Payment path with currency type', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet_orders.secret);
      wallet.getPathList(tdat.DEV.wallet1.address,
          tdat.DEV.CNYAmount1,{'issuer':'jMhLAPaNFo288PNo5HMC37kg6ULjJg8vPf','currency':'USD'}, function(err, data) {
        expect(err).to.be.null;
        expect(data.length).to.be.least(1);
        expect(data[0].key).to.eql(sha1(JSON.stringify('[[{"currency":"CNY","issuer":"jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT","type":48,"type_hex":"0000000000000030"}]]')));
        done();
      });
    });
  });
});

