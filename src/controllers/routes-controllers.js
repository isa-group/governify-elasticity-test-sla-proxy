'use strict';

var logger = require('../logger/logger'),
    routesStore = require('../stores/routes');

module.exports = {
    getRoutingTable: _getRoutingTable,
    getAssignementTable: _getAssignementTable
};

function _getAssignementTable(req, res) {
    logger.controllers("New request to get AssignementTable");
    try {
        res.json(routesStore.getAssignementTable());
    } catch (e) {
        logger.error(e.toString());
        res.status(500).json(new Error(500, e.toString()));
    }
}

function _getRoutingTable(req, res) {
    logger.controllers("New request to get RoutingTable");
    try {
        res.json(routesStore.getRoutingTable());
    } catch (e) {
        logger.error(e.toString());
        res.status(500).json(new Error(500, e.toString()));
    }
}