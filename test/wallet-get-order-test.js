const expect         = require('chai').expect;
const printf         = require('printf');
const Wallet         = require('../lib/Wallet');
const ParamException = require('../lib/Error').ParamException;

// C account create offer CNY-USD
var secret_c = 'safUazSj1q6v4CVYEyeF58k59USfC';
var address_c = 'j44rkkVKxnqhm9cP7kQqpj27YGYTFAEFRh';

describe('wallet get order test', function() {
	
	describe('test normal cancel order', function() {
		it('get cny/usd order', function(done) {
			var wallet = new Wallet(secret_c, address_c);
			var hash = '4B20ED619B193E8A146EA38513DA506C70D8A06E75FC940F1FA0E7E1F9B1B4C0';
			wallet.getOrders(hash, function(err, data) {
				expect(err).to.be.null;
				expect(data.success).to.be.equal(true);
				expect(data.hash).to.be.equal(hash);
				done();
			});
		});
	});
});

