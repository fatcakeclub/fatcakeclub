'use strict';

var express = require('express'),
  debug = require('debug')('fatcakeclub:announcements'),
  announcementsConfig = require('config').get('announcements'),
  router = express.Router(),
  request = require('request');


router.get('/', function(req, res) {
  request(announcementsConfig.url, function(err, response, body) {
    var announcements;

    if(err) {
      debug('error fetching announcements:', err);
      res.jsonp({
        error: err
      });
      return;
    }
    try {
      announcements = JSON.parse(body);
      announcements.length = 5;
      res.jsonp({
        values: announcements
      });
    }
    catch(err) {
      debug('error parsing announcements', err);
      res.jsonp({
        error: err
      });
    }
  });
});

module.exports = router;