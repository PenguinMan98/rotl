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
    console.log('updating local data!', JSON.stringify(data) );

    var player = {};
    var update = false;

    if(!data.guid){
      this.guid = this.makeGuid();
      player.guid = this.guid;
      update = true;
    }else{
      this.guid = data.guid;
    }
    if(!data.name){
      this.name = 'Player-'+this.guid;
      player.name = this.name;
      update = true;
    }else{
      this.name = data.name;
    }
    this.lastActivity = data.lastActivity;
    this.lastUpdate = Date.now();

    if( update ){
      player.lastActivity = Date.now();
      console.log('update pushing player', player );
     db.store('player', player, true);
    }else{
      this.serverPlayerInit(); // I'm ready to send my data to the server
    }
  },
  serverPlayerInit: function(){ // push player data to the server
    console.log('Updating my player on the server');
    db.fetch('player',function(player){
      console.log('player fetched', player);
    });
    /*db.store('player', {
      name: this.name,
      guid: this.guid,
      lastActivity: this.lastActivity,
      lastUpdate: this.lastUpdate
    });*/
  },
  init: function( db ){
    var self = this;
    this.db = db;

    // set up a listener for local data.
    db.listen( 'player', self.localGameUpdate.bind(self), true);

    // initialize the local data
    //db.store( 'player', { lastActivity: Date.now() }, true);

    db.fetch( 'player', self.localGameUpdate.bind(self), true);
  }
};
