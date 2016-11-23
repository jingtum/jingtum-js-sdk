/**
 * Created by lipc on 2016/11/18.
 */
const Wallet    = require('../lib/Wallet');
var wallet = new Wallet('shNKNNtxgBgZDa3YADcAKBFy5W5kK');

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