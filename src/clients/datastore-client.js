'use strict';
var request = require('request'),
    config = require('../configurations/config'),
    metricsStore = require('../stores/metrics'),
    logger = require('../logger/logger'),
    urljoin = require('url-join');

module.exports = {
    getAgreementById: _getAgreementById,
    updateProperty: _updateProperty,

    availabilityInterval: _availabilityInterval
};

function _getAgreementById(id) {

    return new Promise(function (resolve, reject) {
        var url = urljoin(config.urls.store, '/agreements');

        request.get({
            url: url,
            json: true
        }, function (err, res, body) {
            if (err) {
                logger.error(err.toString());
                reject(err.toString());
            } else if (res.statusCode !== 200) {
                var error = 'GET agreements return HTTP error with code: ' + res.statusCode;
                logger.error(error);
                reject(error);
            } else {
                resolve(body.filter(function (element) {
                    return element.id === id;
                }).pop());
            }
        });

    });
}

function _updateProperty(user, property, value) {

    return new Promise(function (resolve, reject) {
        var url = urljoin(config.urls.store, '/agreements', user, '/properties', property);

        request.post({
            url: url,
            json: true,
            body: {
                id: property,
                metric: property,
                scope: "global",
                value: value
            }
        }, function (err, res) {
            if (err) {
                logger.error(err.toString());
                reject(err.toString());
            } else if (res.statusCode !== 200) {
                logger.error('Update property %s of %s return HTTP error with code: %s',
                    property, user, res.statusCode);
                reject();
            } else {
                resolve();
            }
        });
    });
}

var _availabilityInterval = setInterval(function () {
    var availabilityPerUser = metricsStore.getAvailabilityPerUser();

    var promises = [];
    for (var user in availabilityPerUser) {
        promises.push(_updateProperty(user, "Availability", availabilityPerUser[user] * 100));
    }

    Promise.all(promises);

}, 2 * 1000);