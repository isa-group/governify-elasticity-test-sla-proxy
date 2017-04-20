/*!
governify-elasticity-test-sla-proxy 0.0.3, built on: 2017-04-20
Copyright (C) 2017 ISA group
http://www.isa.us.es/
https://github.com/isa-group/governify-elasticity-test-sla-proxy

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.*/


'use strict';
var config = require('../configurations/config');

var levelRoutingTable = {};
var levelAssignementTable = {};

module.exports = {
    routeToLevel: _routeToLevel,
    assigneLevel: _assigneLevel,

    getRoutingTable: _getRoutingTable,
    getAssignementTable: _getAssignementTable,

    getLevel: _getLevel
};

function _getRoutingTable() {
    return levelRoutingTable;
}

function _getAssignementTable() {
    return levelAssignementTable;
}

function _routeToLevel(user, level) {
    levelRoutingTable[user] = level;
}

function _assigneLevel(user, level) {
    levelAssignementTable[user] = level;
}

function _getLevel(user) {
    var ret = levelAssignementTable[user];
    if (!ret) {
        levelRoutingTable[user] = config.governance.levels[0];
        levelAssignementTable[user] = config.governance.levels[0];

        ret = levelAssignementTable[user];
    }

    return ret;
}