/*!
governify-elasticity-test-sla-proxy 0.0.4, built on: 2017-04-21
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

/**
 * Module dependecies.
 * */

var winston = require('winston');
var config = require('../configurations/config');

/**
 * Configure here your custom levels.
 * */
var customLeves = {
    levels: {
        test: 0,
        error: 7,
        warning: 8,
        proxy: 12,
        controllers: 12,
        routingManager: 12,
        elasticityManager: 12,
        info: 12,
        debug: 13
    },
    colors: {
        test: 'red',
        error: 'red',
        warning: 'yellow',
        proxy: 'magenta',
        controllers: 'blue',
        routingManager: 'white',
        elasticityManager: 'white',
        info: 'white',
        debug: 'black'
    }
};

winston.emitErrs = true;

var logger = new winston.Logger({
    levels: customLeves.levels,
    colors: customLeves.colors,
    transports: [
        new winston.transports.File({
            level: config.loglevel,
            filename: config.logfile,
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            colorize: false
        }),
        new winston.transports.Console({
            level: config.loglevel,
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: true
        })
    ],
    exitOnError: false
});

/*
 * Export functions and Objects
 */
module.exports = logger;