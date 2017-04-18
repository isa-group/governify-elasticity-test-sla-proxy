'use strict';

module.exports = {
    getAgreementById: _getAgreementById
};

function _getAgreementById(id) {
    return new Promise(function (resolve) {
        resolve({
            terms: {
                metrics: {
                    MinAvailability: {
                        value: 90,
                        d: id
                    }
                }
            }
        });
    });
}