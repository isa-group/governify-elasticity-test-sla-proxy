'use strict';

var rsyblClient = require('../clients/rsybl-client'),
    config = require('../configurations/config'),
    metricsStore = require('../stores/metrics'),
    routesStore = require('../stores/routes'),
    logger = require('../logger/logger');

const ELASTICITY_TIME = 180;

module.exports = {
    startElasticityManagement: _startElasticityManagement,
    stopElasticityManagement: _stopElasticityManagement
};

var elasticityManagementInterval;

function _startElasticityManagement() {
    elasticityManagementInterval = setInterval(_elasticityManagement, ELASTICITY_TIME * 100);
}

function _stopElasticityManagement() {
    clearInterval(elasticityManagementInterval);
}

function _elasticityManagement() {
    logger.elasticityManager('Calculate rSYBL rules.');
    if (config.governance.service) {
        var rsybl = rsyblClient.getRsyblInfo();

        var elasticitySpeeds = config.governance.elasticitySpeed;
        var throughputInPerLevel = _throughputInLevels();
        var instancesPerLevel = config.governance.minInstances;

        var unitTh = config.governance.service.unitTh;

        var rules = {};
        for (var i in config.governance.levels) {
            var level = config.governance.levels[i];

            var IN = throughputInPerLevel[level] || 0;
            var eSpeed = elasticitySpeeds[level];

            var scaleLimit = unitTh * (1 - eSpeed);
            var instancesFactor = instancesPerLevel[level] - 1;

            var scaleINleftSide = IN + ((scaleLimit * instancesFactor) + 1);

            var scaleOut = "DN_ST2:STRATEGY CASE " + IN + " > " + scaleLimit + "*numberOfVMs #:scaleOut";
            var scaleIN = "DN_ST1:STRATEGY CASE " + scaleINleftSide + " <= " + scaleLimit + "*numberOfVMs-1 #:scaleIn";

            logger.elasticityManager("LEVEL: %s", level);
            logger.elasticityManager("scaleOut: %s", scaleOut);
            logger.elasticityManager("scaleIn: %s", scaleIN);

            rules[level] = scaleOut + ";" + scaleIN;
        }

        rsyblClient.updateRsyblRule(rsybl, rules);
        rsyblClient.putRsyblInfo(rsybl);

    } else {
        logger.elasticityManager('Service scalability is disable');
    }

}

function _throughputInLevels() {
    var routes = routesStore.getAssignementTable();
    var ret = {};

    for (var u in routes) {
        var l = routes[u];
        ret[l] = ret[l] ? ret[l] += metricsStore.getThroughput(u) : metricsStore.getThroughput(u);
    }

    return ret;
}