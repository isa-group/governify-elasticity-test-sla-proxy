'use strict';

var id = 0;
var nodes = [];

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
    return nodes;
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