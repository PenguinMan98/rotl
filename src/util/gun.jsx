var gun = Gun('https://gunjs.herokuapp.com/gun');
var gunPath = 'jbroderick/rotl/';
var playerList = gun.get(gunPath + 'playerList');
var chat = gun.get(gunPath + 'chat');

module.exports = {
  getPlayers: function(){
    return playerList;
  },
  bindPlayerList: function( obj ){
    playerList.on(function(data){
      var stateObj = {};
      stateObj[obj] = data;
      this.setState(stateObj);
    });
  },
  bindChat: function( obj ){
    chat.on(function(data){
      var stateObj = {};
      stateObj[obj] = data;
      this.setState(stateObj);
    });
  },
  addPlayer: function( playerName ){
    if(!playerName){return false;}
    var playerList = this.getPlayers();

    for( var key in playerList ){
      if(playerName == playerList[key].name){
        return false;
      }
    }


  }
};
