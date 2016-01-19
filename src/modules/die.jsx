var React = require('react');
var diceCup = require('../util/dice');

module.exports = React.createClass({
  getInitialState: function(){
    var die = this.props.gameUtil.getDie(this.props.id);
    return{
      locked: die.locked
    }
  },
  componentWillMount: function(){
    // do this when you load
  },
  render: function(){
    var die = this.props.die;
    //console.log('rendering a die.', this.props, die);

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
    var locked = !this.state.locked;
    this.setState({
      locked: locked
    });
    this.props.gameUtil.toggleLock(this.props.id);
  },
  content: function( die, myTurn ){
    //console.log('rendering die', die, myTurn);
    if(!this.state && myTurn){
      return [<div>Ready</div>,
        <input type="button" value={die.locked ? "Locked": "Play"} />];
    }else if(!this.state && !myTurn){
      return [<div>Ready</div>,
        <input type="button" value={die.locked ? "Locked": "Play"} />];
    }else if( myTurn ){
      if( die.lockable ){
        return [<div>{die.value}</div>,
          <input
            type="button"
            value={die.locked ? "Locked": "Play" }
            onClick={this.testCatchDieLock}
          />];
      }
      return <div>{die.value}</div>;
    }else{
      if( die.lockable ){
        return [<div>{die.value}</div>,
          <span>{die.locked ? "Locked": "Play" }</span>];
      }
      return <div>{die.value}</div>;
    }
  }
});
