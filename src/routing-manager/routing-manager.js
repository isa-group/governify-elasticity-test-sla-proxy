/*!
governify-elasticity-test-sla-proxy 0.0.2, built on: 2017-04-19
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

var agreementStore = require('../stores/agreements'),
    routesStore = require('../stores/routes'),
    metricsStore = require('../stores/metrics'),
    logger = require('../logger/logger'),
    melaClient = require('../clients/mela-client'),
    Promise = require('bluebird'),
    config = require('../configurations/config');

const ROUTING_INTERVAL = 4;
const ROUTING_BY = "MinAvailability";

var calculateRoutesInterval;

module.exports = {
    startRouting: _startRouting,
    stopRouting: _stopRouting
};

function _stopRouting() {
    clearInterval(calculateRoutesInterval);
}

function _startRouting() {
    calculateRoutesInterval = setInterval(_routing, ROUTING_INTERVAL * 1000);
}

function _routing() {
    var routingSpeedLevels = config.governance.routingSpeed;

    var users = agreementStore.get();
    var userNewLevel = [];
    for (var u in users) {

        var agreement = users[u];

        if (agreement) {
            logger.info("Deciding route for user=" + u);
            var property = agreement.terms.metrics[ROUTING_BY];
            logger.info("With property: " + JSON.stringify(property, null, 2));
            var currentLevel = routesStore.getLevel(u);

            var routingSpeed = routingSpeedLevels[currentLevel];
            var currentPropertyValue = metricsStore.getAvailability(u);

            logger.info("Values: current=%s, min=%s, upLevel=%s, downLevel=%s", currentPropertyValue * 100, property.value, routingSpeed.upLevelSpeed, routingSpeed.downLevelSpeed);
            var upLevel = (currentPropertyValue * 100) < property.value + (routingSpeed.upLevelSpeed * (100 - property.value));
            var downLevel = (currentPropertyValue * 100) >= property.value + (routingSpeed.downLevelSpeed * (100 - property.value));

            var currentIndex = config.governance.levels.indexOf(currentLevel);
            var newindex = parseInt(config.governance.levels.indexOf(currentLevel));
            if (upLevel && newindex != config.governance.levels.length - 1) {
                newindex++;
            } else if (downLevel && newindex !== 0) {
                newindex--;
            }

            if (currentIndex !== newindex) {
                logger.info("Decided to route user=" + u);
                userNewLevel.push({
                    user: u,
                    level: newindex
                });
            }
        }

    }

    Promise.each(userNewLevel, function (element) {
        return _changeLevelProccess(element.user, element.level);
    });

}

function _changeLevelProccess(user, newindex) {
    return new Promise(function (resolve, reject) {

        _levelIsPrepared(newindex).then(function (prepared) {
            logger.routingManager("User=%s assigned to level=%s", user, config.governance.levels[newindex]);
            routesStore.assigneLevel(user, config.governance.levels[newindex]);

            if (prepared) {
                logger.routingManager("Level prepared, user=%s routed to level=%s", user, config.governance.levels[newindex]);
                routesStore.routeToLevel(user, config.governance.levels[newindex]);
                resolve();
            } else {
                logger.routingManager("Level is not prepared, wait 90s to route");
                setTimeout(function () {
                    logger.routingManager("Waited 90s, user=%s routed to level=%s", user, config.governance.levels[newindex]);
                    routesStore.routeToLevel(user, config.governance.levels[newindex]);
                    resolve();
                }, 90 * 1000);
            }

        }, reject);
    });
}

function _levelIsPrepared(index) {
    return new Promise(function (resolve, reject) {
        logger.routingManager('GET info from MELA Client');
        melaClient.getMetricOfServiceUnit(config.governance.levels[index], "numberOfVMs").then(function (numberOfVMs) {
            //implement getThroughputInPerLevel
            if (!numberOfVMs || numberOfVMs === 0) {
                return reject(1);
            }
            var thAssigned = _getThroughputInLevel(config.governance.levels[index]) || 1;
            logger.routingManager('Throughput in level %s, is: %s', config.governance.levels[index], thAssigned);

            if (thAssigned / config.governance.service.unitTh > numberOfVMs) {
                resolve(false);
            } else {
                resolve(true);
            }

        }, reject);
    });
}

function _getThroughputInLevel(level) {
    var assignementTable = routesStore.getAssignementTable();
    var th = 0;

    for (var user in assignementTable) {
        var l = assignementTable[user];
        if (l === level) {
            th += metricsStore.getThroughput(user);
        }
    }

    return th;
}