
module.exports = {
  myPlayer: {},
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
    }else{
      this.serverPlayerUpdate(); // I'm ready to send my data to the server
    }
  },
  serverPlayerUpdate: function(){ // push player data to the server
    var self = this;
  },
  init: function( ){
    var self = this;
  }
};
