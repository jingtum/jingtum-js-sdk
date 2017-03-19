/**
 * Test set and remove set operations
*/
const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const SettingsOperation = require('../lib/SettingsOperation');
const config         = require('../config.json');
const fingate        = require('../lib/FinGate');
const tdat           = require('./Test_data.json');

fingate.setMode(fingate.DEVELOPEMENT);

describe('set settings operation', function() {

	describe('test normal set settings', function() {
		it('change environment', function () {
			var wallet = new Wallet(tdat.DEV.wallet5.secret);

			fingate.setMode(fingate.PRODUCTION);
			var set1 = new SettingsOperation(wallet);
			expect(set1._server._serverURL).to.equal(config.server);

			fingate.setMode(fingate.DEVELOPEMENT);
			var set2 = new SettingsOperation(wallet);
			expect(set2._server._serverURL).to.equal(config.test_server);
		});

		it('sync set settings', function(done) {
			var wallet = new Wallet(tdat.DEV.wallet2.secret);
			var set = new SettingsOperation(wallet);
			var transfer_rate = 1.00;
			set.setValidate(true);
			set.setTransferRate(transfer_rate);
			set.submit(function (err, data) {
				// console.log(data.toString());
				expect(err).to.be.null;
				expect(data.success).to.be.equal(true);
				expect(data.state).to.be.equal('validated');
				expect(data.settings.transfer_rate).to.be.equal(transfer_rate);

                //Should return the account settings
				wallet.getSettings(function(err, data) {
			        expect(err).to.be.null;
			        expect(data).to.not.empty;
			        expect(data.success).to.equal(true);
                    expect(data.settings.acount).to.be.equal(wallet.address);
			    });
				done();
			});
			this.timeout(15000);
		});
		// it('async swt/usd set', function(done) {
		// 	var wallet = new Wallet(tdat.DEV.wallet2.secret);
		// 	var set = new SettingsOperation(wallet);
		// 	set.setValidate(false);
		// 	set.setCounterparty(tdat.DEV.wallet1.address);
		// 	set.setType(set.AUTHORIZE);
		// 	set.setAmount(tdat.DEV.CNYAmount1);
		// 	set.submit(function (err, data) {
		// 		expect(err).to.be.null;
		// 		expect(data.success).to.be.equal(true);
		// 		expect(data.state).to.be.equal('pending');
		// 		done();
		// 	});
		// });
	});
});

