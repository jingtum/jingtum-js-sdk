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
const stringformat = require('stringformat');
const TRUSTS         = '/accounts/{0}/trustlines';
const ParamException = require('./Error').ParamException;
const Operation      = require('./Operation');
const isAmount       = require('./DataCheck').isAmount;

function TrustlineOperation(wallet) {
  try{
    if (!wallet || typeof wallet !== 'object' || !wallet.secret)
      throw new ParamException("Invalid wallet");
  }catch(e){console.log(e);return e;}

  Operation.call(this,wallet);
  this._method = 'POST';
  this._url = stringformat(TRUSTS, this._wallet.address);
  this._amount = {};
}

TrustlineOperation.prototype = new Operation();

TrustlineOperation.prototype.setTrustlineAmount = function(trustline_amount) {
  try{
    if (!isAmount(trustline_amount) )
      throw new ParamException("Invalid Taker pays amount!");
    this._amount = trustline_amount;
  }catch(e){console.log(e);}
};

/*
 * Put all the info in the operation
 * and should wait for the sign.
 */
TrustlineOperation.prototype._payload = function() {
  //Just check if the required parameters are empty
  try {
    if (!this._amount)
      throw new ParamException("Invalid trustline parameters");
  }catch(e){console.log(e);return;}

  var _data = {
    secret: this._wallet.secret,
    trustline: {
      limit: this._amount.value,
      currency: this._amount.currency,
      counterparty: this._amount.issuer
    }
  };

  return _data;
};


module.exports = TrustlineOperation;

