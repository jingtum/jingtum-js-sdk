///**
// * Created by lipc on 2016/11/7.
// */
var JingtumSDK = require('jingtum-sdk');


//----------------------wallet-----------------------------
//创建钱包1
var fingate = JingtumSDK.FinGate;
var wallet = fingate.createWallet();
console.log(wallet);
console.log(wallet.getWallet());

//创建钱包2
var Wallet = JingtumSDK.Wallet;
var walletNew = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK','jJwtrfvKpvJf2w42rmsEzK5fZRqP9Y2xhQ');
var walletNew2 = new Wallet('sh6JBD14JpRRRQM8Li4r5EAer4Yka','jp53tPyrQLoFriTJhtm8Z9iLUXUDucnwVk');
//console.log(walletNew.getWallet());

//创建钱包3
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');


//激活钱包
walletNew.setActivated(true);
var a = walletNew.isActivated();//钱包是否激活
console.log(a);

//切换正式与测试环境
walletNew.setTest(false);//测试环境
console.log(walletNew._server._serverURL);
walletNew.setTest(true);//正式环境
console.log(walletNew._server._serverURL);

//查询余额
wallet.getBalance(null, function (err, data) {
    if(err) console.log(err);
    else console.log(data);
});
wallet.getBalance('SWT', function(err, data) {//获得指定货币余额
    if(err) console.log(err);
    else console.log(data);
});
wallet.getBalance({'currency':'USD'}, function(err, data) {//获得指定货币余额
    if(err) console.log(err);
    else console.log(data);
});
wallet.getBalance({'issuer': 'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT'}, function(err, data) {//获得指定货币余额
    if(err) console.log(err);
    else console.log(data);
});
wallet.getBalance({'currency':'USD','issuer': 'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT'}, function(err, data) {//获得指定货币指定银关的余额
    if(err) console.log(err);
    else console.log(data);
});

//获得账号所有设置
wallet.getSettings(function (err, data) {
    if(err){console.log(err);}
    else console.log(data);
});

//获得账号所有信任
wallet.getTrustLineList(null, function(err, data) {
    if(err) console.log(err);
    else console.log(data);
});

//获得账号指定货币的信任
wallet.getTrustLineList({'currency':'USD'}, function(err, data) {
    if(err) console.log(err);
    else console.log(data);
});

//获得账号指定对家的信任
wallet.getTrustLineList({'issuer':'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT'}, function(err, data) {
    if(err) console.log(err);
    else console.log(data);
});

//获得账号指定货币和对家的信任（limit可不写，若写必须为'all'）
wallet.getTrustLineList({'currency':'USD','issuer':'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT','limit':'all'}, function(err, data) {
    if(err) console.log(err);
    else console.log(data);
});

//查询支付路径
wallet.getPathList('jD2RbZEpBG3T6iWDPyPiNBvpU8sAhRYbpZ',{'value':'1.00','currency':'USD','issuer':'jMhLAPaNFo288PNo5HMC37kg6ULjJg8vPf'},{'issuer':'jMhLAPaNFo288PNo5HMC37kg6ULjJg8vPf','currency':'USD'}
    , function(err, data) {
        if(err) console.log(err);
        else console.log(data);
    });

//获得所有支付信息
wallet.getPayments(null, function(err, data) {
    if(err) console.log(err);
    else console.log(data);
});

//获得某一支付信息
wallet.getPayments('6397E5EF067A7040677102AC6679F4F1A1C59A6D1978D9A7E5334B5FFB2B0BBF', function(err, data) {
    if(err) console.log(err);
    else console.log(data);
});

//获得所有挂单信息
wallet.getOrders(null, function (err, data) {
    if(err) console.log(err);
    else console.log(data);
    //console.log(JSON.stringify(data));
});

//获得某一挂单信息
wallet.getOrders('3E0E7444449A06565625436C4ABD1932CD80F79190ED8889B669FBF67115FE20', function (err, data) {
    if(err){
        console.log(err);
        return;
    }
    console.log(data);
});

//获得货币对的挂单信息
wallet.getOrderBook({'currency':'CNY','issuer':'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS'},{'currency':'USD','issuer':'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS'}, function (err, data) {
    if(err) console.log(err);
    else console.log(data);
    //console.log(JSON.stringify(data));
});

//获得某一次交易信息（通过hash）
wallet.getTransaction('D1B87A3E46792BE1F78E5846C122601AD29A54040DB2F3029CC730DA0564ACC7', function (err, data) {
    if(err) console.log(err);
    else console.log(data);
    //console.log(JSON.stringify(data));
});

//获得所有交易信息（默认最多显示10条）
wallet.getTransactionList(null, function (err, data) {
    if(err) console.log(err);
    else console.log(data);
    //console.log(JSON.stringify(data));
});

//按条件查找交易信息(source_account、destination_account、exclude_failed、direction、results_per_page、page)
wallet.getTransactionList({'source_account':'jp53tPyrQLoFriTJhtm8Z9iLUXUDucnwVk','destination_account':'j4PqT7iAk5XgxocdihxT8jrXgBhm1L4BpW','exclude_failed':true,'results_per_page':2}, function (err, data) {
    if(err) console.log(err);
    else console.log(data);
});


//---------------fingate.js---------------------------

var fingate = JingtumSDK.FinGate;
console.log(fingate.createWallet());
fingate.setAccount('sn37nYrQ6KPJvTFmaBYokS3FjXUWd','jB7rxgh43ncbTX4WeMoeadiGMfmfqY2xLZ');
fingate.setConfig('token','sign_key');
console.log(fingate);
fingate.setTest(false);//切换到正式环境
console.log(fingate._url);
fingate.setTest(true);//切换到测试环境
console.log(fingate._url);
//发通
fingate.issueCustomTum({
        'custom':'00000008',
        'order':'006',
        'currency':'8200000008000020160010000000000020000001',
        'amount':'0.05',
        'account':'jMoqSwXyaTSWtGvkYLGyVLd6ppHcDi6UcL',
        'key':'5361ef7e7e36c155dcc77354913d1a4dd458f37b'},
    function (err, data) {
        if(err) {console.log(err);return;}
        console.log(data);
    }
);

//查询发通状态
fingate.queryCustomTum({
    'custom':'00000008',
    'currency':'8200000008000020160010000000000020000001',
    'date':'1479183410',
    'key':'5361ef7e7e36c155dcc77354913d1a4dd458f37b',
    'url':'http://tfingate.jingtum.com/v1/business/node'
},function (err, data) {
    if(err) {console.log(err);return;}
    console.log(data);
});

//查询通状态（信用额度多少，发行了多少）
fingate.queryCustomTum({
    'custom':'00000008',
    'currency':'8200000008000020160010000000000020000001',
    'date':'1479183410',
    'key':'5361ef7e7e36c155dcc77354913d1a4dd458f37b',
    'url':'http://tfingate.jingtum.com/v1/business/node'
},function (err, data) {
    if(err) {console.log(err);return;}
    console.log(data);
});



//------------------operations-------------------------

///*支付*/
var Wallet = JingtumSDK.Wallet;
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
var payment = new JingtumSDK.PaymentOperation(wallet);
payment.setTest(true);
payment.setDestination('jp53tPyrQLoFriTJhtm8Z9iLUXUDucnwVk');
payment.setDestAmount({'currency':'SWT','value':'0.01','issue':''});
payment.setValidate(true);
payment.setClientResourceID('20611171957');
payment.submit(function (err, res) {
    if(err) {console.log(err);return;}
    console.log(res);
});


///*挂单*/
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
var order = new JingtumSDK.OrderOperation(wallet);
order.setTest(true);//测试环境
order.setValidate(true);
order.setOrderType('sell');
order.setTakerPays({currency:'USD',value:'0.01',issuer:'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT'});
order.setTakerGets({currency:'SWT',value:'0.01',issuer:''});
order.submit(function (err, res) {
    if(err) {console.log(err);return;}
    console.log(res);
});


///*取消挂单*/
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
var cancelorder = new JingtumSDK.CancelOrderOperation(wallet,54);
cancelorder.setTest(true);
cancelorder.setValidate(true);
cancelorder.submit(function (err, res) {
    if(err) {console.log(err);return;}
    console.log(res);
});


///*设置信任*/
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
var trustline = new JingtumSDK.TrustlineOperation(wallet);
trustline.setTest(true);
trustline.setValidate(true);
trustline.setTrustlineAmount({currency:'USD',value:'100',issuer:'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT'});
trustline.submit(function (err, res) {
    if(err) {console.log(err);return;}
    console.log(res);
});


//--------------websocketServer------------------------

//消息订阅
var JingtumSDK = require('jingtum-sdk');
var ws = new JingtumSDK.WebSocketServer();
ws.setTest(false);//切换到正式环境
console.log(ws._url);
ws.setTest(true);//切换到测试环境
console.log(ws._url);
ws.connect();
ws.subscribe(walletNew);
ws.unsubscribe(walletNew);
ws.connect(function(err,data){
    if(err){console.log('err:',err);return;}
    console.log('connect data',data);
});
ws.subscribe(walletNew, function(err,data){
    if(err){console.log('err:',err);return;}
    console.log('subscribe data',data);
});
ws.unsubscribe(walletNew, function(err,data){
    if(err){console.log('err:',err);return;}
    console.log('unsubscribe data',data);
});
ws.disconnect();