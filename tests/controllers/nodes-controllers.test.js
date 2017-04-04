'use strict';

var server = require('../../src/index');

var expect = require('chai').expect;
var request = require('request');


describe('Node controllers tests', function () {
    var proxy;
    before(function (done) {
        server.deploy().then(function (server) {
            proxy = server;
            done();
        }, done);
    });

    it('POST /registry', function (done) {
        request.post({
            url: 'http://localhost:3000/registry/l00?ip=172.0.2.13:8080',
            json: true
        }, function (err, res, body) {
            if (err) {
                done(err);
            } else if (res.statusCode != 200) {
                done(new Error("status code is not correct"));
            } else {
                expect(body.name).to.equal('node00');
                done();
            }
        });
    });

    it('POST /registry force error', function (done) {
        request.post({
            url: 'http://localhost:3000/registry/l00'
        }, function (err, res) {
            if (err) {
                done(err);
            } else if (res.statusCode != 200) {
                expect(res.statusCode).to.equal(400);
                done();
            } else {
                done(new Error("status code is not correct"));
            }
        });
    });

    it('GET /registry', function (done) {
        request.get({
            url: 'http://localhost:3000/registry',
            json: true
        }, function (err, res, body) {
            if (err) {
                done(err);
            } else if (res.statusCode != 200) {
                done(new Error("status code is not correct"));
            } else {
                expect(body.length).to.equal(1);
                done();
            }
        });
    });

    it('DELETE /registry/node00', function (done) {
        request.delete({
            url: 'http://localhost:3000/registry/node00'
        }, function (err, res) {
            if (err) {
                done(err);
            } else if (res.statusCode != 200) {
                done(new Error("status code is not correct"));
            } else {
                done();
            }
        });
    });

    it('DELETE /registry/node01 force errors', function (done) {
        request.delete({
            url: 'http://localhost:3000/registry/node01'
        }, function (err, res) {
            if (err) {
                done(err);
            } else if (res.statusCode != 200) {
                expect(res.statusCode).to.equal(404);
                done();
            } else {
                done(new Error("status code is not correct"));
            }
        });
    });
});