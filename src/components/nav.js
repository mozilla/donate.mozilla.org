import React from 'react';

var Nav = React.createClass({
  contextTypes: {
    intl: React.PropTypes.object
  },
  getInitialState: function() {
    var menuOpen = false;
    return {
      menuOpen: menuOpen
    };
  },
  onBurgerClick: function() {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  },
  render: function() {
    var primaryNavClassName = "";
    var burgerClassName = "burger";
    var wideMenuClassName = "wide-screen-menu";
    var narrowMenuClassName = "narrow-screen-menu";
    var menuContainerClass = "menu-container";
    if (this.props.zenMode) {
      primaryNavClassName = "zen-mode";
    } else {
      burgerClassName += " hidden-md-up";
    }

    //Only show the navigation on english sites, since the Foundation site isn't localized.
    if (!/^(en-)(\b|$)/.test(this.context.intl.locale)) {
      menuContainerClass += " no-menu";
    }

    if (this.props.zenMode && !this.state.menuOpen) {
      wideMenuClassName += " hide-menu";
    }
    if (!this.state.menuOpen) {
      narrowMenuClassName += " hide-menu";
    }
    if (this.state.menuOpen) {
      burgerClassName += " menu-open";
    }
    var backgroundClassName = "wrapper-burger";
    if (this.props.simpleBackground) {
      backgroundClassName += " simple-background";
    }
    return (
      <div id="primary-nav-container" className={primaryNavClassName}>
        <div className={backgroundClassName}>
          <div className={menuContainerClass}>
            <div className={narrowMenuClassName}>
              <div className="narrow-screen-menu-background">
                <div className="narrow-screen-menu-container">
                  <div className="row">
                    <div className="nav-links">
                      <a className="nav-link-home" href="/">Home</a>
                      <a className="nav-link-initiatives" href="https://foundation.mozilla.org/initiatives">Initiatives</a>
                      <a className="nav-link-participate" href="https://foundation.mozilla.org/participate">Participate</a>
                      <a className="nav-link-internet-health" href="https://foundation.mozilla.org/internet-health">Internet&nbsp;Health</a>
                      <a className="nav-link-about" href="https://foundation.mozilla.org/about">About&nbsp;Us</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="width-container">
              <div className="d-flex flex-row justify-content-between">
                <div id="primary-nav-links">
                  <div className="d-flex align-items-center flex-wrap">
                    <button className={burgerClassName} onClick={this.onBurgerClick}>
                      <div className="burger-bar burger-bar-top"></div>
                      <div className="burger-bar burger-bar-middle"></div>
                      <div className="burger-bar burger-bar-bottom"></div>
                    </button>
                    <a className="logo text-hide" href="https://foundation.mozilla.org">Mozilla Foundation</a>
                    <div className={wideMenuClassName}>
                      <div className="nav-links hidden-sm-down">
                        <a className="nav-link-initiatives" href="https://foundation.mozilla.org/initiatives">Initiatives</a>
                        <a className="nav-link-participate" href="https://foundation.mozilla.org/participate">Participate</a>
                        <a className="nav-link-internet-health" href="https://foundation.mozilla.org/internet-health">Internet&nbsp;Health</a>
                        <a className="nav-link-about" href="https://foundation.mozilla.org/about">About&nbsp;Us</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Nav;
