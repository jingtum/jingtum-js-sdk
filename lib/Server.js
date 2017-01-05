/*
 * NODE JS SDK for Jingtum network.
 * @version 1.1.0
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
 * ServerClass
 * Class for API Server communications. 
 * 
*/

const request      = require('request');
const crypto       = require('crypto');
const util           = require('util');
const printf         = require('printf');
const dateformat     = require('dateformat');
const ParamException = require('./Error').ParamException;
var config           = require('../config.json');

const ACTIVE_AMOUNT       = '25';
const DEFAULT_TRUST_LIMIT = '100000000';
const PAYMENT_PATH_RATE   = '1.01';
const RANDOM_PREFIX       = printf("%06d", parseInt((Math.random()*1000000)));
const PREFIX              = 'PREFIX' + RANDOM_PREFIX;
const API_VERSION_V1      = '/v1';
const API_VERSION_V2      = '/v2';
const SERVER_STATUS_PATH    = '/server/connected';


const HTTP_SUCCESS_CODE = 200;
const HTTP_REDIRECT_CODE = 300;
const HTTP_CLIENT_CODE = 400;
const HTTP_SERVER_CODE = 500;

/**
 * Base class for Server connections
 * Note: 
 * just use string instead of URL object.
 *  
*/
/**
 * Jingtum API server
 * Handles the request and responses
 * from the API server.
 * 1. build in two API commands, creatNewWallet and getNextUUID
 * 2. submit the input command to the API server by using URL, PARAMETER and method.
*/
function ServerClass(){
  this._serverURL = config.isTest ? config.test_server : config.server;
  this._version = API_VERSION_V1;
  this.activeAmount = ACTIVE_AMOUNT;
  this.defaultTrustLimit = DEFAULT_TRUST_LIMIT;
  this.paymentPathRate = PAYMENT_PATH_RATE;
  this.prefix = PREFIX;
  this.apiVersion = API_VERSION_V1; // TODO
  this._client_resource_id = 0;
  this.paths = [];
}

ServerClass.prototype.setTest = function (bool) {
  this._serverURL = bool ? config.test_server : config.server;
};

ServerClass.prototype.setServer = function(in_url){
    this._serverURL = in_url;
};

ServerClass.prototype.getServer = function(){
    return this._serverURL;
};

ServerClass.prototype.disconnect = function() {
 return false;
};

/*
 * 获得服务端连接状态
*/
ServerClass.prototype.serverStatus = function(callback) {
  var url = this._serverURL + this._version + SERVER_STATUS_PATH;
  request(url, function(err, res, data) {
    if (!err && res.statusCode === HTTP_SUCCESS_CODE) {
      var _data = JSON.parse(data);
      callback(null, _data);
    } else {
      callback(null, {success: true, connected: false});
    }
  });
};

/*
 * Submit the request and return the results as the 
 * callback function 
 * Input:
 * in_cmd : the data used to submit the request
 * method: 
 * url:
 * parameters:
 * validated为queryURL参数。为true表示等待系统的支付结果，为false表示调用不等待系统的支付结果，只表示系统接收了支付请求，之后可以通过返回的交易hash进行查询结果。下面接口出现的validated效果类同。
 * Callback can be used to process the response info from the Server.
 * If the Jingtum Server reponse correctly, the response message
 * should have a "success" flag 
*/
ServerClass.prototype.submitRequest = function(in_cmd, callback) {

  //Submit the request according to the method
  //and parameters
  if(in_cmd && in_cmd.type === 'ParamException'){//参数错误
    return callback(new ParamException("Invalid params"));
  }
  if(!in_cmd || !in_cmd.url){
    console.log(in_cmd);
    return callback(new ParamException("Invalid url"));
  }
  url = this._serverURL + this._version + in_cmd.url + (in_cmd.validate ? ('?validated=true'):'?validated=false' );
  if ( in_cmd.method === 'GET' ){
    url = this._serverURL + this._version + in_cmd.url;
    //For both Asyn and non-Asyn requests,  
    //all use call back function to process the results.
    request
      .get(url,
      function(err, res, data) {
      if (!err && res.statusCode === HTTP_SUCCESS_CODE) {
        var _data = JSON.parse(data);
        callback(null, _data);
      } else {
//To keep the data format with JSON,
//put the success flag
        var data = {};
        data.success = 'failed';
        //if ( typeof(res) != null ){
        if ( typeof(res) === 'object' ){
          data.err = res.statusCode;
          data.message = JSON.parse(res.body).message;//add,添加返回的消息说明
        }else
          data.err = JSON.stringify(err);
        callback(err, data);
      }
    }
    );//end request get
  }
  else if ( in_cmd.method === 'POST' ){
 
    var options = {
      method: 'POST',
      url: url,
      json: true,
      body: in_cmd.data};

    request(options,
      function(err, res, data){
        if (!err && (res.statusCode === HTTP_SUCCESS_CODE || res.statusCode === 201)) {
          callback(null, data);
        }
        else{
          var data = {};
          data.success = 'failed';
          if ( typeof(res) === 'object' ){
            data.err = res.statusCode;
            data.message = res.body.message || res.body.result;//add,添加返回的消息说明
          }else
            data.err = JSON.stringify(err);
          //return the err message
          callback(err, data);
        }
     }//end function
    );
  }
  else if ( in_cmd.method === 'DELETE' ){
    var options = {
      method: in_cmd.method,
      url: url,
      json: true,
      body: in_cmd.data};


    request(options,
      function(err, res, data){
        if (!err && res.statusCode === HTTP_SUCCESS_CODE) {
          callback(null, data);
        }
        else{
          var data = {};
          data.success = 'failed';
          if ( typeof(res) === 'object' ){
            data.err = res.statusCode;
          }else
            data.err = JSON.stringify(err);
          //return the err message
          callback(err, data);
        }
     }//end function
    );

//    request.delete(in_cmd.url);
  }else{
    //Cause error for other methods.
    return callback(new ParamException("Invalid method:"+in_cmd.method));
  }

};//end of request

/*
 * Local function to create the
 * unique ID for Jingtum transactions
 *   
*/

ServerClass.prototype.getClientResourceID = function() {
  var date = new Date();
  this._client_resource_id++;
  var uuid = this.prefix + dateformat(date, 'yyyymmddHHMMss') + printf("%06d", this._client_resource_id);
  return uuid;
};


// --------follow functions are issue currency related--------

module.exports = ServerClass;

