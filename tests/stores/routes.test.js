/*!
governify-elasticity-test-sla-proxy 0.0.3, built on: 2017-04-20
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

var routesStore = require('../../src/stores/routes');
var expect = require('chai').expect;

describe('Routes strore tests', function () {

    before(function (done) {
        routesStore.routeToLevel('t00', 'l00');
        routesStore.assigneLevel('t00', 'l01');
        routesStore.routeToLevel('t01', 'l00');
        done();
    });

    it('Change t00 to l01', (done) => {

        routesStore.routeToLevel('t00', 'l01');

        expect(routesStore.getRoutingTable().t00).to.equal('l01');

        done();

    });

    it('Assigne t01 to l01', (done) => {

        routesStore.assigneLevel('t01', 'l01');

        expect(routesStore.getAssignementTable().t01).to.equal('l01');

        done();

    });

    it('GET routing table', (done) => {

        var rTable = routesStore.getRoutingTable();

        expect(rTable.t00).to.not.equal(null);
        expect(rTable.t01).to.not.equal(null);

        done();

    });

    it('GET Assignement table', (done) => {

        var aTable = routesStore.getAssignementTable();

        expect(aTable.t00).to.not.equal(null);
        expect(aTable.t01).to.not.equal(null);

        done();

    });

});