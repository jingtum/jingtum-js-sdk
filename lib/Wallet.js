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
 * getOrderBook  获得货币对的挂单列表
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

/*
 * CONSTANTS used for GET commands
*/
const MAXIMUM_RESULTS_PAGE = 99;
const MAXIMUM_PAGES  = 999;
const BALANCES       = '/accounts/{0}/balances';
const PAYMENTS       = '/accounts/{0}/payments';
const PAYMENT_PATHS  = '/accounts/{0}/payments/paths';
const ORDERS         = '/accounts/{0}/orders';
const ORDERBOOK      = '/accounts/{0}/order_book';
const TRUST_LINES    = '/accounts/{0}/trustlines';
const TRANSACTIONS   = '/accounts/{0}/transactions';
const SETTINGS       = '/accounts/{0}/settings';
const Server = require('./Server');

/**
 * Wallet constructor
 * Extends the AccountClass.
*/

function Wallet(secret,address) {
  AccountClass.call(this, secret, address);
  this._activated = false;
  this._server = new Server();
}

Wallet.prototype.setTest = function (bool) {
  try{
    if(typeof bool !== 'boolean')
      throw new ParamException("Invalid type,must be boolean");
  }catch(e){console.log(e);return;}

  this._server.setTest(bool);
}

/*
 * Return the active flag.
*/
Wallet.prototype.isActivated = function() {
  return this._activated;
};

/*
 * Set the active flag.
*/
Wallet.prototype.setActivated = function(in_flag) {
  try{
    if ( in_flag === true || in_flag === false)
      this._activated = in_flag;
    else
      throw new ParamException("Invalid activated flag");
  }catch(e){console.log(e);}
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
Wallet.prototype.getBalance = function(options,callback) {
  //optional parameters used to filter the results
  var opt_str = null;

  //Check the options
  try{
    if(arguments.length !== 2) throw new ParamException('Missing Parameters');
    if(options === null){}
    else if ( typeof(options) == 'object' ){
      if(options.currency) {
        if (isCurrency(options.currency) !== true)
          throw new ParamException('Invalid currency in getBalance');
        opt_str = 'currency=' + options.currency;
      }
      if(options.issuer){
        if (base.isValidAddress(options.issuer) ){
          var opt_issuer = 'counterparty='+options.issuer;
          opt_str = opt_str + '&' + opt_issuer;
        }else{
          throw new ParamException('Invalid issuer in getBalance');
        }
      }
    }
    else{
      if ( options ){
        if (isCurrency(options) == true)
          opt_str = 'currency='+options;
        else if (base.isValidAddress(options))
          opt_str = 'counterparty='+options;
        else
          throw new ParamException('Invalid options in getBalance');
      }
    }
  }catch(e){console.log(e);callback(e); return;}


  //Build the commands
  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = opt_str ? (stringformat(BALANCES, this.address)+'?'+ opt_str) : stringformat(BALANCES, this.address);

  //return out_cmd;
  this._get(out_cmd,callback)
};

Wallet.prototype._get = function (options,callback) {
  this._server.submitRequest(options, function (err, data) {
    callback(err,data);
  })
};


/*
 * Return the settings of the Wallet account
*/
Wallet.prototype.getSettings = function(callback) {
  if(!callback) return new ParamException('no callback');
  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = stringformat(SETTINGS, this.address);
  this._get(out_cmd,callback)
};

/**
 * Get trust line list, now suport currency and issuer options
 * limit options should be all or none
 *
 * TODO not marker, limit, ledger is not supported
 * it should be support later, but can change to limit
 * and offset options, or results_per_page and page
 */
Wallet.prototype.getTrustLineList = function(options,callback) {
  var parms = null;
  //Check the options and added the valid parameters
  //if it exists
  try{
    if(arguments.length !== 2) throw new ParamException('Missing Parameters');
    if(options === null){}
    else if (options && typeof(options) === 'object') {
      if (options.currency && ! isTumCode(options.currency)) {
        throw new ParamException("Invalid Tum code");
      }
      if (options.issuer && !base.isValidAddress(options.issuer)) {
        throw new ParamException("Invalid issuer option");
      }
      if (options.limit && options.limit !== 'all') {
        throw new ParamException("Invalid limit option, it must be all");
      }
      parms =  options.currency ? ('currency=' + options.currency):null;
      parms += options.issuer ? ('&counterparty=' + options.issuer):'&'+null;
    }
  }catch(e){console.log(e);callback(e); return;}

  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = stringformat(TRUST_LINES, this.address)+'?'+ parms;
  this._get(out_cmd,callback)
};


/*
 * Return the payment path list for the
 * destination account and currency amount.
 * Parameters:
 * dest_address  String
 * in_amount     Object
 * src_tum       Object
*/
Wallet.prototype.getPathList = function(dest_address, in_amount, src_tum , callback) {
  try{
    if(arguments.length !== 4)
      throw new ParamException('Missing Parameters');
    if ( !base.isValidAddress(dest_address))
      throw new ParamException('Invalid destination address!');

    if ( !isAmount(in_amount) )
      throw new ParamException('Invalid Amount Parameter!');

    if(in_amount.currency === 'SWT')
      throw new ParamException('支付SWT不需要路径！');

    if(!callback) throw new ParamException('no callback');

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
  }catch(e){console.log(e);callback(e); return;}


  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = stringformat(PAYMENT_PATHS, this.address)
    + '/' + dest_address + '/' + path;

  this._get(out_cmd,callback) ;

};

/*
 * Get the payment info by input resource ID
 * or HASH value
*/
Wallet.prototype.getPayments = function(in_id,callback) {
  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  try{
    if(arguments.length !== 2) throw new ParamException('Missing Parameters');
    if(in_id === null){out_cmd.url = stringformat(PAYMENTS, this.address);}
    else if ( in_id ){
      if (typeof(in_id) !== 'string')
        throw new ParamException('Invalida id in getPayment');
      out_cmd.url = stringformat(PAYMENTS, this.address)+'/'+in_id;
    }
    else//return all the payments
      out_cmd.url = stringformat(PAYMENTS, this.address);
  }catch(e) {console.log(e);callback(e); return;}

  this._get(out_cmd,callback);
};


/*
 * 获取所有挂单信息或者 通过hash获得单个挂单信息
 * Get the order info by input HASH value
*/
Wallet.prototype.getOrders = function(hash,callback) {
  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  try{
    if(arguments.length !== 2) throw new ParamException('Missing Parameters');
    if(hash===null){out_cmd.url = stringformat(ORDERS, this.address);}
    else if(hash){
      if(typeof hash !== 'string')
        return new ParamException("Invalid hash param");
      out_cmd.url = stringformat(ORDERS, this.address)+'/'+hash;
    }else
      out_cmd.url = stringformat(ORDERS, this.address);
  }catch(e){console.log(e);callback(e);return;}
  this._get(out_cmd,callback);
};

/**
 *
 * 获得货币对的挂单列表， 通过以下API发送接口
 * /v1/accounts/{:address}/order_book/{:base}/{:counter}
 * 需要检测输入参数的格式。
 * base (currency+issuer)
 * counter(currency+issuer)
 */
Wallet.prototype.getOrderBook = function(baser, counter, callback) {
  try{
    if(arguments.length !== 3){
      throw new ParamException('Missing Parameters');
    }
    if ( baser && baser.currency !== 'SWT' && (!isTumCode(baser.currency) || !base.isValidAddress(baser.issuer))){
      throw new ParamException('Invalid baser!');
    }
    if ( counter && (!isTumCode(counter.currency) || !base.isValidAddress(counter.issuer))){
      throw new ParamException('Invalid counter!');
    }
  }catch(e){console.log(e);callback(e); return;}

  var path = baser.currency + (baser.currency === 'SWT'? '' :('+' + baser.issuer)) + '/' + counter.currency + '+' +counter.issuer;
  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = stringformat(ORDERBOOK, this.address)+ '/'+ path;;
  this._get(out_cmd,callback);
}

/*
 * Use id to search for the transaction.
 * 交易资源号或者交易hash
 * Include transactions like payment, trustline, relation, etc.
 *
*/

Wallet.prototype.getTransaction = function(in_id,callback) {
  try{
    if (!in_id || typeof(in_id) != 'string') {
      throw new ParamException("Invalid hash/id in getTransaction");
    }
    if(!callback) throw new ParamException('no callback');
  }catch(e){console.log(e);callback(e); return;}

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
  var opt_str = '';
  var opt_num = 0;

  //Check the input options and added the parameters
  try{
    if(arguments.length !== 2) throw new ParamException('Missing Parameters');
    if(options === null){}
    else if ( typeof options == 'object' ){
      if(options.source_account){
        if ( base.isValidAddress(options.source_account) ){
          var tmp_str = 'source_account='+options.source_account;
          opt_str = tmp_str ;
          opt_num ++;
        }else
          throw new ParamException("Invalid source_account!");
      }

      if(options.destination_account){
        if ( base.isValidAddress(options.destination_account)){
          var tmp_str = 'destination_account='+options.destination_account;
          opt_str = opt_num > 0 ? (opt_str + '&' + tmp_str) : tmp_str;
        }else
          throw new ParamException("Invalid destination_account!");
      }

      if(options.exclude_failed){
        if ( typeof options.exclude_failed === 'boolean' ){
          var tmp_str = 'exclude_failed='+options.exclude_failed;
          opt_str = opt_num > 0 ? (opt_str + '&' + tmp_str) : tmp_str;
        }else
          throw new ParamException("Invalid exclude_failed!");
      }

      if(options.direction){
        if (options.direction === 'incoming' || options.direction === 'outgoing'){
          var tmp_str = 'direction='+options.direction;
          opt_str = opt_num > 0 ? (opt_str + '&' + tmp_str) : tmp_str;
        }else
          throw new ParamException("Invalid direction!");
      }

      //Number of results per page for display
      if(options.results_per_page){
        if (options.results_per_page > 0 && options.results_per_page < MAXIMUM_RESULTS_PAGE){
          var tmp_str = 'results_per_page='+options.results_per_page;
          opt_str = opt_num > 0 ? (opt_str + '&' + tmp_str) : tmp_str;
        }else
          throw new ParamException("Invalid results_per_page!");
      }

      //Page number to return
      if(options.page){
        if (options.page > 0 && options.page < MAXIMUM_PAGES){
          var tmp_str = 'page='+options.page;
          opt_str = opt_num > 0 ? (opt_str + '&' + tmp_str) : tmp_str;
        }else
          throw new ParamException("Invalid page!");
      }
    }
    else if(!options){}
    else
      throw new ParamException("Invalid options!");
}catch(e){console.log(e);callback(e); return;}

  var out_cmd = {};
  out_cmd.method = 'GET';
  out_cmd.data = '';
  out_cmd.url = opt_str ? (stringformat(TRANSACTIONS, this.address)+'?'+ opt_str) : stringformat(TRANSACTIONS, this.address);

  this._get(out_cmd,callback);
};

module.exports = Wallet;

