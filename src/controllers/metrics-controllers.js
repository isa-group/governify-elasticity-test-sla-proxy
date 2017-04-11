'use strict';

var metricsStore = require('../stores/metrics'),
    logger = require('../logger/logger'),
    Error = require('../domain/json-error').Error;

module.exports = {
    getAll: _getAll,
    getThroughput: _getThroughput,
    getThroughputUser: _getThroughputUser,

    getAvailability: _getAvailability,
    getAvailabilityUser: _getAvailabilityUser

    //throughput per level 
};

function _getAvailability(req, res) {
    logger.controllers("New request to get total availability");
    try {
        res.json({
            availability: metricsStore.getAvailability()
        });
    } catch (e) {
        logger.error(e.toString());
        res.status(500).json(new Error(500, e.toString()));
    }
}

function _getAvailabilityUser(req, res) {
    var user = req.params.user;
    logger.controllers("New request to get availability for user=%s", user);
    try {
        res.json({
            availability: metricsStore.getAvailability(user)
        });
    } catch (e) {
        logger.error(e.toString());
        res.status(500).json(new Error(500, e.toString()));
    }
}

function _getAll(req, res) {
    logger.controllers("New request to get all metrics");
    try {
        res.json({
            throughput: {
                total: metricsStore.getThroughput(),
                users: metricsStore.getThroughputPerUser()
            },
            availability: {
                total: metricsStore.getAvailability(),
                users: metricsStore.getAvailabilityPerUser()
            }
        });
    } catch (e) {
        logger.error(e.toString());
        res.status(500).json(new Error(500, e.toString()));
    }
}

function _getThroughput(req, res) {
    logger.controllers("New request to get total throughput");
    try {
        res.json({
            throughput: metricsStore.getThroughput()
        });
    } catch (e) {
        logger.error(e.toString());
        res.status(500).json(new Error(500, e.toString()));
    }
}

function _getThroughputUser(req, res) {
    var user = req.params.user;
    logger.controllers("New request to get total throughput for user=%s", user);
    try {
        res.json({
            throughput: metricsStore.getThroughput(user)
        });
    } catch (e) {
        logger.error(e.toString());
        res.status(500).json(new Error(500, e.toString()));
    }
}