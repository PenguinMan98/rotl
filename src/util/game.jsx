/*
* The purpose of this class is to house all the common routines and functions the game needs to interface with the page or storage
* */

var db = require('./db');

module.exports = {
  guid: '',
  name: '',
  lastActivity: 0,
  lastUpdate: 0,
  db: null,
  makeGuid: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    //return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      //s4() + '-' + s4() + s4() + s4();
    return s4() + s4() + s4();
  },
  localGameUpdate: function( data ){
    console.log('game data changed!', data );

    var player = {};
    if(!data.guid){
      this.guid = this.makeGuid();
      player.guid = this.guid;
    }else{
      this.guid = data.guid;
    }
    if(!data.name){
      this.name = 'Player-'+this.guid;
      player.name = this.name;
    }else{
      this.name = data.name;
    }
    this.lastActivity = data.lastActivity;
    this.lastUpdate = Date.now();

    if( Object.keys(player).length > 0){
      player.lastActivity = Date.now();
      console.log('update pushing player', player, 'to', this.gunUtil.localRootPath);
      this.gunUtil.local.put(player).key(this.gunUtil.localRootPath);
    }else{
      this.serverPlayerUpdate(); // I'm ready to send my data to the server
    }
  },
  serverPlayerUpdate: function(){ // push player data to the server
    var gunUtil = this.gunUtil;
    var self = this;
    gunUtil.server.get(this.gunUtil.playerPath)
      .not(function(){ // if there are no players in the server,
        var newPlayer = {}; // create a server player object
        newPlayer[self.guid] = {
          lastActivity: self.lastActivity,
          name: self.name,
          guid: self.guid
        };
        console.log('serverPlayerUpdate not pushing', newPlayer, 'to', gunUtil.playerPath);
        gunUtil.server.put(newPlayer).key(gunUtil.playerPath);// push it
      })
      .value(function(data){
        data[self.guid] = {
          lastActivity: self.lastActivity,
          name: self.name,
          guid: self.guid
        };
        console.log('serverPlayerUpdate val pushing', data, 'to', gunUtil.playerPath);
        gunUtil.server.put(data).key(gunUtil.playerPath);// push it
      });
  },
  init: function( db ){
    var self = this;
    console.log('game init called', db);
    this.db = db;

    // set up a listener for local data.
    db.listen( 'player', self.localGameUpdate.bind(self), true);

    // initialize the local data
    db.store( 'player', { lastActivity: Date.now() }, true);
  }
};
