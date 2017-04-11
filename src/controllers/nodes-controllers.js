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