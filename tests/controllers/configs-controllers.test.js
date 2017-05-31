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

process.env.NODE_ENV = "test";

var server = require('../../src/index');

var expect = require('chai').expect;
var request = require('request');


describe('Config controllers tests', function () {
    var proxy;
    before(function (done) {
        this.timeout(7000);
        server.deploy().then(function (server) {
            proxy = server;
            setTimeout(done, 2000);
        }, done);
    });

    after(function (done) {
        this.timeout(7000);
        server.undeploy(proxy).then(done, done);
    });

    it('GET Initial configs', function (done) {
        request.get({
            url: 'http://localhost:3000/configs',
            json: true
        }, function (err, res, body) {
            if (err) {
                done(err);
            } else if (res.statusCode != 200) {
                done(new Error("status code is not correct"));
            } else {
                expect(body.urls.rsybl).to.equal("http://192.1.1.15:8280/rSYBL/");
                expect(body.urls.store).to.equal("http://datastore-research-governify.herokuapp.com/api/v5/");
                expect(body.urls.mela).to.equal("http://192.1.1.15:8180/MELA-AnalysisService/");

                expect(body.governance.service.id).to.equal("unknown");
                expect(body.governance.service.unitTh).to.equal("unknown");
                expect(body.governance.service.scalable).to.equal(false);

                expect(body.governance.levels.length).to.equal(1);
                expect(body.governance.elasticitySpeed.l00).to.equal(undefined);
                expect(body.governance.routingSpeed.l00.upLevelSpeed).to.equal(0.7);
                expect(body.governance.routingSpeed.l00.downLevelSpeed).to.equal(0.8);
                expect(body.governance.minInstances.l00).to.equal(undefined);

                done();
            }
        });
    });

    it('POST new configs', function (done) {
        request.post({
            url: 'http://localhost:3000/configs',
            json: true,
            body: {
                "id": "Governed",
                "levels": 2,
                "datastore": "http://datastore-research-governify.herokuapp.com/api/v6/",
                "instanceLimit": 12,
                "updateElasticity": true,
                "initialInstances": {
                    "min": 1,
                    "max": 2,
                    "distribution": "lineal"
                },
                "elasticitySpeed": {
                    "min": 0,
                    "max": 0.5,
                    "distribution": "lineal"
                },
                "routingSpeed": {
                    "upLevelSpeed": {
                        "min": 0.4,
                        "max": 0.4,
                        "distribution": "lineal"
                    },
                    "downLevelSpeed": {
                        "min": 0.7,
                        "max": 0.7,
                        "distribution": "lineal"
                    }
                },
                "elasticityRules": {
                    "of": "DN_ST2:STRATEGY CASE throughput > {{instanceLimit}}*{{elasticitySpeed}}*numberOfVMs #:scaleOut;DN_ST1:STRATEGY CASE throughput <= {{limit}}*{{elasticitySpeed}}*numberOfVMs-1 #:scaleIn",
                    "with": {
                        "instanceLimit": 12,
                        "elasticitySpeed": "#/elasticitySpeed"
                    }
                }
            }
        }, function (err, res) {
            if (err) {
                done(err);
            } else if (res.statusCode != 200) {
                done(new Error("status code is not correct"));
            } else {
                done();
            }
        });
    });

    it('GET configs modified', function (done) {
        request.get({
            url: 'http://localhost:3000/configs',
            json: true
        }, function (err, res, body) {
            if (err) {
                done(err);
            } else if (res.statusCode != 200) {
                done(new Error("status code is not correct"));
            } else {
                expect(body.urls.rsybl).to.equal("http://192.1.1.15:8280/rSYBL/");
                expect(body.urls.store).to.equal("http://datastore-research-governify.herokuapp.com/api/v6/");
                expect(body.urls.mela).to.equal("http://192.1.1.15:8180/MELA-AnalysisService/");

                expect(body.governance.service.id).to.equal("Governed");
                expect(body.governance.service.unitTh).to.equal(12);
                expect(body.governance.service.scalable).to.equal(true);

                expect(body.governance.levels.length).to.equal(2);
                expect(body.governance.elasticitySpeed.l00).to.equal(0.25);
                expect(body.governance.elasticitySpeed.l01).to.equal(0.5);
                expect(body.governance.routingSpeed.l00.upLevelSpeed).to.equal(0.4);
                expect(body.governance.routingSpeed.l00.downLevelSpeed).to.equal(0.7);
                expect(body.governance.routingSpeed.l01.upLevelSpeed).to.equal(0.4);
                expect(body.governance.routingSpeed.l01.downLevelSpeed).to.equal(0.7);
                expect(body.governance.minInstances.l00).to.equal(1);
                expect(body.governance.minInstances.l01).to.equal(2);

                done();
            }
        });
    });

});