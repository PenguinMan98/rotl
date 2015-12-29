var React = require('react');

module.exports = React.createClass({
  componentWillMount: function(){
    // do this when you load
    this.setState({
      locked: this.props.locked
    });
  },
  render: function(){
    return <div className="col-md-1" id={this.props.id}>
      Die {this.props.id}<br />
      <div>##</div>
      <input type="button" value={(this.state && this.state.locked) ? "Keep": "Toss" } />
    </div>
  }
});
