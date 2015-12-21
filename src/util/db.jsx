var Firebase = require('firebase');
/*
* This is intended to be a database interface to abstract databasing functions from the working game core.
* */

var localStorageEngine = "LocalStorage"; // Gun or LocalStorage
var remoteStorageEngine = "Firebase"; // Gun, Firebase, or LocalStorage
var firebaseStorageUrl = "https://rotl.firebaseio.com/";

var localPlayerStoragePath = "playerData";
var remotePlayerStoragePath = "playerData";

var ldb = null;
if(localStorageEngine == "LocalStorage"){
  ldb = localStorage;
}

var db = null;
if(remoteStorageEngine == "Firebase"){
  db = new Firebase(firebaseStorageUrl);
}


module.exports = {
  listen: function( dataKey, callback, isLocal ){

  },
  store: function( dataKey, data, isLocal ){

  }
};