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
    var die = this.props.gameUtil.getDie(this.props.id);
    if(!this.state){
      return <div className="col-md-1" id={this.props.id}>
        Die {this.props.id}<br />
        <div>Ready</div>
        <input type="button" value={die.locked ? "Locked": "Play"} />
      </div>
    }else{
      return <div className="col-md-1" id={this.props.id}>
        Die {this.props.id}<br />
        <div>{die.value}</div>
        <input
          type="button"
          value={this.state.locked ? "Locked": "Play" }
          onClick={this.handleLockClick}
        />
      </div>
    }
  },
  handleLockClick: function(){
    this.setState({
      locked: !this.state.locked
    });
  }
});
