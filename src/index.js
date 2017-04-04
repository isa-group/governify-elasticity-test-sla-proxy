/*!
governify-elasticity-test-sla-proxy 0.0.0, built on: 2017-03-30
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

/*
 * Put here your dependecies
 */
var express = require('express'),
    helmet = require('helmet'),
    bodyParser = require('body-parser'),
    logger = require('./logger/logger'),
    Promise = require('bluebird'),
    config = require('./configurations/config');

/*
 * Export functions and Objects
 */
module.exports = {
    deploy: _deploy,
    undeploy: _undeploy
};

var server;

function _deploy() {
    return new Promise(function (resolve, reject) {
        logger.info('Set up SLA Proxy');
        var app = express();

        app.use(helmet());
        app.use(bodyParser.json());
        app.use('/', express.static(__dirname + '/../public'));

        var port = process.env.PORT || config.server.port;

        server = app.listen(port, function (err) {
            if (err) {
                logger.error('Error occurs while SLA Proxy was been deployed');
                reject(err);
            } else {
                logger.info('SLA Proxy is running on http://localhost:%s', port);
                resolve();
            }
        });
    });
}

function _undeploy() {
    return new Promise(function (resolve, reject) {
        logger.info('Turn off SLA Proxy');
        server.close(function (err) {
            if (err) {
                logger.error('Error occurs while SLA Proxy was been undeployed');
                reject();
            } else {
                logger.info('SLA Proxy was turned off');
                resolve();
            }
        });
    });
}