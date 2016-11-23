const expect               = require('chai').expect;
const CancelOrderOperation = require('../lib/CancelOrderOperation');
const OrderOperation       = require('../lib/OrderOperation');
const Wallet               = require('../lib/Wallet');
const config               = require('../config.json');

var gt = 'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT';
// C account create offer CNY-USD
var secret_c = 'safUazSj1q6v4CVYEyeF58k59USfC';
var address_c = 'j44rkkVKxnqhm9cP7kQqpj27YGYTFAEFRh';

describe('wallet cancel order test', function() {
	describe('test normal cancel order', function() {
		it('change environment', function () {
			var wallet = new Wallet(secret_c, address_c);
			var cancelorder = new CancelOrderOperation(wallet,3);
			cancelorder.setTest(false);
			expect(cancelorder._server._serverURL).to.equal(config.server);
			cancelorder.setTest(true);
			expect(cancelorder._server._serverURL).to.equal(config.test_server);
		});
		it('sync cancel cny/usd order', function(done) {
			var wallet = new Wallet(secret_c, address_c);
			var order = new OrderOperation(wallet);
			order.setOrderType('sell');
			order.setValidate(true);
			order.setTakerPays({ value: '1', currency: 'CNY', issuer: gt });
			order.setTakerGets({ value: '1', currency: 'USD', issuer: gt });
			order.submit(function (err, data) {
				expect(err).to.be.null;
				expect(data.success).to.be.equal(true);
				expect(data.state).to.be.equal('validated');
				expect(data.sequence).to.not.null;
				var cancelorder = new CancelOrderOperation(wallet,data.sequence);
				cancelorder.setValidate(true);
				cancelorder.submit(function (err2, data2) {
					expect(err2).to.be.null;
					expect(data2.success).to.be.equal(true);
					expect(data2.state).to.be.equal('validated');
					expect(data2.sequence).to.be.equal(data.sequence + 1);
					done();
				});
			});
			this.timeout(20000);
		});
		it('async cancel cny/usd order', function(done) {
			var wallet = new Wallet(secret_c, address_c);
			var order = new OrderOperation(wallet);
			order.setOrderType('sell');
			order.setValidate(true);
			order.setTakerPays({ value: '1', currency: 'CNY', issuer: gt });
			order.setTakerGets({ value: '1', currency: 'USD', issuer: gt });
			order.submit(function (err, data) {
				expect(err).to.be.null;
				expect(data.success).to.be.equal(true);
				expect(data.state).to.be.equal('validated');
				expect(data.sequence).to.not.null;
				var cancelorder = new CancelOrderOperation(wallet,data.sequence);
				cancelorder.setValidate(false);
				cancelorder.submit(function (err2, data2) {
					expect(err2).to.be.null;
					expect(data2.success).to.be.equal(true);
					expect(data2.state).to.be.equal('pending');
					expect(data2.sequence).to.be.equal(data.sequence + 1);
					done();
				});
			});
			this.timeout(15000);
		});
	});
});

