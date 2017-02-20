const expect               = require('chai').expect;
const CancelOrderOperation = require('../lib/CancelOrderOperation');
const OrderOperation       = require('../lib/OrderOperation');
const Wallet               = require('../lib/Wallet');
const config               = require('../config.json');
const fingate          = require('../lib/FinGate');

fingate.setMode(fingate.DEVELOPEMENT);//切换到测试换

var gt = 'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT';
// C account create offer CNY-USD
var secret_c = 'safUazSj1q6v4CVYEyeF58k59USfC';
var address_c = 'j44rkkVKxnqhm9cP7kQqpj27YGYTFAEFRh';

describe('wallet cancel order test', function() {
	describe('test normal cancel order', function() {
		it('sync cancel swt/usd order', function(done) {
			var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
			var order = new OrderOperation(wallet);
			order.setType(order.SELL);
			order.setValidate(true);
			order.setPair('SWT/USD:' + gt);
			order.setAmount(0.1);
			order.setPrice(0.5);
			order.submit(function (err, data) {
				expect(err).to.be.null;
				expect(data.success).to.be.equal(true);
				expect(data.state).to.be.equal('validated');
				expect(data.sequence).to.not.null;
				var cancelorder = new CancelOrderOperation(wallet);
				cancelorder.setSequence(data.sequence);
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
		it('async cancel swt/usd order', function(done) {
			var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
			var order = new OrderOperation(wallet);
			order.setType(order.SELL);
			order.setValidate(true);
			order.setPair('SWT/USD:' + gt);
			order.setAmount(0.1);
			order.setPrice(0.5);
			order.submit(function (err, data) {
				expect(err).to.be.null;
				expect(data.success).to.be.equal(true);
				expect(data.state).to.be.equal('validated');
				expect(data.sequence).to.not.null;
				var cancelorder = new CancelOrderOperation(wallet);
				cancelorder.setSequence(data.sequence);
				cancelorder.setValidate(false);
				cancelorder.submit(function (err2, data2) {
					expect(err2).to.be.null;
					expect(data2.success).to.be.equal(true);
					expect(data2.state).to.be.equal('pending');
					expect(data2.sequence).to.be.equal(data.sequence + 1);
					done();
				});
			});
			this.timeout(25000);
		});
	});
});

