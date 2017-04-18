'use strict';

var id = 0;

var developNodes = [{
    name: "node00",
    type: "l00",
    ip: "aws1617-dab.herokuapp.com"
}, {
    name: "node00",
    type: "l01",
    ip: "aws1617-dab2.herokuapp.com"
}];

var env = process.env.NODE_ENV || "development";
var nodes = env === "development" ? developNodes : [];

module.exports = {
    put: _put,
    get: _get,
    deleteOne: _deleteOne
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

function Node(ip, type) {
    this.name = id < 10 ? 'node0' + id : 'node' + id;
    this.type = type;
    this.ip = ip;

    id++;
}