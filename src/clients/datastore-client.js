/*!
governify-elasticity-test-sla-proxy 0.0.4, built on: 2017-04-21
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