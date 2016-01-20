var React = require('react');
var diceCup = require('../util/dice');

/*
 *
 * PASSED PROPS
 * gameUtil   the game utility
 * id         The id of this die
 * die        An object containing information about the die
 * myTurn     Boolean is it my turn?
 * turnOver   Boolean is my turn over?
 *
 * We want the game state to refresh whenever there is a change
 * to the playerList or the gameState
 * */
module.exports = React.createClass({
  componentWillMount: function(){
    // do this when you load
  },
  render: function(){
    var die = this.props.die;
    //console.log('rendering a die.', this.props);

    if( die === null ){
      return <div className="col-md-1" id={this.props.id}>
        Die {this.props.id}<br />
        Loading
      </div>
    }else {
      return <div className="col-md-1" id={this.props.id}>
        Die {this.props.id}<br />
        {this.content( die, this.props.myTurn )}
      </div>
    }
  },
  handleLockClick: function(){
    var locked = !this.props.die.locked;
    this.props.gameUtil.setGameState(this.props.gameState);
    this.props.gameUtil.toggleLock(this.props.id, locked);
  },
  content: function( die, myTurn ){
    //console.log('rendering die', die, myTurn);
    var retVal = [];
    retVal.push(<div>{die.value}</div>);
    if( myTurn ){
      if( die.disabled ){
        retVal.push(<span>INJURED!</span>);
      }else if( die.lockable && !this.props.turnOver ){
        retVal.push(
          <input
            type="button"
            value={die.locked ? "Locked": "Play" }
            onClick={this.handleLockClick}
          />);
      }
      return retVal;
    }else{ // not my turn
      if( die.lockable ){
        return [<div>{die.value}</div>,
          <span>{die.locked ? "Locked": "Play" }</span>];
      }
      return <div>{die.value}</div>;
    }
  }
});
