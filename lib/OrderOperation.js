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
const isAmount       = require('./DataCheck').isAmount;
/*
 * Base class for all the operations
 * This should contain 
*/
function OrderOperation(wallet) {
  try{
    if (!wallet || typeof wallet !== 'object' || !wallet.secret)
      throw new ParamException("Invalid wallet");
  }catch(e){console.log(e);return;}

  Operation.call(this,wallet);
  this._method = 'POST';
  this._url = stringformat(ORDERS, this._wallet.address);
  this._type = '';
  this._taker_pays = {};
  this._taker_gets = {};
}
OrderOperation.prototype = new Operation();

OrderOperation.prototype.setOrderType = function(type) {
  try{
    if ( type === 'sell' ||  type === 'buy')
      this._type = type;
    else
      throw new ParamException("Invalid Order type!");
  }catch(e){console.log(e);}
};


/*
 * Set the currency amount for the Taker pays
 * Notice that the amount obj's issuer attributes
 * need to be changed to counter party
*/
OrderOperation.prototype.setTakerPays = function(pays_amount) {
  try{
    if (!isAmount(pays_amount) )
      throw new ParamException("Invalid Taker pays amount!");
    this._taker_pays = pays_amount;
  }catch(e){console.log(e);}
};


/*
 * Set the currency amount for the Taker Gets
 * Notice that the amount obj's issuer attributes
 * need to be changed to counter party 
*/
OrderOperation.prototype.setTakerGets = function(gets_amount) {
  try{
    if (!isAmount(gets_amount) )
      throw new ParamException("Invalid Taker gets amount!");
    this._taker_gets = gets_amount;
  }catch(e){console.log(e);}
};


/*
 * Note:
 * API requires the input Amount using 'counterparty'
 * instead of 'issuer' for the order submission
*/
OrderOperation.prototype._payload = function() {
  //Just check if the required parameters are empty
  try{
    if ( !isAmount(this._taker_pays ) )
      throw new ParamException("Invalid Taker pays amount!");
    if (!isAmount( this._taker_gets))
      throw new ParamException("Invalid Taker gets amount!");
    if ( this._type != 'sell' &&  this._type != 'buy')
      throw new ParamException("Invalid order type!");
  }catch(e){console.log(e);return;}

  //Note to change the issuer to
  var amount_pays = {};

  amount_pays.value = this._taker_pays.value;
  amount_pays.currency = this._taker_pays.currency;
  amount_pays.counterparty = this._taker_pays.issuer;
  
  var amount_gets = {};

  amount_gets.value = this._taker_gets.value;
  amount_gets.currency = this._taker_gets.currency;
  amount_gets.counterparty = this._taker_gets.issuer;

  var _data ={
    secret: this._wallet.secret,
    order: {
      type: this._type,
      taker_pays: amount_pays,
      taker_gets: amount_gets
    }
  }
  return _data;
};



module.exports = OrderOperation;

