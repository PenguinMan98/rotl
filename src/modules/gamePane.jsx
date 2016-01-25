var React = require('react');
var Die = require('./die');

/*
*
* PASSED PROPS
* mode      spectator or player
* myTurn    if the game has started, this tells me if it's my turn
* gameUtil  the game utility
* myGuid    my guid
* */

module.exports = React.createClass({
  getInitialState: function(){
    return{
      gameState: {},
      myTurn: this.props.myTurn,
      playerList: {}
    }
  },
  componentWillMount: function(){
    // do this when you load
    var game = this.props.gameUtil;
    var playerListUtil = this.props.playerListUtil;
    game.gameDB.on("value", this.updateGameState);
    playerListUtil.playerListDB.on("value", this.updatePlayerList);
    if(this.props.myTurn != this.state.myTurn){
      this.setState({
        myTurn: this.props.myTurn
      });
    }
  },
  render: function(){
    //console.log('rendering gamePane', this.props);
    var myPlayer, currentPlayer;

    // if the game is ready (I have both a gameState and a playerList)
    if(this.state
      && this.state.gameState && Object.keys(this.state.gameState).length > 1
      && this.state.playerList && Object.keys(this.state.playerList).length > 1){
      var gameState = this.state.gameState;
      var playerList = this.state.playerList;
      this.props.playerListUtil.setPlayerList( playerList );
      myPlayer = this.props.playerListUtil.getPlayerByGuid( this.props.myGuid );
      currentPlayer = this.props.playerListUtil.getPlayerByGuid( gameState.currentPlayerGuid );
      // If the game has started,
      if(this.state.gameState.gameStarted){
        /*
        * SHOW THE GAME
        * */
        return <div className="row">
          <div id="roll-btn" className="col-md-1">
            <div id="player-turn">Go {currentPlayer.name}!</div>
            {this.rollButton()}
            {this.endTurnButton()}
          </div>
          {this.dice()}
          <div id="turn-stats" className="col-md-2">
            Current Turn Score: {(this.state && this.state.gameState)? this.state.gameState.turnScore : 0}
          </div>
        </div>
      }else{ // the game hasn't started
        // if I'm not the first player,
        if( gameState.currentPlayerGuid != myPlayer.guid ) {
          /*
           * SHOW THE WAIT MESSAGE
           * */
          return <div className="row">
            <div className="col-md-6 col-md-offset-3">
              The game will start shortly.
            </div>
          </div>
        }else{ // I'm the first player so I get the button to start the game
          /*
           * SHOW THE START BUTTON
           * */
          return <div className="row">
            <div className="col-md-6 col-md-offset-3">
              <input
                type="button"
                value="Start the Game!"
                onClick={this.handleStartGame}
              />
            </div>
          </div>
        }
      }
    }else{ // I do not have enough information to render the game
      /*
       * SHOW THE LOADING MESSAGE
       * */
      return <div className="row">
        <div className="col-md-6 col-md-offset-3">
          Loading, please wait.
        </div>
      </div>
    }
  },
  rollButton: function(){
    var myTurn = (this.state.gameState.currentPlayerGuid == this.props.myGuid);
    if(myTurn) {
      if (!this.state.gameState.turnOver) {
        return [<input
          type="button"
          value="Roll"
          onClick={this.handleRoll}
        />,<br />]
      } else {
        /*return <input
          type="button"
          value="Roll"
          disabled="disabled"
        />*/
      }
    }
  },
  endTurnButton: function(){
    var myTurn = (this.state.gameState.currentPlayerGuid == this.props.myGuid);
    if(myTurn) {
      if (this.state.gameState.throwNumber > 1) {
        return <input
          type="button"
          value="End Turn"
          onClick={this.handleEndTurn}
        />
      } else {
        /*return <input
          type="button"
          value="End Turn"
          disabled="disabled"
        />*/
      }
    }
  },
  handleRoll: function(){
    if( this.state.gameState.currentPlayerGuid == this.props.myGuid ) {
      this.props.gameUtil.setGameState(this.state.gameState);
      this.props.gameUtil.newThrow();
    }else{
      console.log("Can't roll. Not my turn");
    }
  },
  handleStartGame: function(){
    this.props.gameUtil.setGameState(this.state.gameState);
    this.props.gameUtil.startGame();

    //this.props.playerListUtil.setPlayerList(this.state.playerList);
  },
  handleEndTurn: function(){
    this.props.gameUtil.setGameState(this.state.gameState);
    var score = this.state.gameState.turnScore;

    if( this.state.gameState.currentPlayerGuid == this.props.myGuid ) {
      this.props.playerListUtil.setPlayerList(this.state.playerList);
      this.props.playerListUtil.addScore(this.props.myGuid, score);
      var nextPlayer = this.props.playerListUtil.getNextPlayer(this.props.myGuid);
      this.props.gameUtil.newTurn( nextPlayer );
    }
  },
  dice: function(){
    var children = [];
    if(this.state && this.state.gameState && Object.keys(this.state.gameState).length > 1) {
      var gameState = this.state.gameState;

      var myTurn = gameState.currentPlayerGuid == this.props.myGuid;
      var dieName, die;
      for(var id in this.props.gameUtil.allDieArray){
        dieName = this.props.gameUtil.allDieArray[id];
        die = gameState[dieName];

        children.push(
          <Die
            id={dieName}
            die={die}
            myTurn={myTurn}
            turnOver={gameState.turnOver}
            gameUtil={this.props.gameUtil}
            gameState={this.state.gameState}
          />
        )
      }
    }else{
      for(var id in this.props.gameUtil.allDieArray) {
        dieName = this.props.gameUtil.allDieArray[id];
        children.push(
          <Die id={dieName} die={null} myTurn={false} gameUtil={this.props.gameUtil} />
        )
      }
    }
    return children;
  },
  updateGameState: function( gameState ){
    this.setState({
      gameState: gameState.val()
    });
  },
  updatePlayerList: function( snapshot ){
    this.setState({
      playerList: snapshot.val()
    });
  }
});
