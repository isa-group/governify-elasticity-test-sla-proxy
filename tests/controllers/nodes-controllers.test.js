/*!
governify-elasticity-test-sla-proxy 0.0.2, built on: 2017-04-19
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

process.env.NODE_ENV = "test";

var server = require('../../src/index');

var expect = require('chai').expect;
var request = require('request');


describe('Nodes controllers tests', function () {
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
                expect(body.l00.length).to.equal(1);
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