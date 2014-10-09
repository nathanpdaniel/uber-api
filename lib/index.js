var url = "https://api.uber.com/",
    version = "v1",
    request = require("request");

/**
 *
 * Constructor, takes in your Uber API Server token and version.  Currently for most request, this is 'v1'.  
 * However, for some user history request, this is 'v1.1'.
 * This assumes if data is of type string, it is a server_token.
 * 
 * @param object required
 *  - server_token | bearer_token
 *  - version
 *
 * @throws Error if token is not supplied
 */
function Uber(data) {
  if (!(this instanceof Uber)) {
    return new Uber(data);
  }
  if (typeof data === 'undefined') {
    throw new Error("Server token or data object is required.");
  }
  
  if (typeof data === 'string') {
    this.setServerToken(data);
    this.setApiVersion('v1'); 
  } else { // assume object
    if (typeof data.server_token === 'undefined') {
      if (typeof data.bearer_token === 'undefined') {
        throw new Error("An API token is required.");
      } else {
        this.setBearerToekn(data.bearer_token);
      }
    } else {
      this.setServerToken(data.server_token);
    }
    this.setApiVersion((typeof data.version === 'undefined')? version : data.version);
  }
}

Uber.prototype = {
  /**
   *
   * getProducts
   *
   * @param Number required Latitude component of location.
   * @param Number required Longitude component of location.
   * @param Function A callback function which takes two parameters
   *
   * @throws Error If the latitude or longitude are not supplied
   */
  getProducts: function(latitude, longitude, callback) {
    if (typeof latitude === 'undefined' || typeof latitude === 'function') {
      throw new Error("Latitude must be defined");
    }
    if (typeof longitude === 'undefined' || typeof longitude === 'function') {
      throw new Error("Longitude must be defined");
    }

    callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
    
    get(this.getAuthToken(), url+this.version+"/products?latitude="+latitude+"&longitude="+longitude, callback);
  },
  
  
  /**
   *
   * getPriceEstimate Requires both a starting and ending point
   *
   * @param Number required Latitude component of start location.
   * @param Number required Longitude component of start location.
   * @param Number required Latitude component of end location.
   * @param Number required Longitude component of end location.
   * @param Function A callback function which takes two parameters
   *
   * @throws Error If the starting or ending latitude or longitude are not supplied
   */
  getPriceEstimate: function (start_latitude, start_longitude, end_latitude, end_longitude, callback) {
    var u = url + this.version + "/estimates/price?";
    u += "start_latitude="+start_latitude+"&start_longitude="+start_longitude;
    u += "&end_latitude="+end_latitude+"&end_longitude="+end_longitude;
    callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
    get(this.getAuthToken(), u, callback);
  },
  
  /**
   *
   * getTimeEstimate Requires starting point, gives an estimate (in seconds) of time until arrival
   *
   * @param Number required Latitude component.
   * @param Number required Longitude component.
   * @param String Unique customer identifier to be used for experience customization.
   * @param String Unique identifier representing a specific product for a given latitude & longitude.
   * @param Function A callback function which takes two parameters
   *
   * @throws Error If the starting or ending latitude or longitude are not supplied
   */
  getTimeEstimate: function (start_latitude, start_longitude, customer_uuid, product_id, callback) {
    if (typeof customer_uuid === 'function') {
      callback = customer_uuid;
    }
    if (typeof product_id === 'function') {
      callback = product_id;
    }
    callback = (typeof callback === 'undefined') ? function(e,b){} : callback;
    var u = url+this.version+"/estimates/time?start_latitude="+start_latitude+"&start_longitude="+start_longitude;
    if (typeof customer_uuid !== 'undefined' && typeof customer_uuid != 'function') {
      url += "&customer_uuid="+customer_uuid;
    }
    if (typeof product_id !== 'undefined' && typeof product_id != 'function') {
      url += "&product_id="+product_id;
    }
    get(this.getAuthToken(), u, callback);
  },
  
  /**
   * getHistory Get the currently logged in user history
   *
   * @param Function A callback function which takes two paramenters
   */
  getHistory: function(callback) {
    if (typeof callback === 'undefined') {
    } else {
      var u = url+((this.version == "v1") ? "v1.1" : this.version)+"/history",
          tokenData = this.getAuthToken();
      if (tokenData.type != "bearer") {
        throw new Error("Invalid token type. Must use a token of type bearer.");
      }
      get(tokenData, u, callback);
    }
  },
  
  /**
   * getMe Get the currently logged in user profile.
   *
   * @param Function A callback function which takes two parameters
   */
  getMe: function(callback) {
    if (typeof callback === 'undefined') {
      throw new Error("Callback function undefined");
    } else {
      var u = url+this.version+"/me",
          tokenData = this.getAuthToken();
      if (tokenData.type != "bearer") {
        throw new Error("Invalid token type. Must use a token of type bearer.");
      }
      get(tokenData, u, callback);
    }
  },
  
  
  setBearerToken: function(token) {
    this.bearer_token = token;
  },
  getBearerToken: function(token) {
    return this.bearer_token;
  },
  setServerToken: function(token) {
    this.server_token = token;
  },
  getServerToken: function() {
    return this.server_token;
  },
  setApiVersion: function(version) {
    this.version = version;
  },
  
  /**
   *
   */
  getAuthToken: function() {
    var data = {
      token: this.getServerToken(),
      type: "server"
    };
    if (typeof this.bearer_token !== 'undefined') {
      data.token = this.getBearerToken();
      data.type = "bearer";
    }
    return data;
  }
}







//Uber.prototype.getUserActivity = null;
//Uber.prototype.getUserProfile = null;

module.exports = Uber;

/**
 * @private
 * A function to help ease development. So as not to rewrite the same thing over and over again.
 */
function get(tokenData, url, callback) {
  var tokenStr = "Token ";
  
  if (tokenData.type == "bearer") {
    tokenStr = "Bearer ";
  }
  
  var opts = {
    url: url,
    headers: {
      "Authorization": tokenStr + tokenData.token
    }
  }
  request.get(opts, function(error, body, response) {
    if (error) {
      callback(error, null);
    } else {
      if (body.statusCode != 200) {
        callback(JSON.parse(response), null);
      } else {
        callback(null, JSON.parse(response));
      }
    }
  });
}