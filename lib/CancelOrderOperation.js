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
const stringformat   = require('stringformat');
const ORDERS         = '/accounts/{0}/orders';
const Operation      = require('./Operation');
const ParamException = require('./Error').ParamException;


function CancelOrderOperation(wallet) {
  try{
    if (!wallet || typeof wallet !== 'object' || !wallet.secret)
      throw new ParamException("Invalid wallet");
  }catch(e){console.log(e);return e;}

  Operation.call(this,wallet);
}

CancelOrderOperation.prototype = new Operation();

CancelOrderOperation.prototype.setSequence = function(sequence){
  try{
    if(!sequence || isNaN(sequence))
      throw new ParamException("Invalid sequence!");
  }catch (e){
    console.log(e);
    return e;
  }

  this._method = 'DELETE';
  this._url = stringformat(ORDERS, this._wallet.address)+'/'+sequence;
};
/*
 Perform the cancelOrder operation
*/
CancelOrderOperation.prototype._payload = function() {
  var _data ={
    secret: this._wallet.secret
  };
  return _data;
};

/*
* For batch operation parameters
*/
CancelOrderOperation.prototype._getOperation = function() {
  return null;
};

module.exports = CancelOrderOperation;

