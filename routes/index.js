'use strict';

var express = require('express'),
  router = express.Router(),
  googleAnalyticsConfig = require('config').get('googleAnalytics');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    year: (new Date()).getFullYear(),
    googleAnalytics: googleAnalyticsConfig
  });
});

module.exports = router;
