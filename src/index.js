/*!
governify-elasticity-test-sla-proxy 0.0.4, built on: 2017-04-21
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

/*
 * Put here your dependecies
 */
var express = require('express'),
    helmet = require('helmet'),
    bodyParser = require('body-parser'),
    logger = require('./logger/logger'),
    cors = require('cors'),
    Promise = require('bluebird'),
    jsyaml = require('js-yaml'),
    path = require('path'),
    fs = require('fs'),
    swagger = require('swagger-tools'),
    config = require('./configurations/config');

var proxy = require('./proxy/proxy'),
    routesControllers = require('./controllers/routes-controllers'),
    metricsControllers = require('./controllers/metrics-controllers'),
    configsControllers = require('./controllers/configs-controllers'),
    nodesControllers = require('./controllers/nodes-controllers');

var routingManager = require('./routing-manager/routing-manager'),
    elasticityManager = require('./elasticity-manager/elasticity-manager');
/*
 * Export functions and Objects
 */
module.exports = {
    deploy: _deploy,
    undeploy: _undeploy
};

var app = express();

//statics and some middelware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/../public'));

//proxy
app.use('/api', proxy.doProxy);

//nodes endpoint
app.get('/registry', nodesControllers.getAll);
app.post('/registry/:type', nodesControllers.create);
app.delete('/registry/:name', nodesControllers.delete);

//routes endpoint
app.get('/registry/routingtable', routesControllers.getRoutingTable);
app.get('/registry/assignementtable', routesControllers.getAssignementTable);

//metrics endpoint
app.get('/metrics', metricsControllers.getAll);
app.get('/metrics/throughput', metricsControllers.getThroughput);
app.get('/metrics/throughput/:user', metricsControllers.getThroughputUser);
app.get('/metrics/availability', metricsControllers.getAvailability);
app.get('/metrics/availability/:user', metricsControllers.getAvailabilityUser);
//throughput levels

//configs endpoint
app.get('/configs', configsControllers.get);
app.post('/configs', configsControllers.post);

var port = process.env.PORT || config.server.port;

function _deploy() {
    return new Promise(function (resolve, reject) {
        logger.info('Set up SLA Proxy');


        var swaggerObject = jsyaml.safeLoad(fs.readFileSync(path.join(__dirname, '/api/swagger.v1.yaml'), 'utf8'));
        swagger.initializeMiddleware(swaggerObject, function (middleware) {

            app.use(middleware.swaggerUi());

            var server = app.listen(port, function (err) {
                if (err) {
                    logger.error('Error occurs while SLA Proxy was been deployed');
                    reject(err);
                } else {
                    logger.info('SLA Proxy is running on http://localhost:%s', port);
                    logger.info('Serve the Swagger documents and Swagger UI on http://localhost:%s/docs', port);
                    resolve(server);
                    routingManager.startRouting();
                    elasticityManager.startElasticityManagement();
                }
            });
        });

    });
}

function _undeploy(server) {
    return new Promise(function (resolve, reject) {
        logger.info('Turn off SLA Proxy');
        server.close(function (err) {
            if (err) {
                logger.error('Error occurs while SLA Proxy was been undeployed');
                reject();
            } else {
                logger.info('SLA Proxy was turned off');
                routingManager.stopRouting();
                elasticityManager.stopElasticityManagement();
                resolve();
            }
        });
    });
}