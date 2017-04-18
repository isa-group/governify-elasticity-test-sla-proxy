'use strict';

var config = require('../configurations/config'),
    Promise = require('bluebird'),
    logger = require('../logger/logger'),
    xml2js = require('xml2js'),
    clone = require('clone'),
    request = require('request');

var xmlParser = xml2js.parseString;
var xmlBuilder = new xml2js.Builder();

var rsyblInfo;

module.exports = {

    interval: rsyblInfoInterval,
    loadRsyblInfo: _loadRsyblInfo,
    getRsyblInfo: _getRsyblInfo,
    updateRsyblRule: _updateRsyblRule,

    putRsyblInfo: _putRsyblInfo
};

var rsyblInfoInterval = setInterval(_loadRsyblInfo, 10 * 1000);

function _putRsyblInfo(rsybl) {
    return new Promise(function (resolve, reject) {
        var id = config.governance.service.id;
        var url = config.urls.rsybl + "restWS/" + id + "/description";

        logger.info("Request to update rsybl info for: " + id);
        logger.info(url);

        if (id !== "unknown") {
            var xmlrsybl = xmlBuilder.buildObject(rsybl);

            logger.info(xmlrsybl);

            request.post({
                url: url,
                body: xmlrsybl,
                headers: {
                    'Content-Type': 'application/xml'
                }
            }, function (err, res) {
                if (err) {
                    logger.error(err.toString());
                    reject(err.toString());
                } else if (res.statusCode !== 200) {
                    logger.error('Update rSYBL info return HTTP error: ' + res.statusCode);
                    logger.error('id=%s could not be correct, please check it.', id);
                    reject('Update rSYBL info return HTTP error: ' + res.statusCode);
                } else {
                    logger.info("rSYBL info updated");
                    resolve();
                }
            });
        } else {
            logger.info("id=unkown is not valid, please change the id of service.");
            reject("id=unkown is not valid, please change the id of service.");
        }
    });

}

function _updateRsyblRule(rsybl, rules) {
    for (var l in rules) {
        rsybl.CloudService.ServiceTopology[0].ServiceUnit.filter(function (element) {
            return element.$.id.indexOf(l) !== -1 && element.$.id.indexOf('proxy') === -1;
        })[0].SYBLDirective[0].$.Strategies = rules[l];
    }

}

function _getRsyblInfo() {
    return clone(rsyblInfo);
}

function _loadRsyblInfo(callback) {
    var id = config.governance.service.id;
    var url = config.urls.rsybl + "restWS/" + id + "/description";

    logger.info("Request to get a rsybl info for: " + id);
    logger.info(url);

    if (id !== "unknown") {
        request.get(url, function (err, res, body) {
            if (err) {
                logger.error(err.toString());
            } else if (res.statusCode !== 200) {
                logger.error('Get rSYBL info return HTTP error: ' + res.statusCode);
                logger.error('id=%s could not be correct, please check it.', id);
            } else {
                if (body) {
                    xmlParser(body, function (err, rsybl) {
                        if (err) {
                            logger.error(err.toString());
                        } else {
                            rsyblInfo = rsybl;
                            if (callback) {
                                callback();
                            }
                        }
                    });
                }
            }
        });
    } else {
        logger.info("id=unkown is not valid, please change the id of service.");
    }

}