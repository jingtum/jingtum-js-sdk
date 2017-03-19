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
 * ---------------------------------------------------------------  
 * Operation
 *   SettingsOperation     
*/
const stringformat   = require('stringformat');
const SETTINGS       = '/accounts/{0}/settings';
const Operation      = require('./Operation');
const ParamException = require('./Error').ParamException;
const base           = require('jingtum-base-lib').Wallet;
const isAmount       = require('./DataCheck').isAmount;

/*
 * Class to change account setting operations
 * This should contain 
 */
function SettingsOperation(wallet) {
  try{
    if (!wallet || typeof wallet !== 'object' || !wallet.secret)
      throw new ParamException("Invalid wallet");
  }catch(e){console.log(e);return;}

  Operation.call(this,wallet);
  this._method = 'POST';
  this._url = stringformat(SETTINGS, this._wallet.address);
  this.settings = {};

}
SettingsOperation.prototype = new Operation();

SettingsOperation.prototype.setRegularKey = function(regular_key) {
  try{
    if (base.isValidAddress(regular_key))
      this.settings.regular_key = regular_key;
    else
      throw new ParamException("Invalid regular_key!");
  }catch(e){console.log(e);}
};

SettingsOperation.prototype.setDomain = function(domain) {
  try{
    if (typeof domain === 'string')
      this.settings.domain = domain;
    else
      throw new ParamException("Invalid domain!");
  }catch(e){console.log(e);}
};

SettingsOperation.prototype.setEmailHash = function(email_hash) {
  try{
    if (typeof email_hash === 'string')
      this.settings.email_hash = email_hash;
    else
      throw new ParamException("Invalid email_hash!");
  }catch(e){console.log(e);}
};

SettingsOperation.prototype.setWalletLocator = function(wallet_locator) {
  try{
    if (typeof wallet_locator === 'string')
      this.settings.wallet_locator = wallet_locator;
    else
      throw new ParamException("Invalid wallet_locator!");
  }catch(e){console.log(e);}
};

SettingsOperation.prototype.setMessageKey = function(message_key) {
  try{
    if (typeof message_key === 'string')
      this.settings.message_key = message_key;
    else
      throw new ParamException("Invalid message_key!");
  }catch(e){console.log(e);}
};

/*
 * Transfer rate should be larger or equal than 1.0
*/
SettingsOperation.prototype.setTransferRate = function(transfer_rate) {
  try{
    if (!isNaN(transfer_rate) && transfer_rate >= 1.0)
      this.settings.transfer_rate = transfer_rate;
    else
      throw new ParamException("Invalid transfer_rate!");
  }catch(e){console.log(e);}
};

//SettingsOperation.prototype.setWalletSize = function(wallet_size) {
//  try{
//    if (!isNaN(wallet_size))
//      this.settings.wallet_size = wallet_size;
//    else
//      throw new ParamException("Invalid wallet_size!");
//  }catch(e){console.log(e);}
//};

SettingsOperation.prototype.setDisallowSwt  = function(disallow_swt) {
  try{
    if (typeof disallow_swt === 'boolean')
      this.settings.disallow_swt = disallow_swt;
    else
      throw new ParamException("Invalid disallow_swt!");
  }catch(e){console.log(e);}
};

SettingsOperation.prototype.setRequireDestinationTag  = function(require_destination_tag) {
  try{
    if (typeof require_destination_tag === 'boolean')
      this.settings.require_destination_tag = require_destination_tag;
    else
      throw new ParamException("Invalid require_destination_tag!");
  }catch(e){console.log(e);}
};

SettingsOperation.prototype.setRequireAuthorization  = function(require_authorization) {
  try{
    if (typeof require_authorization === 'boolean')
      this.settings.require_authorization = require_authorization;
    else
      throw new ParamException("Invalid require_authorization!");
  }catch(e){console.log(e);}
};

SettingsOperation.prototype.setDisableMaster  = function(disable_master) {
  try{
    if (typeof disable_master === 'boolean')
      this.settings.disable_master = disable_master;
    else
      throw new ParamException("Invalid disable_master!");
  }catch(e){console.log(e);}
};


SettingsOperation.prototype._payload = function() {
  //check if the required parameters are empty
  try{
    if (JSON.stringify(this.settings) === '{}')
      throw new ParamException("Please set params first!");
  }catch(e){console.log(e);return;}

  var _data ={
    secret: this._wallet.secret,
    settings: this.settings
  };

  return _data;
};

/*
* For batch operation parameters
*/
SettingsOperation.prototype._getOperation = function() {
  //Just check if the required parameters are empty
  try{
    if (JSON.stringify(this.settings) === '{}')
      throw new ParamException("Please set settings first!");
  }catch(e){console.log(e);return;}

  var _data = {
    type: 'AccountSet',
    account: this._wallet.address,
    settings: this.settings
  };

  return _data;
};

module.exports = SettingsOperation;

