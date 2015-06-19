var React = require('react/addons');
var ReactIntl = require('react-intl');

var LocalizedMsg = React.createClass({
  mixins: [ReactIntl.IntlMixin],
  render: function() {
    var message = this.getIntlMessage(this.props.msgid);

    return (
      <ReactIntl.FormattedHTMLMessage message={message} {...this.props} />
    );
  }
});

module.exports = LocalizedMsg;
