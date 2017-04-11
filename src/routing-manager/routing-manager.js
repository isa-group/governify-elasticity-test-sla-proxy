'use strict';

var agreementStore = require('../stores/agreements'),
    routesStore = require('../stores/routes'),
    metricsStore = require('../stores/metrics'),
    logger = require('../logger/logger'),
    config = require('../configurations/config');

const ROUTING_INTERVAL = 2;
const ROUTING_BY = "MinAvailability";

var calculateRoutesInterval;

module.exports = {
    startRouting: _startRouting
};

function _startRouting() {
    calculateRoutesInterval = setInterval(_routing, ROUTING_INTERVAL * 1000);
}

function _routing() {
    var routingSpeed = config.governance.routingSpeed;

    var users = agreementStore.get();
    for (var u in users) {
        var agreement = users[u];
        var property = agreement.terms.metrics[ROUTING_BY];

        var currentLevel = routesStore.getLevel(u) || config.governance.levels[0];
        routingSpeed = routingSpeed[currentLevel];

        var currentPropertyValue = metricsStore.getAvailability(u);

        var upLevel = (currentPropertyValue * 100) < property.value + (routingSpeed.upLevelSpeed * (100 - property.value));
        var downLevel = (currentPropertyValue * 100) > property.value + (routingSpeed.downLevelSpeed * (100 - property.value));


        var index = config.governance.levels.indexOf(currentLevel);
        if (upLevel && index != config.governance.levels.length - 1) {
            index++;
        } else if (downLevel && index !== 0) {
            index--;
        }

        routesStore.assigneLevel(u, config.governance.levels[index]);
        _levelIsPrepared(index).then(function (prepared) {
            var attemp = 0;
            var inter;
            if (prepared) {
                routesStore.routeToLevel(u, index);
            } else {
                inter = setInterval(function () {
                    _levelIsPrepared(index).then(function (prepared) {
                        if (prepared) {
                            routesStore.routeToLevel(u, index);
                            clearInterval(inter);
                            attemp++;
                        } else if (attemp > 2) {
                            routesStore.routeToLevel(u, index);
                            clearInterval(inter);
                        }
                    });
                }, 40 * 1000);
            }
        }, function (err) {
            logger.error(err.toString());
        });

    }

    logger.routingManager("Update routes: " + JSON.stringify(routesStore.getAssignementTable(), null, 2));
}

function _levelIsPrepared(index) {
    return new Promise(function (resolve, reject) {
        //implement melaClient
        melaClient.getMetricOfServiceUnit(config.governance.service.id, config.governance.levels[index], "numberOfVMs").then(function (numberOfVMs) {
            //implement getThroughputInPerLevel
            var thAssigned = metricsStore.getThroughputInPerLevel()[config.governance.levels[index]] || 1;

            if (thAssigned / config.governance.service.unitTh > numberOfVMs) {
                resolve(false);
            } else {
                resolve(true);
            }

        }, reject);
    });
}