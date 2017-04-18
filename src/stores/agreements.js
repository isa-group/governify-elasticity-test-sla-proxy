'use strict';

var storeClient = require('../clients/datastore-client'),
    logger = require('../logger/logger');

var users = {};

module.exports = {
    put: _put,
    get: _get,
    getOne: _getOne,
    getMetricValue: _getMetricValue
};

function _put(user) {
    if (!users[user]) {
        storeClient.getAgreementById(user).then(function (agreement) {
            users[user] = agreement;
        }, function (err) {
            logger.error(err.toString());
        });
    }
}

function _get() {
    return users;
}

function _getOne(user) {
    return users[user];
}

function _getMetricValue(user, metric) {
    return users[user].terms.metrics[metric].value;
}