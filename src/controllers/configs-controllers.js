'use strict';

var config = require('../configurations/config'),
    Error = require('../domain/json-error').Error;

module.exports = {
    get: _get,
    post: _post
};

function _post(req, res) {
    var newConfig = req.body;

    if (!newConfig || !newConfig.id) {
        res.status(400).json({
            code: 400,
            message: "Bad request, review your body."
        });
    } else {
        //do everything necessary
        //store url
        if (!newConfig.datastore) {
            return res.status(400).json(new Error(400, 'BAD REQUEST: datastore is require'));
        }
        config.urls.store = newConfig.datastore;

        //static configurations
        if (!newConfig.id || !newConfig.instanceLimit || !newConfig.updateElasticity) {
            return res.status(400).json(new Error(400, 'BAD REQUEST: id, instanceLimit and updateElasticity are require'));
        }
        config.governance.service.id = newConfig.id;
        config.governance.service.unitTh = newConfig.instanceLimit;
        config.governance.service.scalable = newConfig.updateElasticity;

        //calculate rates        
        if (!newConfig.levels || !newConfig.initialInstances || !newConfig.elasticitySpeed || !newConfig.routingSpeed) {
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
    }
}

function _get(req, res) {
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