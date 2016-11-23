const AccountClass     = require('../lib/AccountClass');
const expect         = require('chai').expect;

const secret_1 = 'shBGm5E1EBPM9V8y5Q3NKyjehaGp9';
const address_1 = 'jpzuq1jxJkQ2SYatmdDV4DaE2cSFGuykfe';

describe('test AccountClass', function() {

	it('a normal wallet', function() {
		var secret = secret_1;
		var address = address_1;
		var wallet = new AccountClass(secret, address);
		expect(wallet).to.be.an.instanceof(AccountClass);
		expect(wallet.address).to.be.equal(address);
		expect(wallet.secret).to.be.equal(secret);
	});

	it('create use secret', function() {
		var wallet = new AccountClass(secret_1);
		expect(wallet.secret).to.be.equal(secret_1);
		expect(wallet.address).to.be.equal(address_1);
	})

	it('invalid address', function() {
		var secret = secret_1;
		var address = 'jpzuq1jxJkQ2SYatmdDV4DaE2cSFGuykfex';
		expect(new AccountClass(secret, address).msg).to.equal('invalid address');
		
	});

	it('secret not match address', function() {
		var secret = 'sp5uk8jH5SoiMfS2H6SC6ioGXCcxZ';
		var address = address_1;
		expect(new AccountClass(secret, address).msg).to.equal('secret not match address');

		secret = '';
		expect(new AccountClass(secret, address).msg).to.equal('empty secret!');

		secret = null;
		expect(new AccountClass(secret, address).msg).to.equal('empty secret!');
	});
});

