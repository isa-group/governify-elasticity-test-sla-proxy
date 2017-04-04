'use strict';

var src = require('./src/index');
var logger = require('./src/logger/logger');

src.deploy().then(function () {
    logger.info("Deployed");
}, function (err) {
    logger.error(err);
});