/**
 * Created by wudan on 2017/2/7.
 */
const isTumCode      = require('./DataCheck').isTumCode;
const base           = require('jingtum-base-lib').Wallet;
const ParamException = require('./Error').ParamException;

function Amount(value, currency, issuer){
    if(arguments.length !== 3 || isNaN(value)|| !isTumCode(currency) || (currency !== 'SWT' && !base.isValidAddress(issuer)) ){
        console.log(new ParamException("invalid arguments!"));
        return;
    }
    if(currency === 'SWT' && issuer !== ''){
        console.log(new ParamException("invalid issuer!"));
        return;
    }
    return {currency:currency,value:value,issuer:issuer};
}

module.exports = Amount;
