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