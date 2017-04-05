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

        var rTable = routesStore.getAssignementTable();

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