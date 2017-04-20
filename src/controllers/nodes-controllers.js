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

var nodeStore = require('../stores/nodes'),
    Error = require('../domain/json-error').Error,
    logger = require('../logger/logger');

module.exports = {
    getAll: _getAll,
    create: _create,
    delete: _delete
};

function _getAll(req, res) {
    logger.controllers("New request to get all NODES");
    try {
        res.json(nodeStore.get());
    } catch (e) {
        logger.error(e.toString());
        res.status(500).json(new Error(500, e.toString()));
    }
}

function _create(req, res) {
    var type = req.params.type;
    var ip = req.query.ip;

    logger.controllers("New request to create NODE of type=%s and ip=%s", type, ip);
    try {
        if (!type || !ip) {
            logger.error("BAD REQUEST, type and ip are required, type=%s and ip=%s", type, ip);
            res.status(400).json(new Error(400, "BAD REQUEST, type and ip are required"));
        } else {
            res.json({
                name: nodeStore.put(ip, type)
            });
        }
    } catch (e) {
        logger.error(e.toString());
        res.status(500).json(new Error(500, e.toString()));
    }
}

function _delete(req, res) {
    var name = req.params.name;

    logger.controllers("New request to delete NODE with name=%s", name);
    try {
        if (!name) {
            res.statu(400).json(new Error(400, "BAD REQUEST, name is required"));
        } else {
            var deleted = nodeStore.deleteOne(name);
            if (deleted) {
                res.json();
            } else {
                logger.error("NOT FOUND node with this name=%s", name);
                res.status(404).json(new Error(404, "NOT FOUND node with this name"));
            }
        }
    } catch (e) {
        logger.error(e.toString());
        res.status(500).json(new Error(500, e.toString()));
    }
}