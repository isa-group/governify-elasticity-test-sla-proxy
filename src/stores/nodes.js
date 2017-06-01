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

var id = 0;

var developNodes = [{
    name: "node00",
    type: "l00",
    ip: "l00" // "aws1617-dab.herokuapp.com"
}, {
    name: "node01",
    type: "l01",
    ip: "l01" // "aws1617-dab2.herokuapp.com"
}];

var env = process.env.NODE_ENV || "development";
var nodes = env === "development" ? developNodes : [];

module.exports = {
    put: _put,
    get: _get,
    deleteOne: _deleteOne,
    deleteAll: _deleteAll
};

function _deleteOne(name) {
    var index;
    var exists = nodes.filter(function (element, i) {
        if (element.name === name) {
            index = i;
        }
        return element.name === name;
    }).pop();

    if (!exists) {
        return null;
    } else {
        nodes.splice(index, 1);
        return exists;
    }
}

function _get() {
    var ret = {};
    for (var i in nodes) {
        if (ret[nodes[i].type]) {
            ret[nodes[i].type].push(nodes[i]);
        } else {
            ret[nodes[i].type] = [nodes[i]];
        }
    }
    return ret;
}

function _put(ip, type) {
    var exists = nodes.filter(function (element) {
        return element.ip === ip;
    }).pop();

    if (!exists) {
        var newNode = new Node(ip, type);
        nodes.push(newNode);
        return newNode.name;
    }

    return exists.name;
}

function _deleteAll() {
    nodes = [];
}

function Node(ip, type) {
    this.name = id < 10 ? 'node0' + id : 'node' + id;
    this.type = type;
    this.ip = ip;

    id++;
}