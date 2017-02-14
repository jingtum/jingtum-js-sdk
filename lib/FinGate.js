/*
 * NODE JS SDK for Jingtum network； Websocket class
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
 * --------------------------------------------------------
 */
const util           = require('util');
const printf         = require('printf');
const dateformat     = require('dateformat');
const base           = require('jingtum-base-lib').Wallet;
const Base58Utils    = require('./base58');
const sjcl           = require('./sjcl');
const AccountClass   = require('./AccountClass');
const ParamException = require('./Error').ParamException;
const isTumCode      = require('./DataCheck').isTumCode;
var CryptoJS         = require('crypto-js');
var request          = require('request');
var config           = require('../config.json');
var Single           = require('./Single');


const ACTIVE_AMOUNT       = '25';
const MIN_ACT_AMOUNT      = '10';
const DEFAULT_TRUST_LIMIT = '100000000';
const PAYMENT_PATH_RATE   = '1.01';
const RANDOM_PREFIX       = printf("%06d", parseInt((Math.random()*1000000)));
const PREFIX              = 'PREFIX' + RANDOM_PREFIX;
const API_VERSION_V1      = '/v1';
const API_VERSION_V2      = '/v2';
const ORDERBOOK      = '/accounts/{0}/order_book';
const stringformat   = require('stringformat');

/**
 * FinGate constructor,
 * default fingate is connected to product env, prefix is random
 * activeAmount, defaultTrustLimit, paymentPathRate, apiVersion, these are all default.
 * and can be changed directly by these properties.
 *
 * this fingate ONLY support prod env and test env.
 */
function FinGate() {
  this.activeAmount = ACTIVE_AMOUNT;
  this.defaultTrustLimit = DEFAULT_TRUST_LIMIT;
  this.paymentPathRate = PAYMENT_PATH_RATE;
  this.prefix = PREFIX;
  this.apiVersion = API_VERSION_V1;
  this._client_resource_id = 0;
  this.DEVELOPEMENT = false;
  this.PRODUCTION = true;
  this._mode = false;
  this._single = new Single().getInstance();
  this._url = this._single.fingate;
  this.setAmountFlag = true;//标记是否设置了activeAmount
  // init sjcl library
  for (var i = 0; i < 8; i++) {
    sjcl.random.addEntropy(Math.random(), 32, 'Math.random()');
  }
}

/*set fingate environment:1表示测试环境；0表示正式环境*/
FinGate.prototype.setMode = function (bool) {
  try{
    if(typeof bool !== 'boolean')
      throw new ParamException("Invalid type,must be boolean");
  }catch(e){console.log(e);return;}
  this._single.setMode(bool);
  this._url = this._single.fingate;
  this._mode = bool;
};

/**
 * set fingate account, this account can be used to
 *    activate wallet
 *    used as fingate
 */
FinGate.prototype.setAccount = function(secret, address) {
  try{
    if(!secret)
      throw new ParamException('missing params!');
    var bw = new AccountClass(secret, address);
    if(bw.type === 'ParamException')
      throw new ParamException(bw.msg);
    this.address = bw.address;
    this.secret = bw.secret;
  }catch(e){
    console.log(e);
  }
};


/**
 *
 * 获得货币对的挂单列表， 通过以下API发送接口
 * /v1/accounts/{:address}/order_book/{:base}/{:counter}
 * 需要检测输入参数的格式。
 * base (currency+issuer)
 * counter(currency+issuer)
 */
FinGate.prototype.getOrderBook = function(pair, callback) {
  try{
    if(!this.address || !this.secret)
      throw  new ParamException('please set account first!');
    if(arguments.length !== 2 || typeof pair !== 'string' || typeof callback !== 'function')
      throw new ParamException('Missing Parameters');
    if(pair.indexOf('SWT')> -1)
      pair = pair.substring(0,pair.indexOf('SWT')+3) + ':' + pair.substring(pair.indexOf('SWT')+3, pair.length);
    var curs = pair.split(/[\/:]/);
    if (curs[0] !== 'SWT' && (!isTumCode(curs[0]) || !base.isValidAddress(curs[1]))){
      throw new ParamException('Invalid baser!');
    }
    if (curs[2] !== 'SWT' &&(!isTumCode(curs[2]) || !base.isValidAddress(curs[3]))){
      throw new ParamException('Invalid counter!');
    }
  }catch(e){callback(e); return;}

  var path = curs[0] + (curs[0] === 'SWT'? '' :('+' +curs[1])) + '/' + curs[2] + (curs[2] === 'SWT'? '' :('+' +curs[3]));
  var url = this._single.server + this.apiVersion  + stringformat(ORDERBOOK, this.address)+ '/'+ path;
  request.get(url, function (err,res,body) {
    if(err) {callback(err,null);}
    else if(body) {
      var data = JSON.parse(body);
      data.pair = data.order_book.replace(/\+/g,':');
      delete data.order_book;
      formatOrderBook(data.bids);
      formatOrderBook(data.asks);
      callback(null,data);
    }
  });
};

function formatOrderBook(bids){
  for(var i=0;i<bids.length;i++){
    var bid = bids[i];
    bid.price = bid.price.value;
    bid.funed = bid.sell ? bid.taker_gets_funded.value : bid.taker_pays_funded.value;
    bid.total = bid.sell ? bid.taker_gets_total.value : bid.taker_pays_total.value;

    delete bid.taker_gets_funded;
    delete bid.taker_pays_funded;
    delete bid.taker_gets_total;
    delete bid.taker_pays_total;
    delete bid.passive;
    delete bid.sell;
  }
}


FinGate.prototype.createWallet = function() {
  var secret = Base58Utils.encode_base_check(33, sjcl.codec.bytes.fromBits(sjcl.random.randomWords(4)));
  var address = base.fromSecret(secret).address;
  const Wallet = require('./Wallet');
  return new Wallet(secret,address);
};

/*set activeAmount
 * default 25
 * */
FinGate.prototype.setActiveAmount = function (amount) {
  try{
    if(!amount || isNaN(amount))
      throw new ParamException('amount must be a number!');
    else if(Number(amount) < Number(MIN_ACT_AMOUNT)){
      this.setAmountFlag = false;
      throw new ParamException('The minimum value of amount is 10!');
    }
  }catch(e){
    console.log(e);
    return e;
  }
  this.activeAmount = amount.toString();
};

/*active wallet
 * source_wallet: Wallet Object, source wallet,
 * dest_address: string, destination address,
 * return boolean
 * */
FinGate.prototype.activateWallet = function (address, callback) {
  if(arguments.length !== 2 || !base.isValidAddress(address) || typeof callback !== 'function'){
    console.log(new ParamException("invalid arguments!"));
    return;
  }
  try{
    if(!this.address || !this.secret)
      throw new ParamException("please set fingate account first!");
    if(!this.setAmountFlag)
      throw new ParamException('The minimum value of amount is 10!');
  }catch(e){
    callback(e,null);
    return;
  }
  var that = this;
  var options = {
    method:'GET',
    url: (this._mode ? config.server : config.test_server) + this.apiVersion + '/accounts/' + address + '/balances',
    json: true
  };
  request(options, function (err, res, body) {//是否已经激活
    if(body.success === true)
      callback(null,'already activated!');
    else{
      var Server = require('./Server');
      var _data = {
        method:"POST",
        url:(that._mode ? config.server : config.test_server) + that.apiVersion + '/accounts/' + address + '/payments?validated=true',
        json:true,
        body: {
          secret: that.secret,
          client_resource_id: new Server().getClientResourceID(),
          payment: {
            source_account: that.address,
            destination_account: address,
            destination_amount: {'currency':'SWT','value':that.activeAmount,'issuer':''}
          }
        }
      };
      request(_data, function(err,res,body){
        if(body.success === true)
          callback(null,'activated successfully!');
        else
          callback(body,'activated failed!');
      });
    }
  });
};

// --------follow functions are issue currency related--------

/* token: string 商户编号 */
FinGate.prototype.setToken = function(token) {
  try{
    if (!token || typeof(token) !== 'string')
      throw new ParamException("Invalid token param!");
    this._custom = token;
  }catch(e){
    console.log(e);
  }
};

/* key: string 商户密钥*/
FinGate.prototype.setKey = function(key) {
  try{
    if (!key || typeof(key) !== 'string')
      throw new ParamException("Invalid sign key param for FinGate!");
    this._ekey = key;
  }catch(e){
    console.log(e);
  }
};

//发行用户通（银关给帐户发通）
FinGate.prototype.issueCustomTum = function(currency, amount, orderId, account, callback) {
  //custom, order, currency, amount, account, key, url
  if(arguments.length >= 4 && arguments.length <= 5 &&  ( typeof account === 'function' || typeof callback === 'function')){
    if(arguments.length === 4){
      var Server = require('./Server');
      callback = account;
      account = orderId;
      orderId = new Server().getClientResourceID();
    }
  }else{
    console.log(new ParamException("invalid arguments!"));
    return;
  }
  try{
    if(!this._ekey)
      throw  new ParamException('please set token and key first!');
    if (!isTumCode(currency))
      throw new ParamException("Invalid currency param");
    if (!/^-?\d+\.?\d{2}$/.test(amount)) //控制必须为两位小数
      throw new ParamException("Invalid amount param:amount must be an number and be two decimal places");
    if (!base.isValidAddress(account))
      throw new ParamException("Invalid account param");
  }catch(e){callback(e,null);return;}
  var obj = {};
  obj.account = account;
  obj.currency = currency;
  obj.custom = this._custom;
  obj.amount = amount;
  obj.order = orderId;
  obj.url = this._url;
  obj.cmd = 'IssueTum';
  obj.key = this._ekey;
  obj.hmac = CryptoJS.HmacMD5(obj.cmd + obj.custom + obj.order + obj.currency + obj.amount + obj.account, obj.key).toString();
  var options = {
    method:'POST',
    url: obj.url,
    json: true,
    body: obj
  };
  request(options, function (err, res, body) {
    if(err) {callback(err,null);}
    else if(body) {
      callback(null,body);
    }else
      callback('invalid parameters!',null);
  });
};

/*
 * Query the info about issued information. 查询发行状态
 */
FinGate.prototype.queryIssue = function(orderId, callback) {
  if (arguments.length !==2 || typeof(orderId) !== 'string' || typeof callback !== 'function'){
    console.log(new ParamException("Invalid arguments"));
    return;
  }
  try{
    if(!this._custom || !this._ekey)
      throw  new ParamException('please set token and key first!');
  }catch(e){callback(e,null);return;}
  var obj = {};
  obj.custom = this._custom;
  obj.key = this._ekey;
  obj.url = this._url;
  obj.order = orderId;
  obj.cmd = 'QueryIssue';
  obj.hmac = CryptoJS.HmacMD5(obj.cmd + obj.custom + obj.order , obj.key).toString();
  request({method:'POST', url: obj.url, json: true, body: obj}, function (err, res, body) {
    if(err) callback(err,null);
    else if(body){
      callback(null,body);
    }else
      callback('invalid parameters!',null);
  });
};

/*
 * Query the info about issued custom Tum.查询通状态
 */
FinGate.prototype.queryCustomTum = function(currency,callback) {
  if (arguments.length !==2 || !isTumCode(currency) || typeof callback !== 'function'){
    console.log(new ParamException("Invalid arguments"));
    return;
  }
  try{
    if(!this._custom || !this._ekey)
      throw  new ParamException('please set token and key first!');
  }catch(e){callback(e,null);return;}
  var obj = {};
  obj.custom = this._custom;
  obj.key = this._ekey;
  obj.currency = currency;
  obj.date = Math.floor(new Date().getTime()/1000);
  obj.url = this._url;
  obj.cmd = 'QueryTum';
  obj.hmac = CryptoJS.HmacMD5(obj.cmd + obj.custom + obj.currency + obj.date , obj.key).toString();
  request({
    method:'POST',
    url: obj.url,
    json: true,
    body: obj
  }, function (err, res, body) {
    if(err) console.log('err:',err);
    else if(body){
      callback(null,body);
    }else
      callback('invalid parameters!',null);
  });
};

var fingate = new FinGate();

module.exports = fingate;
