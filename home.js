var express = require('express');
var router = express.Router();
var uni = require('unirest');
var _ = require('lodash');

router.get('/', function(req, res) {
        var Request = uni.get('http://api-c1.hivisasa.com/const/locations/_list');
        Request.end(function(response) {
          let locations = requestGetter('http://api-c1.hivisasa.com/const/locations/_list');
          let rankedArticles = requestGetter('http://analytics.hivisasa.tech/ranked');
          let latestArticles = requestGetter('http://analytics.hivisasa.tech/latest');

          //calling the requests in a specific order
          locations.then(rankedArticles).then(latestArticles).then(render_articles(res, req, rankedArticles, latestArticles, locations));
      });
});


//function that returns a promise and has error handling
function requestGetter(url){
  return new Promise((resolve, reject) => {
  var Request = uni.get(url).end(function(response) {
    if (response.error) {
            console.log('GET error', response.error);
            reject(response.error);
    }else{
      resolve(response.body);
    }

  })
});

}

let render_articles = function(res, req, rankedArticles, latestArticles, locations) {
    res.render('mobile/index', {
        latestArticles: latestArticles,
        layout: 'mobile/layout',
        locations: locations,
        rankedArticles: rankedArticles)
    });
};





module.exports = router;
