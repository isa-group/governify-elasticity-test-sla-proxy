'use strict';

const THROUGHPUT_WINDOWS = 1 * 1000; //1s
const REQUESTS_WINDOWS = 1 * 60 * 1000; //1m

var throughput = 0;
var throughputPerUser = {};

var requests = {};
var successRequests = {};

module.exports = {
    increaseThroughput: _increaseThroughput,
    increaseRequests: _increaseRequests,

    getAvailability: _getAvailability,
    getThroughput: _getThroughput,

    intervals: {
        throughput: _throughputInterval,
        requests: _requestsInterval
    }
};

function _getAvailability(user) {
    return requests[user] ? successRequests[user] / requests[user] : 1;
}

function _getThroughput(user) {
    if (!user) {
        return throughput;
    } else {
        return throughputPerUser[user] ? throughputPerUser[user] : 0;
    }
}

/**
 * requests functions
 */
function _increaseRequests(user, res) {
    requests[user] = (requests[user] || 0) + 1;

    if (res && res.statusCode < 300) {
        successRequests[user] = (successRequests[user] || 0) + 1;
    }
}

function _clearRequests() {
    console.log(_getThroughput());
    requests = {};
    successRequests = {};
}

var _requestsInterval = setInterval(_clearRequests, REQUESTS_WINDOWS);

/**
 * throughput functions
 */
function _increaseThroughput(user) {
    //Update proxy throughput
    throughput++;
    //Update throughput per user
    throughputPerUser[user] = (throughputPerUser[user] || 0) + 1;
}

function _clearThroughput() {
    throughput = 0;
    throughputPerUser = {};
}

var _throughputInterval = setInterval(_clearThroughput, THROUGHPUT_WINDOWS);