/*!
governify-elasticity-test-sla-proxy 0.0.4, built on: 2017-04-21
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

var metricsStore = require('../../src/stores/metrics');
var expect = require('chai').expect;

describe('Metrics strore tests', function () {

    var interval;
    before(function (done) {
        this.timeout(61000);
        interval = setInterval(function () {
            metricsStore.increaseThroughput('t00');

            metricsStore.increaseThroughput('t01');
            metricsStore.increaseThroughput('t01');

            if (Math.random() > 0.5) {
                metricsStore.increaseRequests('t00', {
                    statusCode: 500
                });
            } else {

                metricsStore.increaseRequests('t00', {
                    statusCode: 200
                });
            }

            metricsStore.increaseRequests('t01', {
                statusCode: 200
            });

            metricsStore.increaseRequests('t02', {
                statusCode: 500
            });

        }, 1000);

        setTimeout(done, 60200);
    });

    after(function (done) {
        clearInterval(interval);
        done();
    });

    it('Check proxy throughput', (done) => {
        expect(metricsStore.getThroughput()).to.equal(3);
        done();
    });

    it('Check proxy availability', (done) => {
        expect(metricsStore.getThroughput()).to.not.equal(1);
        done();
    });

    it('Check throughput = 1', (done) => {
        expect(metricsStore.getThroughput('t00')).to.equal(1);
        done();
    });

    it('Check throughput = 2', (done) => {
        expect(metricsStore.getThroughput('t01')).to.equal(2);
        done();
    });

    it('Check availability != 1', (done) => {
        expect(metricsStore.getAvailability('t00')).to.not.equal(1);
        done();
    });

    it('Check availability == 1', (done) => {
        expect(metricsStore.getAvailability('t01')).to.equal(1);
        done();
    });

    it('Check availability == 0', (done) => {
        expect(metricsStore.getAvailability('t02')).to.equal(0);
        done();
    });

});