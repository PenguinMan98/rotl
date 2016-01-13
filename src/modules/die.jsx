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

    return <div className="col-md-1" id={this.props.id}>
      Die {this.props.id}<br />
      {this.content( die )}
    </div>
  },
  handleLockClick: function(){
    var locked = !this.state.locked;
    this.setState({
      locked: locked
    });
    this.props.gameUtil.toggleLock(this.props.id);
  },
  content: function( die ){
    if(!this.state){
      return [<div>Ready</div>,
        <input type="button" value={die.locked ? "Locked": "Play"} />];
    }else{
      if( die.lockable ){
        return [<div>{die.value}</div>,
          <input
            type="button"
            value={die.locked ? "Locked": "Play" }
            onClick={this.handleLockClick}
          />];
      }
      return <div>{die.value}</div>;
    }
  }
});
