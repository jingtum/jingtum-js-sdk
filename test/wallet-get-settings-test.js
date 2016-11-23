/*
 * Test for get settings operations
*/
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const tdat = require('./Test_data.json');//Test data

describe('wallet settings test', function() {
  before(function() {
    //Init the server
  });

  describe('test get settings', function() {
    it('1.activated account', function(done) {
      var wallet = new Wallet( tdat.DEV.wallet3.secret, tdat.DEV.wallet3.address);
      wallet.getSettings(function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.success).to.equal(true);
        done();
      });
    });
    it('2.not activated account', function(done) {
      var wallet = new Wallet();
      wallet.getSettings(function(err, data) {
        expect(err).to.be.null;
        expect(data.success).to.equal('failed');
        expect(data).to.eql({ success: 'failed', err: 400, message: 'Parameter is not a valid Jingtum address: account' });
        done();
      });
    });

    it('3.Check return info from the settings', function(done) {
      // have cny
      var wallet = new Wallet(tdat.DEV.wallet3.secret);
       wallet.getSettings(function(err, data) {
        expect(err).to.be.null;
        expect(data).to.not.empty;
        expect(data.settings.account).to.eql(tdat.DEV.wallet3.address);
        done();
      });
    });
  });
});

