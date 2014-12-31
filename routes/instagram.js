'use strict';

var express = require('express'),
  debug = require('debug')('fatcakeclub:instagram'),
  instagramConfig = require('config').get('instagram'),
  instagramBase = 'https://api.instagram.com/',
  // crypto = require('crypto'),
  url = require('url'),
  router = express.Router(),
  _ = require('underscore'),
  request = require('request');

function get(path, query, cb) {
  var iurl = url.parse(instagramBase + path);

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
  request(url.format(iurl), function(err, response, body) {
    if(err) {
      cb(err);
    }
    else if(response.statusCode !== 200) {
      cb({
        error: body
      });
    }
    else {
      cb(undefined, JSON.parse(body));
    }
  });
}

function post(path, data, cb) {
  var iurl = url.parse(instagramBase + path);
  request.post({
    url:url.format(iurl),
    form: data
  }, function(err, response, body){
    if(err) {
      cb(err);
    }
    else if(response.statusCode !== 200) {
      cb({
        error: body
      });
    }
    else {
      cb(undefined, JSON.parse(body));
    }
  });
}

router.get('/access_token', function(req, res) {

  var access_token_url = url.parse('https://api.instagram.com/oauth/authorize/'),
    redirect_uri = url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: '/instagram/access_token'
    });

  if(req.query.error) {
    res
      .status(401)
      .render('instagram/access_token_error', {
        error_reason: req.query.error_reason,
        error_description: req.query.error_description
    });
    return;
  }
  if(req.query.code) {
    post('/oauth/access_token', {
      client_id: instagramConfig.client_id,
      client_secret: instagramConfig.client_secret,
      grant_type: 'authorization_code',
      redirect_uri: redirect_uri,
      code: req.query.code
    }, function(err, body) {
      res.render('instagram/access_token', {
        access_token: body.access_token
      });
    });
    return;
  }


  access_token_url.query = {
    client_id: instagramConfig.client_id,
    redirect_uri: redirect_uri,
    response_type: 'code'
  };

  res.redirect(url.format(access_token_url));
});

/* GET instagram feed. */
router.get('/', function(req, res) {
  get('/v1/tags/fatcakeclub/media/recent', {
    count: 24
  }, function(err, body) {
    res.send(body);
  });

  // res.send('instagram');
});

module.exports = router;
