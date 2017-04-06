'use strict';

var metricsStore = require('../stores/metrics'),
    logger = require('../logger/logger');

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
    res.json({
        availability: metricsStore.getAvailability()
    });
}

function _getAvailabilityUser(req, res) {
    var user = req.params.user;
    logger.controllers("New request to get availability for user=%s", user);
    res.json({
        availability: metricsStore.getAvailability(user)
    });
}

function _getAll(req, res) {
    logger.controllers("New request to get all metrics");
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
}

function _getThroughput(req, res) {
    logger.controllers("New request to get total throughput");
    res.json({
        throughput: metricsStore.getThroughput()
    });
}

function _getThroughputUser(req, res) {
    var user = req.params.user;
    logger.controllers("New request to get total throughput for user=%s", user);
    res.json({
        throughput: metricsStore.getThroughput(user)
    });
}