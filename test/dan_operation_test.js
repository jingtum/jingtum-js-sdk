/**
 * Created by lipc on 2016/11/17.
 */
const PaymentOperation = require('../lib/PaymentOperation');
const OrderOperation = require('../lib/OrderOperation');
const CancelOrderOperation = require('../lib/CancelOrderOperation');
const TrustlineOperation = require('../lib/TrustlineOperation');
const Wallet = require('../lib/Wallet');

/*支付*/
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
var payment = new PaymentOperation(wallet);
payment.setDestination('jp53tPyrQLoFriTJhtm8Z9iLUXUDucnwVk');
payment.setDestAmount({'currency':'SWT','value':'0.01','issue':''});
payment.setValidate(true);
payment.setClientResourceID('20611171957');
payment.submit(function (err, res) {
    if(err) {console.log(err);return;}
    console.log(res);
});


/*挂单*/
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
var order = new OrderOperation(wallet);
order.setValidate(true);
order.setOrderType('sell');
order.setTakerPays({currency:'USD',value:'0.01',issuer:'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT'});
order.setTakerGets({currency:'SWT',value:'0.01',issuer:''});
order.submit(function (err, res) {
    if(err) {console.log(err);return;}
    console.log(res);
});


/*取消挂单*/
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
var cancelorder = new CancelOrderOperation(wallet,54);
cancelorder.setValidate(true);
cancelorder.submit(function (err, res) {
    if(err) {console.log(err);return;}
    console.log(res);
});


/*设置信任*/
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
var trustline = new TrustlineOperation(wallet);
trustline.setValidate(true);
trustline.setTrustlineAmount({currency:'USD',value:'100',issuer:'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT'});
trustline.submit(function (err, res) {
    if(err) {console.log(err);return;}
    console.log(res);
});


