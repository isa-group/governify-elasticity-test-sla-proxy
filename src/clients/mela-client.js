/*!
governify-elasticity-test-sla-proxy 0.0.5, built on: 2017-05-31
Copyright (C) 2017 ISA group
http://www.isa.us.es/
https://github.com/isa-group/governify-elasticity-test-sla-proxy

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.*/


'use strict';

var config = require('../configurations/config'),
    Promise = require('bluebird'),
    logger = require('../logger/logger'),
    request = require('request');

var melaInfo;

module.exports = {
    getMetricOfServiceUnit: _getMetricOfServiceUnit,

    interval: melaInfoInterval
};


var melaInfoInterval;
if (config.deploymentType == 'icomot') {
    melaInfoInterval = setInterval(_loadMelaInfo, 10 * 1000);
}


function _loadMelaInfo() {
    var id = config.governance.service.id;
    var url = config.urls.mela + "REST_WS/" + id + "/monitoringdata/json";
    logger.info("Request to get a metric of ServiceUnit: service=" + id);
    logger.info(url);
    request.get(url, {
        json: true
    }, function (err, res, body) {
        if (err) {
            logger.error(err.toString());
        } else if (res.statusCode !== 200) {
            logger.error("GET metric of service. HTTP error: " + res.statusCode);
        } else {
            if (body.children) {
                melaInfo = body;
            }
        }
    });
}

function _getMetricOfServiceUnit(level, metric) {
    return new Promise(function (resolve, reject) {
        logger.info("Request to get a metric of ServiceUnit: metric=" + metric + " servicUnit=" + level);

        try {
            if (melaInfo && melaInfo.children) {
                var topology = melaInfo.children[0];
                var ret;
                for (var su in topology.children) {
                    var suO = topology.children[su];
                    if (suO.name.indexOf(level) !== -1 && suO.name.indexOf("proxy") === -1) {
                        for (var m in suO.children) {
                            var mO = suO.children[m];
                            if (mO.name.indexOf(metric) !== -1) {
                                ret = mO.name.split(" ")[0];
                            }
                        }
                    }
                }
                resolve(ret);
            } else {
                resolve(0);
            }
        } catch (e) {
            reject(e.toString());
        }

    });
}