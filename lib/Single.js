/**
 * Created by wudan on 2017/1/19.
 */
var config           = require('../config.json');

function Single(){
    var unique;
    function Construct(){
        this.server = config.server;
        this.fingate = config.fingate;
        this.ws = config.ws;
    }
    Construct.prototype.setMode = function (bool) {
        this.server = bool ? config.server : config.test_server;
        this.fingate = bool ? config.fingate : config.test_fingate;
        this.ws = bool ? config.ws : config.test_ws;
    };

    function getInstance(){
        if( unique === undefined ){
            unique = new Construct();
        }
        return unique;
    }

    return{
        getInstance : getInstance
    }
}

module.exports = Single;
