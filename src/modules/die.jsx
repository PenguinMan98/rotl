var React = require('react');
var diceCup = require('../util/dice');

module.exports = React.createClass({
  getInitialState: function(){
    return{
      locked: this.props.locked,
      roll: '--'
    }
  },
  componentWillMount: function(){
    // do this when you load
  },
  render: function(){
    if(!this.state){
      return <div className="col-md-1" id={this.props.id}>
        Die {this.props.id}<br />
        <div>##</div>
        <input type="button" value={this.props.locked ? "Keep": "Toss"} />
      </div>
    }else{
      var roll = (this.state.roll);

      if(!this.state.locked){
        switch(this.props.type) {
          case 'power': roll = diceCup.roll(diceCup.powerDie); break;
          case 'track': roll = diceCup.roll(diceCup.trackDie); break;
          case 'flag': roll = diceCup.roll(diceCup.flagDie); break;
          case 'crash': roll = diceCup.roll(diceCup.crashDie); break;
          case 'pit': roll = diceCup.roll(diceCup.pitDie); break;
        }
      }
      return <div className="col-md-1" id={this.props.id}>
        Die {this.props.id}<br />
        <div>{roll}</div>
        <input type="button" value={this.state.locked ? "Keep": "Toss" } />
      </div>
    }
  }
});
