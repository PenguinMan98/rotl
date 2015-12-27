var React = require('react');

module.exports = React.createClass({
  getInitialState: function () {
    // start like this
    return {
      message: ''
    }
  },
  render: function(){
    return <div className="chat-form row">
      <div>
        <input
          className="col-md-9"
          id="chatForm"
          onChange={this.handleMessageChange}
          value={this.state.message}
          hint="This is the chat input"
          />
      </div>
      <div className="col-md-3">
      <input
        type="button"
        onClick={this.handleSend}
        value="Send"
        />
      </div>
    </div>
  },
  handleSend: function( e ){
    if(this.state.message) { // push it to firebase
      this.props.chatStore.push({
        'when': Date.now(),
        'who': this.props.myPlayer.name,
        'what': this.state.message
      });
      this.setState({ // reset the field
        message: ''
      });
    }

  },
  handleMessageChange: function( e ){
    this.setState({
      message: e.target.value
    });
  }
});

