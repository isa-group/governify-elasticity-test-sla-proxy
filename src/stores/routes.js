'use strict';

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
    return levelAssignementTable[user];
}