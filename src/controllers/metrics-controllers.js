/*!
governify-elasticity-test-sla-proxy 0.0.5, built on: 2017-05-31
Copyright (C) 2017 ISA group
http://www.isa.us.es/
https://github.com/isa-group/governify-elasticity-test-sla-proxy

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