'use strict';

var routesStore = require('../stores/routes'),
    nodesStore = require('../stores/nodes');

module.exports = {
    balance: _balance
};


function _balance(type, user) {
    var ip;

    switch (type) {

        case "fixedBalance":
            ip = _fixedBalance(user);
            break;

            /**
                    case "roundRobin":
                        ip = _roundRobinBalance(user);
                        break;

                    case "random":
                        ip = _randomBalance(user);
                        break;
             */

        default:
            ip = _fixedBalance(user);
            break;

    }

    return ip;

}

function _fixedBalance(user) {
    var level = routesStore.getLevel(user);
    return nodesStore.get()[level][0].ip;
}

/**

function _roundRobinBalance(user) {

}

function _randomBalance(user) {

}

 */