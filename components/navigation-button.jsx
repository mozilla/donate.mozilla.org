import React from 'react';

var NavigationButton = React.createClass({
  onClick: function(e) {
    if (this.props.activePage > this.props.index) {
      this.props.onClick(this.props.index);
    }
  },
  render: function() {
    var className = "";
    var activePage = this.props.activePage;
    var index = this.props.index;
    if (activePage < index) {
      className += "incomplete";
    } else if (activePage > index) {
      className += "complete";
    } else {
      className += "active";
    }
    return (
      <li onClick={this.onClick} className={className}>
        {this.props.children}
        <div className="page-breadcrumb">{this.props.display}</div>
      </li>
    );
  }
});

module.exports = NavigationButton;
