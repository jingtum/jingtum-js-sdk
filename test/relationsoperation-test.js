const expect         = require('chai').expect;
const Wallet         = require('../lib/Wallet');
const RelationsOperation = require('../lib/RelationsOperation');
const config         = require('../config.json');
const fingate        = require('../lib/FinGate');
const tdat           = require('./Test_data.json');

fingate.setMode(fingate.DEVELOPEMENT);

describe('create order relations', function() {

	describe('test normal create relations', function() {
		it('change environment', function () {
			var wallet = new Wallet(tdat.DEV.wallet1.secret);

			fingate.setMode(fingate.PRODUCTION);
			var relation1 = new RelationsOperation(wallet);
			expect(relation1._server._serverURL).to.equal(config.server);

			fingate.setMode(fingate.DEVELOPEMENT);
			var relation2 = new RelationsOperation(wallet);
			expect(relation2._server._serverURL).to.equal(config.test_server);
		});

		it('sync swt/usd relation', function(done) {
			var wallet = new Wallet(tdat.DEV.wallet2.secret);
			var relation = new RelationsOperation(wallet);
			relation.setValidate(true);
			relation.setCounterparty(tdat.DEV.wallet1.address);
			relation.setType(relation.AUTHORIZE);
			relation.setAmount(tdat.DEV.CNYAmount1);
			relation.submit(function (err, data) {
				expect(err).to.be.null;
				expect(data.success).to.be.equal(true);
				expect(data.state).to.be.equal('validated');
				done();
			});
			this.timeout(10000);
		});
		it('async swt/usd relation', function(done) {
			var wallet = new Wallet(tdat.DEV.wallet2.secret);
			var relation = new RelationsOperation(wallet);
			relation.setValidate(false);
			relation.setCounterparty(tdat.DEV.wallet1.address);
			relation.setType(relation.AUTHORIZE);
			relation.setAmount(tdat.DEV.CNYAmount1);
			relation.submit(function (err, data) {
				expect(err).to.be.null;
				expect(data.success).to.be.equal(true);
				expect(data.state).to.be.equal('pending');
				done();
			});
		});
	});
});

