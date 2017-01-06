# jingtum-js sdk

jingtum-js-sdk is a client side NODE Javascript library 
for communicating with Jingtum API. It exports all functions 
of Jingtum API and others utilities.

It provides:
- a networking layer API for Jingtum testnet/network and 
- facilities for building and signing varies operations, 
  for communicating with Jingtum servers, 
  and for submitting operations or querying transaction history.
## Quick start

Using npm to include jingtum-js-sdk in your own project:
### To use as a module in a Node.js project
1.Install the jingtum-sd through npm:
```
npm install jingtum-sdk --save
```
Note:
Users in China may experience some slow connections using https 
to connect to the nodejs server. You can turn the https off to 
reduce the installation time by using the following commands:
```
npm config set strict-ssl false
```
and setup the URL to get the packages: 

```
npm config set registry "http://registry.npmjs.org/"
```
This should reduce the installation time in Aliyun.

2.require/import it in the JavaScript client program:
```js
var JingtumSDK = require('jingtum-sdk');
var fingate = JingtumSDK.FinGate;
var wallet = fingate.createWallet();
console.log(wallet.getWallet());
```

## Install

### To use as a module in a Node.js project
Install it using npm:
```shell
npm install jingtum-sdk --save
````

require/import it in your JavaScript:
```js
var JingtumSDK = require('jingtum-sdk');
```
## Configuration
FinGate is a singleton object in Jingtum SDK. You can get the sdk instance by
```js
var fingate = JingtumSDK.FinGate;
```
Before you can use it, you should config it, includes:
### Setup FinGate Account
FinGate account is a type of Jingtum account used for business customers.
It can be used to activate newly created wallets, issue custom Tum and 
manage Jingtum accounts for FinGate's users. 
It should be activated and have enough SWT for other newly created wallets.
User can obtain the FinGate address by contacting Jingtum company or through
jingtum developer site(developer.jingtum.com).
```js
fingate.setAccount(secret, address);
```
### Connect to Jingtum Message Publisher
FinGate can subscribe its users to a Jingtum websocket server and 
receive the transaction messages for the users. 
It should be connected to Jingtum messgae published by weboskcet, 
and setup transaction messaage handler.
```js
var JingtumSDK = require('jingtum-sdk');
var ws = JingtumSDK.WebSocketServer; 
ws.connect(function(err, msg) {
    if(err){
        console.log(err);
        return;
    }
    // TODO handle message
    console.log(msg);
});
```
### Issue FinGate owner custom tum, or currency
If FinGate needs to issue currency, it should register one account in 
[Jingtum Fingate](https://fingate.jingtum.com) to get its token and secret.
And then setup these configuration in its FinGate.
```js
fingate.setConfig(token, secret);
```

## Usage
For more information on how to use jingtum-js-sdk, please go to the 
[Jingtum Developer](http://developer.jingtum.com) site. 
There is also API documentation reference.

## License
Please refer LICENSE.md file
