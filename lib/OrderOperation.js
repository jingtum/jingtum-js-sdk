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
 *   OrderOperation
 */
const stringformat   = require('stringformat');
const ORDERS         = '/accounts/{0}/orders';
const Operation      = require('./Operation');
const ParamException = require('./Error').ParamException;

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
  this._pair = '';
  this._amount = 0;
  this._price = 0;
  this.SELL = 'sell';
  this.BUY = 'buy';
}
OrderOperation.prototype = new Operation();

OrderOperation.prototype.setType = function(type) {
  try{
    if ( type === this.SELL ||  type === this.BUY)
      this._type = type;
    else
      throw new ParamException("Invalid Order type!");
  }catch(e){console.log(e);}
};

OrderOperation.prototype.setPair = function(pair) {
  try{
    if (pair.split(/[\/:]/).length < 3 || !/^(([A-Z]{3})|([A-Z0-9]{40}))(:[a-zA-Z0-9]{34})*\/(([A-Z]{3})|([A-Z0-9]{40}))(:[a-zA-Z0-9]{34})*$/.test(pair) )
      throw new ParamException("Invalid pair!");
    if(pair.indexOf('SWT')> -1){
      pair = pair.substring(0,pair.indexOf('SWT')+3) + ':' + pair.substring(pair.indexOf('SWT')+3, pair.length);
    }
    this._pair = pair;
  }catch(e){console.log(e);}
};

OrderOperation.prototype.setAmount = function(amount) {
  try{
    if (isNaN(amount))
      throw new ParamException("Invalid amount!");
    this._amount = amount;
  }catch(e){console.log(e);}
};

OrderOperation.prototype.setPrice = function(price) {
  try{
    if (isNaN(price))
      throw new ParamException("Invalid price!");
    this._price = price;
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
    if ( this._type !== this.SELL &&  this._type !== this.BUY)
      throw new ParamException("Please set type first!");
    if ( this._pair === '')
      throw new ParamException("Please set pair first!");
    if ( this._amount === 0)
      throw new ParamException("Please set amount first!");
    if ( this._price === 0)
      throw new ParamException("Please set price first!");
  }catch(e){console.log(e);return;}
  var amount_pays = {};
  var amount_gets = {};
  var curs = this._pair.split(/[\/:]/);
  if(this._type === this.BUY){
    amount_pays.value = parseFloat(this._amount).toFixed(6);
    amount_pays.currency = curs[0];
    amount_pays.counterparty = curs[1];

    amount_gets.value = (parseFloat(this._price) * parseFloat(this._amount)).toFixed(6);
    amount_gets.currency = curs[2];
    amount_gets.counterparty = curs[3];
  }else{
    amount_gets.value = parseFloat(this._amount).toFixed(6);
    amount_gets.currency = curs[0];
    amount_gets.counterparty = curs[1];

    amount_pays.value = (parseFloat(this._price) * parseFloat(this._amount)).toFixed(6);
    amount_pays.currency = curs[2];
    amount_pays.counterparty = curs[3];
  }

  var _data ={
    secret: this._wallet.secret,
    order: {
      type: this._type,
      taker_pays: amount_pays,
      taker_gets: amount_gets
    }
  };
  return _data;
};

/*
* For batch operation parameters
*/
OrderOperation.prototype._getOperation = function() {
   //Just check if the required parameters are empty
  try{
    if ( this._type !== this.SELL &&  this._type !== this.BUY)
      throw new ParamException("Please set type first!");
    if ( this._pair === '')
      throw new ParamException("Please set pair first!");
    if ( this._amount === 0)
      throw new ParamException("Please set amount first!");
    if ( this._price === 0)
      throw new ParamException("Please set price first!");
  }catch(e){console.log(e);return;}
  var amount_pays = {};
  var amount_gets = {};
  var curs = this._pair.split(/[\/:]/);
  if(this._type === this.BUY){
    amount_pays.value = parseFloat(this._amount).toFixed(6);
    amount_pays.currency = curs[0];
    amount_pays.counterparty = curs[1];

    amount_gets.value = (parseFloat(this._price) * parseFloat(this._amount)).toFixed(6);
    amount_gets.currency = curs[2];
    amount_gets.counterparty = curs[3];
  }else{
    amount_gets.value = parseFloat(this._amount).toFixed(6);
    amount_gets.currency = curs[0];
    amount_gets.counterparty = curs[1];

    amount_pays.value = (parseFloat(this._price) * parseFloat(this._amount)).toFixed(6);
    amount_pays.currency = curs[2];
    amount_pays.counterparty = curs[3];
  }

  var _data = {
    type: this._type,
    account: this._wallet.address,
    order: {
      type: this._type,
      taker_pays: amount_pays,
      taker_gets: amount_gets
    }
  };
  return _data;
};

module.exports = OrderOperation;

