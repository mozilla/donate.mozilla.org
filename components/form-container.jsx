var React = require('react');

var FormContainer = React.createClass({
  render: function() {
    return (
      <form id="donation-form" method="post">
        <div className="container">
          {this.props.children}
        </div>
      </form>
    );
  }
});

module.exports = FormContainer;
