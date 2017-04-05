/*!
governify-elasticity-test-sla-proxy 0.0.0, built on: 2017-03-30
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

var nodeStore = require('../../src/stores/nodes');
var expect = require('chai').expect;

describe('Node strore tests', function () {

    before(function (done) {
        nodeStore.put('172.0.2.14:8080', 'l00');
        nodeStore.put('172.0.2.15:8080', 'l01');
        nodeStore.put('172.0.2.16:8080', 'l01');
        done();
    });

    var newNodeName;

    it('PUT new node', (done) => {

        newNodeName = nodeStore.put('172.0.2.17:8080', 'l00');

        expect(nodeStore.get().length).to.equal(4);
        expect(newNodeName).to.not.equal(null);

        done();

    });

    it('PUT same node', (done) => {

        var name = nodeStore.put('172.0.2.17:8080', 'l00');

        expect(nodeStore.get().length).to.equal(4);
        expect(name).to.equal(newNodeName);

        done();

    });

    it('DELETE node', (done) => {

        var node = nodeStore.deleteOne(newNodeName);

        expect(nodeStore.get().length).to.equal(3);
        expect(node.name).to.equal(newNodeName);

        done();

    });

});