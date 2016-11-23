const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const OrderOperation = require('../lib/OrderOperation');

var gt = 'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT';
// C account create offer CNY-USD
var secret_c = 'safUazSj1q6v4CVYEyeF58k59USfC';
var address_c = 'j44rkkVKxnqhm9cP7kQqpj27YGYTFAEFRh';

describe('wallet create order test', function() {

	describe('test normal create order', function() {
		it('sync cny/usd order', function(done) {
			var wallet = new Wallet(secret_c);
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
				done();
			});
			this.timeout(10000);
		});
		it('async cny/usd order', function(done) {
			var wallet = new Wallet(secret_c, address_c);
			var order = new OrderOperation(wallet);
			order.setOrderType('sell');
			order.setValidate(false);
			order.setTakerPays({ value: '1', currency: 'CNY', issuer: gt });
			order.setTakerGets({ value: '1', currency: 'USD', issuer: gt });
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

