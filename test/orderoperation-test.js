const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const OrderOperation = require('../lib/OrderOperation');
const config        = require('../config.json');
const fingate        = require('../lib/FinGate');

var gt = 'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT';
// C account create offer CNY-USD
var secret_c = 'safUazSj1q6v4CVYEyeF58k59USfC';
var address_c = 'j44rkkVKxnqhm9cP7kQqpj27YGYTFAEFRh';

describe('wallet create order test', function() {

	describe('test normal create order', function() {
		it('change environment', function () {
			var wallet = new Wallet(secret_c);

			fingate.setMode(fingate.PRODUCTION);
			var order1 = new OrderOperation(wallet);
			expect(order1._server._serverURL).to.equal(config.server);

			fingate.setMode(fingate.DEVELOPEMENT);
			var order2 = new OrderOperation(wallet);
			expect(order2._server._serverURL).to.equal(config.test_server);
		});

		it('sync swt/usd order', function(done) {
			var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
			var order = new OrderOperation(wallet);
			order.setValidate(true);
			order.setPair('SWT/USD:jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT');
			order.setType(order.SELL);
			order.setAmount(0.1);
			order.setPrice(0.5);
			order.submit(function (err, data) {
				expect(err).to.be.null;
				expect(data.success).to.be.equal(true);
				expect(data.state).to.be.equal('validated');
				expect(data.sequence).to.not.null;
				done();
			});
			this.timeout(50000);
		});
		it('async swt/usd order', function(done) {
			var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
			var order = new OrderOperation(wallet);
			order.setValidate(false);
			order.setPair('SWT/USD:jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT');
			order.setType(order.SELL);
			order.setAmount(0.1);
			order.setPrice(0.5);
			order.submit(function (err, data) {
				expect(err).to.be.null;
				expect(data.success).to.be.equal(true);
				expect(data.state).to.be.equal('pending');
				expect(data.sequence).to.not.null;
				done();
			});
		});
	});
});

