/**
 * NODE JS SDK for Jingtum network； 
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
 * AccountClass: 
 * Contains the base class for Jingtum Account
 * Base account class used for Wallet and FinGate 
 * renamed from BaseWallet to AccountClass
 * just for address and secret
 *  
 */
const base           = require('jingtum-base-lib').Wallet;
const ParamException = require('./Error').ParamException;

function AccountClass(secret,address) {
  try{
    if(!secret)
      throw new ParamException("empty secret!");
    if (address && !base.isValidAddress(address))
      throw new ParamException("invalid address");
    var account = base.fromSecret(secret).address;
    if (address && account !== address)
      throw new ParamException("secret not match address");
    this.secret = secret;
    this.address = address || account;
  }catch(e){return e;}
}

AccountClass.prototype.getAddress= function(){
  return this.address;
};

AccountClass.prototype.getSecret= function(){
  return this.secret;
};

module.exports = AccountClass;
