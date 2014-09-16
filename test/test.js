var assert = require("assert"),
    should = require("chai").should(),
    uberLib = require("../uber"),
    token = '',
    uber = new uberLib(token,'v1'),
    sLat = 36.3018,
    sLon = -94.1215,
    eLat = 36.0,
    eLon = -94.0;
    

describe("uber-api", function() {  
  describe(".getProducts", function() {
    it("Should return a list of available products based on location (latitude and longitude).", function(done) {
      uber.getProducts(sLat, sLon, function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  }); 
  describe(".getPriceEstimate", function() {
    it("Should return a JSON object of an array of price estimates based on starting and ending points.", function(done) {
      uber.getPriceEstimate(sLat, sLon, eLat, eLon, function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
  describe(".getTimeEstimate", function() {
    it("Should return a JSON object of an array of time estimates based on starting point.", function(done) {
      uber.getTimeEstimate(sLat, sLon, function(error, response) {
        try {
          should.not.exist(error);
          should.exist(response);
          response.should.be.an('object');
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});