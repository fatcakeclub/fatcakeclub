'use strict';

var express = require('express'),
  debug = require('debug')('fatcakeclub:instagram'),
  instagramConfig = require('config').get('instagram'),
  // crypto = require('crypto'),
  url = require('url'),
  router = express.Router(),
  _ = require('underscore'),
  request = require('request');

function get(path, query, cb) {
  var iurl = url.parse('https://api.instagram.com/v1' + path);
    if(!cb) {
      cb = query;
      query = undefined;
    }
  if(!iurl.query) {
    iurl.query = {};
  }
  _.extend(iurl.query, query);
  iurl.query.access_token = instagramConfig.access_token;
  iurl = url.format(iurl);
  debug('iurl:', iurl);
  console.log('console - iurl:', iurl);
  request(url.format(iurl), function(err, respose, body) {
    if(err) {
      cb(err);
    }
    else if(respose.statusCode !== 200) {
      cb({
        error: body
      });
    }
    else {
      cb(undefined, JSON.parse(body));
    }
  });
}

/* GET instagram feed. */
router.get('/', function(req, res) {
  get('/tags/fatcakeclub/media/recent', {
    count: 24
  }, function(err, body) {
    res.send(body);
  });

  // res.send('instagram');
});

module.exports = router;
