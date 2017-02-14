const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const config         = require('../config.json');
const fingate          = require('../lib/FinGate');

fingate.setMode(false);//切换到测试环境

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
		});
		it('2.another normal wallet', function() {
			var wallet = new Wallet(secret2);//密码创建
			expect(wallet).to.be.an.instanceof(Wallet);
			expect(wallet.address).to.be.equal(address2);
			expect(wallet.secret).to.be.equal(secret2);
		});
		
	});

	describe('change environment', function() {
		it('test server url', function() {
			fingate.setMode(true);//切换到正式环境
			var wallet = new Wallet(secret1);
			expect(wallet).to.be.an.instanceOf(Wallet);
			expect(wallet._server._serverURL).to.equal(config.server);

			fingate.setMode(false);//切换到测试环境
			var wallet2 = new Wallet(secret1);
			expect(wallet2._server._serverURL).to.equal(config.test_server)
		});
	});
});

