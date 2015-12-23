var Firebase = require('firebase');
/*
* This is intended to be a database interface to abstract databasing functions from the working game core.
* */

var localStorageEngine = "LocalStorage"; // Gun or LocalStorage
var remoteStorageEngine = "Firebase"; // Gun, Firebase, or LocalStorage
var firebaseStorageUrl = "https://rotl.firebaseio.com/";

var localPlayerStoragePath = "playerData/";
var remotePlayerStoragePath = "playerData/";
var remoteChatStoragePath = "chatData/";

var ldb = null;
if(localStorageEngine == "LocalStorage"){
  ldb = localStorage;
}

var db = playerDB = chatDB = null;
if(remoteStorageEngine == "Firebase"){
  db = new Firebase(firebaseStorageUrl);
  playerDB = new Firebase(firebaseStorageUrl + remotePlayerStoragePath);
  chatDB = new Firebase(firebaseStorageUrl + remoteChatStoragePath);
}


module.exports = {
  listen: function( dataKey, callback, isLocal ){
    console.log('listening to', dataKey, 'call: ', callback, 'when finished.  Local? (', isLocal, ')');
    if(isLocal){
      if(localStorageEngine == 'LocalStorage'){
        // do nothing. We can't listen to this.
      }
    }else{
      if(remoteStorageEngine == 'Firebase'){
        if( dataKey == 'root' ){
          db.on('value', callback);
        }else if( dataKey == 'player' ){
          playerDB.on('value', callback);
        }else if( dataKey == 'chat' ){
          chatDB.on('value', callback);
        }
      }
    }
  },
  store: function( dataKey, data, isLocal ){
    console.log('Storing into', dataKey, 'data: ', data, '  Local? (', isLocal, ')');
    if(isLocal){
      if(localStorageEngine == 'LocalStorage'){
        ldb.setItem(localPlayerStoragePath, JSON.stringify(data));
      }
    }else{
      if(remoteStorageEngine == 'Firebase'){
        if( dataKey == 'root' ){
          db.push(data);
        }else if( dataKey == 'player' ){
          playerDB.push(data);
        }else if( dataKey == 'chat' ){
          chatDB.push(data);
        }
      }
    }
  },
  fetch: function( dataKey, callback, isLocal){
    console.log('Get', dataKey, ' and send it to : ', callback, '  Local? (', isLocal, ')');
    if(isLocal){
      if(localStorageEngine == 'LocalStorage'){
        callback(JSON.parse(ldb.getItem(localPlayerStoragePath)));
      }
    }else{
      if(remoteStorageEngine == 'Firebase'){
        var query = null;
        if( dataKey == 'root' ){
          //query = db.orderByChild("lastActivity");
        }else if( dataKey == 'player' ){
          query = playerDB.orderByChild("lastActivity");
        }else if( dataKey == 'chat' ){
          //query = chatDB.orderByChild("lastActivity");
        }
        var players = [];
        query.on("child_added", function(playerSnapshot){
          console.log('player',playerSnapshot.val());
          players.push(playerSnapshot);
        });
        callback(players);
      }
    }
  },
  update: function( dataKey, data, isLocal ){
    console.log('updating', dataKey, 'data: ', data, '  Local? (', isLocal, ')');
    if(isLocal){
      if(localStorageEngine == 'LocalStorage'){
        ldb.setItem(localPlayerStoragePath, JSON.stringify(data));
      }
    }else{
      if(remoteStorageEngine == 'Firebase'){
        if( dataKey == 'root' ){
          db.put(data);
        }else if( dataKey == 'player' ){
          playerDB.put(data);
        }else if( dataKey == 'chat' ){
          chatDB.put(data);
        }
      }
    }
  },
  remove: function( dataKey, isLocal ){
    console.log('removing', dataKey, 'Local? (', isLocal, ')');
    if(isLocal){
      if(localStorageEngine == 'LocalStorage'){
        ldb.setItem(localPlayerStoragePath, null);
      }
    }else{
      if(remoteStorageEngine == 'Firebase'){
        if( dataKey == 'root' ){
          db.put(null);
        }else if( dataKey == 'player' ){
          playerDB.put(null);
        }else if( dataKey == 'chat' ){
          chatDB.put(null);
        }
      }
    }
  }
};