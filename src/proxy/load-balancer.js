/*!
governify-elasticity-test-sla-router 1.0.0, built on: 2017-06-02
Copyright (C) 2017 ISA group
http://www.isa.us.es/
https://github.com/isa-group/governify-elasticity-test-sla-router

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.*/


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