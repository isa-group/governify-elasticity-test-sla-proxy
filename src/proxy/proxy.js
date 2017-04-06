'use strict';

var request = require('request'),
    logger = require('../logger/logger'),
    Error = require('../domain/json-error').Error,
    metricsStore = require('../stores/metrics'),
    urljoin = require('url-join');

module.exports = {
    doProxy: _doProxy
};

function _doProxy(preProxyReq, preProxyRes) {
    var ip = "aws1617-dab.herokuapp.com";

    var user = preProxyReq.query.user;
    var url = _buildURL(ip, preProxyReq);
    //logger.proxy('Doing proxy TO: %s', url);

    if (user) {

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

}

function _buildURL(ip, req) {
    var path = req.originalUrl;
    return urljoin('http://', ip, path);
}