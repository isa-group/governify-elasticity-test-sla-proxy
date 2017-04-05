'use strict';

var logger = require('../logger/logger'),
    routesStore = require('../stores/routes');

module.exports = {
    getRoutingTable: _getRoutingTable,
    getAssignementTable: _getAssignementTable
};

function _getAssignementTable(req, res) {
    logger.controllers("New request to get AssignementTable");
    res.json(routesStore.getAssignementTable());
}

function _getRoutingTable(req, res) {
    logger.controllers("New request to get RoutingTable");
    res.json(routesStore.getRoutingTable());
}