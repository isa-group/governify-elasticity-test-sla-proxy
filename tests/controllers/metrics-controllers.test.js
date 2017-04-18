/*!
governify-elasticity-test-sla-proxy 0.0.1, built on: 2017-04-18
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

process.env.NODE_ENV = "test";

var server = require('../../src/index');

var expect = require('chai').expect;
var request = require('request');


describe('Metrics controllers tests', function () {
    var proxy;
    var interval;
    before(function (done) {
        this.timeout(7000);
        server.deploy().then(function (server) {
            proxy = server;

            interval = setInterval(function () {
                request.get('http://localhost:3000/api/v1/contacts?user=t00');
            }, 1000);

            setTimeout(done, 5400);
        }, done);
    });

    after(function (done) {
        this.timeout(7000);
        clearInterval(interval);
        server.undeploy(proxy).then(done, done);
    });

    it('GET /metrics', function (done) {
        request.get({
            url: 'http://localhost:3000/metrics',
            json: true
        }, function (err, res, body) {
            if (err) {
                done(err);
            } else if (res.statusCode != 200) {
                done(new Error("status code is not correct"));
            } else {
                expect(body.throughput.total).to.not.equal(null);
                expect(body.availability.total).to.not.equal(null);
                done();
            }
        });
    });


});