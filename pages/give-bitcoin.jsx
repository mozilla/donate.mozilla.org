var React = require('react');
var Footer = require('../components/footer.jsx');
var Header = require('../components/header.jsx');

var giveBitcoin = React.createClass({
  render: function() {
    return (
      <div className="coinbase-page mozilla-eoy-donation">
        <Header/>
        <div id="header-copy">
          <h2>Help protect the open Web.</h2>
        </div>

        <div className="container" id="form-wrapper">
          <div className="wrap">
            <div className="row">
              <a href="https://www.coinbase.com/checkouts/a9b87242f4430d841e140fdc90b81df2">
                <img src="https://sendto.mozilla.org/page/-/eoy2014/bitcoin_donation_large.png" alt="Donate Bitcoins"/>
              </a>
            </div>
          </div>
          <div className="row">
            <p className="donation-notice">
              <small>
                The Mozilla Foundation is a California non-profit corporation exempt from United States federal income taxation under IRC 501(c)(3) and a public charity classified under IRC sections 170(b)(1)(A) and 509(a)(1). Bitcoin donations Mozilla receives are considered charitable contributions under U.S. federal tax laws, to be used in its discretion for its charitable purposes. If you have questions, check out <a href="https://wiki.mozilla.org/Donate">our FAQ</a> or contact us at <a href="mailto:donate@mozilla.org">donate@mozilla.org</a>.
              </small>
            </p>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = giveBitcoin;
