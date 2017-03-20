/*
 * Node JS SDK for Jingtum network； Operation
 * @version 1.0.0
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
 * ---------------------------------------------------------------  
 * Operation
 *   PaymentOperation     
 *   OrderOperation
*/
const ParamException = require('./Error').ParamException;
const Server         = require('../lib/Server');

function Operation(wallet) {
  if (!wallet || !wallet._server)
    return;
  this._wallet = wallet;
  this._server = new Server();
  this._memo = '';
  this._url = '';
  this._method = null;
  this._validate = false;
}

Operation.prototype.setMemo = function (memo) {
  this._memo = memo;
};
Operation.prototype.setMethod = function(method) {
  try{
    if ( !/^((GET)|(POST)|(DELETE)|(PUT))$/.test(method) )
      throw new ParamException("Invalid method");
    this._method = method;
  }catch(e){console.log(e);}
};

Operation.prototype.setUrl = function(url) {
    this._url = url;
};

/*set sync or async*/
Operation.prototype.setValidate = function(in_validate) {
  try{
    if (typeof in_validate !== 'boolean' )
      throw new ParamException("Invalid validate value");
    this._validate = in_validate;
  }catch(e){console.log(e);}
};

/*
 * Return the data to POST
*/
Operation.prototype._payload = function() {
  return null;
};

/*
* For batch operation parameters
*/
Operation.prototype._getOperation = function() {
  return null;
};

/*
* For batch operation parameters
*/
Operation.prototype._getSrcSecret = function() {
  return this._wallet.secret;
};

Operation.prototype.submit = function (callback) {
  var options = {
    method:this._method,
    url:this._url,
    validate:this._validate,
    data:this._payload()
  };

  this._server.submitRequest(options, function (err, res) {
    if(res.order){ //过滤取消挂单
      var order = res.order;
      var pays_issuer = order.taker_pays.issuer === ''? '':(':'+ order.taker_pays.issuer);
      var gets_issuer = order.taker_gets.issuer === ''? '':(':'+ order.taker_gets.issuer)
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
    }
    console.log(res.toString());
    callback(err,res);
  })
};


module.exports = Operation;

