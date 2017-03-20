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
 *   BatchOperation     
*/
const stringformat = require('stringformat');
const OPERATIONS         = '/accounts/{0}/operations';
const ParamException = require('./Error').ParamException;
const Operation      = require('./Operation');
const isAmount       = require('./DataCheck').isAmount;

function BatchOperation(wallet) {
  try{
    if (!wallet || typeof wallet !== 'object' || !wallet.secret)
      throw new ParamException("Invalid wallet");
  }catch(e){console.log(e);return e;}

  Operation.call(this,wallet);
  this._method = 'POST';
  this._url = stringformat(OPERATIONS, this._wallet.address);
  this._signers = new Array();
  this._operations = new Array();
}

BatchOperation.prototype = new Operation();

/*
 * Add each operation in the array.
 * 
 */
BatchOperation.prototype.setOperation = function(in_ops) {
  try{
        this._signers.push(in_ops._getSrcSecret());
        this._operations.push(in_ops._getOperation());
  }catch(e){console.log(e);}
};

/*
 * Clean the operation array.
 * This should be called when issuing a new set of operations.
 * 
 */
BatchOperation.prototype.reset = function(in_ops) {
  try{
    this._signers = new Array();
    this._operations = new Array();
  }catch(e){console.log(e);}
};

/*
 * Put all the info in the operation
 * and should wait for the sign.
 */
BatchOperation.prototype._payload = function() {
  //Just check if the required parameters are empty
  try {
    if (this._signers.length < 1)
      throw new ParamException("No signers in the Batch operations!");
    if (this._signers.length != this._operations.length)
      throw new ParamException("Number of signers does not equal operations!");
  }catch(e){console.log(e);return;}

  var _data = {
    secret: this._wallet.secret,
    signers: this._signers,
    operations: this._operations
  };

  return _data;
};


module.exports = BatchOperation;

