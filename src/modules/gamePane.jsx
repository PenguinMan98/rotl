var React = require('react');

module.exports = React.createClass({
  getInitialState: function(){
    return{
    }
  },
  componentWillMount: function(){
    // do this when you load
  },
  render: function(){
    return <div className="col-md-offset-2 col-md-8">
      Show me the game!
    </div>
  }
});
