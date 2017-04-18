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


var melaInfoInterval = setInterval(_loadMelaInfo, 10 * 1000);

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