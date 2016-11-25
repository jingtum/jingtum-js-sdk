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
const _              = require('lodash');
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
var Server           = require('./Server');
var config           = require('../config.json');


const ACTIVE_AMOUNT       = '25';
const DEFAULT_TRUST_LIMIT = '100000000';
const PAYMENT_PATH_RATE   = '1.01';
const RANDOM_PREFIX       = printf("%06d", parseInt((Math.random()*1000000)));
const PREFIX              = 'PREFIX' + RANDOM_PREFIX;
const API_VERSION_V1      = '/v1';
const API_VERSION_V2      = '/v2';

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
  this._url = config.isTest ? config.test_fingate : config.fingate;

  // init sjcl library
  for (var i = 0; i < 8; i++) {
    sjcl.random.addEntropy(Math.random(), 32, 'Math.random()');
  }
}

/*set fingate environment:1表示测试环境；0表示正式环境*/
FinGate.prototype.setTest = function (bool) {
  try{
    if(typeof bool !== 'boolean')
      throw new ParamException("Invalid type,must be boolean");
  }catch(e){console.log(e);return;}

  this._url = bool ? config.test_fingate : config.fingate;
};

/**
 * set fingate account, this account can be used to
 *    activate wallet
 *    used as fingate
 */
FinGate.prototype.setAccount = function(secret, address) {
  try{
    if(!secret || !address)
      throw new ParamException('missing params!')
    var bw = new AccountClass(secret,address);
    if(bw.type === 'ParamException')
      throw new ParamException(bw.msg);
    this.address = bw.address;
    this.secret = bw.secret;
  }catch(e){
    console.log(e);
  }
};

FinGate.prototype.createWallet = function() {
  var secret = Base58Utils.encode_base_check(33, sjcl.codec.bytes.fromBits(sjcl.random.randomWords(4)));
  var address = base.fromSecret(secret).address;
  const Wallet = require('./Wallet');
  return new Wallet(secret,address);
};

// --------follow functions are issue currency related--------

/*
* custom: string 商户编号
* ekey: string 商户密钥
* */
FinGate.prototype.setConfig = function(custom, ekey) {
  try{
    if (!custom || typeof(custom) !== 'string')
      throw new ParamException("Invalid custom param!");
    if (!ekey || typeof(ekey) !== 'string')
      throw new ParamException("Invalid sign key param for FinGate!");
    this._custom = custom;
    this._ekey = ekey;
  }catch(e){
    console.log(e);
  }
};

//发行用户通（银关给帐户发通）
FinGate.prototype.issueCustomTum = function(obj,callback) {
  //custom, order, currency, amount, account, key, url
  var newCallback = callback || function(){};
  try{
    if(!this._custom || !this._ekey)
      throw  new ParamException('please set config first!');
    if (!obj.currency || !isTumCode(obj.currency))
      throw new ParamException("Invalid currency param");
    if (!obj.amount || !/^-?\d+\.?\d{2}$/.test(obj.amount)) //控制必须为两位小数
      throw new ParamException("Invalid amount param:amount must be an number and be two decimal places");
    if (!obj.account || !base.isValidAddress(obj.account))
      throw new ParamException("Invalid account param");
  }catch(e){newCallback(e,null);return;}
  obj.custom = this._custom;
  obj.order = new Server().getClientResourceID();
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
    if(err) {console.log('err:',err); callback(err);}
    else if(body) {
      if(body.code === 0){
        var data = {order:obj.order,currency:obj.currency,amount:obj.amount,account:obj.account};
        newCallback(null,data);
        return;
      }
      else
        newCallback(null,body.code)
    }else
      newCallback('invalid parameters!',null);
  });
};

/*
 * Query the info about issued information. 查询发行状态
*/
FinGate.prototype.queryIssue = function(obj,callback) {
  var newCallback = callback || function(){};
  try{
    if(!this._custom || !this._ekey)
      throw  new ParamException('please set config first!');
    if (!obj.order || typeof(obj.order) !== 'string')
      throw new ParamException("Invalid order param");
  }catch(e){console.log(e);newCallback(e,null);return;}
  obj.custom = this._custom;
  obj.key = this._ekey;
  obj.url = this._url;
  obj.cmd = 'QueryIssue';
  obj.hmac = CryptoJS.HmacMD5(obj.cmd + obj.custom + obj.order , obj.key).toString();
  request({method:'POST', url: obj.url, json: true, body: obj}, function (err, res, body) {
    if(err) console.log('err:',err);
    else if(body){
      if(body.code === 0){
        var data = {order:body.order,status:body.status};
        newCallback(null,data);
        return;
      }
      else
        newCallback(body.code,null);
    }else
      newCallback('invalid parameters!',null);
  });
};

/*
 * Query the info about issued custom Tum.查询通状态
*/
FinGate.prototype.queryCustomTum = function(obj,callback) {
  var newCallback = callback || function(){};
  try{
    if (!obj.currency || !isTumCode(obj.currency))
      throw new ParamException("Invalid currency param");
  }catch(e){console.log(e);newCallback(e,null);return;}
  obj.custom = this._custom;
  obj.key = this._ekey;
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
      if(body.code === 0){
        var data = {currency:body.currency,name:body.name,circulation:body.circulation,credit:body.credit,status:body.status,start_date:body.start_date,end_date:body.end_date};
        newCallback(null,data);
        return;
      }
      else
        newCallback(body.code,null);
    }else
      newCallback('invalid parameters!',null);
  });
};

var fingate = new FinGate();

module.exports = fingate;
