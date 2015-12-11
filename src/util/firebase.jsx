
module.exports = {
  addPlayer: function( playerDB, player ){
    playerDB.push( player );
  },
  playerIsUnique( playerList, playerName ){
    for(var key in playerList){
      if(playerList[key].name == playerName){
        return false;
      }
    }
    return true;
  },
  playerLoggedIn( playerList, guid){
    for(var key in playerList){
      if(playerList[key].guid == guid){
        return true;
      }
    }
    return false;
  }
};