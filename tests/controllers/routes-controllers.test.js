/*!
governify-elasticity-test-sla-router 1.0.0, built on: 2017-06-02
Copyright (C) 2017 ISA group
http://www.isa.us.es/
https://github.com/isa-group/governify-elasticity-test-sla-router

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