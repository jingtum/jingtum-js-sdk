/*
 * NODE JS SDK for Jingtum network； Wallet 钱包类
 * @version 1.1.0
 * Copyright (C) 2016 by Jingtum Inc.
 * or its affiliates. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Contains the following functions
 * getBalance 获得本账户余额
 * getOrder  获得尚未成交的单个挂单
 * getOrderList  获得尚未成交的挂单列表
 * getPayment  查询单个支付信息
 * getPaymentList 查询多个支付信息
 * getTransaction  查询单个交易记录信息
 * getTransactionList 查询多个交易信息
 * getWallet  获得当前钱包地址和私钥
 * setActivated  设置钱包激活的状态
 * 
 * 
 */
const util           = require('util');
const stringformat   = require('stringformat');
const AccountClass   = require('./AccountClass');
const ParamException = require('./Error').ParamException;
const isCurrency     = require('./DataCheck').isCurrency;
const isAmount       = require('./DataCheck').isAmount;
const isTumCode      = require('./DataCheck').isTumCode;
const base           = require('jingtum-base-lib').Wallet;
const sha1           = require('sha1');

/*
 * CONSTANTS used for GET commands
*/
const BALANCES       = '/accounts/{0}/balances';
const PAYMENTS       = '/accounts/{0}/payments';
const PAYMENT_PATHS  = '/accounts/{0}/payments/paths';
const ORDERS         = '/accounts/{0}/orders';
const TRANSACTIONS   = '/accounts/{0}/transactions';
const SETTINGS       = '/accounts/{0}/settings';
const RELATIONS       = '/accounts/{0}/relations';

const Server         = require('./Server');

/**
 * Wallet constructor
 * Extends the AccountClass.
*/

function Wallet(secret,address) {
  AccountClass.call(this, secret, address);
  this._server = new Server();
}

/*
 * Return the wallet is activated or not.
 */
Wallet.prototype.isActivated = function(callback) {
  if(!callback) {
    console.log('missing callback');
    return;
  }
  this.getBalance('SWT',function (err,data) {
    if(data.balances)
      callback(err,true);
    else
      callback(err,false);
  });
};



/*
 * Return a base Account class
*/

Wallet.prototype.getWallet = function() {
  return new AccountClass(this.secret, this.address);
};

/**
 * get balance for a account, with options:
 * currency, get balance for which currency
 * issuer, get balance for which issuer
 *
 * Options can be either a JSON format data
 * structure, or a String with the
 * currency  String  指定返回对应货币的余额
 * counterparty  String  指定返回对应银关发行的货币
 *
 */
Wallet.prototype.getBalance = function(currency, issuer, callback) {
  var opt_str = null;
  var _callback = function (err, data) {};

   console.log("Input para"+arguments.length );
  //Check the arguments
  try{
    if(arguments.length ===1 && typeof currency === 'function')
      { _callback = currency; }
    else if(arguments.length ===2 && isCurrency(currency) == true && typeof issuer === 'function'){
      opt_str = 'currency=' + currency;
      _callback = issuer;
    }else if(arguments.length ===3 && isCurrency(currency) == true && base.isValidAddress(issuer)  && typeof callback === 'function'){
      opt_str = 'currency=' + currency + '&' + 'counterparty=' + issuer;
      _callback = callback;
    }
    else{
      throw new ParamException('Invalid arguments');
    }
  }catch(e){console.log(e);_callback(e);return;}

  //Build the commands
  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = opt_str ? (stringformat(BALANCES, this.address)+'?'+ opt_str) : stringformat(BALANCES, this.address);

  //console.log("url"+out_cmd.url);
  //return out_cmd;
  this._get(out_cmd,_callback);
};

Wallet.prototype._get = function (options,callback) {
  this._server.submitRequest(options, function (err, data) {
    if(data && data.balances){
      var balances = data.balances;
      for(var i = 0,len = balances.length;i < len;i++){
        balances[i].issuer = balances[i].counterparty;
        delete balances[i].counterparty;
      }
    }
    if(data && (data.order || data.orders)){
      var len = 1;
      if(data.orders)
        len = data.orders.length;
      for(var i = 0;i < len; i++){
        var order = data.order || data.orders[i];
        var pays_issuer = order.taker_pays.counterparty === ''? '':(':'+ order.taker_pays.counterparty);
        var gets_issuer = order.taker_gets.counterparty === ''? '':(':'+ order.taker_gets.counterparty)
        if(order.type === 'buy'){
          order.pair = order.taker_pays.currency + pays_issuer + '/' + order.taker_gets.currency + gets_issuer;
          order.amount = order.taker_pays.value;
          order.price = order.taker_gets.value / order.taker_pays.value;
        }else{
          order.pair = order.taker_gets.currency + gets_issuer + '/' + order.taker_pays.currency + pays_issuer;
          order.amount = order.taker_gets.value;
          order.price = order.taker_pays.value / order.taker_gets.value;
        }
        delete order.taker_gets;
        delete order.taker_pays;
        delete order.passive;
      }
    }
    if(data && (data.transaction || data.transactions)){
      var tlen = 1;
      if(data.transactions)
        tlen = data.transactions.length;
      for(var s = 0;s < tlen; s++) {
        var transaction = data.transaction || data.transactions[s];
        if(transaction.type && transaction.offertype){//根目录下的:创建挂单和取消挂单
          changeFormat(transaction);
        }
        if(transaction.effects !== '[]'){//effects里面的
          var effects =  transaction.effects;
          for(var j = 0;j<effects.length;j++){
            if(effects[j].effect === 'offer_created' || effects[j].effect === 'offer_cancelled' ){
              var effect =  transaction.effects[j];
              changeEffect(effect);
            }
            if(effects[j].effect === 'offer_funded' || effects[j].effect === 'offer_bought' ){
              var effect2 =  transaction.effects[j];
              changeEffect2(effect2);
            }
            if(effects[j].effect === 'offer_partially_funded'){
              var effect3 =  transaction.effects[j];
              changeEffect2(effect3);
              if(effect3.remaining){
                effect3.remain = {};
                effect3.remain.pair = effect3.pair;
                if(effect3.type === 'bought'){
                  effect3.remain.amount = effect3.pays.value;
                  effect3.remain.price = effect3.gets.value / effect3.pays.value;
                }else{
                  effect3.remain.amount = effect3.gets.value;
                  effect3.remain.price = effect3.pays.value / effect3.gets.value;
                }
                delete effect3.pays;
                delete effect3.gets;
              }
            }
          }
        }
      }
    }
    callback(err,data);
  })
};
function changeFormat(transaction){
  var pays_issuer = transaction.pays.issuer === ''? '':(':'+ transaction.pays.issuer);
  var gets_issuer = transaction.gets.issuer === ''? '':(':'+ transaction.gets.issuer);
  if(transaction.offertype === 'buy'){
    transaction.pair = transaction.pays.currency + pays_issuer + '/' + transaction.gets.currency + gets_issuer;
    transaction.amount = transaction.pays.value;
    transaction.price = transaction.gets.value / transaction.pays.value;
  }else{
    transaction.pair = transaction.gets.currency + gets_issuer + '/' + transaction.pays.currency + pays_issuer;
    transaction.amount = transaction.gets.value;
    transaction.price = transaction.pays.value / transaction.gets.value;
  }
  delete transaction.gets;
  delete transaction.pays;
}
function changeEffect(effect){
  var pays_issuer = effect.pays.issuer === ''? '':(':'+ effect.pays.issuer);
  var gets_issuer = effect.gets.issuer === ''? '':(':'+ effect.gets.issuer);
  if(effect.offertype === 'buy'){
    effect.pair = effect.pays.currency + pays_issuer + '/' + effect.gets.currency + gets_issuer;
    effect.amount = effect.pays.value;
    effect.price = effect.gets.value / effect.pays.value;
  }else{
    effect.pair = effect.gets.currency + gets_issuer + '/' + effect.pays.currency + pays_issuer;
    effect.amount = effect.gets.value;
    effect.price = effect.pays.value / effect.gets.value;
  }
  delete effect.gets;
  delete effect.pays;
}
function changeEffect2(effect){
  var paid_issuer = effect.paid.issuer === ''? '':(':'+ effect.paid.issuer);
  var got_issuer = effect.got.issuer === ''? '':(':'+ effect.got.issuer);
  if(effect.type === 'bought'){
    effect.pair = effect.paid.currency + paid_issuer + '/' + effect.got.currency + got_issuer;
    effect.amount = effect.paid.value;
    effect.price = effect.got.value / effect.paid.value;
  }else{
    effect.pair = effect.got.currency + got_issuer + '/' + effect.paid.currency + paid_issuer;
    effect.amount = effect.got.value;
    effect.price = effect.paid.value / effect.got.value;
  }
  delete effect.paid;
  delete effect.got;
}

/*
 * Return the settings of the Wallet account
*/
Wallet.prototype.getSettings = function(callback) {
  if(!callback) return new ParamException('no callback');
  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = stringformat(SETTINGS, this.address);
  this._get(out_cmd,callback);
};



/*
 * Return the payment path list for the
 * destination account and currency amount.
 * Parameters:
 * dest_address  String
 * in_amount     Object
 * src_tum       Object, optional parameters
*/
Wallet.prototype.getChoices = function(dest_address, in_amount, src_tum , callback) {
  if(arguments.length >= 3 && arguments.length <= 4 &&  ( typeof src_tum === 'function' || typeof callback === 'function')) {
    if (arguments.length === 3) {
      callback = src_tum;
      src_tum = null;
    }
  }else{
    console.log(new ParamException("invalid arguments!"));
    return;
  }
  try{
    if ( !base.isValidAddress(dest_address))
      throw new ParamException('Invalid destination address!');
    if ( !isAmount(in_amount) )
      throw new ParamException('Invalid Amount Parameter!');
    if(in_amount.currency === 'SWT')
      throw new ParamException('支付SWT不需要路径！');
    var path = in_amount.value + '+' + in_amount.currency
        + '+' + in_amount.issuer;

    //optional parameters
    if(src_tum === null){}
    else if ( typeof(src_tum) == 'object' )
    {
      if ( !isTumCode(src_tum.currency) && !base.isValidAddress(src_tum.issuer))
        throw new ParamException('Invalid source currencies!');
      path = path + '?' + src_tum.currency +'+' + src_tum.issuer;
    }
  }catch(e){callback(e); return;}

  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = stringformat(PAYMENT_PATHS, this.address)
      + '/' + dest_address + '/' + path;

  //this._get(out_cmd,callback) ;
  var that = this;
  this._server.submitRequest(out_cmd, function (err, data) {
    var paths = [], myPath = [];
    if(err){
      callback(err,null);
    }else if(data.payments){
      var items = data.payments;
      for(var i = 0;i<items.length;i++){
        var key = sha1(JSON.stringify(items[i].paths));
        paths.push({key:key,choice:items[i].source_amount});
        myPath.push({key:key,amount:in_amount,path:items[i].paths});
      }
      that._server.paths = myPath;
      callback(null,paths);
    }else{
      callback(null,data);
    }
  });

};
/*
 * Get the payment info by input resource ID
 * or HASH value
*/
Wallet.prototype.getPayment = function(in_id,callback) {
  if(arguments.length !== 2 || typeof in_id !== 'string'  || typeof callback !== 'function'){
    console.log(new ParamException('Invalid arguments'));
    return;
  }

  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = stringformat(PAYMENTS, this.address)+'/'+in_id;

  this._get(out_cmd,callback);
};

Wallet.prototype.getPaymentList = function(options,callback) {
  if(arguments.length === 1 && typeof options === 'function'){
    callback = options;
    options = {}
  } else if(arguments.length !== 2 || typeof options !== 'object'  || typeof callback !== 'function'){
    console.log(new ParamException('Invalid arguments'));
    return;
  }

  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';

  var arr = [];
  if ( options ){
  if(options.source_account)
    arr.push('source_account=' + options.source_account);
  if(options.destination_account)
    arr.push('destination_account=' + options.destination_account);
  if(options.exclude_failed)
    arr.push('exclude_failed=' + options.exclude_failed);
  if(options.direction)
    arr.push('direction=' + options.direction);
  if(options.results_per_page)
    arr.push('results_per_page=' + options.results_per_page);
  if(options.page)
    arr.push('page=' + options.page);
  }

  out_cmd.url = stringformat(PAYMENTS, this.address) + '?' + arr.join('&');

  this._get(out_cmd,callback);
};


/*
 * 通过hash获得单个挂单信息
 * Get the order info by input HASH value
*/
Wallet.prototype.getOrder = function(hash,callback) {
  if(arguments.length !== 2 || typeof hash !== 'string'  || typeof callback !== 'function'){
    console.log(new ParamException('Invalid arguments'));
    return;
  }

  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = stringformat(ORDERS, this.address)+'/'+hash;

  this._get(out_cmd,callback);
};

/*
 * 获取所有挂单信息
 * Get the orderList
 */
Wallet.prototype.getOrderList = function(callback) {
  if(!callback || typeof callback !== 'function'){
    console.log(new ParamException('Invalid arguments'));
    return;
  }

  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = stringformat(ORDERS, this.address);

  this._get(out_cmd,callback);
};


/*
 * Use id to search for the transaction.
 * 交易资源号或者交易hash
 * Include transactions like payment, relation, etc.
 *
*/

Wallet.prototype.getTransaction = function(in_id,callback) {
  if(arguments.length !== 2 || typeof in_id !== 'string'  || typeof callback !== 'function'){
    console.log(new ParamException('Invalid arguments'));
    return;
  }

  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = stringformat(TRANSACTIONS, this.address)+'/'+in_id;
  this._get(out_cmd,callback);
};

/**
 * getTransactionList with options
 *
 * source_account: source account for transaction,
 * destination_account: destination account for transaction,
 * excluded_failed: excluded failed transaction,
 * direction: for payment transaction, include 'incoming' and 'outgoing'
 * results_per_page: results per page, integer, default is 10
 * page: offset for page query, integer, the first page is 1
 */
Wallet.prototype.getTransactionList = function(options,callback) {
     var arr = [];
    if(arguments.length === 1 && typeof options === 'function'){
      callback = options;
    }else if(arguments.length === 2 && typeof options === 'object' && typeof callback === 'function'){

      if ( options){
      if(options.source_account)
        arr.push('source_account=' + options.source_account);
      if(options.destination_account)
        arr.push('destination_account=' + options.destination_account);
      if(options.exclude_failed)
        arr.push('exclude_failed=' + options.exclude_failed);
      if(options.direction)
        arr.push('direction=' + options.direction);
      if(options.results_per_page)
        arr.push('results_per_page=' + options.results_per_page);
      if(options.page)
        arr.push('page=' + options.page);
      }
      
    }else{
      console.log(new ParamException('Invalid arguments'));
      return;
    }

  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = stringformat(TRANSACTIONS, this.address)+'?' + arr.join('&');

  this._get(out_cmd,callback);
};


/*
* get relations
* options object,
* options.type: 必选项，关系类型，authorize or frozen
* options.counterparty: 可选项，对方账号
* */
Wallet.prototype.getRelations = function(options, callback) {
  if(arguments.length !== 2 || typeof options !== 'object' || typeof callback !== 'function'){
    console.log(new ParamException('Invalid arguments'));
    return;
  }else if(!options.type){
    console.log(new ParamException('please input type at options'));
    return;
  } else{
    if(!(options.type === 'authorize' || options.type ==='frozen')){
      console.log(new ParamException('type must be authorize or frozen'));
      return;
    }
    if(options.counterparty && !base.isValidAddress(options.counterparty)){
      console.log(new ParamException('Invalid counterparty'));
      return;
    }
  }

  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = stringformat(RELATIONS, this.address)+'?type=' + options.type + (options.counterparty ? '&counterparty=' + options.counterparty : '');

  this._get(out_cmd,callback);
};

module.exports = Wallet;

