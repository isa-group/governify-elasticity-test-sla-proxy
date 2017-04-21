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

var config = require('../configurations/config'),
    logger = require('../logger/logger'),
    Error = require('../domain/json-error').Error;

module.exports = {
    get: _get,
    post: _post
};

function _post(req, res) {
    var newConfig = req.body;
    logger.controllers("New request to set proxy configuration");
    logger.debug(JSON.stringify(newConfig, null, 2));

    if (!newConfig || !newConfig.id) {
        logger.error("Bad request, review your body.");
        res.status(400).json({
            code: 400,
            message: "Bad request, review your body."
        });
    } else {
        //do everything necessary
        //store url
        logger.controllers("PROCESS new config");
        if (!newConfig.datastore) {
            logger.error('BAD REQUEST: datastore is require');
            return res.status(400).json(new Error(400, 'BAD REQUEST: datastore is require'));
        }
        config.urls.store = newConfig.datastore;

        //static configurations
        if (!newConfig.id || !newConfig.instanceLimit || newConfig.updateElasticity === null || newConfig.updateElasticity === undefined) {
            logger.error('BAD REQUEST: id, instanceLimit and updateElasticity are require');
            return res.status(400).json(new Error(400, 'BAD REQUEST: id, instanceLimit and updateElasticity are require'));
        }
        config.governance.service.id = newConfig.id;
        config.governance.service.unitTh = newConfig.instanceLimit;
        config.governance.service.scalable = newConfig.updateElasticity;

        //calculate rates        
        if (!newConfig.levels || !newConfig.initialInstances || !newConfig.elasticitySpeed || !newConfig.routingSpeed) {
            logger.error('BAD REQUEST: levels, initialInstances, elasticitySpeed, routingSpeed and initialInstances are required');
            return res.status(400).json(new Error(400, 'BAD REQUEST: levels, initialInstances, elasticitySpeed, routingSpeed and initialInstances are required'));
        }
        config.governance.levels = [];
        config.governance.elasticitySpeed = {};
        config.governance.routingSpeed = {};
        config.governance.minInstances = {};

        var elasticityDistribution = newConfig.elasticitySpeed instanceof Array ? newConfig.elasticitySpeed : _getDistributionDouble(newConfig.levels, newConfig.elasticitySpeed);
        var upLevelDistribution = newConfig.routingSpeed.upLevelSpeed instanceof Array ? newConfig.routingSpeed.upLevelSpeed : _getDistributionDouble(newConfig.levels, newConfig.routingSpeed.upLevelSpeed);
        var downLevelDistribution = newConfig.routingSpeed.downLevelSpeed instanceof Array ? newConfig.routingSpeed.downLevelSpeed : _getDistributionDouble(newConfig.levels, newConfig.routingSpeed.downLevelSpeed);
        var instancesDistribution = newConfig.initialInstances instanceof Array ? newConfig.initialInstances : _getDistributionInteger(newConfig.levels, newConfig.initialInstances);

        for (var l = 0; l < newConfig.levels; l++) {
            var levelTag = "l" + (l < 10 ? "0" : "") + l;

            config.governance.levels.push(levelTag);
            config.governance.elasticitySpeed[levelTag] = elasticityDistribution[l];
            config.governance.routingSpeed[levelTag] = {};
            config.governance.routingSpeed[levelTag].upLevelSpeed = upLevelDistribution[l];
            config.governance.routingSpeed[levelTag].downLevelSpeed = downLevelDistribution[l];
            config.governance.minInstances[levelTag] = instancesDistribution[l];

        }

        res.json();
        logger.controllers("Successful SET configuration");
    }
}

function _get(req, res) {
    logger.controllers("New request to get proxy configuration");
    res.json({
        urls: config.urls,
        governance: config.governance
    });
}

function _getDistributionInteger(levels, config) {
    var distribution = [];

    var diff = config.max - config.min;
    var factor = 1.0 / levels;

    for (var l = 0; l < levels; l++) {
        distribution[l] = Math.floor(config.min + (diff * factor * (l + 1)));
    }

    return distribution;
}

function _getDistributionDouble(levels, config) {
    var distribution = [];

    var diff = config.max - config.min;
    var factor = 1.0 / levels;

    for (var l = 0; l < levels; l++) {
        distribution[l] = Math.round((config.min + (diff * factor * (l + 1))) * 100) / 100;
    }

    return distribution;
}