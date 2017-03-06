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
var wallet = new Wallet('ssSHuRBvRt4TeB8eVE8CBRoB8cVAe');


//激活钱包
fingate.setActiveAmount(10);//默认25
fingate.activateWallet(wallet.address, function (err, data) {
    if(err) console.log(err);
    console.log(data);
});

//钱包是否激活
walletNew.isActivated(function (err,msg) {
    if(err) console.log(err);
    console.log(msg);
});


//切换正式与测试环境
fingate.setMode(fingate.PRODUCTION);//正式环境
console.log(fingate._single);
fingate.setMode(fingate.DEVELOPEMENT);//测试环境
console.log(fingate._single);

//查询余额
wallet.getBalance(function (err, data) {
    if(err) console.log(err);
    else console.log(data);
});
wallet.getBalance('SWT', function(err, data) {//获得指定货币余额
    if(err) console.log(err);
    else console.log(data);
});
wallet.getBalance('USD', function(err, data) {//获得指定货币余额
    if(err) console.log(err);
    else console.log(data);
});

wallet.getBalance('USD','jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT', function(err, data) {//获得指定货币指定银关的余额
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
wallet.getChoices('jnxxSNnx6yshDKDZUSaxjJi272aREJ3W1R',{'value':'1.00','currency':'CNY','issuer':'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT'},null
    , function(err, data) {
        if(err) console.log(err);
        else console.log(data);
    });

//获得所有支付信息
wallet.getPaymentList(function(err, data) {
    if(err) console.log(err);
    else console.log(data);
});

//通过条件查询支付历史
wallet.getPaymentList({results_per_page:20,page:2}, function(err, data) {
    if(err) console.log(err);
    else console.log(data);
});

//获得某一支付信息
wallet.getPayment('6397E5EF067A7040677102AC6679F4F1A1C59A6D1978D9A7E5334B5FFB2B0BBF', function(err, data) {
    if(err) console.log(err);
    else console.log(data);
});

//获得所有挂单信息
wallet.getOrderList(function (err, data) {
    if(err) console.log(err);
    else console.log(data);
    //console.log(JSON.stringify(data));
});

//获得某一挂单信息
wallet.getOrder('3E0E7444449A06565625436C4ABD1932CD80F79190ED8889B669FBF67115FE20', function (err, data) {
    if(err){
        console.log(err);
        return;
    }
    console.log(data);
});


//获得某一次交易信息（通过hash）
wallet.getTransaction('D1B87A3E46792BE1F78E5846C122601AD29A54040DB2F3029CC730DA0564ACC7', function (err, data) {
    if(err) console.log(err);
    else console.log(data);
    //console.log(JSON.stringify(data));
});

//获得所有交易信息（默认最多显示10条）
wallet.getTransactionList(function (err, data) {
    if(err) console.log(err);
    else console.log(data);
    //console.log(JSON.stringify(data));
});

//按条件查找交易信息(source_account、destination_account、exclude_failed、direction、results_per_page、page)
wallet.getTransactionList({'source_account':'jp53tPyrQLoFriTJhtm8Z9iLUXUDucnwVk','destination_account':'j4PqT7iAk5XgxocdihxT8jrXgBhm1L4BpW','exclude_failed':true,'results_per_page':2}, function (err, data) {
    if(err) console.log(err);
    else console.log(data);
});


//获得指定类型关系
wallet.getRelations({type:'frozen'}, function (err, data) {
    if(err) console.log(err);
    console.log(data);
});

//获得指定类型、指定对方账号的关系
wallet.getRelations({type:'authorize',counterparty:'jB7rxgh43ncbTX4WeMoeadiGMfmfqY2xLZ'}, function (err, data) {
    if(err) console.log(err);
    console.log(data);
});


//---------------fingate.js---------------------------

var fingate = JingtumSDK.FinGate;
console.log(fingate.createWallet());
fingate.setAccount('sn37nYrQ6KPJvTFmaBYokS3FjXUWd','jB7rxgh43ncbTX4WeMoeadiGMfmfqY2xLZ');
fingate.setMode(fingate.PRODUCTION);//切换到正式环境
console.log(fingate._url);
fingate.setMode(fingate.DEVELOPEMENT);//切换到测试环境
console.log(fingate._url);

//获得市场货币对的挂单信息
fingate.getOrderBook('CNY:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS/USD:jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS', function (err, data) {
    if(err) console.log(err);
    else console.log(data);
});

fingate.setToken('00000006');
fingate.setKey('599669081491b660cb5ea9b2c9a183378c10d86d');
//发通
fingate.issueCustomTum(
    '8200000006000020170019000000000020000001',
    '0.01',
    'jpkLNK2D1y8D8sinoRuk2PXoT1eDQvx56p',
    function (err, data) {
        if(err) {console.log(err);return;}
        console.log(data);
    }
);


//查询发通状态
fingate.queryIssue('PREFIX90301520170118210106000001',
    function (err, data) {
        if(err) {console.log(err);return;}
        console.log(data);
});

//查询通状态（信用额度多少，发行了多少）
fingate.queryCustomTum('8200000008000020160010000000000020000001',
    function (err, data) {
    if(err) {console.log(err);return;}
    console.log(data);
});


//------------------operations-------------------------

/*支付*/
var Wallet = JingtumSDK.Wallet;
var wallet = new Wallet('ssSHuRBvRt4TeB8eVE8CBRoB8cVAe');
var payment = new JingtumSDK.PaymentOperation(wallet);
payment.setDestAddress('jp53tPyrQLoFriTJhtm8Z9iLUXUDucnwVk');
payment.setAmount({'currency':'SWT','value':'0.01','issuer':''});
payment.setValidate(true);
payment.setClientId('20611171957');
payment.submit(function (err, res) {
    if(err) {console.log(err);return;}
    console.log(res);
});

/*查找路径，并按指定路径支付*/
wallet.getChoices('jnxxSNnx6yshDKDZUSaxjJi272aREJ3W1R',{'value':'0.01','currency':'CNY','issuer':'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT'}
    , function(err, data) {
        if(err) console.log(err);
        else {
            console.log(data);
            var key = data[0].key;
            var payment = new JingtumSDK.PaymentOperation(wallet);
            payment.setDestAddress('jnxxSNnx6yshDKDZUSaxjJi272aREJ3W1R');
            payment.setChoice(key);//指定路径
            payment.setValidate(true);
            payment.submit(function (err, res) {
                if(err) {console.log(err);return;}
                console.log(res);
            });
        }
    });


///*挂单*/
fingate.setMode(fingate.DEVELOPEMENT);
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
var order = new JingtumSDK.OrderOperation(wallet);
order.setValidate(true);
order.setPair('SWT/USD:jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT');
order.setType(order.SELL);
order.setAmount(0.1);
order.setPrice(0.5);
order.submit(function (err, res) {
    if(err) {console.log(err);return;}
    console.log(res);
});


///*取消挂单*/
fingate.setMode(fingate.DEVELOPEMENT);
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
var cancelorder = new JingtumSDK.CancelOrderOperation(wallet);
cancelorder.setSequence(136);
cancelorder.setValidate(true);
cancelorder.submit(function (err, res) {
    if(err) {console.log(err);return;}
    console.log(res);
});


///*设置信任*/
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
var trustline = new JingtumSDK.TrustlineOperation(wallet);
trustline.setValidate(true);
trustline.setTrustlineAmount({currency:'USD',value:'100',issuer:'jMcCACcfG37xHy7FgqHerzovjLM5FCk7tT'});
trustline.submit(function (err, res) {
    if(err) {console.log(err);return;}
    console.log(res);
});

/*设置关系*/
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
var relation = new JingtumSDK.RelationsOperation(wallet);
var walletNew = new Wallet('ssSHuRBvRt4TeB8eVE8CBRoB8cVAe');
var Amount = JingtumSDK.Amount;
var amount = new Amount('100', 'USD', 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS');
relation.setCounterparty(walletNew.address);
relation.setType(relations.FRIEND);
relation.setAmount(amount);
relation.submit(function(err,res){
    if(err) console.log(err);
    else console.log(res);
});

/*取消关系*/
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');
var relation = new JingtumSDK.RemoveRelationsOperation(wallet);
var walletNew = new Wallet('ssSHuRBvRt4TeB8eVE8CBRoB8cVAe');
var Amount = JingtumSDK.Amount;
var amount = new Amount('100', 'USD', 'jBciDE8Q3uJjf111VeiUNM775AMKHEbBLS');
relation.setCounterparty(walletNew.address);
relation.setType(relation.FRIEND);
relation.setAmount(amount);
relation.submit(function(err,res){
    if(err) console.log(err);
    else console.log(res);
});

/*账号设置*/
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');//jLRdkbLyEwMLKAeGHMh8zfxWQDagPmZEaw
var walletNew = new Wallet('ssSHuRBvRt4TeB8eVE8CBRoB8cVAe');//jLRdkbLyEwMLKAeGHMh8zfxWQDagPmZEaw
var Settings = JingtumSDK.SettingsOperation;
var settings = new Settings(wallet);
settings.setRegularKey(walletNew.address);
settings.setDomain('hahah');
settings.setEmailHash('123@qq.com');
settings.setWalletLocator('02158995447');
settings.setMessageKey('messageKey');
settings.setTransferRate(1.2);
settings.setDisallowSwt(false);
settings.setRequireDestinationTag(false);
settings.setRequireAuthorization(false);
settings.setDisableMaster(false);
settings.submit(function (err, data) {
    if(err) console.log(err);
    console.log(data);
});

//--------------websocketServer------------------------

//消息订阅
fingate.setMode(fingate.DEVELOPEMENT);//切换到测试环境
var JingtumSDK = require('jingtum-sdk');
var ws = new JingtumSDK.WebSocketServer();
console.log(ws._ws.url);
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