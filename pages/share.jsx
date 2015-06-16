var React = require('react');
var Footer = require('../components/footer.jsx');
var Header = require('../components/header.jsx');

var ThankYou = React.createClass({
  componentDidMount: function() {





  },
  render: function() {
    return (
      <div className="share-page">
        <div className="mozilla-eoy-donation">
          <Header/>
          <div>
            <div id="header-copy">
              <h1>Tell your friends</h1>
              <h4>We need your help to spread the word.</h4>
            </div>
            <div className="container">
              <h2>Share</h2>
              <div className="row">
                <div className="half" id="facebook">
                  <a href="http://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fsendto.mozilla.org%2Fpage%2Fcontribute%2Fgivenow-1page">
                    <i className="fa fa-facebook fa-5x"></i>

                    <p>facebook</p>
                  </a>
                </div>
                <div className="half" id="twitter">
                  <a href="http://twitter.com/share?url=https%3A%2F%2Fsendto.mozilla.org%2Fpage%2Fcontribute%2Fgivenow-1page&amp;text=I%20donated%20to%20%40mozilla%20today%20because%20I%20%23lovetheweb.%20Join%20me%20and%20help%20build%20%2B%20protect%20the%20Web%20forever%3A">
                    <i className="fa fa-twitter fa-5x"></i>

                    <p>twitter</p>
                  </a>
                </div>
              </div>
            </div>
            <Footer/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ThankYou;
