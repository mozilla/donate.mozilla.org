// Documentation for running AB tests. https://github.com/mozilla/trafficcop/blob/master/documentation.md

//*********************/
//Traffic cop seems to break IE11. Next time we enable this, let's run a check and avoid running on IE11
/*************************/


// Only run this test on the home page in en-US.
// var tc = new Mozilla.TrafficCop({
//     id: "image-experiment",
//     variations: {
//       "test=img-a": 50,
//       "test=no-img": 50
//     }
// });

// tc.init();