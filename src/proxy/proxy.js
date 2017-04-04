'use strict';

var request = require('request'),
    logger = require('../logger/logger'),
    Error = require('../domain/json-error').Error,
    urljoin = require('url-join');

module.exports = {
    doProxy: _doProxy
};

function _doProxy(preProxyReq, preProxyRes) {
    var ip = "aws1617-dab.herokuapp.com";

    var url = _buildURL(ip, preProxyReq);
    logger.proxy('Doing proxy TO: %s', url);

    request({
        uri: url
    }, function (err) {

        if (err) {
            logger.error(err.toString());
            preProxyRes.status(500).json(new Error(500, err.toString()));
        }

    }).pipe(preProxyRes);

}

function _buildURL(ip, req) {
    var path = req.originalUrl;
    return urljoin('http://', ip, path);
}