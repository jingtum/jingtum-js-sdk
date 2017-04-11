/*
 * Test for get payment path methods
 * Added the payment path by currency choice
 * test.
*/
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const ParamException = require('../lib/Error').ParamException;
const tdat = require('./test_data.json');//Test data
var sha1             = require('sha1');
const fingate        = require('../lib/FinGate');

fingate.setMode(fingate.DEVELOPEMENT);//切换到测试环境


describe('Tests about payment path\n', function() {
  before(function() {
    //Init the server
  });
  describe('Get path tests\n', function() {
    it('SWT payment path:', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet2.secret);
      wallet.getChoices(tdat.DEV.wallet2.address,
          tdat.SWTAmount1,null, function(err, data) {
        expect(err).to.be.an.instanceOf(ParamException);
        expect(err.msg).to.be.equal('支付SWT不需要路径！');
        expect(data).to.be.undefined;
        done();
      });
    });

    it('SWT payment path with inactive address', function(done) {
      var wallet = new Wallet(tdat.InactiveWallet.secret);
      wallet.getChoices(tdat.DEV.wallet3.address,
          tdat.DEV.CNYAmount1,null, function(err, data) {
        expect(err).to.be.null;
        expect(data.success).to.be.failed;
        done();
      });
    });
    it('Payment path for USD test', function(done) {
      // have cny
      var wallet = new Wallet(tdat.DEV.wallet2.secret);
      wallet.getChoices(tdat.DEV.wallet3.address,
          tdat.DEV.USDAmount1,null, function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.length).to.be.least(1);
        done();
      });
    });

    it('Payment path all', function(done) {

      var wallet = new Wallet(tdat.DEV.wallet2.secret);
      wallet.getChoices(tdat.DEV.wallet3.address,
          {"currency":"CNY", "value": "0.01", "issuer":"jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT"},null
          , function(err, data) {
        expect(err).to.be.null;
        expect(data.length).to.be.least(1);
        expect(data[0].key).to.eql('7d6370e3dc63fa2c9351b51c7069ba08799d888a');
        expect(data[0].choice).to.eql({ value: '0.01', currency: 'SWT', issuer: '' });
        done();
      });
    });
  
      it('Payment path with currency type', function(done) {
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
      wallet.getChoices(tdat.DEV.wallet4.address,
          {"currency":"USD", "value": "0.01", "issuer":"jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS"},
          {'issuer':'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS','currency':'CNY'}, function(err, data) {
        expect(err).to.be.null;
        expect(data.length).to.be.least(1);
        done();
      });
    });
  });
});

