'use strict';

module.exports = {
    Error: _Error
};

function _Error(code, message) {
    this.code = code;
    this.message = message;
}