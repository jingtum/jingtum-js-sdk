/*
 * NODE JS SDK for Jingtum network； Websocket class
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
 * --------------------------------------------------------
 */
const WebSocket      = require('ws');
var fingate           = require('./FinGate');
var _             = require('lodash');

/*
 * Jingtum WebSocket Server handles the processing
 * messages from the Jingtum API server to the client.
 * It receive the responses from the background server
 * and stayed until the connection closed.
 */
function WebSocketServer() {
  try{
    this._ws = new WebSocket(fingate._single.ws);
    this._ws.on('error', function (err) {
      console.log(err);
    });
    this.connected = false;
  }catch (e){
    console.log(e);
  }
}

/**
 * connect to the WebSocket Server
 * and return the txhandler.
 */


WebSocketServer.prototype.connect = function(callback) {
  var newCallback = callback || function (err, data) {
        if(err){console.log('err:',err);return;}
        console.log('data',data);
      };

  function incoming(_ws, callback, _msgRaw) {
    var msgObj = JSON.parse(_msgRaw);
    if (msgObj.success) {
      if(msgObj.type === 'connection')
        callback(null,msgObj);
      else if (msgObj.type === 'subscribe')
        this.subCallback(null,msgObj);
      else if (msgObj.type === 'unsubscribe')
        this.unSubCallback(null,msgObj);
    }
  }

  if (this._ws) {
    this.connected = true;
    this._ws.on('message', _.bind(incoming, this, this._ws,newCallback));
    this._ws.on('error', function (err) {
      newCallback(err,null);
    });
  }else{
    newCallback('no websocketserver',null);
  }
};

/*
 * Close the connection
 */
WebSocketServer.prototype.disconnect = function() {
  if (this._ws) {
    this._ws.close();
    this._ws = null;
    console.log('disconnected!');
  }else{
    console.log('no websocketserver');
  }
};

/*
 * Send the subscribe request for a wallet
 */
WebSocketServer.prototype.subscribe = function(wallet,callback) {
  var newCallback = callback || function (err, data) {
        if(err){console.log('err:',err);return;}
        console.log('data',data);
      };
  if(!wallet || !wallet.secret || !wallet.address){
    newCallback('Invalid wallet',null);
    return;
  }
  if(!this.connected){
    newCallback('please connect first',null);
    this._ws.close();
    return;
  }

  if (!this._ws) {
    newCallback("no websocketserver",null);
    return;
  }

  var msg = {'command': 'subscribe', 'account': wallet.address,
    'secret': wallet.secret};
  this._ws.on('open', function open() {
    this.send(JSON.stringify(msg), function (err) {
      if(err)
        newCallback(err,null);
    });
  });
  this.subCallback = newCallback;
};

WebSocketServer.prototype.unsubscribe = function(wallet,callback) {
  var newCallback = callback || function (err, data) {
        if(err){console.log('err:',err);return;}
        console.log('data',data);
      };
  if(!wallet || !wallet.secret || !wallet.address){
    newCallback('Invalid wallet',null);
    return;
  }
  if(!this.connected){
    newCallback('please connect first',null);
    this._ws.close();
    return;
  }
  if (!this._ws) {
    newCallback("no websocketserver",null);
    return;
  }
  var msg = {'command': 'unsubscribe', 'account': wallet.address};
  this._ws.on('open', function open() {
    this.send(JSON.stringify(msg), function (err) {
      if(err)
        newCallback(err, null);
    });
  });
  this.unSubCallback = newCallback;
};

module.exports =  WebSocketServer;
