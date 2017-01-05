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


function CancelOrderOperation(wallet,sequence) {
  try{
    if (!wallet || typeof wallet !== 'object' || !wallet.secret)
      throw new ParamException("Invalid wallet");
    if(!sequence || isNaN(sequence))
      throw new ParamException("Invalid sequence!");
  }catch(e){console.log(e);return e;}

  Operation.call(this,wallet);
  this._method = 'DELETE';
  this._url = stringformat(ORDERS, this._wallet.address)+'/'+sequence;
}

CancelOrderOperation.prototype = new Operation();


/*
 Perform the cancelOrder operation
*/
CancelOrderOperation.prototype._payload = function() {
  var _data ={
    secret: this._wallet.secret
  };
  return _data;
};

module.exports = CancelOrderOperation;

