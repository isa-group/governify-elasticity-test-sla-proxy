'use strict';
process.env.NODE_ENV = "test";

var server = require('../../src/index');

var expect = require('chai').expect;
var request = require('request');


describe('Routes controllers tests', function () {
    var proxy;
    before(function (done) {
        server.deploy().then(function (server) {
            proxy = server;
            done();
        }, done);
    });

    after(function (done) {
        server.undeploy(proxy).then(done, done);
    });
    it('GET /registry/assignementtable', function (done) {
        request.get({
            url: 'http://localhost:3000/registry/assignementtable',
            json: true
        }, function (err, res, body) {
            if (err) {
                done(err);
            } else if (res.statusCode != 200) {
                done(new Error("status code is not correct"));
            } else {
                expect(body).to.eql({
                    t00: 'l00'
                });
                expect(res.statusCode).to.equal(200);
                done();
            }
        });
    });

    it('GET /registry/routingtable force error', function (done) {
        request.get({
            url: 'http://localhost:3000/registry/routingtable',
            json: true
        }, function (err, res, body) {
            if (err) {
                done(err);
            } else if (res.statusCode != 200) {
                done(new Error("status code is not correct"));
            } else {
                expect(body).to.eql({
                    t00: 'l00'
                });
                expect(res.statusCode).to.equal(200);
                done();
            }
        });
    });


});