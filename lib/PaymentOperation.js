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
const PAYMENTS       = '/accounts/{0}/payments';
const ParamException = require('./Error').ParamException;
const base           = require('jingtum-base-lib').Wallet;
const isAmount       = require('./DataCheck').isAmount;
const Operation      = require('./Operation');

/*
 * Base class for all the operations
 * This should contain 
*/
function PaymentOperation(wallet){
  try{
    if (!wallet || typeof wallet !== 'object' || !wallet.secret)
      throw new ParamException("Invalid wallet");
  }catch(e){console.log(e);return;}

  Operation.call(this,wallet);
  this._method = 'POST';
  this._url = stringformat(PAYMENTS, this._wallet.address);
  this._client_id = this._server.getClientResourceID();
  this._amount = {};
  this._destination = '';
}

PaymentOperation.prototype = new Operation();
  
/*
 * Set the client resource ID for PAYMENT operation.
*/
PaymentOperation.prototype.setClientId = function(client_id) {
  try{
    if ( typeof client_id !== 'string' )
      throw new ParamException("Invalid Client Resource ID");
    this._client_id = client_id;
  }catch(e){console.log(e);}
};

/*
 * Payment operation
 * Amount of the payment.
*/

PaymentOperation.prototype.setAmount = function(amount) {
  try{
    if(!isAmount(amount))
      throw new ParamException("Invalid payment amount!");
    this._amount = amount;
  }catch (e){console.log(e);}
};

/*
 * Payment destination address
*/
PaymentOperation.prototype.setDestAddress = function(dest) {
  try{
    if (!base.isValidAddress(dest))
      throw new ParamException("Invalid payment dest address");
    this._destination = dest;
  }catch (e){console.log(e);}
};
 
/*
 * Set the input path which can get from the 
 * get payment path operation.
*/
PaymentOperation.prototype.setChoice= function(key) {
  try{
    if (typeof key === 'string' && key.length === 40) {
      for(var i= 0,len = this._server.paths.length;i < len; i++){
        if(key === this._server.paths[i].key){
          this._path = this._server.paths[i].path;
          this._amount = this._server.paths[i].amount;
        }
      }
    }
    else
      throw new ParamException("Invalid payment path!");
  }catch (e){console.log(e);}
};

/*set memo*/
PaymentOperation.prototype.setMemo = function(memo) {
  try{
    if ( typeof memo !== 'string' )
      throw new ParamException("Invalid memo");
    this._memo = memo;
  }catch (e){console.log(e);}
};

/*
 * Sign the operation by using the input secret key
*/
PaymentOperation.prototype._payload = function(){
  //Just check if the required parameters are empty
  try{
    if ( this._amount && this._wallet && this._destination){
      var payment_item = {
        source_account: this._wallet.address,
        destination_account: this._destination,
        destination_amount: this._amount,
        paths: this._path
      };
      if(this._memo)
        payment_item.memos = [{
          'memo_type': 'string',
          'memo_data': this._memo
        }];
    }
    else
      throw new ParamException("Invalid payment parameters");
  }catch(e){console.log(e);return e;}

  var _data = {
    secret: this._wallet.secret,
    client_resource_id: this._client_id || this._server.getClientResourceID(),
    payment: payment_item
  };
  return _data;
};

/*
* For batch operation parameters
* operation -
    "type": "Payment",
    "account": "jJ524DekvGBKTKu1gxAhMS8raa3mMfdwta",
    "payment": {
    "source_account": "jJ524DekvGBKTKu1gxAhMS8raa3mMfdwta",
    "destination_amount": {
    "currency": "SWT",
    "issuer": "",
    "value": "0.000002"
    },
    "destination_account": "jHokET15vHKFwg9djpieZryiTzgDHRJLrh",
    "paths": "[]"
    }
    },
*/
PaymentOperation.prototype._getOperation = function() {
  //Just check if the required parameters are empty
  try{
    if ( this._amount && this._wallet && this._destination){
      var payment_item = {
        source_account: this._wallet.address,
        destination_account: this._destination,
        destination_amount: this._amount,
        paths: this._path
      };
      if(this._memo)
        payment_item.memos = [{
          'memo_type': 'string',
          'memo_data': this._memo
        }];
    }
    else
      throw new ParamException("Invalid payment parameters");
  }catch(e){console.log(e);return e;}

  var _data = {
    type: 'payment',
    account: this._wallet.address,
    payment: payment_item
  };
  return _data;
};


module.exports = PaymentOperation;

