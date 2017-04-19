/*!
governify-elasticity-test-sla-proxy 0.0.2, built on: 2017-04-19
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

var clone = require('clone');

const THROUGHPUT_WINDOWS = 1 * 1000; //1s
const REQUESTS_WINDOWS = 1 * 60 * 1000; //1m

var throughput = 0;
var throughputPerUser = {};

var countThroughput = 0;
var countThroughputPerUser = {};

var totalRequests = 0;
var totalSuccessRequests = 0;

var requests = {};
var successRequests = {};

var availability = 1;
var availabilityPerUser = {};

module.exports = {
    increaseThroughput: _increaseThroughput,
    increaseRequests: _increaseRequests,

    calculateAvailability: _calculateAvailability,
    getThroughput: _getThroughput,
    getThroughputPerUser: _getThroughputPerUser,
    calculateAvailabilityPerUser: _calculateAvailabilityPerUser,

    getAvailability: _getAvailability,
    getAvailabilityPerUser: _getAvailabilityPerUser,

    intervals: {
        throughput: _throughputInterval,
        requests: _requestsInterval
    }
};

function _getAvailability(user) {
    if (user) {
        return availabilityPerUser[user] !== 0 ? availabilityPerUser[user] || 1 : availabilityPerUser[user];
    } else {
        return availability;
    }
}

function _getAvailabilityPerUser() {
    return availabilityPerUser;
}

function _calculateAvailabilityPerUser() {
    var ret = {};

    for (var u in requests) {
        ret[u] = _calculateAvailability(u);
    }

    return ret;
}

function _calculateAvailability(user) {
    if (user) {

        if (requests[user] > 0) {
            if (successRequests[user] > 0) {
                return successRequests[user] / requests[user];
            } else {
                return 0;
            }
        } else {
            return 1;
        }

    } else {

        if (totalRequests > 0) {
            if (totalSuccessRequests > 0) {
                return totalSuccessRequests / totalRequests;
            } else {
                return 0;
            }
        } else {
            return 1;
        }

    }
}

function _getThroughput(user) {
    if (!user) {
        return throughput;
    } else {
        return throughputPerUser[user] ? throughputPerUser[user] : 0;
    }
}

function _getThroughputPerUser() {
    return throughputPerUser;
}

/**
 * requests functions
 */
function _increaseRequests(user, res) {
    if (!user) {
        totalRequests++;
        if (res && res.statusCode < 300) {
            totalSuccessRequests++;
        }
    } else {
        requests[user] = (requests[user] || 0) + 1;

        if (res && res.statusCode < 300) {
            successRequests[user] = (successRequests[user] || 0) + 1;
        }
    }

}

function _clearRequests() {
    availability = _calculateAvailability();
    availabilityPerUser = _calculateAvailabilityPerUser();

    totalRequests = 0;
    totalSuccessRequests = 0;
    requests = {};
    successRequests = {};
}

var _requestsInterval = setInterval(_clearRequests, REQUESTS_WINDOWS);

/**
 * throughput functions
 */
function _increaseThroughput(user) {
    //Update proxy throughput
    countThroughput++;
    //Update throughput per user
    countThroughputPerUser[user] = (countThroughputPerUser[user] || 0) + 1;
}

function _clearThroughput() {
    throughput = clone(countThroughput);
    throughputPerUser = clone(countThroughputPerUser);

    countThroughput = 0;
    countThroughputPerUser = {};
}

var _throughputInterval = setInterval(_clearThroughput, THROUGHPUT_WINDOWS);