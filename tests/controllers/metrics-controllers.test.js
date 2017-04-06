'use strict';

process.env.NODE_ENV = "test";

var server = require('../../src/index');

var expect = require('chai').expect;
var request = require('request');


describe('Metrics controllers tests', function () {
    var proxy;
    var interval;
    before(function (done) {
        this.timeout(7000);
        server.deploy().then(function (server) {
            proxy = server;

            interval = setInterval(function () {
                request.get('http://localhost:3000/api/v1/contacts?user=t00');
            }, 1000);

            setTimeout(done, 5400);
        }, done);
    });

    after(function (done) {
        this.timeout(7000);
        clearInterval(interval);
        server.undeploy(proxy).then(done, done);
    });

    it('GET /metrics', function (done) {
        request.get({
            url: 'http://localhost:3000/metrics',
            json: true
        }, function (err, res, body) {
            if (err) {
                done(err);
            } else if (res.statusCode != 200) {
                done(new Error("status code is not correct"));
            } else {
                expect(body.throughput.total).to.equal(1);
                expect(body.availability.total).to.equal(1);
                done();
            }
        });
    });


});