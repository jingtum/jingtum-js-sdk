/* 
 * NODE JS SDK for Jingtum network； Wallet 
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
 * Data functions used to check the valid data types.
*/
const CURRENCY_NAME_LEN = 3;
const TUM_NAME_LEN   = 40;
const base           = require('jingtum-base-lib').Wallet;

function allNumeric(in_text) {
  //assign a string with numbers (0-9) in the HTML form
  var numbers = /^[0-9]+$/;

  //Check if the input contains all numbers.
  if (String(in_text).match(numbers))
  {
    console.log("All numbers");
    return true;
  }
  else
    return false;
}

/*
 * Decide if the input is a valid string
 * for a float value.
*/
function isFloat(val) {
    var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
    if (!floatRegex.test(val))
        return false;

    val = parseFloat(val);
    if (isNaN(val))
        return false;
    return true;
}

function isInt(val) {
    var intRegex = /^-?\d+$/;
    if (!intRegex.test(val))
        return false;

    var intVal = parseInt(val, 10);
    return parseFloat(val) == intVal && !isNaN(intVal);
}

//Detect if the string contains only 
//numbers and capital letters.

function isLetterNumer(in_str) {
  var numbers = /^[0-9A-Z]+$/;
  if (String(in_str).match(numbers))
    return true;
  else
    return false;
}
//return true if the code is 3 letters/numbers
function isCurrency(in_code){
  if ( typeof(in_code) == 'string' ){
    if ( in_code.length === CURRENCY_NAME_LEN ){
    if ( in_code === in_code.toUpperCase() ){
      //console.log("All capitals!");
      return true;
    }
    else{
      //console.log("Contains non captial letters!");
      return false;
    }
    }else
      //console.log("Not a currency:",in_code.length);
      return false;
  }else{
    //console.log("Empty code");
      return false;
  }
  return true;
}


//return true if the code is 40 letters/numbers
function isCustomTum(in_code){
  if ( isLetterNumer(in_code) &&
    String(in_code).length === TUM_NAME_LEN ){
    return true;
  }else
    return false;
}

function equals(that){
  return that != null &&    //input must be defined and non-null
    that.constructor === Tum &&  //and an instance of Tum
     this.code === that.code && this.issuer === that.issuer; //have the same code and issuer
}

function isTumCode(in_code){
  return (typeof(in_code) == 'string' &&//input must be defined and non-null
   (in_code == 'SWT' ||     //Make sure if the code meets the coding rule
    isCurrency(in_code) ||  //tum: Custom tum, 40 capital letters or number
    isCustomTum(in_code) ));
};

/*
 *
*/
function isRelation(in_str){
  return true;
}

/*
 * Check if the input is a valid Amount object
 * Amount should have 3 properties
 * value
 * issuer/counterparty
 * currency
*/
function isAmount(in_obj){
  if ( typeof(in_obj) != 'object')
    return false;

  if (typeof in_obj.value !=='string' ||!isFloat(in_obj.value))
    return false;

  if ( !isTumCode(in_obj.currency) )
    return false;
  //AMOUNT could have a field named 
  //either as 'issuer'
  //or as 'counterparty'
  //for SWT, this can be undefined
  if ( typeof(in_obj.issuer) != 'undefined' &&
    in_obj.issuer != ''){
  //  console.log("issuer:", in_obj.issuer);
    if ( !base.isValidAddress(in_obj.issuer))
      return false;
  }else{
   //  console.log("currency:", in_obj.currency); 
    if ( in_obj.currency === 'SWT' )//if currency === 'SWT',自动补全issuer.
      in_obj.issuer = '';
    else return false;
  }

  return true;
}



/*
 * Build the amount object with three parameters. 
*/
function buildAmount(in_currency, in_issuer, in_value)
{
  if ( !isTumCode(in_currency) ) 
    throw new ParamException("Invalid currency code!");

  if ( !base.isValidAddress(in_issuer))
    throw new ParamException("Invalid Jingtum address!");

  if ( !isFloat(in_value))
    throw new ParamException("Invalid value");

  //
  var out_amount = {};
  out_amount.currency = in_currency;
  out_amount.issuer = in_issuer;
  out_amount.value = in_value;

  return out_amount;
}

/*
 * balances  余额
 * value  String  余额
 * currency  String  货币名称，三个字母或是40个字符的字符串
 * counterparty  String  货币发行方
 * freezed  String  冻结的金额
*/
function isBalance(in_obj){
  if ( typeof(in_obj) != 'object')
    return false;

  if ( !isFloat(in_obj.freezed))
    return false;

  if ( !isFloat(in_obj.value))
    return false;

  if ( !isTumCode(in_obj.currency) )
    return false;

//AMOUNT could have a field named
//either as 'issuer'
//or as 'counterparty'
//
  if ( !base.isValidAddress(in_obj.counterparty))
    return false;

  return true;
}

exports.isCustomTum = isCustomTum;
exports.allNumeric = allNumeric;
exports.isRelation = isRelation;
exports.isTumCode = isTumCode;
exports.isCurrency = isCurrency;
exports.isAmount  = isAmount;
exports.isBalance = isBalance;
exports.isLetterNumer = isLetterNumer;
