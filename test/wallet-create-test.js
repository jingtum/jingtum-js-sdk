const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');

var gt = 'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT';
var secret_gt = 'ssPitXium2f2ZxifEaAB2YTpJUpJV';

// not activated account
var secret1 = 'shBGm5E1EBPM9V8y5Q3NKyjehaGp9';
var address1 = 'jpzuq1jxJkQ2SYatmdDV4DaE2cSFGuykfe';
// activaed account
var secret2 = 'snZe5vNkrDELYGrry61xN2GGijJbt';
var address2 = 'jfatnRYLxoVwc8HtSgsmqmF7NRRQzgb3D2';
// have cny account
var secret3 = 'shrQqd46NJZPpDSM1754ebXDb6Krm';
var address3 = 'jhSmVPFFB3pBezyXzVKU97D7HEtXUJ1dZS';

describe('wallet class test', function() {
	
	describe('test wallet constructor', function() {
		it('1.a normal wallet', function() {
			var wallet = new Wallet(secret1, address1);
			expect(wallet).to.be.an.instanceof(Wallet);
			expect(wallet.address).to.be.equal(address1);
			expect(wallet.secret).to.be.equal(secret1);
			expect(wallet._activated).to.be.equal(false);
		});
		it('2.another normal wallet', function() {
			var wallet = new Wallet(secret2);//密码创建
			expect(wallet).to.be.an.instanceof(Wallet);
			expect(wallet.address).to.be.equal(address2);
			expect(wallet.secret).to.be.equal(secret2);
			expect(wallet._activated).to.be.equal(false);
		});
		
	});

	describe('test wallet status', function() {
		it('is activated wallet', function() {
			// not activated account
			var wallet = new Wallet(secret1, address1);
			expect(wallet.isActivated()).to.equal(false);
			// activated account
			wallet = new Wallet(secret2, address2);
			wallet.setActivated(true);
			expect(wallet.isActivated()).to.equal(true);
		});
	});

});

