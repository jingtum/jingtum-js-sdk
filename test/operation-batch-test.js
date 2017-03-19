/**
 * Test Batch operation 
*/
const expect           = require('chai').expect;
const sr               = require('../lib/Server');
const fingate          = require('../lib/FinGate');
const config           = require('../config.json');
const tdat             = require('./test_data.json');//Test data
const Wallet           = require('../lib/Wallet');
const PaymentOperation = require('../lib/PaymentOperation');
const BatchOperation   = require('../lib/BatchOperation');
const OrderOperation   = require('../lib/OrderOperation');
const RelationsOperation       = require('../lib/RelationsOperation');
const RemoveRelationsOperation = require('../lib/RemoveRelationsOperation');
const SettingsOperation        = require('../lib/SettingsOperation');


describe('Operation batch operation test\n', function() {
    it('change environment', function () {
        fingate.setMode(fingate.PRODUCTION);
        var wallet = new Wallet(tdat.DEV.wallet2.secret);
        var bop1 = new BatchOperation(wallet);
        expect(bop1._server._serverURL).to.equal(config.server);

        fingate.setMode(fingate.DEVELOPEMENT);
        var bop2 = new BatchOperation(wallet);
        expect(bop2._server._serverURL).to.equal(config.test_server);

    });

    // it('1.Submit two payment operations with syn option', function(done) {
    //     var wallet2 = new Wallet(tdat.DEV.wallet5.secret);
    //     var wallet3 = new Wallet(tdat.DEV.wallet6.secret);

    //     //build each operation
    //     var op1 = new PaymentOperation(wallet2);
    //     op1.setDestAddress(wallet3.address);
    //     op1.setAmount({'currency':'SWT','value':'0.01','issue':''});

    //     var op2 = new PaymentOperation(wallet3);
    //     op2.setDestAddress(wallet2.address);
    //     op2.setAmount({'currency':'SWT','value':'0.01','issue':''});

    //     //build batch operations
    //     var bop = new BatchOperation(wallet2);

    //     bop.setOperation(op1);
    //     bop.setOperation(op2);

    //     bop.submit(function (err, data) {
    //         console.log(data);
    //         expect(err).to.be.null;
    //         expect(data).to.not.empty;
    //         expect(data.success).to.be.true;
    //         expect(data.hash).to.not.empty;
    //         done();
    //     });
    //     this.timeout(10000);
    // });

    // it('2.Set relation operations', function(done) {
    //     var wallet2 = new Wallet(tdat.DEV.wallet5.secret);
    //     var wallet3 = new Wallet(tdat.DEV.wallet6.secret);

    //     //build each operation
    //     var op1 = new RelationsOperation(wallet2);
    //     op1.setCounterparty(tdat.DEV.wallet3.address);
    //     op1.setType(op1.AUTHORIZE);
    //     op1.setAmount(tdat.DEV.CNYAmount1);

    //     var op2 = new RelationsOperation(wallet3);
    //     op2.setCounterparty(tdat.DEV.wallet2.address);
    //     op2.setType(op2.AUTHORIZE);
    //     op2.setAmount(tdat.DEV.CNYAmount1);

    //     //build batch operations
    //     var bop = new BatchOperation(wallet2);

    //     bop.setOperation(op1);
    //     bop.setOperation(op2);

    //     bop.submit(function (err, data) {
    //         console.log(data.toString());
    //         expect(err).to.be.null;
    //         expect(data).to.not.empty;
    //         expect(data.success).to.be.true;
    //         expect(data.hash).to.not.empty;

    //         //Canceling the relations

    //         var relation = new RemoveRelationsOperation(wallet2);
    //         relation.setValidate(true);
    //         relation.setCounterparty(tdat.DEV.wallet3.address);
    //         relation.setType(relation.AUTHORIZE);
    //         relation.setAmount(tdat.DEV.CNYAmount1);
    //         relation.submit(function (err, data) {
    //             expect(err).to.be.null;
    //             expect(data.success).to.be.equal(true);
    //             expect(data.state).to.be.equal('validated');
    //         });
            

    //         var relation = new RemoveRelationsOperation(wallet3);
    //         relation.setValidate(true);
    //         relation.setCounterparty(tdat.DEV.wallet2.address);
    //         relation.setType(relation.AUTHORIZE);
    //         relation.setAmount(tdat.DEV.CNYAmount1);
    //         relation.submit(function (err, data) {
    //             expect(err).to.be.null;
    //             expect(data.success).to.be.equal(true);
    //             expect(data.state).to.be.equal('validated');
                
    //         });

    //         done();
    //     });
    //     this.timeout(10000);
    // });

 //    it('3.Submit two order operations', function(done) {

 //        var gt = 'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT';
 //        var wallet2 = new Wallet(tdat.DEV.wallet5.secret);
 //        var wallet3 = new Wallet(tdat.DEV.wallet6.secret);

 //        //build each operation
 //        var op1 = new OrderOperation(wallet2);
 //        op1.setType(op1.SELL);
 //        op1.setPair('SWT/USD:' + gt);
 //        op1.setAmount(0.1);
 //        op1.setPrice(0.5);

 //        var op2 = new OrderOperation(wallet3);
 //        op2.setType(op2.SELL);
 //        op2.setPair('SWT/USD:' + gt);
 //        op2.setAmount(0.1);
 //        op2.setPrice(0.5);

 //        //build batch operations
 //        var bop = new BatchOperation(wallet2);

 //        bop.setOperation(op1);
 //        bop.setOperation(op2);

 //        bop.submit(function (err, data) {
 //            console.log(data);
 //            expect(err).to.be.null;
 //            expect(data).to.not.empty;
 //            expect(data.success).to.be.true;
 //            expect(data.hash).to.not.empty;

 //            //In the batch operation, order ID will
 //            //not be returned, but can be get from getTransaction 
 //            //Method
 //            var hash = data.hash;
 // console.log('HASH is'+hash);
 //            wallet2.getTransaction(hash, function(err, data) {
 //              expect(err).to.be.null;
 //              expect(data).to.not.empty;
 //              expect(data.transaction.hash).to.equal(hash);

 //              console.log(data.transaction.effects.toString());

 //              expect(data.transaction.effects[0].effect).to.equal('offer_created');  
 //              sequence = data.transaction.effects[0].seq;                       
 //                var cancelorder = new CancelOrderOperation(wallet2);
 //                cancelorder.setSequence(sequence);
 //                cancelorder.setValidate(true);
 //                cancelorder.submit(function (err2, data2) {
 //                    expect(err2).to.be.null;
 //                    expect(data2.success).to.be.equal(true);
 //                    expect(data2.state).to.be.equal('validated');
 //                    expect(data2.sequence).to.be.equal(data.sequence + 1);
 //                });
 //            });//end wallet2 cancel order

 //            wallet3.getTransaction(hash, function(err, data) {
 //              expect(err).to.be.null;
 //              expect(data).to.not.empty;
 //              expect(data.transaction.hash).to.equal(hash);

 //              expect(data.transaction.effects[0].effect).to.equal('offer_created');  
 //              sequence = data.transaction.effects[0].seq;                       
 //                var cancelorder = new CancelOrderOperation(wallet3);
 //                cancelorder.setSequence(sequence);
 //                cancelorder.setValidate(true);
 //                cancelorder.submit(function (err2, data2) {
 //                    expect(err2).to.be.null;
 //                    expect(data2.success).to.be.equal(true);
 //                    expect(data2.state).to.be.equal('validated');
 //                    expect(data2.sequence).to.be.equal(data.sequence + 1);
 //                });
 //            });//end wallet3 cancel order

 //            done();
 //        });
 //        this.timeout(10000);
 //    });

   it('4.Set settings operations', function(done) {
        var wallet2 = new Wallet(tdat.DEV.wallet5.secret);
        var wallet3 = new Wallet(tdat.DEV.wallet6.secret);

        //build each operation
        var transfer_rate = 1.01;
        var op1 = new SettingsOperation(wallet2);
        op1.setTransferRate(transfer_rate);

        var op2 = new SettingsOperation(wallet3);
        op2.setTransferRate(transfer_rate);

        //build batch operations
        var bop = new BatchOperation(wallet2);

        bop.setOperation(op1);
        bop.setOperation(op2);

        bop.submit(function (err, data) {
            
            expect(err).to.be.null;
            expect(data).to.not.empty;
            expect(data.success).to.be.true;
            expect(data.hash).to.not.empty;

            done();
        });
        this.timeout(10000);
    });

});