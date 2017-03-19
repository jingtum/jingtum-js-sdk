# Jingtum NODE JS SDK

Jingtum SDK NODE JS version 1.0.2
(Notice, npm published version is 2.1.2)


Jingtum-js-sdk is a client side NODE Javascript library 
for communicating with Jingtum API. It exports all functions 
of Jingtum API and others utilities.

It provides:
- a networking layer SDK for Jingtum testnet/network and 
- facilities for building and signing varies operations, 
  for communicating with Jingtum servers, 
  and for submitting operations or querying transaction history.
## Quick start

Using npm to include jingtum-js-sdk in your own project:
### To use as a module in a Node.js project
1. Install the jingtum-sdk through npm:
```shell
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

2. Require/import it in your JavaScript program:
```js
var JingtumSDK = require('jingtum-sdk');
```
## Configuration
FinGate is a singleton object in Jingtum SDK. You can get the instance by
```js
var fingate = JingtumSDK.FinGate;
```
Before using the FinGate, user should config the FinGate:
### Setup FinGate mode
There are two modes in FinGate: PRODUCTION and DEVELOPMENT.
Default mode is PRODUCTION. To use DEVELOPMENT mode, 
```js
fingate.setMode(fingate.DEVELOPEMENT);
```
### Setup FinGate Account
FinGate account is a type of Jingtum account used for business customers.
It can be used to activate newly created wallets, issue custom Tum and 
manage Jingtum accounts for FinGate's users. 
It should be activated and have enough SWT to activate new wallets.
User can obtain his own FinGate account by contacting Jingtum company.
```js
fingate.setAccount(secret, address);
```
### Create new Account
To create a new wallet and activate it using FinGate:
```js
fingate.setAccount(secret, address);
var wallet = fingate.createWallet();
fingate.setActiveAmount(30);//default is 25, no less than 25
fingate.activateWallet(wallet.address, function (err, data) {
    if(err) console.log(err);
    // TODO handle data
});
```

### Issue FinGate owner custom tum
If FinGate wants to issue its own Tum, it should register one account in 
[Jingtum Fingate](https://fingate.jingtum.com) to get its token and key.
And then setup these configurations in its FinGate.
```js
fingate.setToken('1...00006');
fingate.setKey('59966908......a183378c10d86d');
fingate.issueCustomTum(
            custome_tum_code,
            custome_tum_amount,
            'jpkLN......2PXoT1eDQvx56p'
        , function (err,data) {
        // TODO handle data
            done();
        });

```

## Usage
For more information on how to use jingtum-js-sdk, please go to the 
[Jingtum Developer](http://developer.jingtum.com) site. 

## License
Please refer LICENSE.md file
