/*!
governify-elasticity-test-sla-proxy 0.0.3, built on: 2017-04-20
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
    logger = require('../logger/logger'),
    Error = require('../domain/json-error').Error,
    metricsStore = require('../stores/metrics'),
    agreementStore = require('../stores/agreements'),
    loadBalancer = require('./load-balancer'),
    urljoin = require('url-join');

module.exports = {
    doProxy: _doProxy
};

function _doProxy(preProxyReq, preProxyRes) {

    var user = preProxyReq.query.user;
    var ip = loadBalancer.balance(null, user);

    var url = _buildURL(ip, preProxyReq);

    if (user) {
        agreementStore.put(user);

        if (agreementStore.getOne(user)) {

            request({
                uri: url
            }, function (err) {

                if (err) {
                    metricsStore.increaseRequests(user); //per user
                    metricsStore.increaseRequests(null); //total
                    logger.error(err.toString());
                    preProxyRes.status(503).json(new Error(503, ip + " not responded"));
                }

            }).on('response', function (res) {

                metricsStore.increaseThroughput(user);
                metricsStore.increaseRequests(user, res); //per user
                metricsStore.increaseRequests(null, res); //total

            }).pipe(preProxyRes);

        } else {
            logger.proxy('UNAUTHORIZE request', url);

            metricsStore.increaseThroughput(user);
            preProxyRes.status(401).json(new Error(401, 'UNAUTHORIZE'));
        }


    } else {
        logger.proxy('UNAUTHORIZE request', url);

        metricsStore.increaseThroughput(user);
        preProxyRes.status(401).json(new Error(401, 'UNAUTHORIZE'));
    }

}

function _buildURL(ip, req) {
    var path = req.originalUrl;
    return urljoin('http://', ip, path);
}