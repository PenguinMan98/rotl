var gunUtil = require('./gun');

module.exports = {
  guid: '',
  name: '',
  lastActivity: 0,
  lastUpdate: 0,
  gunUtil: null,
  self: this,
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
  init: function( gunUtil ){
    var self = this;
    console.log('game init called', gunUtil);
    this.gunUtil = gunUtil;
    // set up a listener for local data.
    gunUtil.local.get(gunUtil.localRootPath) // should be local/
      .live(this.localGameUpdate.bind(this)); // send updates to localGameUpdate

    // initialize the local data
    gunUtil.local.get(gunUtil.localRootPath) // get the local root
      .not(function(key){ // do this if you don't find one
        console.log('init failed to find local root data');// send the value to localGameUpdate
        self.localGameUpdate({});
      })
      .value(function(data){
        console.log('init getting local root data', data);// send the value to localGameUpdate
        self.localGameUpdate(data);
      });
  }
};
