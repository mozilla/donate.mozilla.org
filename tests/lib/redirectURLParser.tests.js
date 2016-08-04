var redirectURLParser = require('../../scripts/redirectURLParser.js');
var should = require('should');

var tests = [
  {
    desc: 'should redirect to nothing for the pathname /en-US/',
    test: {
      pathname: '/en-US/'
    },
    result: {
      pathname: ''
    }
  },
  {
    desc: 'should redirect to nothing for the pathname /de/',
    test: {
      pathname: '/de/'
    },
    result: {
      pathname: ''
    }
  },
  {
    desc: 'should redirect to nothing for the pathname /de/thank-you/',
    test: {
      pathname: '/de/thank-you/'
    },
    result: {
      pathname: ''
    }
  },
  {
    desc: 'should redirect to "/en-US/" for the pathname "/"',
    test: {
      pathname: '/',
      query: {}
    },
    result: {
      pathname: '/en-US/',
      query: {}
    }
  },
  {
    desc: 'should redirect to "/de/" for the redirect query /de/thank-you/abcd/',
    test: {
      query: {
        redirect: encodeURIComponent('/de/thank-you/abcd/')
      }
    },
    result: {
      pathname: '/de/'
    }
  },
  {
    desc: 'should redirect to "/en-US/thank-you/" for the redirect query /thank-you/',
    test: {
      query: {
        redirect: encodeURIComponent('/thank-you/')
      }
    },
    result: {
      pathname: '/en-US/thank-you/'
    }
  },
  {
    desc: 'should redirect to "/en-US/thunderbird/about/" for the redirect query /thunderbird/about/',
    test: {
      query: {
        redirect: encodeURIComponent('/thunderbird/about/')
      }
    },
    result: {
      pathname: '/en-US/thunderbird/about/'
    }
  },
  {
    desc: 'should redirect to "/en-US/thunderbird/about/?x=y" for the redirect query /fa-KE/thunderbird/about/',
    test: {
      query: {
        redirect: encodeURIComponent('/fa-KE/thunderbird/about/'),
        query: encodeURIComponent('?x=y')
      }
    },
    result: {
      pathname: '/en-US/thunderbird/about/?x=y'
    }
  },
  {
    desc: 'should redirect to /de/ for the redirect query /de/asdsadasd/',
    test: {
      query: {
        redirect: encodeURIComponent('/de/asdsadasd/')
      }
    },
    result: {
      pathname: '/de/'
    }
  },
  {
    desc: 'should redirect to "/en-US/" for the redirect query /th-TH/ which is not a supported locale',
    test: {
      query: {
        redirect: encodeURIComponent('/th-TH/')
      }
    },
    result: {
      pathname: '/en-US/'
    }
  },
  {
    desc: 'should redirect to "/en-US/" for the redirect query /fa-KE/ which is not a real locale',
    test: {
      query: {
        redirect: encodeURIComponent('/fa-KE/')
      }
    },
    result: {
      pathname: '/en-US/'
    }
  },
  {
    desc: 'should redirect to "/en-US/" for the redirect query /th-TH/abc/',
    test: {
      query: {
        redirect: encodeURIComponent('/th-TH/abc/')
      }
    },
    result: {
      pathname: '/en-US/'
    }
  },
  {
    desc: 'should redirect to "/en-US/thank-you/" for the redirect query "/fa-KE/thank-you/"',
    test: {
      query: {
        redirect: encodeURIComponent('/fa-KE/thank-you/')
      }
    },
    result: {
      pathname: '/en-US/thank-you/'
    }
  },
  {
    desc: 'query "?currency=gbp&amount=10" should be passed along on a redirect to "/en-US/"',
    test: {
      query: {
        redirect: encodeURIComponent('/en-US/'),
        query: encodeURIComponent('?currency=gbp&amount=10')
      }
    },
    result: {
      pathname: '/en-US/?currency=gbp&amount=10'
    }
  },
  {
    desc: 'query "?email=test@email.com" should be passed along on a redirect to "/en-US/thank-you"',
    test: {
      query: {
        redirect: encodeURIComponent('/en-US/thank-you'),
        query: encodeURIComponent('?email=test@email.com')
      }
    },
    result: {
      pathname: '/en-US/thank-you/?email=test@email.com'
    }
  }
];

describe('redirectURLParser.js', function() {
  tests.forEach((item) => {
    it(item.desc, function() {
      should.deepEqual(redirectURLParser(item.test), item.result);
    });
  });
});
